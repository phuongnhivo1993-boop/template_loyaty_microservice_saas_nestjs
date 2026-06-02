import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { BulkService } from './bulk.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('Bulk Operations')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('bulk')
export class BulkController {
  constructor(private bulkService: BulkService) {}

  @Post('delete')
  @ApiOperation({ summary: 'Bulk delete records by IDs' })
  bulkDelete(@Body() body: { entity: string; ids: string[]; tenantId?: string }) {
    return this.bulkService.bulkDelete(body.entity, body.ids, body.tenantId);
  }

  @Post('update-status')
  @ApiOperation({ summary: 'Bulk update status for records by IDs' })
  bulkUpdateStatus(@Body() body: { entity: string; ids: string[]; status: string; tenantId?: string }) {
    return this.bulkService.bulkUpdateStatus(body.entity, body.ids, body.status, body.tenantId);
  }
}
