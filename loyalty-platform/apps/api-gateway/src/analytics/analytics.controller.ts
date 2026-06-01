import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AnalyticsService } from './analytics.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('Analytics')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('analytics')
export class AnalyticsController {
  constructor(private analyticsService: AnalyticsService) {}

  @Get('points-trend')
  @ApiOperation({ summary: 'Points earned/burned over time (daily)' })
  getPointsTrend(@Query('days') days?: number, @Query('tenantId') tenantId?: string) {
    return this.analyticsService.getPointsTrend(days || 30, tenantId);
  }

  @Get('member-growth')
  @ApiOperation({ summary: 'New member registrations over time (daily)' })
  getMemberGrowth(@Query('days') days?: number, @Query('tenantId') tenantId?: string) {
    return this.analyticsService.getMemberGrowth(days || 30, tenantId);
  }

  @Get('campaign-performance')
  @ApiOperation({ summary: 'Campaign performance metrics' })
  getCampaignPerformance(@Query('tenantId') tenantId?: string) {
    return this.analyticsService.getCampaignPerformance(tenantId);
  }

  @Get('top-members')
  @ApiOperation({ summary: 'Top members by points' })
  getTopMembers(@Query('limit') limit?: number, @Query('tenantId') tenantId?: string) {
    return this.analyticsService.getTopMembers(limit || 10, tenantId);
  }

  @Get('voucher-stats')
  @ApiOperation({ summary: 'Voucher usage statistics' })
  getVoucherStats(@Query('tenantId') tenantId?: string) {
    return this.analyticsService.getVoucherStats(tenantId);
  }
}
