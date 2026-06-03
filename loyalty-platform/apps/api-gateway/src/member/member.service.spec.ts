import { Test, TestingModule } from '@nestjs/testing';
import { MemberService } from './member.service';
import { PrismaService } from '../prisma/prisma.service';
import { NotificationTriggerService } from '../common/services/notification-trigger.service';
import { ConflictException, NotFoundException } from '@nestjs/common';

const mockNotificationTrigger = { sendWelcome: jest.fn(), sendPointsEarned: jest.fn(), sendTierChanged: jest.fn() };

describe('MemberService', () => {
  let service: MemberService;
  let prisma: any;

  beforeEach(async () => {
    prisma = {
      member: {
        create: jest.fn(),
        findMany: jest.fn(),
        findUnique: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
        count: jest.fn(),
      },
      notificationTemplate: { findFirst: jest.fn() },
      notificationLog: { create: jest.fn() },
      tier: { findUnique: jest.fn() },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MemberService,
        { provide: PrismaService, useValue: prisma },
        { provide: NotificationTriggerService, useValue: mockNotificationTrigger },
      ],
    }).compile();

    service = module.get<MemberService>(MemberService);
  });

  describe('create', () => {
    it('should create a member', async () => {
      const data = { email: 'member@test.com', fullName: 'Member One', tenantId: 'tenant-1' };
      prisma.member.findUnique.mockResolvedValue(null);
      prisma.member.create.mockResolvedValue({ id: 'member-1', ...data });

      const result = await service.create(data);
      expect(result.id).toBe('member-1');
      expect(result.email).toBe('member@test.com');
    });

    it('should reject duplicate email', async () => {
      prisma.member.findUnique.mockResolvedValue({ id: 'existing', email: 'dup@test.com' });
      await expect(
        service.create({ email: 'dup@test.com', fullName: 'Dup', tenantId: 't1' }),
      ).rejects.toThrow(ConflictException);
    });
  });

  describe('findAll', () => {
    it('should return paginated list with search and status/tierId filters', async () => {
      prisma.member.findMany.mockResolvedValue([{ id: 'member-1', fullName: 'Test', tier: { id: 'tier-1', name: 'Gold' } }]);
      prisma.member.count.mockResolvedValue(1);

      const result = await service.findAll('tenant-1', 1, 20, 'test', 'tier-1', 'ACTIVE');
      expect(result.total).toBe(1);
      expect(result.data).toHaveLength(1);
      expect(result.data[0].tier.name).toBe('Gold');
    });
  });

  describe('findOne', () => {
    it('should return a member by id (includes tier + transactions)', async () => {
      const mockMember = {
        id: 'member-1',
        email: 'test@test.com',
        tier: { id: 'tier-1', name: 'Gold' },
        pointTransactions: [{ id: 'tx-1', points: 100 }],
      };
      prisma.member.findUnique.mockResolvedValue(mockMember);

      const result = await service.findOne('member-1');
      expect(result.id).toBe('member-1');
      expect(result.tier.name).toBe('Gold');
      expect(result.pointTransactions).toHaveLength(1);
    });

    it('should throw NotFoundException when missing', async () => {
      prisma.member.findUnique.mockResolvedValue(null);
      await expect(service.findOne('invalid')).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update a member', async () => {
      prisma.member.findUnique.mockResolvedValue({ id: 'member-1' });
      prisma.member.update.mockResolvedValue({ id: 'member-1', fullName: 'Updated Member' });

      const result = await service.update('member-1', { fullName: 'Updated Member' });
      expect(result.fullName).toBe('Updated Member');
    });
  });

  describe('kycVerify', () => {
    it('should set kycVerified=true, status=ACTIVE', async () => {
      prisma.member.findUnique.mockResolvedValue({ id: 'member-1', kycVerified: false, status: 'PENDING' });
      prisma.member.update.mockResolvedValue({ id: 'member-1', kycVerified: true, status: 'ACTIVE' });

      const result = await service.kycVerify('member-1');
      expect(result.kycVerified).toBe(true);
      expect(result.status).toBe('ACTIVE');
    });
  });

  describe('toggleStatus', () => {
    it('should toggle between ACTIVE and LOCKED', async () => {
      prisma.member.findUnique.mockResolvedValue({ id: 'member-1', status: 'ACTIVE' });
      prisma.member.update.mockResolvedValue({ id: 'member-1', status: 'LOCKED' });

      const result = await service.toggleStatus('member-1');
      expect(result.status).toBe('LOCKED');
    });
  });

  describe('remove', () => {
    it('should delete a member', async () => {
      prisma.member.findUnique.mockResolvedValue({ id: 'member-1' });
      prisma.member.delete.mockResolvedValue({ id: 'member-1' });

      const result = await service.remove('member-1');
      expect(result.id).toBe('member-1');
    });
  });
});
