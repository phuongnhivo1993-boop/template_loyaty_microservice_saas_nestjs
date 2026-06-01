import { Injectable } from '@nestjs/common';

@Injectable()
export class CampaignServiceService {
  getHello(): string {
    return 'Hello World!';
  }
}
