import { Test, TestingModule } from '@nestjs/testing';
import { GamificationService } from './gamification.service';
import { PrismaService } from '../prisma/prisma.service';

describe('GamificationService', () => {
  let service: GamificationService;
  let prisma: any;

  beforeEach(async () => {
    prisma = {
      badge: {
        create: jest.fn().mockImplementation(d => Promise.resolve({ id: 'badge-1', ...d.data })),
        findMany: jest.fn().mockResolvedValue([{ id: 'badge-1', name: 'Early Adopter' }]),
        findUnique: jest.fn().mockResolvedValue({ id: 'badge-1', name: 'Early Adopter' }),
        count: jest.fn().mockResolvedValue(1),
        update: jest.fn().mockImplementation(({ where, data }) => Promise.resolve({ id: where.id, ...data })),
        delete: jest.fn().mockResolvedValue({ id: 'badge-1' }),
      },
      mission: {
        create: jest.fn().mockImplementation(d => Promise.resolve({ id: 'mission-1', ...d.data })),
        findMany: jest.fn().mockResolvedValue([{ id: 'mission-1', name: 'First Purchase' }]),
        findUnique: jest.fn().mockResolvedValue({ id: 'mission-1', name: 'First Purchase' }),
        count: jest.fn().mockResolvedValue(1),
        update: jest.fn().mockImplementation(({ where, data }) => Promise.resolve({ id: where.id, ...data })),
        delete: jest.fn().mockResolvedValue({ id: 'mission-1' }),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [GamificationService, { provide: PrismaService, useValue: prisma }],
    }).compile();

    service = module.get<GamificationService>(GamificationService);
  });

  describe('Badges', () => {
    it('should create a badge', async () => {
      const result = await service.createBadge({ name: 'Early Adopter', tenantId: 'tenant-1' });
      expect(result.name).toBe('Early Adopter');
    });

    it('should list badges with pagination', async () => {
      const result = await service.findAllBadges('tenant-1', 1, 20);
      expect(result.data).toHaveLength(1);
      expect(result.total).toBe(1);
    });

    it('should find one badge', async () => {
      const result = await service.findOneBadge('badge-1');
      expect(result.id).toBe('badge-1');
    });

    it('should update a badge', async () => {
      const result = await service.updateBadge('badge-1', { name: 'Veteran' });
      expect(result.name).toBe('Veteran');
    });

    it('should delete a badge', async () => {
      const result = await service.removeBadge('badge-1');
      expect(result.id).toBe('badge-1');
    });
  });

  describe('Missions', () => {
    it('should create a mission', async () => {
      const result = await service.createMission({ name: 'First Purchase', pointsReward: 100, tenantId: 'tenant-1' });
      expect(result.name).toBe('First Purchase');
    });

    it('should find one mission', async () => {
      const result = await service.findOneMission('mission-1');
      expect(result.id).toBe('mission-1');
    });

    it('should list missions with pagination', async () => {
      const result = await service.findAllMissions('tenant-1', 1, 20);
      expect(result.data).toHaveLength(1);
    });

    it('should update a mission', async () => {
      const result = await service.updateMission('mission-1', { pointsReward: 200 });
      expect(result.id).toBe('mission-1');
    });

    it('should delete a mission', async () => {
      const result = await service.removeMission('mission-1');
      expect(result.id).toBe('mission-1');
    });
  });
});
