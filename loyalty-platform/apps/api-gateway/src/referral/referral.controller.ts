import { Controller, Get, Post, Put, Delete, Param, Body, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiBody, ApiParam, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { ReferralService } from './referral.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { CreateReferralLinkDto, ConvertReferralDto } from '../common/dto/common.dto';

@ApiTags('Referrals')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('referrals')
export class ReferralController {
  constructor(private referralService: ReferralService) {}

  @Post('links')
  @Roles('HOST', 'ADMIN', 'STAFF')
  @ApiBody({ type: CreateReferralLinkDto })
  @ApiOperation({ summary: 'Create referral link' })
  @ApiResponse({ status: 201, description: 'Referral link created' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  createLink(@Body() body: CreateReferralLinkDto) {
    return this.referralService.createLink(body.referrerId, body.tenantId);
  }

  @Get()
  @Roles('HOST', 'ADMIN', 'STAFF')
  @ApiOperation({ summary: 'List referrals (with pagination & sort)' })
  @ApiQuery({ name: 'tenantId', required: false, type: String })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'search', required: false, type: String })
  @ApiQuery({ name: 'sort', required: false, type: String })
  @ApiQuery({ name: 'status', required: false, type: String })
  @ApiResponse({ status: 200, description: 'List of referrals' })
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
  @Roles('HOST', 'ADMIN', 'STAFF')
  @ApiQuery({ name: 'tenantId', required: false, type: String })
  @ApiOperation({ summary: 'Get referral stats' })
  @ApiResponse({ status: 200, description: 'Referral statistics' })
  getStats(@Query('tenantId') tenantId?: string) {
    return this.referralService.getStats(tenantId);
  }

  @Get(':id')
  @Roles('HOST', 'ADMIN', 'STAFF')
  @ApiParam({ name: 'id', type: String, description: 'Referral ID' })
  @ApiOperation({ summary: 'Get referral by ID' })
  @ApiResponse({ status: 200, description: 'Referral found' })
  @ApiResponse({ status: 404, description: 'Referral not found' })
  findOne(@Param('id') id: string) {
    return this.referralService.findOne(id);
  }

  @Put(':id')
  @Roles('HOST', 'ADMIN')
  @ApiParam({ name: 'id', type: String, description: 'Referral ID' })
  @ApiBody({ schema: { type: 'object', properties: { status: { type: 'string' } } } })
  @ApiOperation({ summary: 'Update referral' })
  @ApiResponse({ status: 200, description: 'Referral updated' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Referral not found' })
  update(@Param('id') id: string, @Body() body: { status?: string }) {
    return this.referralService.update(id, body);
  }

  @Delete(':id')
  @Roles('HOST', 'ADMIN')
  @ApiParam({ name: 'id', type: String, description: 'Referral ID' })
  @ApiOperation({ summary: 'Delete referral' })
  @ApiResponse({ status: 200, description: 'Referral deleted' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Referral not found' })
  remove(@Param('id') id: string) {
    return this.referralService.remove(id);
  }

  @Post(':id/convert')
  @Roles('HOST', 'ADMIN', 'STAFF')
  @ApiParam({ name: 'id', type: String, description: 'Referral ID' })
  @ApiBody({ type: ConvertReferralDto })
  @ApiOperation({ summary: 'Mark referral as converted and reward referrer' })
  @ApiResponse({ status: 201, description: 'Referral converted' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 404, description: 'Referral not found' })
  convert(@Param('id') id: string, @Body() body: ConvertReferralDto) {
    return this.referralService.convertReferral(id, body.refereeId);
  }
}
