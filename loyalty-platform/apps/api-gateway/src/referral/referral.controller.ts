import { Controller, Get, Post, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ReferralService } from './referral.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('Referrals')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('referrals')
export class ReferralController {
  constructor(private referralService: ReferralService) {}

  @Post('links')
  @ApiOperation({ summary: 'Create referral link' })
  createLink(@Param() _: any, @Query('referrerId') referrerId: string, @Query('tenantId') tenantId: string) {
    return this.referralService.createLink(referrerId, tenantId);
  }

  @Get()
  @ApiOperation({ summary: 'List referrals (with pagination)' })
  findAll(
    @Query('tenantId') tenantId?: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.referralService.findAll(tenantId, page, limit);
  }

  @Get('stats')
  @ApiOperation({ summary: 'Get referral stats' })
  getStats(@Query('tenantId') tenantId?: string) {
    return this.referralService.getStats(tenantId);
  }
}
