import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { VoucherService } from './voucher.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { CreateVoucherDto, UpdateVoucherDto, ValidateVoucherDto, VoucherQueryDto, BatchGenerateVoucherDto } from './dto/create-voucher.dto';

@ApiTags('Vouchers')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('vouchers')
export class VoucherController {
  constructor(private voucherService: VoucherService) {}

  @Post()
  @Roles('HOST', 'ADMIN')
  @ApiOperation({ summary: 'Create a voucher' })
  create(@Req() req: any, @Body() body: CreateVoucherDto) {
    return this.voucherService.create({ ...body, tenantId: req.tenantId ?? body.tenantId });
  }

  @Get()
  @ApiOperation({ summary: 'List vouchers (with pagination & sort)' })
  findAll(@Req() req: any, @Query() query: VoucherQueryDto) {
    return this.voucherService.findAll(req.tenantId ?? query.tenantId, query.page, query.limit, query.search, query.sort);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get voucher by ID' })
  findOne(@Param('id') id: string) {
    return this.voucherService.findOne(id);
  }

  @Post('validate')
  @ApiOperation({ summary: 'Validate a voucher code' })
  validate(@Body() body: ValidateVoucherDto) {
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
  update(@Param('id') id: string, @Body() body: UpdateVoucherDto) {
    return this.voucherService.update(id, body);
  }

  @Delete(':id')
  @Roles('HOST', 'ADMIN')
  @ApiOperation({ summary: 'Delete voucher' })
  remove(@Param('id') id: string) {
    return this.voucherService.remove(id);
  }

  @Post('batch-generate')
  @Roles('HOST', 'ADMIN')
  @ApiOperation({ summary: 'Batch generate vouchers' })
  batchGenerate(@Body() body: BatchGenerateVoucherDto) {
    return this.voucherService.batchGenerate(body);
  }

  @Get('stats/expired')
  @Roles('HOST', 'ADMIN', 'STAFF')
  @ApiOperation({ summary: 'Get expired voucher stats' })
  getExpiredStats(@Query('tenantId') tenantId?: string) {
    return this.voucherService.getExpiredStats(tenantId);
  }
}
