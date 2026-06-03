import { Module } from '@nestjs/common';
import { NotificationTriggerService } from './services/notification-trigger.service';
import { CacheService } from './services/cache.service';

@Module({
  providers: [NotificationTriggerService, CacheService],
  exports: [NotificationTriggerService, CacheService],
})
export class CommonModule {}
