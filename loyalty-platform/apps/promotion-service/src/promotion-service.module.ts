import { Module } from '@nestjs/common';
import { PromotionServiceController } from './promotion-service.controller';
import { PromotionServiceService } from './promotion-service.service';
import { HealthController } from './health.controller';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [PromotionServiceController, HealthController],
  providers: [PromotionServiceService],
})
export class PromotionServiceModule {}
