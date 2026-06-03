import { Controller, Get, Post, Body, Param, Delete, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { ReferralServiceService } from './referral-service.service';
import { CreateReferralDto, ConvertReferralDto } from './dto';

@ApiTags('Referrals')
@ApiBearerAuth()
@Controller('referrals')
export class ReferralServiceController {
  constructor(private readonly referralServiceService: ReferralServiceService) {}

  @Post('links')
  @ApiOperation({ summary: 'Create a referral link' })
  createReferralLink(@Body() dto: CreateReferralDto) {
    return this.referralServiceService.createReferralLink(dto);
  }

  @Get()
  @ApiOperation({ summary: 'List all referrals' })
  @ApiQuery({ name: 'tenantId', required: false })
  findAll(@Query('tenantId') tenantId?: string) {
    return this.referralServiceService.findAll(tenantId);
  }

  @Get('stats')
  @ApiOperation({ summary: 'Get referral statistics' })
  @ApiQuery({ name: 'tenantId', required: false })
  getStats(@Query('tenantId') tenantId?: string) {
    return this.referralServiceService.getStats(tenantId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get referral by ID' })
  findOne(@Param('id') id: string) {
    return this.referralServiceService.findOne(id);
  }

  @Post(':id/convert')
  @ApiOperation({ summary: 'Convert a referral with auto-reward' })
  convert(@Param('id') id: string, @Body() dto: ConvertReferralDto) {
    return this.referralServiceService.convert(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a referral' })
  remove(@Param('id') id: string) {
    return this.referralServiceService.remove(id);
  }
}
