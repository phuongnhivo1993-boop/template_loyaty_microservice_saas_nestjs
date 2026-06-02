import { Module } from '@nestjs/common';
import { ExportController } from './export.controller';
import { ExportService } from '../common/services/export.service';

@Module({
  controllers: [ExportController],
  providers: [ExportService],
  exports: [ExportService],
})
export class ExportModule {}
