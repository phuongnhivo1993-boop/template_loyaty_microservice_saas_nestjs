import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
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

  private async comparePassword(password: string, hash: string): Promise<boolean> {
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
    if (member.status !== 'ACTIVE') throw new UnauthorizedException('Account is not active');
    if (member.password && !(await this.comparePassword(password, member.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return this.generateToken(member.id, member.email, 'MEMBER', member.tenantId);
  }

  async validateUser(email: string, password: string, role: 'HOST' | 'TENANT' | 'MEMBER'): Promise<any> {
    if (role === 'HOST') {
      const host = await this.prisma.host.findUnique({ where: { email } });
      if (host && await this.comparePassword(password, host.password)) {
        return { id: host.id, email: host.email, role: 'HOST' };
      }
    } else if (role === 'TENANT') {
      const user = await this.prisma.user.findUnique({ where: { email } });
      if (user && await this.comparePassword(password, user.password)) {
        return { id: user.id, email: user.email, role: user.role, tenantId: user.tenantId };
      }
    } else if (role === 'MEMBER') {
      const member = await this.prisma.member.findUnique({ where: { email } });
      if (member && member.password && await this.comparePassword(password, member.password)) {
        return { id: member.id, email: member.email, role: 'MEMBER', tenantId: member.tenantId };
      }
    }
    return null;
  }

  private generateToken(sub: string, email: string, role: string, tenantId?: string) {
    const payload = { sub, email, role, tenantId };
    return {
      accessToken: this.jwtService.sign(payload),
      refreshToken: this.jwtService.sign({ sub, type: 'refresh' }, { expiresIn: '7d' }),
    };
  }
}
