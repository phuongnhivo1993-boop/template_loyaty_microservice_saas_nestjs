import { Controller, Get } from '@nestjs/common';
import { RewardServiceService } from './reward-service.service';

@Controller()
export class RewardServiceController {
  constructor(private readonly rewardServiceService: RewardServiceService) {}

  @Get()
  getHello(): string {
    return this.rewardServiceService.getHello();
  }
}
