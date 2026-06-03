import { Module } from '@nestjs/common';
import { PointService } from './point.service';
import { PointController } from './point.controller';
import { PointExpiryService } from './point-expiry.service';
import { SettingsModule } from '../settings/settings.module';
import { CommonModule } from '../common/common.module';

@Module({
  imports: [SettingsModule, CommonModule],
  controllers: [PointController],
  providers: [PointService, PointExpiryService],
  exports: [PointService],
})
export class PointModule {}
