import { Module } from '@nestjs/common';
import { NotificationTriggerService } from './services/notification-trigger.service';
import { CacheService } from './services/cache.service';
import { EncryptionService } from './services/encryption.service';

@Module({
  providers: [NotificationTriggerService, CacheService, EncryptionService],
  exports: [NotificationTriggerService, CacheService, EncryptionService],
})
export class CommonModule {}
