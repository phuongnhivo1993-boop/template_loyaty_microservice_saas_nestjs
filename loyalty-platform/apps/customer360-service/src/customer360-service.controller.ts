import { Controller, Get } from '@nestjs/common';
import { Customer360ServiceService } from './customer360-service.service';

@Controller()
export class Customer360ServiceController {
  constructor(private readonly customer360ServiceService: Customer360ServiceService) {}

  @Get()
  getHello(): string {
    return this.customer360ServiceService.getHello();
  }
}
