import { Module } from '@nestjs/common';
import { PromotionServiceController } from './promotion-service.controller';
import { PromotionServiceService } from './promotion-service.service';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [PromotionServiceController],
  providers: [PromotionServiceService],
})
export class PromotionServiceModule {}
