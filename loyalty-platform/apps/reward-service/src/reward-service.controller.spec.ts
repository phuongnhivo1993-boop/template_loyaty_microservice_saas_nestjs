import { Test, TestingModule } from '@nestjs/testing';
import { RewardServiceController } from './reward-service.controller';
import { RewardServiceService } from './reward-service.service';

describe('RewardServiceController', () => {
  let rewardServiceController: RewardServiceController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [RewardServiceController],
      providers: [RewardServiceService],
    }).compile();

    rewardServiceController = app.get<RewardServiceController>(RewardServiceController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(rewardServiceController.getHello()).toBe('Hello World!');
    });
  });
});
