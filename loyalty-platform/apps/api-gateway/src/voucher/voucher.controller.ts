import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiBody, ApiParam, ApiQuery, ApiResponse } from '@nestjs/swagger';
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
  @ApiBody({ type: CreateVoucherDto })
  @ApiOperation({ summary: 'Create a voucher' })
  @ApiResponse({ status: 201, description: 'Voucher created' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  create(@Req() req: any, @Body() body: CreateVoucherDto) {
    return this.voucherService.create({ ...body, tenantId: req.tenantId ?? body.tenantId });
  }

  @Get()
  @ApiOperation({ summary: 'List vouchers (with pagination & sort)' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'search', required: false, type: String })
  @ApiQuery({ name: 'sort', required: false, type: String })
  @ApiQuery({ name: 'tenantId', required: false, type: String })
  @ApiResponse({ status: 200, description: 'List of vouchers' })
  findAll(@Req() req: any, @Query() query: VoucherQueryDto) {
    return this.voucherService.findAll(req.tenantId ?? query.tenantId, query.page, query.limit, query.search, query.sort);
  }

  @Get(':id')
  @ApiParam({ name: 'id', type: String, description: 'Voucher ID' })
  @ApiOperation({ summary: 'Get voucher by ID' })
  @ApiResponse({ status: 200, description: 'Voucher found' })
  @ApiResponse({ status: 404, description: 'Voucher not found' })
  findOne(@Param('id') id: string) {
    return this.voucherService.findOne(id);
  }

  @Post('validate')
  @ApiBody({ type: ValidateVoucherDto })
  @ApiOperation({ summary: 'Validate a voucher code' })
  @ApiResponse({ status: 201, description: 'Voucher validation result' })
  @ApiResponse({ status: 400, description: 'Invalid voucher' })
  validate(@Body() body: ValidateVoucherDto) {
    return this.voucherService.validate(body.code);
  }

  @Post(':id/redeem')
  @Roles('HOST', 'ADMIN', 'STAFF')
  @ApiParam({ name: 'id', type: String, description: 'Voucher ID' })
  @ApiOperation({ summary: 'Redeem/use a voucher' })
  @ApiResponse({ status: 201, description: 'Voucher redeemed' })
  @ApiResponse({ status: 400, description: 'Voucher expired or already used' })
  @ApiResponse({ status: 404, description: 'Voucher not found' })
  redeem(@Param('id') id: string) {
    return this.voucherService.redeem(id);
  }

  @Post(':id/duplicate')
  @Roles('HOST', 'ADMIN')
  @ApiParam({ name: 'id', type: String, description: 'Voucher ID' })
  @ApiOperation({ summary: 'Duplicate a voucher' })
  @ApiResponse({ status: 201, description: 'Voucher duplicated' })
  @ApiResponse({ status: 404, description: 'Voucher not found' })
  duplicate(@Param('id') id: string) {
    return this.voucherService.duplicate(id);
  }

  @Put(':id')
  @Roles('HOST', 'ADMIN')
  @ApiParam({ name: 'id', type: String, description: 'Voucher ID' })
  @ApiBody({ type: UpdateVoucherDto })
  @ApiOperation({ summary: 'Update voucher' })
  @ApiResponse({ status: 200, description: 'Voucher updated' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Voucher not found' })
  update(@Param('id') id: string, @Body() body: UpdateVoucherDto) {
    return this.voucherService.update(id, body);
  }

  @Delete(':id')
  @Roles('HOST', 'ADMIN')
  @ApiParam({ name: 'id', type: String, description: 'Voucher ID' })
  @ApiOperation({ summary: 'Delete voucher' })
  @ApiResponse({ status: 200, description: 'Voucher deleted' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Voucher not found' })
  remove(@Param('id') id: string) {
    return this.voucherService.remove(id);
  }

  @Post('batch-generate')
  @Roles('HOST', 'ADMIN')
  @ApiBody({ type: BatchGenerateVoucherDto })
  @ApiOperation({ summary: 'Batch generate vouchers' })
  @ApiResponse({ status: 201, description: 'Vouchers generated' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  batchGenerate(@Body() body: BatchGenerateVoucherDto) {
    return this.voucherService.batchGenerate(body);
  }

  @Get('stats/expired')
  @Roles('HOST', 'ADMIN', 'STAFF')
  @ApiQuery({ name: 'tenantId', required: false, type: String })
  @ApiOperation({ summary: 'Get expired voucher stats' })
  @ApiResponse({ status: 200, description: 'Expired voucher stats' })
  getExpiredStats(@Query('tenantId') tenantId?: string) {
    return this.voucherService.getExpiredStats(tenantId);
  }
}
