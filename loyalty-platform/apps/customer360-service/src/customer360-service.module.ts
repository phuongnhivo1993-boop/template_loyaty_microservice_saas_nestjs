import { Module } from '@nestjs/common';
import { Customer360ServiceController } from './customer360-service.controller';
import { Customer360ServiceService } from './customer360-service.service';
import { HealthController } from './health.controller';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [Customer360ServiceController, HealthController],
  providers: [Customer360ServiceService],
})
export class Customer360ServiceModule {}
