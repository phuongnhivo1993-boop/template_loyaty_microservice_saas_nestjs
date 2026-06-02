import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { ConflictException, UnauthorizedException, BadRequestException, NotFoundException } from '@nestjs/common';

jest.setTimeout(30000);

describe('AuthService', () => {
  let service: AuthService;
  let prisma: any;
  let jwtService: any;

    beforeEach(async () => {
    prisma = {
      host: {
        findUnique: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
      },
      user: {
        findUnique: jest.fn(),
        update: jest.fn(),
      },
      member: {
        findUnique: jest.fn(),
        update: jest.fn(),
      },
    };

    jwtService = {
      sign: jest.fn().mockReturnValue('mock-token'),
      verify: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: PrismaService, useValue: prisma },
        { provide: JwtService, useValue: jwtService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  describe('registerHost', () => {
    it('should register a new host', async () => {
      prisma.host.findUnique.mockResolvedValue(null);
      prisma.host.create.mockResolvedValue({
        id: 'host-1',
        email: 'test@test.com',
        name: 'Test Host',
      });

      const result = await service.registerHost(
        'test@test.com',
        'password123',
        'Test Host',
      );
      expect(result.email).toBe('test@test.com');
      expect(result.name).toBe('Test Host');
    });

    it('should throw ConflictException for duplicate email', async () => {
      prisma.host.findUnique.mockResolvedValue({ id: 'host-1' });
      await expect(
        service.registerHost('test@test.com', 'password123', 'Test'),
      ).rejects.toThrow(ConflictException);
    });
  });

  describe('loginHost', () => {
    it('should login with valid credentials', async () => {
      const hashedPassword = await (service as any).hashPassword('password123');
      prisma.host.findUnique.mockResolvedValue({
        id: 'host-1',
        email: 'test@test.com',
        password: hashedPassword,
      });

      const result = await service.loginHost('test@test.com', 'password123');
      expect(result.accessToken).toBe('mock-token');
    });

    it('should throw UnauthorizedException for invalid password', async () => {
      const hashedPassword = await (service as any).hashPassword(
        'correct-password',
      );
      prisma.host.findUnique.mockResolvedValue({
        id: 'host-1',
        email: 'test@test.com',
        password: hashedPassword,
      });

      await expect(
        service.loginHost('test@test.com', 'wrong-password'),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException for non-existing email', async () => {
      prisma.host.findUnique.mockResolvedValue(null);
      await expect(
        service.loginHost('notfound@test.com', 'password'),
      ).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('loginMember', () => {
    it('should login active member', async () => {
      const hashedPassword = await (service as any).hashPassword('memberpass');
      prisma.member.findUnique.mockResolvedValue({
        id: 'member-1',
        email: 'member@test.com',
        password: hashedPassword,
        status: 'ACTIVE',
        tenantId: 'tenant-1',
      });

      const result = await service.loginMember('member@test.com', 'memberpass');
      expect(result.accessToken).toBe('mock-token');
    });

    it('should reject inactive member', async () => {
      prisma.member.findUnique.mockResolvedValue({
        id: 'member-1',
        email: 'member@test.com',
        password: 'hashed',
        status: 'LOCKED',
        tenantId: 'tenant-1',
      });

      await expect(
        service.loginMember('member@test.com', 'memberpass'),
      ).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('validateUser', () => {
    it('should validate host credentials', async () => {
      const hashedPassword = await (service as any).hashPassword('password123');
      prisma.host.findUnique.mockResolvedValue({
        id: 'host-1',
        email: 'test@test.com',
        password: hashedPassword,
      });

      const result = await service.validateUser(
        'test@test.com',
        'password123',
        'HOST',
      );
      expect(result).toBeDefined();
      expect(result.role).toBe('HOST');
    });

    it('should return null for invalid credentials', async () => {
      prisma.host.findUnique.mockResolvedValue(null);
      const result = await service.validateUser(
        'test@test.com',
        'password123',
        'HOST',
      );
      expect(result).toBeNull();
    });
  });

  describe('forgotPassword', () => {
    it('should return a reset token for existing member', async () => {
      prisma.member.findUnique.mockResolvedValue({ id: 'member-1', email: 'member@test.com' });
      prisma.user.findUnique.mockResolvedValue(null);
      prisma.host.findUnique.mockResolvedValue(null);

      const result = await service.forgotPassword('member@test.com');
      expect(result.message).toBe('If the email exists, a reset link has been sent');
      expect(result.resetToken).toBeDefined();
    });

    it('should not reveal if email does not exist', async () => {
      prisma.member.findUnique.mockResolvedValue(null);
      prisma.user.findUnique.mockResolvedValue(null);
      prisma.host.findUnique.mockResolvedValue(null);

      const result = await service.forgotPassword('nonexistent@test.com');
      expect(result.message).toBe('If the email exists, a reset link has been sent');
      expect(result.resetToken).toBeUndefined();
    });
  });

  describe('resetPassword', () => {
    it('should reset password for member with valid token', async () => {
      jwtService.verify.mockReturnValue({ email: 'member@test.com', type: 'reset' });
      prisma.member.findUnique.mockResolvedValue({ id: 'member-1', email: 'member@test.com', password: 'old-hashed' });
      prisma.member.update.mockResolvedValue({ id: 'member-1' });

      const result = await service.resetPassword('valid-token', 'new-password');
      expect(result.message).toBe('Password reset successfully');
    });

    it('should throw for invalid token type', async () => {
      jwtService.verify.mockReturnValue({ email: 'test@test.com', type: 'access' });

      await expect(service.resetPassword('bad-token', 'new-password')).rejects.toThrow(BadRequestException);
    });

    it('should throw for expired token', async () => {
      jwtService.verify.mockImplementation(() => { throw new Error('expired'); });

      await expect(service.resetPassword('expired-token', 'new-password')).rejects.toThrow(BadRequestException);
    });
  });
});
