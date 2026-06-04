import { Module } from '@nestjs/common';
import { NotificationServiceController } from './notification-service.controller';
import { NotificationServiceService } from './notification-service.service';
import { MailService } from './mail.service';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [NotificationServiceController],
  providers: [NotificationServiceService, MailService],
  exports: [MailService],
})
export class NotificationServiceModule {}
