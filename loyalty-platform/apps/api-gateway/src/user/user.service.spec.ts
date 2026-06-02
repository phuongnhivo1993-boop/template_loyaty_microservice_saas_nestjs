import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { PrismaService } from '../prisma/prisma.service';
import { ConflictException, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';

jest.mock('bcryptjs', () => ({
  hash: jest.fn().mockResolvedValue('hashed-password'),
}));

describe('UserService', () => {
  let service: UserService;
  let prisma: any;

  beforeEach(async () => {
    prisma = {
      user: {
        create: jest.fn(),
        findMany: jest.fn(),
        findUnique: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
        count: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  describe('create', () => {
    it('should create a user (email, fullName, password hashed)', async () => {
      const data = { email: 'test@test.com', password: 'plain123', fullName: 'Test User', tenantId: 'tenant-1' };
      prisma.user.findUnique.mockResolvedValue(null);
      prisma.user.create.mockResolvedValue({ id: 'user-1', email: data.email, fullName: data.fullName, password: 'hashed-password', tenantId: data.tenantId });

      const result = await service.create(data);
      expect(result.id).toBe('user-1');
      expect(result.email).toBe('test@test.com');
      expect(result.password).toBe('hashed-password');
      expect(bcrypt.hash).toHaveBeenCalledWith('plain123', 12);
    });

    it('should reject duplicate email', async () => {
      prisma.user.findUnique.mockResolvedValue({ id: 'existing', email: 'dup@test.com' });
      await expect(
        service.create({ email: 'dup@test.com', password: 'pwd', fullName: 'Dup', tenantId: 't1' }),
      ).rejects.toThrow(ConflictException);
    });
  });

  describe('findAll', () => {
    it('should return paginated list with search', async () => {
      prisma.user.findMany.mockResolvedValue([{ id: 'user-1', email: 'test@test.com' }]);
      prisma.user.count.mockResolvedValue(1);

      const result = await service.findAll('tenant-1', 1, 20, 'test');
      expect(result.total).toBe(1);
      expect(result.data).toHaveLength(1);
      expect(result.page).toBe(1);
      expect(result.limit).toBe(20);
    });
  });

  describe('findOne', () => {
    it('should return a user by id', async () => {
      const mockUser = { id: 'user-1', email: 'test@test.com', fullName: 'Test' };
      prisma.user.findUnique.mockResolvedValue(mockUser);

      const result = await service.findOne('user-1');
      expect(result.id).toBe('user-1');
      expect(result.email).toBe('test@test.com');
    });

    it('should throw NotFoundException when missing', async () => {
      prisma.user.findUnique.mockResolvedValue(null);
      await expect(service.findOne('invalid')).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update a user', async () => {
      prisma.user.findUnique.mockResolvedValue({ id: 'user-1' });
      prisma.user.update.mockResolvedValue({ id: 'user-1', fullName: 'Updated Name' });

      const result = await service.update('user-1', { fullName: 'Updated Name' });
      expect(result.fullName).toBe('Updated Name');
    });
  });

  describe('remove', () => {
    it('should delete a user', async () => {
      prisma.user.findUnique.mockResolvedValue({ id: 'user-1' });
      prisma.user.delete.mockResolvedValue({ id: 'user-1' });

      const result = await service.remove('user-1');
      expect(result.id).toBe('user-1');
    });
  });
});
