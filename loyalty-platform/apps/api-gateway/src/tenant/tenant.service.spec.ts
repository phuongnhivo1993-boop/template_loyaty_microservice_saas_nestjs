import { Test, TestingModule } from '@nestjs/testing';
import { TenantService } from './tenant.service';
import { PrismaService } from '../prisma/prisma.service';
import { ConflictException, NotFoundException } from '@nestjs/common';

describe('TenantService', () => {
  let service: TenantService;
  let prisma: any;

  beforeEach(async () => {
    prisma = {
      tenant: {
        create: jest.fn(),
        findMany: jest.fn(),
        findUnique: jest.fn(),
        update: jest.fn(),
        count: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TenantService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();

    service = module.get<TenantService>(TenantService);
  });

  describe('create', () => {
    it('should create a tenant', async () => {
      const data = { name: 'Test Tenant', domain: 'test.com', email: 'admin@test.com', hostId: 'host-1' };
      prisma.tenant.findUnique.mockResolvedValue(null);
      prisma.tenant.create.mockResolvedValue({ id: 'tenant-1', ...data });

      const result = await service.create(data);
      expect(result.id).toBe('tenant-1');
      expect(result.name).toBe('Test Tenant');
    });

    it('should throw ConflictException for duplicate domain', async () => {
      prisma.tenant.findUnique.mockResolvedValue({ id: 'existing', domain: 'test.com' });
      await expect(
        service.create({ name: 'Test', domain: 'test.com', email: 'a@a.com', hostId: 'h1' }),
      ).rejects.toThrow(ConflictException);
    });
  });

  describe('findAll', () => {
    it('should return paginated list with search', async () => {
      prisma.tenant.findMany.mockResolvedValue([{ id: 'tenant-1', name: 'Test Tenant' }]);
      prisma.tenant.count.mockResolvedValue(1);

      const result = await service.findAll(1, 20, 'test');
      expect(result.total).toBe(1);
      expect(result.data).toHaveLength(1);
      expect(result.page).toBe(1);
      expect(result.limit).toBe(20);
    });
  });

  describe('findOne', () => {
    it('should return a tenant by id', async () => {
      const mockTenant = { id: 'tenant-1', name: 'Test', _count: { users: 2, members: 5 } };
      prisma.tenant.findUnique.mockResolvedValue(mockTenant);

      const result = await service.findOne('tenant-1');
      expect(result.id).toBe('tenant-1');
      expect(result._count.users).toBe(2);
    });

    it('should throw NotFoundException for non-existing tenant', async () => {
      prisma.tenant.findUnique.mockResolvedValue(null);
      await expect(service.findOne('invalid')).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update a tenant', async () => {
      prisma.tenant.findUnique.mockResolvedValue({ id: 'tenant-1' });
      prisma.tenant.update.mockResolvedValue({ id: 'tenant-1', name: 'Updated Tenant' });

      const result = await service.update('tenant-1', { name: 'Updated Tenant' });
      expect(result.name).toBe('Updated Tenant');
    });
  });

  describe('remove', () => {
    it('should soft-delete a tenant', async () => {
      prisma.tenant.findUnique.mockResolvedValue({ id: 'tenant-1' });
      prisma.tenant.update.mockResolvedValue({ id: 'tenant-1', status: 'DISABLED' });

      const result = await service.remove('tenant-1');
      expect(result.status).toBe('DISABLED');
    });
  });
});
