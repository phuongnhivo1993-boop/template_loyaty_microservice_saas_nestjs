import { Test, TestingModule } from '@nestjs/testing';
import { NotificationPreferenceService } from './notification-preference.service';
import { PrismaService } from '../prisma/prisma.service';

describe('NotificationPreferenceService', () => {
  let service: NotificationPreferenceService;
  let prisma: any;

  const defaultPrefs = {
    email: { marketing: true, points: true, rewards: true, promotions: true },
    sms: { marketing: false, points: true, rewards: false },
    push: { marketing: false, points: true, rewards: true },
  };

  beforeEach(async () => {
    prisma = {
      settings: {
        findUnique: jest.fn(),
        upsert: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NotificationPreferenceService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();

    service = module.get<NotificationPreferenceService>(NotificationPreferenceService);
  });

  describe('get', () => {
    it('should return stored preferences', async () => {
      const stored = { email: { marketing: false, points: true, rewards: false, promotions: true } };
      prisma.settings.findUnique.mockResolvedValue({ value: stored });

      const result = await service.get('tenant-1', 'member-1');
      expect(result).toEqual(stored);
    });

    it('should return default preferences when none stored', async () => {
      prisma.settings.findUnique.mockResolvedValue(null);

      const result = await service.get('tenant-1', 'member-1');
      expect(result).toEqual(defaultPrefs);
    });
  });

  describe('update', () => {
    it('should merge and save preferences', async () => {
      prisma.settings.findUnique.mockResolvedValue({
        value: {
          email: { marketing: true, points: true, rewards: true, promotions: true },
        },
      });
      prisma.settings.upsert.mockResolvedValue({});

      const updateData = { email: { marketing: false } };
      const result = await service.update('tenant-1', 'member-1', updateData);

      expect(result.email.marketing).toBe(false);
      expect(result.email.points).toBe(true);
    });

    it('should create settings when none exist', async () => {
      prisma.settings.findUnique.mockResolvedValue(null);
      prisma.settings.upsert.mockResolvedValue({});

      const updateData = { sms: { marketing: true } };
      const result = await service.update('tenant-1', 'member-1', updateData);

      expect(result.sms.marketing).toBe(true);
      expect(result.email).toEqual(defaultPrefs.email);
    });
  });
});
