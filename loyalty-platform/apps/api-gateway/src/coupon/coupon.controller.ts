import { Controller, Get, Post, Put, Delete, Param, Body, Query, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
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
  create(@Req() req: any, @Body() body: CreateCouponDto) {
    return this.couponService.create({ ...body, tenantId: req.tenantId ?? body.tenantId });
  }

  @Get()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Roles('HOST', 'ADMIN', 'STAFF')
  @ApiOperation({ summary: 'List coupons' })
  findAll(@Req() req: any, @Query() query: CouponQueryDto) {
    return this.couponService.findAll({ ...query, tenantId: req.tenantId ?? query.tenantId });
  }

  @Get(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Roles('HOST', 'ADMIN', 'STAFF')
  @ApiOperation({ summary: 'Get coupon by ID' })
  findOne(@Param('id') id: string) {
    return this.couponService.findOne(id);
  }

  @Post(':id/duplicate')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Roles('HOST', 'ADMIN')
  @ApiOperation({ summary: 'Duplicate a coupon' })
  duplicate(@Param('id') id: string) {
    return this.couponService.duplicate(id);
  }

  @Put(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Roles('HOST', 'ADMIN')
  @ApiOperation({ summary: 'Update coupon' })
  update(@Param('id') id: string, @Body() body: UpdateCouponDto) {
    return this.couponService.update(id, body);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Roles('HOST', 'ADMIN')
  @ApiOperation({ summary: 'Delete coupon' })
  remove(@Param('id') id: string) {
    return this.couponService.remove(id);
  }

  @Post('bulk-generate')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Roles('HOST', 'ADMIN')
  @ApiOperation({ summary: 'Bulk generate coupon codes' })
  bulkGenerate(@Req() req: any, @Body() body: BulkGenerateCouponDto) {
    return this.couponService.bulkGenerate({ ...body, tenantId: req.tenantId ?? body.tenantId });
  }

  @Post('validate')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Roles('HOST', 'ADMIN', 'STAFF', 'MEMBER')
  @ApiOperation({ summary: 'Validate a coupon code without applying' })
  validate(@Body() body: ValidateCouponDto) {
    return this.couponService.validate(body.code, body.memberId, body.orderTotal, body.tenantId);
  }

  @Post('apply')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Roles('HOST', 'ADMIN', 'STAFF', 'MEMBER')
  @ApiOperation({ summary: 'Calculate coupon discount (usage recorded during order creation)' })
  async apply(@Body() body: ApplyCouponDto) {
    const result = await this.couponService.validate(body.code, body.memberId, body.orderTotal, body.tenantId);
    return { valid: result.valid, discount: result.discount, couponCode: result.coupon?.code, errors: result.errors };
  }

  @Get('stats/performance')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Roles('HOST', 'ADMIN')
  @ApiOperation({ summary: 'Get coupon performance stats (usage, discount, top coupons)' })
  getPerformanceStats(@Req() req: any, @Query('tenantId') tenantId?: string) {
    return this.couponService.getPerformanceStats(req.tenantId ?? tenantId);
  }

  @Get(':id/usages')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Roles('HOST', 'ADMIN')
  @ApiOperation({ summary: 'Get coupon usage report' })
  getUsageReport(@Param('id') id: string) {
    return this.couponService.getUsageReport(id);
  }
}
