import { Module } from '@nestjs/common';
import { LoyaltyServiceController } from './loyalty-service.controller';
import { LoyaltyServiceService } from './loyalty-service.service';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [LoyaltyServiceController],
  providers: [LoyaltyServiceService],
})
export class LoyaltyServiceModule {}
