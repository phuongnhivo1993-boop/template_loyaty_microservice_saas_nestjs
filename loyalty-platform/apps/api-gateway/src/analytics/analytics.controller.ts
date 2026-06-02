import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AnalyticsService } from './analytics.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';

@ApiTags('Analytics')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('analytics')
export class AnalyticsController {
  constructor(private analyticsService: AnalyticsService) {}

  @Get('points-trend')
  @Roles('HOST', 'ADMIN', 'STAFF')
  @ApiOperation({ summary: 'Points earned/burned over time (daily)' })
  getPointsTrend(@Query('days') days?: number, @Query('tenantId') tenantId?: string) {
    return this.analyticsService.getPointsTrend(days || 30, tenantId);
  }

  @Get('member-growth')
  @Roles('HOST', 'ADMIN', 'STAFF')
  @ApiOperation({ summary: 'New member registrations over time (daily)' })
  getMemberGrowth(@Query('days') days?: number, @Query('tenantId') tenantId?: string) {
    return this.analyticsService.getMemberGrowth(days || 30, tenantId);
  }

  @Get('campaign-performance')
  @Roles('HOST', 'ADMIN', 'STAFF')
  @ApiOperation({ summary: 'Campaign performance metrics' })
  getCampaignPerformance(@Query('tenantId') tenantId?: string) {
    return this.analyticsService.getCampaignPerformance(tenantId);
  }

  @Get('top-members')
  @Roles('HOST', 'ADMIN', 'STAFF')
  @ApiOperation({ summary: 'Top members by points' })
  getTopMembers(@Query('limit') limit?: number, @Query('tenantId') tenantId?: string) {
    return this.analyticsService.getTopMembers(limit || 10, tenantId);
  }

  @Get('voucher-stats')
  @Roles('HOST', 'ADMIN', 'STAFF')
  @ApiOperation({ summary: 'Voucher usage statistics' })
  getVoucherStats(@Query('tenantId') tenantId?: string) {
    return this.analyticsService.getVoucherStats(tenantId);
  }

  @Get('expiring-points')
  @Roles('HOST', 'ADMIN', 'STAFF')
  @ApiOperation({ summary: 'Members with points nearing expiry' })
  getExpiringPoints(@Query('tenantId') tenantId?: string) {
    return this.analyticsService.getExpiringPoints(tenantId);
  }

  @Get('leaderboard')
  @Roles('HOST', 'ADMIN', 'STAFF')
  @ApiOperation({ summary: 'Member leaderboard ranked by points' })
  getLeaderboard(@Query('limit') limit?: number, @Query('tenantId') tenantId?: string) {
    return this.analyticsService.getLeaderboard(tenantId, limit || 20);
  }

  @Get('voucher-analytics')
  @Roles('HOST', 'ADMIN', 'STAFF')
  @ApiOperation({ summary: 'Voucher usage analytics (daily trend, popular, by type)' })
  getVoucherAnalytics(@Query('days') days?: number, @Query('tenantId') tenantId?: string) {
    return this.analyticsService.getVoucherAnalytics(days || 30, tenantId);
  }
}
