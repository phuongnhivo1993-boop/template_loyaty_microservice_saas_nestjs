import { Test, TestingModule } from '@nestjs/testing';
import { DashboardService } from './dashboard.service';
import { PrismaService } from '../prisma/prisma.service';

describe('DashboardService', () => {
  let service: DashboardService;
  let prisma: any;

  const createMockPrisma = (overrides?: Partial<typeof prisma>) => ({
    tenant: { count: jest.fn().mockResolvedValue(2) },
    member: {
      count: jest.fn()
        .mockResolvedValueOnce(100)
        .mockResolvedValueOnce(0)
        .mockResolvedValue(80),
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
    ...overrides,
  });

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
    prisma = createMockPrisma({
      member: {
        count: jest.fn()
          .mockResolvedValueOnce(100)
          .mockResolvedValueOnce(60)
          .mockResolvedValue(100),
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
    prisma = createMockPrisma({
      member: {
        count: jest.fn().mockResolvedValue(0),
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
