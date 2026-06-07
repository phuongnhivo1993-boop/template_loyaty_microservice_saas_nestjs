import { Module } from '@nestjs/common';
import { NotificationPreferenceController } from './notification-preference.controller';
import { NotificationPreferenceService } from './notification-preference.service';

@Module({
  controllers: [NotificationPreferenceController],
  providers: [NotificationPreferenceService],
})
export class NotificationPreferenceModule {}
