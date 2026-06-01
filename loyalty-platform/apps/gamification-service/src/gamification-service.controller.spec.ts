import { Test, TestingModule } from '@nestjs/testing';
import { GamificationServiceController } from './gamification-service.controller';
import { GamificationServiceService } from './gamification-service.service';

describe('GamificationServiceController', () => {
  let gamificationServiceController: GamificationServiceController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [GamificationServiceController],
      providers: [GamificationServiceService],
    }).compile();

    gamificationServiceController = app.get<GamificationServiceController>(GamificationServiceController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(gamificationServiceController.getHello()).toBe('Hello World!');
    });
  });
});
