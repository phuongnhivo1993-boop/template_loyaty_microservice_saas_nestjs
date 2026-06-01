import { Module } from '@nestjs/common';
import { GamificationServiceController } from './gamification-service.controller';
import { GamificationServiceService } from './gamification-service.service';

@Module({
  imports: [],
  controllers: [GamificationServiceController],
  providers: [GamificationServiceService],
})
export class GamificationServiceModule {}
