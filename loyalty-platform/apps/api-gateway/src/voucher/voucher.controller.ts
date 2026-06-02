import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { VoucherService } from './voucher.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';

@ApiTags('Vouchers')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('vouchers')
export class VoucherController {
  constructor(private voucherService: VoucherService) {}

  @Post()
  @Roles('HOST', 'ADMIN')
  @ApiOperation({ summary: 'Create a voucher' })
  create(@Body() body: { code: string; type: string; value: number; maxUsage?: number; expiresAt?: string; tenantId: string }) {
    return this.voucherService.create(body);
  }

  @Get()
  @ApiOperation({ summary: 'List vouchers (with pagination & sort)' })
  findAll(
    @Query('tenantId') tenantId?: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('search') search?: string,
    @Query('sort') sort?: string,
  ) {
    return this.voucherService.findAll(tenantId, page, limit, search, sort);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get voucher by ID' })
  findOne(@Param('id') id: string) {
    return this.voucherService.findOne(id);
  }

  @Post('validate')
  @ApiOperation({ summary: 'Validate a voucher code' })
  validate(@Body() body: { code: string }) {
    return this.voucherService.validate(body.code);
  }

  @Post(':id/redeem')
  @Roles('HOST', 'ADMIN', 'STAFF')
  @ApiOperation({ summary: 'Redeem/use a voucher' })
  redeem(@Param('id') id: string) {
    return this.voucherService.redeem(id);
  }

  @Put(':id')
  @Roles('HOST', 'ADMIN')
  @ApiOperation({ summary: 'Update voucher' })
  update(@Param('id') id: string, @Body() body: { value?: number; maxUsage?: number; expiresAt?: string }) {
    return this.voucherService.update(id, body);
  }

  @Delete(':id')
  @Roles('HOST', 'ADMIN')
  @ApiOperation({ summary: 'Delete voucher' })
  remove(@Param('id') id: string) {
    return this.voucherService.remove(id);
  }
}
