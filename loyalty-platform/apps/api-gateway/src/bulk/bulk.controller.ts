import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { BulkService } from './bulk.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';

@ApiTags('Bulk Operations')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('bulk')
export class BulkController {
  constructor(private bulkService: BulkService) {}

  @Post('restore')
  @Roles('HOST', 'ADMIN')
  @ApiOperation({ summary: 'Bulk restore soft-deleted records by IDs' })
  bulkRestore(@Body() body: { entity: string; ids: string[]; tenantId?: string }) {
    return this.bulkService.bulkRestore(body.entity, body.ids, body.tenantId);
  }

  @Post('delete')
  @Roles('HOST', 'ADMIN')
  @ApiOperation({ summary: 'Bulk delete records by IDs' })
  bulkDelete(@Body() body: { entity: string; ids: string[]; tenantId?: string }) {
    return this.bulkService.bulkDelete(body.entity, body.ids, body.tenantId);
  }

  @Post('update-status')
  @Roles('HOST', 'ADMIN')
  @ApiOperation({ summary: 'Bulk update status for records by IDs' })
  bulkUpdateStatus(@Body() body: { entity: string; ids: string[]; status: string; tenantId?: string }) {
    return this.bulkService.bulkUpdateStatus(body.entity, body.ids, body.status, body.tenantId);
  }
}
