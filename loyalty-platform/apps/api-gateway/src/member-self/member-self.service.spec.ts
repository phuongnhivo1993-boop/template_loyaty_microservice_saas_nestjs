import { Test, TestingModule } from '@nestjs/testing';
import { MemberSelfService } from './member-self.service';
import { PrismaService } from '../prisma/prisma.service';
import { NotFoundException } from '@nestjs/common';

describe('MemberSelfService', () => {
  let service: MemberSelfService;
  let prisma: any;

  beforeEach(async () => {
    prisma = {
      member: {
        findUnique: jest.fn(),
        update: jest.fn(),
      },
      pointTransaction: {
        findMany: jest.fn(),
      },
      referral: {
        findMany: jest.fn(),
      },
      memberVoucher: {
        findMany: jest.fn(),
      },
      mission: {
        findMany: jest.fn(),
      },
      notificationLog: {
        findMany: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MemberSelfService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();

    service = module.get<MemberSelfService>(MemberSelfService);
  });

  describe('getProfile', () => {
    it('should return member profile', async () => {
      prisma.member.findUnique.mockResolvedValue({
        id: 'member-1',
        email: 'john@test.com',
        fullName: 'John Doe',
        password: 'hashed',
        tier: { id: 'tier-1', name: 'Gold' },
      });

      const result = await service.getProfile('member-1');
      expect(result.email).toBe('john@test.com');
      expect(result.fullName).toBe('John Doe');
      expect((result as any).password).toBeUndefined();
    });
  });

  describe('getWallet', () => {
    it('should return wallet with tier and transactions', async () => {
      prisma.member.findUnique.mockResolvedValue({
        id: 'member-1',
        email: 'john@test.com',
        fullName: 'John Doe',
        totalPoints: 500,
        availablePoints: 300,
        tier: { name: 'Gold' },
      });
      prisma.pointTransaction.findMany.mockResolvedValue([
        { id: 'pt-1', amount: 100, createdAt: new Date() },
      ]);

      const result = await service.getWallet('member-1');
      expect(result.email).toBe('john@test.com');
      expect(result.tier).toBe('Gold');
      expect(result.totalPoints).toBe(500);
      expect(result.availablePoints).toBe(300);
      expect(result.recentTransactions).toHaveLength(1);
    });
  });

  describe('getReferrals', () => {
    it('should return referral info with stats', async () => {
      prisma.referral.findMany.mockResolvedValue([
        {
          id: 'ref-1',
          status: 'CONVERTED',
          referee: { id: 'm-2', fullName: 'Jane' },
        },
        {
          id: 'ref-2',
          status: 'PENDING',
          referee: { id: 'm-3', fullName: 'Bob' },
        },
      ]);

      const result = await service.getReferrals('member-1');
      expect(result.total).toBe(2);
      expect(result.converted).toBe(1);
      expect(result.rate).toBe('50.0');
      expect(result.referralCode).toContain('REF-');
      expect(result.referrals).toHaveLength(2);
    });
  });

  describe('getVouchers', () => {
    it('should return member vouchers', async () => {
      prisma.memberVoucher.findMany.mockResolvedValue([
        { id: 'mv-1', voucher: { code: 'V20' }, redeemed: false },
        { id: 'mv-2', voucher: { code: 'V30' }, redeemed: true },
      ]);

      const result = await service.getVouchers('member-1');
      expect(result).toHaveLength(2);
      expect(result[0].voucher.code).toBe('V20');
    });
  });

  describe('getMissions', () => {
    it('should return missions for members tenant', async () => {
      prisma.member.findUnique.mockResolvedValue({ id: 'member-1', tenantId: 'tenant-1' });
      prisma.mission.findMany.mockResolvedValue([
        { id: 'mission-1', name: 'Spend 500 pts', pointsReward: 100 },
      ]);

      const result = await service.getMissions('member-1');
      expect(result).toHaveLength(1);
      expect(result[0].name).toBe('Spend 500 pts');
    });

    it('should throw for non-existing member', async () => {
      prisma.member.findUnique.mockResolvedValue(null);
      await expect(service.getMissions('invalid')).rejects.toThrow(NotFoundException);
    });
  });

  describe('getNotifications', () => {
    it('should return notifications for member', async () => {
      prisma.member.findUnique.mockResolvedValue({ id: 'member-1', tenantId: 'tenant-1', email: 'member@test.com' });
      prisma.notificationLog.findMany.mockResolvedValue([
        { id: 'log-1', subject: 'Welcome', status: 'SENT' },
      ]);

      const result = await service.getNotifications('member-1');
      expect(result).toHaveLength(1);
      expect(result[0].subject).toBe('Welcome');
    });

    it('should throw for non-existing member', async () => {
      prisma.member.findUnique.mockResolvedValue(null);
      await expect(service.getNotifications('invalid')).rejects.toThrow(NotFoundException);
    });
  });

  describe('updateProfile', () => {
    it('should update member profile', async () => {
      prisma.member.findUnique.mockResolvedValue({ id: 'member-1', fullName: 'Old Name', phone: null, password: 'hashed' });
      prisma.member.update.mockResolvedValue({ id: 'member-1', fullName: 'New Name', phone: '123456' });

      const result = await service.updateProfile('member-1', { fullName: 'New Name', phone: '123456' });
      expect(result.fullName).toBe('New Name');
    });

    it('should throw for non-existing member', async () => {
      prisma.member.findUnique.mockResolvedValue(null);
      await expect(service.updateProfile('invalid', {})).rejects.toThrow(NotFoundException);
    });
  });
});
