import { Test, TestingModule } from '@nestjs/testing';
import { CheckinService } from './checkin.service';
import { PrismaService } from '../prisma/prisma.service';
import { BadRequestException } from '@nestjs/common';

describe('CheckinService', () => {
  let service: CheckinService;
  let prisma: any;

  beforeEach(async () => {
    prisma = {
      dailyCheckin: {
        findUnique: jest.fn(),
        findFirst: jest.fn(),
        create: jest.fn(),
        count: jest.fn(),
        findMany: jest.fn(),
      },
      pointTransaction: {
        create: jest.fn(),
      },
      member: {
        update: jest.fn(),
      },
      $transaction: jest.fn((txs: any[]) => Promise.all(txs.map((t: any) => Promise.resolve()))),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CheckinService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();

    service = module.get<CheckinService>(CheckinService);
  });

  describe('doCheckin', () => {
    it('should throw if already checked in today', async () => {
      prisma.dailyCheckin.findUnique.mockResolvedValue({ id: 'checkin-1' });
      await expect(service.doCheckin('member-1')).rejects.toThrow(BadRequestException);
    });

    it('should create checkin with streak=1 if no yesterday checkin', async () => {
      prisma.dailyCheckin.findUnique
        .mockResolvedValueOnce(null)
        .mockResolvedValueOnce(null);
      prisma.dailyCheckin.create.mockResolvedValue({
        id: 'checkin-1', memberId: 'member-1', streak: 1, pointsAwarded: 10,
      });
      prisma.pointTransaction.create.mockResolvedValue({});
      prisma.member.update.mockResolvedValue({});

      const result = await service.doCheckin('member-1');
      expect(result.streak).toBe(1);
      expect(result.pointsAwarded).toBe(10);
    });

    it('should continue streak if yesterday was checked in', async () => {
      prisma.dailyCheckin.findUnique
        .mockResolvedValueOnce(null)
        .mockResolvedValueOnce({ id: 'yesterday', streak: 5, date: new Date(Date.now() - 86400000) });
      prisma.dailyCheckin.create.mockResolvedValue({
        id: 'checkin-2', memberId: 'member-1', streak: 6, pointsAwarded: 35,
      });
      prisma.pointTransaction.create.mockResolvedValue({});
      prisma.member.update.mockResolvedValue({});

      const result = await service.doCheckin('member-1');
      expect(result.streak).toBe(6);
      expect(result.pointsAwarded).toBe(35);
    });
  });

  describe('getStats', () => {
    it('should return stats', async () => {
      prisma.dailyCheckin.count.mockResolvedValue(10);
      prisma.dailyCheckin.findFirst.mockResolvedValue({ streak: 3 });
      prisma.dailyCheckin.findUnique.mockResolvedValue(null);

      const result = await service.getStats('member-1');
      expect(result.totalCheckins).toBe(10);
      expect(result.longestStreak).toBe(3);
      expect(result.currentStreak).toBe(0);
      expect(result.checkedInToday).toBe(false);
    });
  });
});
