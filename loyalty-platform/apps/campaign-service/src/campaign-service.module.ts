import { Module } from '@nestjs/common';
import { CampaignServiceController } from './campaign-service.controller';
import { CampaignServiceService } from './campaign-service.service';
import { HealthController } from './health.controller';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [CampaignServiceController, HealthController],
  providers: [CampaignServiceService],
})
export class CampaignServiceModule {}
