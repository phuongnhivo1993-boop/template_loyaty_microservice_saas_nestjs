import { Test, TestingModule } from '@nestjs/testing';
import { AnalyticsService } from './analytics.service';
import { PrismaService } from '../prisma/prisma.service';
import { CacheService } from '../common/services/cache.service';

const mockCacheService = { get: jest.fn().mockResolvedValue(null), set: jest.fn(), del: jest.fn(), delPattern: jest.fn() };

describe('AnalyticsService', () => {
  let service: AnalyticsService;
  let prisma: any;

  beforeEach(async () => {
    prisma = {
      pointTransaction: {
        findMany: jest.fn(),
      },
      member: {
        findMany: jest.fn(),
      },
      campaign: {
        findMany: jest.fn(),
      },
      voucher: {
        count: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AnalyticsService,
        { provide: PrismaService, useValue: prisma },
        { provide: CacheService, useValue: mockCacheService },
      ],
    }).compile();

    service = module.get<AnalyticsService>(AnalyticsService);
  });

  describe('getPointsTrend', () => {
    it('should return daily earned/burned arrays', async () => {
      const now = Date.now();
      prisma.pointTransaction.findMany.mockResolvedValue([
        { id: 'pt-1', amount: 100, createdAt: new Date(now), member: { tenantId: 't-1' } },
        { id: 'pt-2', amount: -30, createdAt: new Date(now), member: { tenantId: 't-1' } },
      ]);

      const result = await service.getPointsTrend(30, 't-1');
      expect(result.length).toBe(1);
      expect(result[0].earned).toBe(100);
      expect(result[0].burned).toBe(30);
    });
  });

  describe('getMemberGrowth', () => {
    it('should return daily new + cumulative members', async () => {
      const now = Date.now();
      prisma.member.findMany.mockResolvedValue([
        { id: 'm-1', createdAt: new Date(now) },
        { id: 'm-2', createdAt: new Date(now) },
      ]);

      const result = await service.getMemberGrowth(30, 't-1');
      expect(result.length).toBe(1);
      expect(result[0].newMembers).toBe(2);
      expect(result[0].totalMembers).toBe(2);
    });
  });

  describe('getCampaignPerformance', () => {
    it('should return campaign counts', async () => {
      prisma.campaign.findMany.mockResolvedValue([
        { id: 'c-1', status: 'ACTIVE' },
        { id: 'c-2', status: 'ENDED' },
        { id: 'c-3', status: 'DRAFT' },
      ]);

      const result = await service.getCampaignPerformance('t-1');
      expect(result.total).toBe(3);
      expect(result.active).toBe(1);
      expect(result.completed).toBe(1);
      expect(result.draft).toBe(1);
    });
  });

  describe('getTopMembers', () => {
    it('should return top members by points', async () => {
      prisma.member.findMany.mockResolvedValue([
        { id: 'm-1', totalPoints: 500, tier: { name: 'Gold', color: '#FFD700' } },
        { id: 'm-2', totalPoints: 300, tier: { name: 'Silver', color: '#C0C0C0' } },
      ]);

      const result = await service.getTopMembers(10, 't-1');
      expect(result).toHaveLength(2);
      expect(result[0].totalPoints).toBe(500);
      expect(result[1].tier.name).toBe('Silver');
    });
  });

  describe('getVoucherStats', () => {
    it('should return voucher statistics', async () => {
      prisma.voucher.count.mockResolvedValueOnce(10);
      prisma.voucher.count.mockResolvedValueOnce(3);

      const result = await service.getVoucherStats('t-1');
      expect(result.total).toBe(10);
      expect(result.used).toBe(3);
      expect(result.remaining).toBe(7);
      expect(result.usageRate).toBe('30.0');
    });
  });
});
