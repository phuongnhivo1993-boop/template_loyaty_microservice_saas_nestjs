import { Module } from '@nestjs/common';
import { GamificationServiceController } from './gamification-service.controller';
import { GamificationServiceService } from './gamification-service.service';
import { HealthController } from './health.controller';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [GamificationServiceController, HealthController],
  providers: [GamificationServiceService],
})
export class GamificationServiceModule {}
