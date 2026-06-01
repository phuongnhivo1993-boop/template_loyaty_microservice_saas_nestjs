import { Injectable } from '@nestjs/common';

@Injectable()
export class Customer360ServiceService {
  getHello(): string {
    return 'Hello World!';
  }
}
