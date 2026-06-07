import { Test, TestingModule } from '@nestjs/testing';
import { InvoiceService } from './invoice.service';
import { PrismaService } from '../prisma/prisma.service';
import { NotFoundException } from '@nestjs/common';
import { InvoiceStatus } from './dto/invoice.dto';

describe('InvoiceService', () => {
  let service: InvoiceService;
  let prisma: any;

  beforeEach(async () => {
    prisma = {
      subscription: { findUnique: jest.fn() },
      invoice: {
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
        InvoiceService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();

    service = module.get<InvoiceService>(InvoiceService);
  });

  describe('create', () => {
    it('should create an invoice', async () => {
      const dto = { subscriptionId: 'sub-1', amount: 100, dueDate: '2025-01-01', currency: 'VND' };
      prisma.subscription.findUnique.mockResolvedValue({ id: 'sub-1' });
      prisma.invoice.create.mockResolvedValue({ id: 'inv-1', ...dto, subscription: { include: {} } });

      const result = await service.create(dto);
      expect(result.id).toBe('inv-1');
    });

    it('should throw NotFoundException when subscription missing', async () => {
      prisma.subscription.findUnique.mockResolvedValue(null);
      await expect(
        service.create({ subscriptionId: 'invalid', amount: 100, dueDate: '2025-01-01' }),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('findAll', () => {
    it('should return paginated invoices', async () => {
      prisma.invoice.findMany.mockResolvedValue([{ id: 'inv-1', amount: 100 }]);
      prisma.invoice.count.mockResolvedValue(1);

      const result = await service.findAll({ page: 1, limit: 20 });
      expect(result.data).toHaveLength(1);
      expect(result.total).toBe(1);
      expect(result.page).toBe(1);
      expect(result.totalPages).toBe(1);
    });

    it('should apply filters', async () => {
      prisma.invoice.findMany.mockResolvedValue([]);
      prisma.invoice.count.mockResolvedValue(0);

      await service.findAll({ subscriptionId: 'sub-1', status: 'PENDING', tenantId: 'tenant-1' });
      expect(prisma.invoice.findMany).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return an invoice', async () => {
      const mock = { id: 'inv-1', amount: 100, subscription: { include: {} } };
      prisma.invoice.findUnique.mockResolvedValue(mock);

      const result = await service.findOne('inv-1');
      expect(result.id).toBe('inv-1');
    });

    it('should throw NotFoundException when missing', async () => {
      prisma.invoice.findUnique.mockResolvedValue(null);
      await expect(service.findOne('invalid')).rejects.toThrow(NotFoundException);
    });
  });

  describe('findByTenant', () => {
    it('should return paginated invoices for a tenant', async () => {
      prisma.invoice.findMany.mockResolvedValue([{ id: 'inv-1', amount: 100 }]);
      prisma.invoice.count.mockResolvedValue(1);

      const result = await service.findByTenant('tenant-1', 1, 20);
      expect(result.data).toHaveLength(1);
      expect(result.total).toBe(1);
    });
  });

  describe('update', () => {
    it('should update invoice status', async () => {
      prisma.invoice.findUnique.mockResolvedValue({ id: 'inv-1' });
      prisma.invoice.update.mockResolvedValue({ id: 'inv-1', status: 'PAID' });

      const result = await service.update('inv-1', { status: InvoiceStatus.PAID });
      expect(result.status).toBe('PAID');
    });
  });

  describe('remove', () => {
    it('should delete an invoice', async () => {
      prisma.invoice.findUnique.mockResolvedValue({ id: 'inv-1' });
      prisma.invoice.delete.mockResolvedValue({ id: 'inv-1' });

      const result = await service.remove('inv-1');
      expect(result.deleted).toBe(true);
    });

    it('should throw NotFoundException when missing', async () => {
      prisma.invoice.findUnique.mockResolvedValue(null);
      await expect(service.remove('invalid')).rejects.toThrow(NotFoundException);
    });
  });
});
