import { Injectable } from '@nestjs/common';

@Injectable()
export class GamificationServiceService {
  getHello(): string {
    return 'Hello World!';
  }
}
