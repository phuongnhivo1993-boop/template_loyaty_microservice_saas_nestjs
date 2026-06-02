import { Test, TestingModule } from '@nestjs/testing';
import { RewardService } from './reward.service';
import { PrismaService } from '../prisma/prisma.service';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('RewardService', () => {
  let service: RewardService;
  let prisma: any;

  beforeEach(async () => {
    prisma = {
      reward: {
        create: jest.fn(),
        findMany: jest.fn(),
        findUnique: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
        count: jest.fn(),
      },
      member: {
        findUnique: jest.fn(),
        update: jest.fn(),
      },
      pointTransaction: {
        create: jest.fn(),
      },
      voucher: {
        create: jest.fn(),
      },
      $transaction: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RewardService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();

    service = module.get<RewardService>(RewardService);
  });

  describe('create', () => {
    it('should create a reward', async () => {
      const data = { name: 'Gift Card', type: 'DIGITAL', pointsRequired: 1000, quantity: 50, tenantId: 'tenant-1' };
      prisma.reward.create.mockResolvedValue({ id: 'reward-1', ...data });

      const result = await service.create(data);
      expect(result.id).toBe('reward-1');
      expect(result.name).toBe('Gift Card');
    });
  });

  describe('findAll', () => {
    it('should return paginated list', async () => {
      prisma.reward.findMany.mockResolvedValue([{ id: 'reward-1', name: 'Test Reward' }]);
      prisma.reward.count.mockResolvedValue(1);

      const result = await service.findAll('tenant-1', 1, 20);
      expect(result.total).toBe(1);
      expect(result.data).toHaveLength(1);
    });
  });

  describe('findOne', () => {
    it('should return a reward by id', async () => {
      prisma.reward.findUnique.mockResolvedValue({ id: 'reward-1', name: 'Test Reward' });
      const result = await service.findOne('reward-1');
      expect(result.id).toBe('reward-1');
    });

    it('should throw NotFoundException for non-existing reward', async () => {
      prisma.reward.findUnique.mockResolvedValue(null);
      await expect(service.findOne('invalid')).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update a reward', async () => {
      prisma.reward.findUnique.mockResolvedValue({ id: 'reward-1' });
      prisma.reward.update.mockResolvedValue({ id: 'reward-1', name: 'Updated Reward' });

      const result = await service.update('reward-1', { name: 'Updated Reward' });
      expect(result.name).toBe('Updated Reward');
    });
  });

  describe('redeem', () => {
    it('should redeem a reward and generate voucher', async () => {
      const mockReward = { id: 'reward-1', name: 'Gift Card', type: 'DIGITAL', pointsRequired: 1000, quantity: 10, tenantId: 'tenant-1' };
      const mockMember = { id: 'member-1', availablePoints: 5000, tenantId: 'tenant-1' };
      prisma.reward.findUnique.mockResolvedValue(mockReward);
      prisma.member.findUnique.mockResolvedValue(mockMember);
      prisma.$transaction.mockImplementation((promises: any[]) => Promise.resolve(promises.map((_, i: number) => ({ id: `res-${i}` }))));

      const result = await service.redeem('reward-1', 'member-1');
      expect(result.voucherCode).toBeDefined();
      expect(result.pointsUsed).toBe(1000);
      expect(result.rewardName).toBe('Gift Card');
    });

    it('should throw NotFoundException for non-existing reward', async () => {
      prisma.reward.findUnique.mockResolvedValue(null);
      await expect(service.redeem('invalid', 'member-1')).rejects.toThrow(NotFoundException);
    });

    it('should throw BadRequestException for insufficient stock', async () => {
      prisma.reward.findUnique.mockResolvedValue({ id: 'reward-1', name: 'Test', type: 'DIGITAL', pointsRequired: 1000, quantity: 1, tenantId: 'tenant-1' });
      prisma.member.findUnique.mockResolvedValue({ id: 'member-1', availablePoints: 5000, tenantId: 'tenant-1' });
      await expect(service.redeem('reward-1', 'member-1', 5)).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException for insufficient points', async () => {
      prisma.reward.findUnique.mockResolvedValue({ id: 'reward-1', name: 'Test', type: 'DIGITAL', pointsRequired: 10000, quantity: 5, tenantId: 'tenant-1' });
      prisma.member.findUnique.mockResolvedValue({ id: 'member-1', availablePoints: 1000, tenantId: 'tenant-1' });
      await expect(service.redeem('reward-1', 'member-1')).rejects.toThrow(BadRequestException);
    });
  });

  describe('remove', () => {
    it('should delete a reward', async () => {
      prisma.reward.findUnique.mockResolvedValue({ id: 'reward-1' });
      prisma.reward.delete.mockResolvedValue({ id: 'reward-1' });

      const result = await service.remove('reward-1');
      expect(result.id).toBe('reward-1');
    });
  });
});
