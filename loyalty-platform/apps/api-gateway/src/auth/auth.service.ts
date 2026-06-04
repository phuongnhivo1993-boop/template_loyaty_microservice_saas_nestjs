import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  NotFoundException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import * as crypto from 'crypto';
import { PrismaService } from '../prisma/prisma.service';
import { TokenBlacklistService } from './token-blacklist.service';
import { ErrorCodes, ServiceException } from '../common/errors/error-codes';

const MAX_LOGIN_ATTEMPTS = 5;
const LOCKOUT_DURATION_MINUTES = 15;

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  private readonly saltRounds = 12;

  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private tokenBlacklist: TokenBlacklistService,
  ) {}

  private async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, this.saltRounds);
  }

  private async comparePassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  private generateToken(sub: string, email: string, role: string, tenantId?: string) {
    const jti = crypto.randomUUID();
    const payload = { sub, email, role, tenantId, jti };
    return {
      accessToken: this.jwtService.sign(payload),
      refreshToken: this.jwtService.sign(
        { sub, email, role, tenantId, type: 'refresh', jti },
        { expiresIn: '7d' },
      ),
    };
  }

  private async checkAccountLockout(identifier: string): Promise<void> {
    const cacheKey = `login_attempts:${identifier}`;
    const lockKey = `account_locked:${identifier}`;
    try {
      const locked = await this.prisma.settings.findFirst({
        where: { scope: '_auth', scopeId: lockKey, key: 'locked' },
      });
      if (locked) {
        throw new ServiceException(
          'Account is locked due to too many failed attempts. Please try again later.',
          ErrorCodes.AUTH_ACCOUNT_LOCKED,
          423,
        );
      }
    } catch (err) {
      if (err instanceof ServiceException) throw err;
    }
  }

  private async recordFailedAttempt(identifier: string): Promise<void> {
    const lockKey = `login_attempts:${identifier}`;
    const existing = await this.prisma.settings.findFirst({
      where: { scope: '_auth', scopeId: lockKey, key: 'count' },
    });
    const count = existing ? ((existing.value as any)?.count || 0) + 1 : 1;
    await this.prisma.settings.upsert({
      where: { scope_scopeId_key: { scope: '_auth', scopeId: lockKey, key: 'count' } },
      update: { value: { count, lastAttempt: new Date() } },
      create: { scope: '_auth', scopeId: lockKey, key: 'count', value: { count, lastAttempt: new Date() } },
    });
    if (count >= MAX_LOGIN_ATTEMPTS) {
      const lockUntil = new Date(Date.now() + LOCKOUT_DURATION_MINUTES * 60 * 1000);
      await this.prisma.settings.upsert({
        where: { scope_scopeId_key: { scope: '_auth', scopeId: `account_locked:${identifier}`, key: 'locked' } },
        update: { value: { lockedUntil: lockUntil } },
        create: { scope: '_auth', scopeId: `account_locked:${identifier}`, key: 'locked', value: { lockedUntil: lockUntil } },
      });
      this.logger.warn(`Account locked: ${identifier} until ${lockUntil}`);
    }
  }

  private async clearFailedAttempts(identifier: string): Promise<void> {
    const lockKey = `login_attempts:${identifier}`;
    await this.prisma.settings.deleteMany({
      where: { scope: '_auth', scopeId: { in: [lockKey, `account_locked:${identifier}`] } },
    }).catch(() => {});
  }

  async registerHost(email: string, password: string, name: string) {
    if (password.length < 8) {
      throw new ServiceException('Password must be at least 8 characters', ErrorCodes.AUTH_WEAK_PASSWORD, 422);
    }
    const existing = await this.prisma.host.findUnique({ where: { email } });
    if (existing) throw new ConflictException('Email already registered');
    const host = await this.prisma.host.create({
      data: { email, password: await this.hashPassword(password), name },
    });
    await this.prisma.auditLog.create({
      data: { entityType: 'host', entityId: host.id, action: 'CREATE', userEmail: email, ipAddress: '' },
    });
    return { id: host.id, email: host.email, name: host.name };
  }

  async loginHost(email: string, password: string, ipAddress?: string) {
    await this.checkAccountLockout(`host:${email}`);
    const host = await this.prisma.host.findUnique({ where: { email } });
    if (!host || !(await this.comparePassword(password, host.password))) {
      await this.recordFailedAttempt(`host:${email}`);
      this.logger.warn(`Failed login attempt for host: ${email} from IP: ${ipAddress}`);
      throw new ServiceException('Invalid credentials', ErrorCodes.AUTH_INVALID_CREDENTIALS, 401);
    }
    await this.clearFailedAttempts(`host:${email}`);
    await this.prisma.auditLog.create({
      data: { entityType: 'auth', entityId: host.id, action: 'LOGIN', userEmail: email, ipAddress: ipAddress || '' },
    });
    return this.generateToken(host.id, host.email, 'HOST');
  }

  async loginTenant(email: string, password: string, tenantId?: string, ipAddress?: string) {
    await this.checkAccountLockout(`tenant:${email}`);
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user || !(await this.comparePassword(password, user.password))) {
      await this.recordFailedAttempt(`tenant:${email}`);
      this.logger.warn(`Failed login attempt for tenant user: ${email} from IP: ${ipAddress}`);
      throw new ServiceException('Invalid credentials', ErrorCodes.AUTH_INVALID_CREDENTIALS, 401);
    }
    if (tenantId && user.tenantId !== tenantId) {
      throw new ServiceException('User does not belong to this tenant', ErrorCodes.TENANT_CROSS_ACCESS, 403);
    }
    const tenant = await this.prisma.tenant.findUnique({ where: { id: user.tenantId } });
    if (tenant?.status === 'SUSPENDED') {
      throw new ServiceException('Tenant account is suspended', ErrorCodes.TENANT_SUSPENDED, 403);
    }
    await this.clearFailedAttempts(`tenant:${email}`);
    await this.prisma.auditLog.create({
      data: { entityType: 'auth', entityId: user.id, action: 'LOGIN', userEmail: email, ipAddress: ipAddress || '' },
    });
    return this.generateToken(user.id, user.email, user.role, user.tenantId);
  }

  async loginMember(email: string, password: string, ipAddress?: string) {
    await this.checkAccountLockout(`member:${email}`);
    const member = await this.prisma.member.findUnique({ where: { email } });
    if (!member) {
      await this.recordFailedAttempt(`member:${email}`);
      throw new ServiceException('Invalid credentials', ErrorCodes.AUTH_INVALID_CREDENTIALS, 401);
    }
    if (member.status === 'LOCKED') {
      throw new ServiceException('Account is locked. Please contact support.', ErrorCodes.AUTH_ACCOUNT_LOCKED, 423);
    }
    if (member.status !== 'ACTIVE') {
      throw new ServiceException('Account is not active', ErrorCodes.FORBIDDEN, 403);
    }
    if (member.password && !(await this.comparePassword(password, member.password))) {
      await this.recordFailedAttempt(`member:${email}`);
      this.logger.warn(`Failed login attempt for member: ${email}`);
      throw new ServiceException('Invalid credentials', ErrorCodes.AUTH_INVALID_CREDENTIALS, 401);
    }
    await this.clearFailedAttempts(`member:${email}`);
    await this.prisma.auditLog.create({
      data: { entityType: 'auth', entityId: member.id, action: 'LOGIN', userEmail: email, ipAddress: ipAddress || '' },
    });
    return this.generateToken(member.id, member.email, 'MEMBER', member.tenantId);
  }

  async logout(user: any, accessToken: string): Promise<void> {
    try {
      const payload = this.jwtService.verify(accessToken);
      if (payload.jti && payload.exp) {
        await this.tokenBlacklist.add(payload.jti, new Date(payload.exp * 1000));
      }
    } catch {}
    this.logger.log(`User logged out: ${user?.email || 'unknown'}`);
  }

  async refreshToken(refreshToken: string) {
    try {
      const payload = this.jwtService.verify(refreshToken);
      if (payload.type !== 'refresh') {
        throw new ServiceException('Invalid refresh token', ErrorCodes.AUTH_TOKEN_INVALID, 401);
      }
      if (payload.jti && (await this.tokenBlacklist.isBlacklisted(payload.jti))) {
        throw new ServiceException('Token has been revoked', ErrorCodes.AUTH_TOKEN_REVOKED, 401);
      }
      return this.generateToken(
        payload.sub,
        payload.email || payload.sub,
        payload.role || 'MEMBER',
        payload.tenantId,
      );
    } catch (err) {
      if (err instanceof ServiceException) throw err;
      throw new ServiceException('Invalid or expired refresh token', ErrorCodes.AUTH_TOKEN_EXPIRED, 401);
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
    this.logger.log(`Password reset requested for: ${email}`);
    return { message: 'If the email exists, a reset link has been sent' };
  }

  async resetPassword(token: string, newPassword: string) {
    try {
      const payload = this.jwtService.verify(token);
      if (payload.type !== 'reset') {
        throw new BadRequestException('Invalid reset token');
      }
      if (newPassword.length < 8) {
        throw new ServiceException('Password must be at least 8 characters', ErrorCodes.AUTH_WEAK_PASSWORD, 422);
      }
      const email = payload.email;
      const hashed = await this.hashPassword(newPassword);
      const member = await this.prisma.member.findUnique({ where: { email } });
      if (member && member.password) {
        await this.prisma.member.update({ where: { email }, data: { password: hashed } });
        return { message: 'Password reset successfully' };
      }
      const user = await this.prisma.user.findUnique({ where: { email } });
      if (user && user.password) {
        await this.prisma.user.update({ where: { email }, data: { password: hashed } });
        return { message: 'Password reset successfully' };
      }
      throw new NotFoundException('User not found');
    } catch (err) {
      if (err instanceof ServiceException) throw err;
      if (err instanceof NotFoundException || err instanceof BadRequestException) throw err;
      throw new BadRequestException('Invalid or expired reset token');
    }
  }

  async changePassword(user: any, oldPassword: string, newPassword: string) {
    if (newPassword.length < 8) {
      throw new ServiceException('Password must be at least 8 characters', ErrorCodes.AUTH_WEAK_PASSWORD, 422);
    }
    const { sub, role } = user;
    if (role === 'HOST') {
      const host = await this.prisma.host.findUnique({ where: { id: sub } });
      if (!host) throw new NotFoundException('User not found');
      if (!(await this.comparePassword(oldPassword, host.password))) {
        throw new UnauthorizedException('Current password is incorrect');
      }
      await this.prisma.host.update({ where: { id: sub }, data: { password: await this.hashPassword(newPassword) } });
    } else if (role === 'MEMBER') {
      const member = await this.prisma.member.findUnique({ where: { id: sub } });
      if (!member) throw new NotFoundException('Member not found');
      if (!member.password) {
        throw new BadRequestException('No password set. Use set-password first.');
      }
      if (!(await this.comparePassword(oldPassword, member.password))) {
        throw new UnauthorizedException('Current password is incorrect');
      }
      await this.prisma.member.update({ where: { id: sub }, data: { password: await this.hashPassword(newPassword) } });
    } else {
      const userEntity = await this.prisma.user.findUnique({ where: { id: sub } });
      if (!userEntity) throw new NotFoundException('User not found');
      if (!(await this.comparePassword(oldPassword, userEntity.password))) {
        throw new UnauthorizedException('Current password is incorrect');
      }
      await this.prisma.user.update({ where: { id: sub }, data: { password: await this.hashPassword(newPassword) } });
    }
    return { message: 'Password changed successfully' };
  }
}
