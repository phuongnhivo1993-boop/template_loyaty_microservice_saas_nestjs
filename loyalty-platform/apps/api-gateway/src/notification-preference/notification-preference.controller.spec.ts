import { Test, TestingModule } from '@nestjs/testing';
import { NotificationPreferenceController } from './notification-preference.controller';
import { NotificationPreferenceService } from './notification-preference.service';

describe('NotificationPreferenceController', () => {
  let controller: NotificationPreferenceController;
  let service: any;

  beforeEach(async () => {
    service = {
      get: jest.fn(),
      update: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [NotificationPreferenceController],
      providers: [
        { provide: NotificationPreferenceService, useValue: service },
      ],
    }).compile();

    controller = module.get<NotificationPreferenceController>(NotificationPreferenceController);
  });

  describe('get', () => {
    it('should return notification preferences for the member', async () => {
      const req = { tenantId: 'tenant-1', user: { memberId: 'member-1' } };
      const expected = { email: { marketing: true, points: true, rewards: true, promotions: true } };
      service.get.mockResolvedValue(expected);

      const result = await controller.get(req);
      expect(result).toEqual(expected);
      expect(service.get).toHaveBeenCalledWith('tenant-1', 'member-1');
    });

    it('should use req.user.id when memberId not present', async () => {
      const req = { tenantId: 'tenant-1', user: { id: 'user-1' } };
      service.get.mockResolvedValue({});

      await controller.get(req);
      expect(service.get).toHaveBeenCalledWith('tenant-1', 'user-1');
    });
  });

  describe('update', () => {
    it('should update and return merged preferences', async () => {
      const req = { tenantId: 'tenant-1', user: { memberId: 'member-1' } };
      const body = { email: { marketing: false } };
      const expected = { email: { marketing: false, points: true, rewards: true, promotions: true } };
      service.update.mockResolvedValue(expected);

      const result = await controller.update(req, body);
      expect(result).toEqual(expected);
      expect(service.update).toHaveBeenCalledWith('tenant-1', 'member-1', body);
    });
  });
});
