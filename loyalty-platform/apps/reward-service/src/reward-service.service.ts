import { Injectable } from '@nestjs/common';

@Injectable()
export class RewardServiceService {
  getHello(): string {
    return 'Hello World!';
  }
}
