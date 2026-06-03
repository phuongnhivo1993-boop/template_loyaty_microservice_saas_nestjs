import { Module } from '@nestjs/common';
import { GamificationServiceController } from './gamification-service.controller';
import { GamificationServiceService } from './gamification-service.service';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [GamificationServiceController],
  providers: [GamificationServiceService],
})
export class GamificationServiceModule {}
