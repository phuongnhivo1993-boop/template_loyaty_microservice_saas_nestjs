import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { NotificationController } from './notification.controller';
import { NotificationService } from './notification.service';
import { NotificationTriggerService } from './notification-trigger.service';

@Module({
  imports: [HttpModule],
  controllers: [NotificationController],
  providers: [NotificationService, NotificationTriggerService],
  exports: [NotificationService, NotificationTriggerService],
})
export class NotificationModule {}
