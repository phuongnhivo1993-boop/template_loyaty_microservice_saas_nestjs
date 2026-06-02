import { Controller, Get, Post, Put, Delete, Param, Body, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ReferralService } from './referral.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateReferralLinkDto, ConvertReferralDto } from '../common/dto/common.dto';

@ApiTags('Referrals')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('referrals')
export class ReferralController {
  constructor(private referralService: ReferralService) {}

  @Post('links')
  @ApiOperation({ summary: 'Create referral link' })
  createLink(@Body() body: CreateReferralLinkDto) {
    return this.referralService.createLink(body.referrerId, body.tenantId);
  }

  @Get()
  @ApiOperation({ summary: 'List referrals (with pagination & sort)' })
  findAll(
    @Query('tenantId') tenantId?: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('search') search?: string,
    @Query('sort') sort?: string,
    @Query('status') status?: string,
  ) {
    return this.referralService.findAll(tenantId, page, limit, search, sort, status);
  }

  @Get('stats')
  @ApiOperation({ summary: 'Get referral stats' })
  getStats(@Query('tenantId') tenantId?: string) {
    return this.referralService.getStats(tenantId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get referral by ID' })
  findOne(@Param('id') id: string) {
    return this.referralService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update referral' })
  update(@Param('id') id: string, @Body() body: { status?: string }) {
    return this.referralService.update(id, body);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete referral' })
  remove(@Param('id') id: string) {
    return this.referralService.remove(id);
  }

  @Post(':id/convert')
  @ApiOperation({ summary: 'Mark referral as converted and reward referrer' })
  convert(@Param('id') id: string, @Body() body: ConvertReferralDto) {
    return this.referralService.convertReferral(id, body.refereeId);
  }
}
