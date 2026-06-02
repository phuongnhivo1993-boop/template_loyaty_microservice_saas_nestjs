import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuthService {
  private readonly saltRounds = 12;

  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  private async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, this.saltRounds);
  }

  private async comparePassword(
    password: string,
    hash: string,
  ): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  async registerHost(email: string, password: string, name: string) {
    const existing = await this.prisma.host.findUnique({ where: { email } });
    if (existing) throw new ConflictException('Email already registered');

    const host = await this.prisma.host.create({
      data: { email, password: await this.hashPassword(password), name },
    });
    return { id: host.id, email: host.email, name: host.name };
  }

  async loginHost(email: string, password: string) {
    const host = await this.prisma.host.findUnique({ where: { email } });
    if (!host || !(await this.comparePassword(password, host.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return this.generateToken(host.id, host.email, 'HOST');
  }

  async loginTenant(email: string, password: string, tenantId?: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user || !(await this.comparePassword(password, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }
    if (tenantId && user.tenantId !== tenantId) {
      throw new UnauthorizedException('User does not belong to this tenant');
    }
    return this.generateToken(user.id, user.email, user.role, user.tenantId);
  }

  async loginMember(email: string, password: string) {
    const member = await this.prisma.member.findUnique({ where: { email } });
    if (!member) throw new UnauthorizedException('Invalid credentials');
    if (member.status !== 'ACTIVE')
      throw new UnauthorizedException('Account is not active');
    if (
      member.password &&
      !(await this.comparePassword(password, member.password))
    ) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return this.generateToken(
      member.id,
      member.email,
      'MEMBER',
      member.tenantId,
    );
  }

  async validateUser(
    email: string,
    password: string,
    role: 'HOST' | 'TENANT' | 'MEMBER',
  ): Promise<any> {
    if (role === 'HOST') {
      const host = await this.prisma.host.findUnique({ where: { email } });
      if (host && (await this.comparePassword(password, host.password))) {
        return { id: host.id, email: host.email, role: 'HOST' };
      }
    } else if (role === 'TENANT') {
      const user = await this.prisma.user.findUnique({ where: { email } });
      if (user && (await this.comparePassword(password, user.password))) {
        return {
          id: user.id,
          email: user.email,
          role: user.role,
          tenantId: user.tenantId,
        };
      }
    } else if (role === 'MEMBER') {
      const member = await this.prisma.member.findUnique({ where: { email } });
      if (
        member &&
        member.password &&
        (await this.comparePassword(password, member.password))
      ) {
        return {
          id: member.id,
          email: member.email,
          role: 'MEMBER',
          tenantId: member.tenantId,
        };
      }
    }
    return null;
  }

  private generateToken(
    sub: string,
    email: string,
    role: string,
    tenantId?: string,
  ) {
    const payload = { sub, email, role, tenantId };
    return {
      accessToken: this.jwtService.sign(payload),
      refreshToken: this.jwtService.sign(
        { sub, type: 'refresh' },
        { expiresIn: '7d' },
      ),
    };
  }

  async refreshToken(refreshToken: string) {
    try {
      const payload = this.jwtService.verify(refreshToken);
      if (payload.type !== 'refresh')
        throw new UnauthorizedException('Invalid refresh token');
      return this.generateToken(
        payload.sub,
        payload.email || payload.sub,
        payload.role || 'MEMBER',
        payload.tenantId,
      );
    } catch {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }
  }

  async forgotPassword(email: string) {
    const member = await this.prisma.member.findUnique({ where: { email } });
    const user = await this.prisma.user.findUnique({ where: { email } });
    const host = await this.prisma.host.findUnique({ where: { email } });
    if (!member && !user && !host) {
      return { message: 'If the email exists, a reset link has been sent' };
    }
    const resetToken = this.jwtService.sign({ email, type: 'reset' }, { expiresIn: '15m' });
    // TODO: Integrate with email service to send reset link
    return { message: 'If the email exists, a reset link has been sent', resetToken };
  }

  async resetPassword(token: string, newPassword: string) {
    try {
      const payload = this.jwtService.verify(token);
      if (payload.type !== 'reset')
        throw new BadRequestException('Invalid reset token');
      const email = payload.email;
      const hashed = await this.hashPassword(newPassword);
      const member = await this.prisma.member.findUnique({ where: { email } });
      if (member && member.password) {
        await this.prisma.member.update({
          where: { email },
          data: { password: hashed },
        });
        return { message: 'Password reset successfully' };
      }
      const user = await this.prisma.user.findUnique({ where: { email } });
      if (user && user.password) {
        await this.prisma.user.update({
          where: { email },
          data: { password: hashed },
        });
        return { message: 'Password reset successfully' };
      }
      throw new NotFoundException('User not found');
    } catch (err) {
      if (err instanceof NotFoundException || err instanceof BadRequestException) throw err;
      throw new BadRequestException('Invalid or expired reset token');
    }
  }

  async changePassword(user: any, oldPassword: string, newPassword: string) {
    const { sub, role } = user;

    if (role === 'HOST') {
      const host = await this.prisma.host.findUnique({ where: { id: sub } });
      if (!host) throw new NotFoundException('User not found');
      if (!(await this.comparePassword(oldPassword, host.password))) {
        throw new UnauthorizedException('Current password is incorrect');
      }
      await this.prisma.host.update({
        where: { id: sub },
        data: { password: await this.hashPassword(newPassword) },
      });
    } else if (role === 'MEMBER') {
      const member = await this.prisma.member.findUnique({
        where: { id: sub },
      });
      if (!member) throw new NotFoundException('Member not found');
      if (!member.password)
        throw new BadRequestException(
          'No password set. Use set-password first.',
        );
      if (!(await this.comparePassword(oldPassword, member.password))) {
        throw new UnauthorizedException('Current password is incorrect');
      }
      await this.prisma.member.update({
        where: { id: sub },
        data: { password: await this.hashPassword(newPassword) },
      });
    } else {
      const userEntity = await this.prisma.user.findUnique({
        where: { id: sub },
      });
      if (!userEntity) throw new NotFoundException('User not found');
      if (!(await this.comparePassword(oldPassword, userEntity.password))) {
        throw new UnauthorizedException('Current password is incorrect');
      }
      await this.prisma.user.update({
        where: { id: sub },
        data: { password: await this.hashPassword(newPassword) },
      });
    }
    return { message: 'Password changed successfully' };
  }
}
