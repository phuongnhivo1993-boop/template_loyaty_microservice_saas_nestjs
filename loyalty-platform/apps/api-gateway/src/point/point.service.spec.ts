import { Test, TestingModule } from '@nestjs/testing';
import { PointService } from './point.service';
import { PrismaService } from '../prisma/prisma.service';
import { NotFoundException } from '@nestjs/common';

describe('PointService', () => {
  let service: PointService;
  let prisma: any;

  const mockMember = {
    id: 'member-1',
    totalPoints: 100,
    availablePoints: 50,
    tenantId: 'tenant-1',
    tierId: null,
  };

  beforeEach(async () => {
    prisma = {
      member: {
        findUnique: jest.fn(),
        update: jest.fn(),
        aggregate: jest.fn(),
      },
      pointTransaction: {
        create: jest.fn(),
        findMany: jest.fn(),
        count: jest.fn(),
      },
      tier: {
        findMany: jest.fn(),
      },
      $transaction: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PointService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();

    service = module.get<PointService>(PointService);
  });

  describe('getWallet', () => {
    it('should return wallet for existing member', async () => {
      prisma.member.findUnique.mockResolvedValue(mockMember);
      const result = await service.getWallet('member-1');
      expect(result).toEqual({
        available: 50,
        total: 100,
        memberId: 'member-1',
      });
    });

    it('should throw NotFoundException for non-existing member', async () => {
      prisma.member.findUnique.mockResolvedValue(null);
      await expect(service.getWallet('invalid')).rejects.toThrow(NotFoundException);
    });
  });

  describe('earn', () => {
    it('should add points and create transaction', async () => {
      prisma.member.findUnique.mockResolvedValue(mockMember);
      prisma.$transaction.mockResolvedValue([{ id: 'tx-1', amount: 50, type: 'EARN' }]);
      prisma.tier.findMany.mockResolvedValue([]);

      const result = await service.earn('member-1', 50, 'Purchase reward');
      expect(result).toEqual({ id: 'tx-1', amount: 50, type: 'EARN' });
      expect(prisma.$transaction).toHaveBeenCalled();
    });

    it('should throw NotFoundException for invalid member', async () => {
      prisma.member.findUnique.mockResolvedValue(null);
      await expect(service.earn('invalid', 50)).rejects.toThrow(NotFoundException);
    });
  });

  describe('burn', () => {
    it('should deduct points when sufficient', async () => {
      prisma.member.findUnique.mockResolvedValue(mockMember);
      prisma.$transaction.mockResolvedValue([{ id: 'tx-2', amount: -30, type: 'BURN' }]);

      const result = await service.burn('member-1', 30, 'Reward redemption');
      expect(result).toEqual({ id: 'tx-2', amount: -30, type: 'BURN' });
    });

    it('should throw error when insufficient points', async () => {
      prisma.member.findUnique.mockResolvedValue(mockMember);
      await expect(service.burn('member-1', 200)).rejects.toThrow('Insufficient points');
    });
  });

  describe('adjust', () => {
    it('should adjust points and create ADJUST transaction', async () => {
      prisma.member.findUnique.mockResolvedValue(mockMember);
      prisma.$transaction.mockResolvedValue([{ id: 'tx-3', amount: -20, type: 'ADJUST' }]);

      const result = await service.adjust('member-1', -20, 'Admin correction');
      expect(result).toEqual({ id: 'tx-3', amount: -20, type: 'ADJUST' });
    });

    it('should throw error when adjusting below zero', async () => {
      prisma.member.findUnique.mockResolvedValue(mockMember);
      await expect(service.adjust('member-1', -200, 'Admin error')).rejects.toThrow('Insufficient points');
    });
  });

  describe('getTransactions', () => {
    it('should return paginated transactions', async () => {
      prisma.pointTransaction.findMany.mockResolvedValue([{ id: 'tx-1' }]);
      prisma.pointTransaction.count.mockResolvedValue(1);

      const result = await service.getTransactions('member-1', 1, 20, 'EARN');
      expect(result.total).toBe(1);
      expect(result.data).toHaveLength(1);
      expect(result.totalPages).toBe(1);
    });

    it('should return empty list for no transactions', async () => {
      prisma.pointTransaction.findMany.mockResolvedValue([]);
      prisma.pointTransaction.count.mockResolvedValue(0);

      const result = await service.getTransactions('member-1');
      expect(result.total).toBe(0);
      expect(result.data).toHaveLength(0);
    });
  });
});
