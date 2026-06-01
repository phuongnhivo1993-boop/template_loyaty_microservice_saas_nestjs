import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as crypto from 'crypto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  private hashPassword(password: string): string {
    return crypto.createHash('sha256').update(password).digest('hex');
  }

  async registerHost(email: string, password: string, name: string) {
    const existing = await this.prisma.host.findUnique({ where: { email } });
    if (existing) throw new ConflictException('Email already registered');

    const host = await this.prisma.host.create({
      data: { email, password: this.hashPassword(password), name },
    });
    return { id: host.id, email: host.email, name: host.name };
  }

  async loginHost(email: string, password: string) {
    const host = await this.prisma.host.findUnique({ where: { email } });
    if (!host || host.password !== this.hashPassword(password)) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return this.generateToken(host.id, host.email, 'HOST');
  }

  async loginTenant(email: string, password: string, tenantId?: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user || user.password !== this.hashPassword(password)) {
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
    return this.generateToken(member.id, member.email, 'MEMBER', member.tenantId);
  }

  private generateToken(sub: string, email: string, role: string, tenantId?: string) {
    const payload = { sub, email, role, tenantId };
    return {
      accessToken: this.jwtService.sign(payload),
      refreshToken: this.jwtService.sign({ sub, type: 'refresh' }, { expiresIn: '7d' }),
    };
  }
}
