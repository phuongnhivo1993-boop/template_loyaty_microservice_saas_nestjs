import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { AnalyticsServiceService } from './analytics-service.service';

@ApiTags('Analytics')
@ApiBearerAuth()
@Controller('analytics')
export class AnalyticsServiceController {
  constructor(private readonly service: AnalyticsServiceService) {}

  @Get('dashboard')
  @ApiOperation({ summary: 'Dashboard stats' })
  getDashboard(@Query('tenantId') tenantId: string) {
    return this.service.getDashboard(tenantId);
  }

  @Get('points-trend')
  @ApiOperation({ summary: 'Points earned/burned over time' })
  @ApiQuery({ name: 'tenantId', required: true })
  @ApiQuery({ name: 'days', required: false })
  getPointsTrend(@Query('tenantId') tenantId: string, @Query('days') days?: number) {
    return this.service.getPointsTrend(tenantId, days ? +days : 30);
  }

  @Get('member-growth')
  @ApiOperation({ summary: 'Member registrations over time' })
  @ApiQuery({ name: 'tenantId', required: true })
  @ApiQuery({ name: 'days', required: false })
  getMemberGrowth(@Query('tenantId') tenantId: string, @Query('days') days?: number) {
    return this.service.getMemberGrowth(tenantId, days ? +days : 30);
  }

  @Get('top-members')
  @ApiOperation({ summary: 'Top members by points' })
  getTopMembers(@Query('tenantId') tenantId: string, @Query('limit') limit?: number) {
    return this.service.getTopMembers(tenantId, limit ? +limit : 10);
  }

  @Get('voucher-stats')
  @ApiOperation({ summary: 'Voucher usage stats' })
  getVoucherStats(@Query('tenantId') tenantId: string) {
    return this.service.getVoucherStats(tenantId);
  }
}
