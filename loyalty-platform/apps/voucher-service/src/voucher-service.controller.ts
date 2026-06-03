import { Controller, Get, Post, Body, Param, Patch, Delete, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { VoucherServiceService } from './voucher-service.service';
import { CreateVoucherDto, UpdateVoucherDto, ValidateVoucherDto, BatchGenerateDto } from './dto';

@ApiTags('Vouchers')
@ApiBearerAuth()
@Controller('vouchers')
export class VoucherServiceController {
  constructor(private readonly voucherServiceService: VoucherServiceService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new voucher' })
  create(@Body() dto: CreateVoucherDto) {
    return this.voucherServiceService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'List all vouchers' })
  @ApiQuery({ name: 'tenantId', required: false })
  findAll(@Query('tenantId') tenantId?: string) {
    return this.voucherServiceService.findAll(tenantId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get voucher by ID' })
  findOne(@Param('id') id: string) {
    return this.voucherServiceService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a voucher' })
  update(@Param('id') id: string, @Body() dto: UpdateVoucherDto) {
    return this.voucherServiceService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a voucher' })
  remove(@Param('id') id: string) {
    return this.voucherServiceService.remove(id);
  }

  @Post('validate')
  @ApiOperation({ summary: 'Validate a voucher code' })
  validate(@Body() dto: ValidateVoucherDto) {
    return this.voucherServiceService.validate(dto);
  }

  @Post(':id/redeem')
  @ApiOperation({ summary: 'Redeem a voucher (increment usage count)' })
  redeem(@Param('id') id: string) {
    return this.voucherServiceService.redeem(id);
  }

  @Post('batch-generate')
  @ApiOperation({ summary: 'Batch generate vouchers' })
  batchGenerate(@Body() dto: BatchGenerateDto) {
    return this.voucherServiceService.batchGenerate(dto);
  }

  @Get('stats/expired')
  @ApiOperation({ summary: 'Get expired voucher statistics' })
  @ApiQuery({ name: 'tenantId', required: false })
  getExpiredStats(@Query('tenantId') tenantId?: string) {
    return this.voucherServiceService.getExpiredStats(tenantId);
  }
}
