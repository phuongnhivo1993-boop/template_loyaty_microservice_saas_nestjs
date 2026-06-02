import { Test, TestingModule } from '@nestjs/testing';
import { TierService } from './tier.service';
import { PrismaService } from '../prisma/prisma.service';
import { NotFoundException } from '@nestjs/common';

describe('TierService', () => {
  let service: TierService;
  let prisma: any;

  beforeEach(async () => {
    prisma = {
      tier: {
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
        TierService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();

    service = module.get<TierService>(TierService);
  });

  describe('create', () => {
    it('should create a tier', async () => {
      const data = { name: 'Gold', minPoints: 100, maxPoints: 500, benefits: 'Discount 10%', tenantId: 'tenant-1' };
      prisma.tier.create.mockResolvedValue({ id: 'tier-1', ...data });

      const result = await service.create(data);
      expect(result.id).toBe('tier-1');
      expect(result.name).toBe('Gold');
    });
  });

  describe('findAll', () => {
    it('should return paginated list with search', async () => {
      prisma.tier.findMany.mockResolvedValue([{ id: 'tier-1', name: 'Gold' }]);
      prisma.tier.count.mockResolvedValue(1);

      const result = await service.findAll('tenant-1', 1, 20, 'gold');
      expect(result.total).toBe(1);
      expect(result.data).toHaveLength(1);
      expect(result.page).toBe(1);
      expect(result.limit).toBe(20);
    });
  });

  describe('findOne', () => {
    it('should return a tier by id', async () => {
      const mockTier = { id: 'tier-1', name: 'Gold', minPoints: 100, maxPoints: 500 };
      prisma.tier.findUnique.mockResolvedValue(mockTier);

      const result = await service.findOne('tier-1');
      expect(result.id).toBe('tier-1');
      expect(result.name).toBe('Gold');
    });

    it('should throw NotFoundException when missing', async () => {
      prisma.tier.findUnique.mockResolvedValue(null);
      await expect(service.findOne('invalid')).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update a tier', async () => {
      prisma.tier.findUnique.mockResolvedValue({ id: 'tier-1' });
      prisma.tier.update.mockResolvedValue({ id: 'tier-1', name: 'Platinum' });

      const result = await service.update('tier-1', { name: 'Platinum' });
      expect(result.name).toBe('Platinum');
    });
  });

  describe('remove', () => {
    it('should delete a tier', async () => {
      prisma.tier.findUnique.mockResolvedValue({ id: 'tier-1' });
      prisma.tier.delete.mockResolvedValue({ id: 'tier-1' });

      const result = await service.remove('tier-1');
      expect(result.id).toBe('tier-1');
    });
  });
});
