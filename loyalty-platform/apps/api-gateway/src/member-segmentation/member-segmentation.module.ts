import { Module } from '@nestjs/common';
import { MemberSegmentationController } from './member-segmentation.controller';
import { MemberSegmentationService } from './member-segmentation.service';
import { CommonModule } from '../common/common.module';
import { ExportModule } from '../export/export.module';

@Module({
  imports: [CommonModule, ExportModule],
  controllers: [MemberSegmentationController],
  providers: [MemberSegmentationService],
  exports: [MemberSegmentationService],
})
export class MemberSegmentationModule {}
