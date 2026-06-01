import { Module } from '@nestjs/common';
import { Customer360ServiceController } from './customer360-service.controller';
import { Customer360ServiceService } from './customer360-service.service';

@Module({
  imports: [],
  controllers: [Customer360ServiceController],
  providers: [Customer360ServiceService],
})
export class Customer360ServiceModule {}
