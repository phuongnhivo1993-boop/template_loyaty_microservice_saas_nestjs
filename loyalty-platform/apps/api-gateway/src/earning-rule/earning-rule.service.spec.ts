import { Test, TestingModule } from '@nestjs/testing';
import { EarningRuleService } from './earning-rule.service';
import { PrismaService } from '../prisma/prisma.service';
import { NotFoundException } from '@nestjs/common';

describe('EarningRuleService', () => {
  let service: EarningRuleService;
  let prisma: any;

  beforeEach(async () => {
    prisma = {
      pointEarningRule: {
        create: jest.fn(),
        findMany: jest.fn(),
        findUnique: jest.fn(),
        count: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EarningRuleService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();

    service = module.get<EarningRuleService>(EarningRuleService);
  });

  describe('create', () => {
    it('should create an earning rule', async () => {
      const dto = { name: 'Spend Bonus', pointsPerUnit: 0.1, tenantId: 'tenant-1' };
      prisma.pointEarningRule.create.mockResolvedValue({ id: 'rule-1', ...dto });
      const result = await service.create(dto);
      expect(result.id).toBe('rule-1');
      expect(result.name).toBe('Spend Bonus');
    });
  });

  describe('findAll', () => {
    it('should return paginated rules', async () => {
      prisma.pointEarningRule.findMany.mockResolvedValue([{ id: 'rule-1', name: 'Bonus' }]);
      prisma.pointEarningRule.count.mockResolvedValue(1);
      const result = await service.findAll('tenant-1', 1, 20);
      expect(result.data).toHaveLength(1);
      expect(result.total).toBe(1);
    });
  });

  describe('findOne', () => {
    it('should return a rule', async () => {
      prisma.pointEarningRule.findUnique.mockResolvedValue({ id: 'rule-1', name: 'Bonus' });
      const result = await service.findOne('rule-1');
      expect(result.id).toBe('rule-1');
    });

    it('should throw if not found', async () => {
      prisma.pointEarningRule.findUnique.mockResolvedValue(null);
      await expect(service.findOne('invalid')).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update a rule', async () => {
      prisma.pointEarningRule.findUnique.mockResolvedValue({ id: 'rule-1', name: 'Old' });
      prisma.pointEarningRule.update.mockResolvedValue({ id: 'rule-1', name: 'Updated' });
      const result = await service.update('rule-1', { name: 'Updated' });
      expect(result.name).toBe('Updated');
    });
  });

  describe('remove', () => {
    it('should delete a rule', async () => {
      prisma.pointEarningRule.findUnique.mockResolvedValue({ id: 'rule-1' });
      prisma.pointEarningRule.delete.mockResolvedValue({ id: 'rule-1' });
      const result = await service.remove('rule-1');
      expect(result.id).toBe('rule-1');
    });
  });

  describe('calculateEarning', () => {
    it('should return 0 if no rules match', async () => {
      prisma.pointEarningRule.findMany.mockResolvedValue([]);
      const result = await service.calculateEarning('tenant-1', 100);
      expect(result.points).toBe(0);
      expect(result.rule).toBeNull();
    });

    it('should calculate points from matching rule', async () => {
      prisma.pointEarningRule.findMany.mockResolvedValue([
        { id: 'r1', name: 'Standard', pointsPerUnit: 0.1, minAmount: 50, maxAmount: null, status: 'ACTIVE' },
      ]);
      const result = await service.calculateEarning('tenant-1', 100);
      expect(result.points).toBe(10);
      expect(result.rule).toBe('Standard');
      expect(result.amount).toBe(100);
    });

    it('should filter by category', async () => {
      prisma.pointEarningRule.findMany.mockResolvedValue([
        { id: 'r1', name: 'Food Bonus', pointsPerUnit: 0.2, minAmount: null, maxAmount: null, status: 'ACTIVE' },
      ]);
      const result = await service.calculateEarning('tenant-1', 200, 'FOOD');
      expect(result.points).toBe(40);
      expect(prisma.pointEarningRule.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({ category: 'FOOD' }),
        })
      );
    });

    it('should apply min/max amount filter', async () => {
      prisma.pointEarningRule.findMany.mockResolvedValue([
        { id: 'r1', name: 'Bulk Bonus', pointsPerUnit: 0.5, minAmount: 500, maxAmount: null, status: 'ACTIVE' },
      ]);
      const result = await service.calculateEarning('tenant-1', 50);
      expect(result.points).toBe(0);
    });
  });
});
