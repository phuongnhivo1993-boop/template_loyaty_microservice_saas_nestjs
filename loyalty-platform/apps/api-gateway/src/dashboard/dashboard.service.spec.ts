import { Test, TestingModule } from '@nestjs/testing';
import { DashboardService } from './dashboard.service';
import { PrismaService } from '../prisma/prisma.service';

describe('DashboardService', () => {
  let service: DashboardService;
  let prisma: any;

  const createMockPrisma = (overrides?: Partial<typeof prisma>) => {
    const memberCountMock = jest.fn();
    memberCountMock
      .mockResolvedValueOnce(100)   // total members
      .mockResolvedValueOnce(0)     // kyc verified count (first call in position 2)
      .mockResolvedValueOnce(5);    // new members today

    return {
      tenant: { count: jest.fn().mockResolvedValue(2) },
      member: {
        count: memberCountMock,
        aggregate: jest.fn().mockResolvedValue({ _sum: { totalPoints: 50000 } }),
        groupBy: jest.fn().mockResolvedValue([
          { status: 'ACTIVE', _count: 80 },
          { status: 'INACTIVE', _count: 20 },
        ]),
      },
      campaign: { count: jest.fn().mockResolvedValue(5) },
      reward: { count: jest.fn().mockResolvedValue(10) },
      voucher: { count: jest.fn().mockResolvedValue(50) },
      promotion: { count: jest.fn().mockResolvedValue(3) },
      badge: { count: jest.fn().mockResolvedValue(8) },
      mission: { count: jest.fn().mockResolvedValue(6) },
      referral: { count: jest.fn().mockResolvedValue(30) },
      tier: {
        findMany: jest.fn().mockResolvedValue([
          { name: 'Gold', color: '#f59e0b', _count: { members: 30 } },
          { name: 'Silver', color: '#94a3b8', _count: { members: 70 } },
        ]),
      },
      memberVoucher: { count: jest.fn().mockResolvedValue(40) },
      pointTransaction: {
        aggregate: jest.fn()
          .mockResolvedValueOnce({ _sum: { amount: 5000 } })   // earned today
          .mockResolvedValueOnce({ _sum: { amount: -2000 } }),  // burned today
      },
      ...overrides,
    };
  };

  beforeEach(async () => {
    prisma = createMockPrisma();

    const module: TestingModule = await Test.createTestingModule({
      providers: [DashboardService, { provide: PrismaService, useValue: prisma }],
    }).compile();

    service = module.get<DashboardService>(DashboardService);
  });

  it('should return dashboard stats', async () => {
    const result = await service.getStats();
    expect(result.tenants).toBe(2);
    expect(result.members).toBe(100);
    expect(result.totalPoints).toBe(50000);
    expect(result.kycRate).toBe(0);
    expect(result.activeVouchers).toBe(40);
    expect(result.tiers).toHaveLength(2);
    expect(result.membersByStatus).toEqual({ ACTIVE: 80, INACTIVE: 20 });
  });

  it('should filter by tenantId', async () => {
    const spy = jest.spyOn(prisma.member, 'count');
    await service.getStats('tenant-1');
    expect(spy).toHaveBeenCalledWith(expect.objectContaining({ where: { tenantId: 'tenant-1' } }));
  });

  it('should calculate KYC rate correctly', async () => {
    const memberCountMock = jest.fn();
    memberCountMock
      .mockResolvedValueOnce(100)
      .mockResolvedValueOnce(60)
      .mockResolvedValueOnce(5);
    prisma = createMockPrisma({
      member: {
        count: memberCountMock,
        aggregate: jest.fn().mockResolvedValue({ _sum: { totalPoints: 50000 } }),
        groupBy: jest.fn().mockResolvedValue([]),
      },
    });
    const mod = await Test.createTestingModule({
      providers: [DashboardService, { provide: PrismaService, useValue: prisma }],
    }).compile();
    const svc = mod.get<DashboardService>(DashboardService);

    const result = await svc.getStats();
    expect(result.kycRate).toBe(60);
  });

  it('should handle empty members', async () => {
    const memberCountMock = jest.fn();
    memberCountMock
      .mockResolvedValueOnce(0)
      .mockResolvedValueOnce(0)
      .mockResolvedValueOnce(0);
    prisma = createMockPrisma({
      member: {
        count: memberCountMock,
        aggregate: jest.fn().mockResolvedValue({ _sum: { totalPoints: null } }),
        groupBy: jest.fn().mockResolvedValue([]),
      },
    });
    const mod = await Test.createTestingModule({
      providers: [DashboardService, { provide: PrismaService, useValue: prisma }],
    }).compile();
    const svc = mod.get<DashboardService>(DashboardService);

    const result = await svc.getStats();
    expect(result.kycRate).toBe(0);
    expect(result.members).toBe(0);
  });
});
