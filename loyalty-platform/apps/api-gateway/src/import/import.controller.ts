import { Controller, Post, Param, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ImportService } from '../common/services/import.service';

@ApiTags('Import')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('import')
export class ImportController {
  constructor(private importService: ImportService) {}

  @Post(':entity')
  @ApiOperation({ summary: 'Import data from CSV' })
  importCsv(@Param('entity') entity: string, @Body() body: { csv: string; tenantId?: string }) {
    return this.importService.importCsv(entity, body.csv, body.tenantId);
  }
}
