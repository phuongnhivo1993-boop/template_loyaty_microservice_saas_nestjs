import { Test, TestingModule } from '@nestjs/testing';
import { CampaignServiceController } from './campaign-service.controller';
import { CampaignServiceService } from './campaign-service.service';

describe('CampaignServiceController', () => {
  let campaignServiceController: CampaignServiceController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [CampaignServiceController],
      providers: [CampaignServiceService],
    }).compile();

    campaignServiceController = app.get<CampaignServiceController>(CampaignServiceController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(campaignServiceController.getHello()).toBe('Hello World!');
    });
  });
});
