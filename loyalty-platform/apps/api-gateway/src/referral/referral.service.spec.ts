import { Test, TestingModule } from '@nestjs/testing';
import { ReferralService } from './referral.service';
import { PrismaService } from '../prisma/prisma.service';
import { NotFoundException } from '@nestjs/common';

describe('ReferralService', () => {
  let service: ReferralService;
  let prisma: any;

  beforeEach(async () => {
    prisma = {
      referral: {
        create: jest.fn(),
        findMany: jest.fn(),
        findUnique: jest.fn(),
        update: jest.fn(),
        count: jest.fn(),
      },
      pointTransaction: {
        create: jest.fn(),
      },
      member: {
        update: jest.fn(),
      },
      $transaction: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReferralService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();

    service = module.get<ReferralService>(ReferralService);
  });

  describe('createLink', () => {
    it('should create a referral link with unique code', async () => {
      prisma.referral.create.mockResolvedValue({
        id: 'ref-1',
        code: 'REF-member1-abc123',
        referrerId: 'member-1',
        tenantId: 'tenant-1',
      });

      const result = await service.createLink('member-1', 'tenant-1');
      expect(result.code).toContain('REF-');
      expect(result.referrerId).toBe('member-1');
    });
  });

  describe('findAll', () => {
    it('should return paginated referrals', async () => {
      prisma.referral.findMany.mockResolvedValue([{ id: 'ref-1', code: 'REF-123' }]);
      prisma.referral.count.mockResolvedValue(1);

      const result = await service.findAll('tenant-1', 1, 20);
      expect(result.total).toBe(1);
      expect(result.data).toHaveLength(1);
    });
  });

  describe('getStats', () => {
    it('should return referral statistics', async () => {
      prisma.referral.count.mockResolvedValueOnce(10).mockResolvedValueOnce(4);

      const result = await service.getStats('tenant-1');
      expect(result.total).toBe(10);
      expect(result.converted).toBe(4);
      expect(result.rate).toBe('40.0');
    });

    it('should handle zero referrals', async () => {
      prisma.referral.count.mockResolvedValueOnce(0).mockResolvedValueOnce(0);

      const result = await service.getStats('tenant-1');
      expect(result.total).toBe(0);
      expect(result.converted).toBe(0);
      expect(result.rate).toBe('0');
    });
  });

  describe('convertReferral', () => {
    it('should convert referral and reward referrer', async () => {
      prisma.referral.findUnique.mockResolvedValue({
        id: 'ref-1',
        referrerId: 'member-1',
        status: 'PENDING',
        code: 'REF-123',
        tenantId: 'tenant-1',
      });
      prisma.referral.update.mockResolvedValue({
        id: 'ref-1',
        status: 'CONVERTED',
        refereeId: 'member-2',
      });
      prisma.$transaction.mockResolvedValue([]);

      const result = await service.convertReferral('ref-1', 'member-2');
      expect(result.status).toBe('CONVERTED');
      expect(result.refereeId).toBe('member-2');
    });

    it('should throw NotFoundException for invalid referral', async () => {
      prisma.referral.findUnique.mockResolvedValue(null);
      await expect(service.convertReferral('invalid', 'member-2')).rejects.toThrow(NotFoundException);
    });
  });
});
