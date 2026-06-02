import { Controller, Post, Param, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { ImportService } from '../common/services/import.service';

@ApiTags('Import')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('import')
export class ImportController {
  constructor(private importService: ImportService) {}

  @Post(':entity')
  @Roles('HOST', 'ADMIN')
  @ApiOperation({ summary: 'Import data from CSV' })
  importCsv(@Param('entity') entity: string, @Body() body: { csv: string; tenantId?: string }) {
    return this.importService.importCsv(entity, body.csv, body.tenantId);
  }

  @Post(':entity/excel')
  @Roles('HOST', 'ADMIN')
  @ApiOperation({ summary: 'Import data from Excel (.xlsx) - send base64 content' })
  importExcel(@Param('entity') entity: string, @Body() body: { file: string; tenantId?: string }) {
    return this.importService.importExcel(entity, body.file, body.tenantId);
  }
}
