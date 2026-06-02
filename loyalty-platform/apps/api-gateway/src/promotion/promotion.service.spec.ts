import { Test, TestingModule } from '@nestjs/testing';
import { PromotionService } from './promotion.service';
import { PrismaService } from '../prisma/prisma.service';
import { NotFoundException } from '@nestjs/common';

describe('PromotionService', () => {
  let service: PromotionService;
  let prisma: any;

  beforeEach(async () => {
    prisma = {
      promotion: {
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
        PromotionService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();

    service = module.get<PromotionService>(PromotionService);
  });

  describe('create', () => {
    it('should create a promotion (conditions/actions as JSON)', async () => {
      const data = {
        name: 'Summer Sale',
        description: 'Summer promotion',
        conditions: { minPurchase: 100 },
        actions: { discount: 15 },
        tenantId: 'tenant-1',
      };
      prisma.promotion.create.mockResolvedValue({ id: 'promo-1', ...data });

      const result = await service.create(data);
      expect(result.id).toBe('promo-1');
      expect(result.name).toBe('Summer Sale');
      expect(result.conditions).toEqual({ minPurchase: 100 });
      expect(result.actions).toEqual({ discount: 15 });
    });
  });

  describe('findAll', () => {
    it('should return paginated list with search and status filter', async () => {
      prisma.promotion.findMany.mockResolvedValue([{ id: 'promo-1', name: 'Summer Sale', status: 'ACTIVE' }]);
      prisma.promotion.count.mockResolvedValue(1);

      const result = await service.findAll('tenant-1', 1, 20, 'summer', undefined, 'ACTIVE');
      expect(result.total).toBe(1);
      expect(result.data).toHaveLength(1);
      expect(result.page).toBe(1);
      expect(result.limit).toBe(20);
    });
  });

  describe('findOne', () => {
    it('should return a promotion by id', async () => {
      const mockPromotion = { id: 'promo-1', name: 'Summer Sale', status: 'ACTIVE' };
      prisma.promotion.findUnique.mockResolvedValue(mockPromotion);

      const result = await service.findOne('promo-1');
      expect(result.id).toBe('promo-1');
      expect(result.name).toBe('Summer Sale');
    });

    it('should throw NotFoundException when missing', async () => {
      prisma.promotion.findUnique.mockResolvedValue(null);
      await expect(service.findOne('invalid')).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update a promotion', async () => {
      prisma.promotion.findUnique.mockResolvedValue({ id: 'promo-1' });
      prisma.promotion.update.mockResolvedValue({ id: 'promo-1', name: 'Winter Sale' });

      const result = await service.update('promo-1', { name: 'Winter Sale' });
      expect(result.name).toBe('Winter Sale');
    });
  });

  describe('remove', () => {
    it('should delete a promotion', async () => {
      prisma.promotion.findUnique.mockResolvedValue({ id: 'promo-1' });
      prisma.promotion.delete.mockResolvedValue({ id: 'promo-1' });

      const result = await service.remove('promo-1');
      expect(result.id).toBe('promo-1');
    });
  });
});
