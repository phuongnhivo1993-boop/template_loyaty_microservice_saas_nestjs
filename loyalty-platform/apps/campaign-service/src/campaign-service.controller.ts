import { Controller, Get } from '@nestjs/common';
import { CampaignServiceService } from './campaign-service.service';

@Controller()
export class CampaignServiceController {
  constructor(private readonly campaignServiceService: CampaignServiceService) {}

  @Get()
  getHello(): string {
    return this.campaignServiceService.getHello();
  }
}
