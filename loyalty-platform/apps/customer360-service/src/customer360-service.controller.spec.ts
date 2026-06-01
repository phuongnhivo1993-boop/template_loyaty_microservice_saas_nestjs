import { Test, TestingModule } from '@nestjs/testing';
import { Customer360ServiceController } from './customer360-service.controller';
import { Customer360ServiceService } from './customer360-service.service';

describe('Customer360ServiceController', () => {
  let customer360ServiceController: Customer360ServiceController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [Customer360ServiceController],
      providers: [Customer360ServiceService],
    }).compile();

    customer360ServiceController = app.get<Customer360ServiceController>(Customer360ServiceController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(customer360ServiceController.getHello()).toBe('Hello World!');
    });
  });
});
