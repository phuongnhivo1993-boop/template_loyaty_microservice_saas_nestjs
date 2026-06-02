import { Module } from '@nestjs/common';
import { ImportController } from './import.controller';
import { ImportService } from '../common/services/import.service';

@Module({
  controllers: [ImportController],
  providers: [ImportService],
  exports: [ImportService],
})
export class ImportModule {}
