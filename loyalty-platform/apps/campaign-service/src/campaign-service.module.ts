import { Module } from '@nestjs/common';
import { CampaignServiceController } from './campaign-service.controller';
import { CampaignServiceService } from './campaign-service.service';

@Module({
  imports: [],
  controllers: [CampaignServiceController],
  providers: [CampaignServiceService],
})
export class CampaignServiceModule {}
