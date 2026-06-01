import { Controller, Get } from '@nestjs/common';
import { GamificationServiceService } from './gamification-service.service';

@Controller()
export class GamificationServiceController {
  constructor(private readonly gamificationServiceService: GamificationServiceService) {}

  @Get()
  getHello(): string {
    return this.gamificationServiceService.getHello();
  }
}
