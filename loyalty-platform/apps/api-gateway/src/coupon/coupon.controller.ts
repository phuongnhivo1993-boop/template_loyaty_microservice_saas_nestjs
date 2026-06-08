import { Controller, Get, Post, Put, Delete, Param, Body, Query, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiParam, ApiQuery, ApiResponse, ApiBody } from '@nestjs/swagger';
import { CouponService } from './coupon.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { CreateCouponDto, UpdateCouponDto, CouponQueryDto, ValidateCouponDto, ApplyCouponDto, BulkGenerateCouponDto } from './dto/coupon.dto';

@ApiTags('Coupons')
@Controller('coupons')
export class CouponController {
  constructor(private couponService: CouponService) {}

  @Post()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Roles('HOST', 'ADMIN')
  @ApiOperation({ summary: 'Create a new coupon' })
  @ApiBody({ type: CreateCouponDto })
  @ApiResponse({ status: 201, description: 'Coupon created' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  create(@Req() req: any, @Body() body: CreateCouponDto) {
    return this.couponService.create({ ...body, tenantId: req.tenantId });
  }

  @Get()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Roles('HOST', 'ADMIN', 'STAFF')
  @ApiOperation({ summary: 'List coupons' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'status', required: false, type: String })
  @ApiQuery({ name: 'search', required: false, type: String })
  @ApiQuery({ name: 'sort', required: false, type: String })
  @ApiResponse({ status: 200, description: 'List of coupons' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  findAll(@Req() req: any, @Query() query: CouponQueryDto) {
    return this.couponService.findAll({ ...query, tenantId: req.tenantId });
  }

  @Get(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Roles('HOST', 'ADMIN', 'STAFF')
  @ApiOperation({ summary: 'Get coupon by ID' })
  @ApiParam({ name: 'id', type: String, description: 'Coupon ID' })
  @ApiResponse({ status: 200, description: 'Coupon found' })
  @ApiResponse({ status: 404, description: 'Coupon not found' })
  findOne(@Req() req: any, @Param('id') id: string) {
    return this.couponService.findOne(id, req.tenantId);
  }

  @Post(':id/duplicate')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Roles('HOST', 'ADMIN')
  @ApiOperation({ summary: 'Duplicate a coupon' })
  @ApiParam({ name: 'id', type: String, description: 'Coupon ID' })
  @ApiResponse({ status: 201, description: 'Coupon duplicated' })
  @ApiResponse({ status: 404, description: 'Coupon not found' })
  duplicate(@Req() req: any, @Param('id') id: string) {
    return this.couponService.duplicate(id, req.tenantId);
  }

  @Put(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Roles('HOST', 'ADMIN')
  @ApiOperation({ summary: 'Update coupon' })
  @ApiParam({ name: 'id', type: String, description: 'Coupon ID' })
  @ApiBody({ type: UpdateCouponDto })
  @ApiResponse({ status: 200, description: 'Coupon updated' })
  @ApiResponse({ status: 404, description: 'Coupon not found' })
  update(@Req() req: any, @Param('id') id: string, @Body() body: UpdateCouponDto) {
    return this.couponService.update(id, body, req.tenantId);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Roles('HOST', 'ADMIN')
  @ApiOperation({ summary: 'Delete coupon' })
  @ApiParam({ name: 'id', type: String, description: 'Coupon ID' })
  @ApiResponse({ status: 200, description: 'Coupon deleted' })
  @ApiResponse({ status: 404, description: 'Coupon not found' })
  remove(@Req() req: any, @Param('id') id: string) {
    return this.couponService.remove(id, req.tenantId);
  }

  @Post('bulk-generate')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Roles('HOST', 'ADMIN')
  @ApiOperation({ summary: 'Bulk generate coupon codes' })
  @ApiBody({ type: BulkGenerateCouponDto })
  @ApiResponse({ status: 201, description: 'Coupons generated' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  bulkGenerate(@Req() req: any, @Body() body: BulkGenerateCouponDto) {
    return this.couponService.bulkGenerate({ ...body, tenantId: req.tenantId });
  }

  @Post('validate')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Roles('HOST', 'ADMIN', 'STAFF', 'MEMBER')
  @ApiOperation({ summary: 'Validate a coupon code without applying' })
  @ApiBody({ type: ValidateCouponDto })
  @ApiResponse({ status: 200, description: 'Validation result' })
  @ApiResponse({ status: 404, description: 'Coupon not found' })
  validate(@Req() req: any, @Body() body: ValidateCouponDto) {
    return this.couponService.validate(body.code, body.memberId, body.orderTotal, req.tenantId);
  }

  @Post('apply')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Roles('HOST', 'ADMIN', 'STAFF', 'MEMBER')
  @ApiOperation({ summary: 'Calculate coupon discount (usage recorded during order creation)' })
  @ApiBody({ type: ApplyCouponDto })
  @ApiResponse({ status: 200, description: 'Discount calculated' })
  async apply(@Req() req: any, @Body() body: ApplyCouponDto) {
    const result = await this.couponService.validate(body.code, body.memberId, body.orderTotal, req.tenantId);
    return { valid: result.valid, discount: result.discount, couponCode: result.coupon?.code, errors: result.errors };
  }

  @Get('stats/performance')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Roles('HOST', 'ADMIN')
  @ApiOperation({ summary: 'Get coupon performance stats (usage, discount, top coupons)' })
  @ApiQuery({ name: 'tenantId', required: false, type: String })
  @ApiResponse({ status: 200, description: 'Performance stats' })
  getPerformanceStats(@Req() req: any, @Query('tenantId') tenantId?: string) {
    return this.couponService.getPerformanceStats(req.tenantId);
  }

  @Get(':id/usages')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Roles('HOST', 'ADMIN')
  @ApiOperation({ summary: 'Get coupon usage report' })
  @ApiParam({ name: 'id', type: String, description: 'Coupon ID' })
  @ApiResponse({ status: 200, description: 'Usage report' })
  @ApiResponse({ status: 404, description: 'Coupon not found' })
  getUsageReport(@Req() req: any, @Param('id') id: string) {
    return this.couponService.getUsageReport(id, req.tenantId);
  }
}
