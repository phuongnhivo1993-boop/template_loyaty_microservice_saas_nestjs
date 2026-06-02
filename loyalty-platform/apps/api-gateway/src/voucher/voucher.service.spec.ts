import { Test, TestingModule } from '@nestjs/testing';
import { VoucherService } from './voucher.service';
import { PrismaService } from '../prisma/prisma.service';
import { ConflictException, NotFoundException, BadRequestException } from '@nestjs/common';

describe('VoucherService', () => {
  let service: VoucherService;
  let prisma: any;

  beforeEach(async () => {
    prisma = {
      voucher: {
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
        VoucherService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();

    service = module.get<VoucherService>(VoucherService);
  });

  describe('create', () => {
    it('should create a voucher', async () => {
      const data = { code: 'SUMMER20', type: 'PERCENTAGE', value: 20, tenantId: 'tenant-1' };
      prisma.voucher.findUnique.mockResolvedValue(null);
      prisma.voucher.create.mockResolvedValue({ id: 'voucher-1', ...data, expiresAt: null });

      const result = await service.create(data);
      expect(result.id).toBe('voucher-1');
      expect(result.code).toBe('SUMMER20');
    });

    it('should throw ConflictException for duplicate code', async () => {
      prisma.voucher.findUnique.mockResolvedValue({ id: 'existing', code: 'SUMMER20' });
      await expect(
        service.create({ code: 'SUMMER20', type: 'PERCENTAGE', value: 20, tenantId: 'tenant-1' }),
      ).rejects.toThrow(ConflictException);
    });
  });

  describe('findAll', () => {
    it('should return paginated list', async () => {
      prisma.voucher.findMany.mockResolvedValue([{ id: 'voucher-1', code: 'TEST' }]);
      prisma.voucher.count.mockResolvedValue(1);

      const result = await service.findAll('tenant-1', 1, 20);
      expect(result.total).toBe(1);
      expect(result.data).toHaveLength(1);
    });
  });

  describe('findOne', () => {
    it('should return a voucher by id', async () => {
      prisma.voucher.findUnique.mockResolvedValue({ id: 'voucher-1', code: 'TEST' });
      const result = await service.findOne('voucher-1');
      expect(result.id).toBe('voucher-1');
    });

    it('should throw NotFoundException for non-existing voucher', async () => {
      prisma.voucher.findUnique.mockResolvedValue(null);
      await expect(service.findOne('invalid')).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update a voucher', async () => {
      prisma.voucher.findUnique.mockResolvedValue({ id: 'voucher-1' });
      prisma.voucher.update.mockResolvedValue({ id: 'voucher-1', value: 30 });

      const result = await service.update('voucher-1', { value: 30 });
      expect(result.value).toBe(30);
    });
  });

  describe('validate', () => {
    it('should validate a voucher code', async () => {
      const futureDate = new Date(Date.now() + 86400000);
      prisma.voucher.findUnique.mockResolvedValue({ id: 'voucher-1', code: 'SUMMER20', expiresAt: futureDate, maxUsage: 100, usedCount: 5 });

      const result = await service.validate('SUMMER20');
      expect(result.valid).toBe(true);
      expect(result.voucher.code).toBe('SUMMER20');
    });

    it('should throw NotFoundException for non-existing voucher', async () => {
      prisma.voucher.findUnique.mockResolvedValue(null);
      await expect(service.validate('invalid')).rejects.toThrow(NotFoundException);
    });

    it('should throw BadRequestException for expired voucher', async () => {
      const pastDate = new Date(Date.now() - 86400000);
      prisma.voucher.findUnique.mockResolvedValue({ id: 'voucher-1', code: 'EXPIRED', expiresAt: pastDate, maxUsage: 100, usedCount: 5 });
      await expect(service.validate('EXPIRED')).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException for max usage reached', async () => {
      const futureDate = new Date(Date.now() + 86400000);
      prisma.voucher.findUnique.mockResolvedValue({ id: 'voucher-1', code: 'MAXED', expiresAt: futureDate, maxUsage: 10, usedCount: 10 });
      await expect(service.validate('MAXED')).rejects.toThrow(BadRequestException);
    });
  });

  describe('redeem', () => {
    it('should redeem a voucher', async () => {
      const futureDate = new Date(Date.now() + 86400000);
      prisma.voucher.findUnique.mockResolvedValue({ id: 'voucher-1', code: 'SUMMER20', expiresAt: futureDate, maxUsage: 100, usedCount: 5 });
      prisma.voucher.update.mockResolvedValue({ id: 'voucher-1', usedCount: 6 });

      const result = await service.redeem('voucher-1');
      expect(result.usedCount).toBe(6);
    });

    it('should throw BadRequestException for expired voucher on redeem', async () => {
      const pastDate = new Date(Date.now() - 86400000);
      prisma.voucher.findUnique.mockResolvedValue({ id: 'voucher-1', code: 'EXPIRED', expiresAt: pastDate, maxUsage: 100, usedCount: 5 });
      await expect(service.redeem('voucher-1')).rejects.toThrow(BadRequestException);
    });
  });

  describe('remove', () => {
    it('should delete a voucher', async () => {
      prisma.voucher.findUnique.mockResolvedValue({ id: 'voucher-1' });
      prisma.voucher.delete.mockResolvedValue({ id: 'voucher-1' });

      const result = await service.remove('voucher-1');
      expect(result.id).toBe('voucher-1');
    });
  });
});
