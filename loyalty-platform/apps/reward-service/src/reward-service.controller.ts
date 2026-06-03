import { Controller, Get, Post, Body, Param, Patch, Delete, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { RewardServiceService } from './reward-service.service';
import { CreateRewardDto, UpdateRewardDto, RedeemRewardDto } from './dto';

@ApiTags('Rewards')
@ApiBearerAuth()
@Controller('rewards')
export class RewardServiceController {
  constructor(private readonly rewardServiceService: RewardServiceService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new reward' })
  create(@Body() dto: CreateRewardDto) {
    return this.rewardServiceService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'List all rewards' })
  @ApiQuery({ name: 'tenantId', required: false })
  findAll(@Query('tenantId') tenantId?: string) {
    return this.rewardServiceService.findAll(tenantId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get reward by ID' })
  findOne(@Param('id') id: string) {
    return this.rewardServiceService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a reward' })
  update(@Param('id') id: string, @Body() dto: UpdateRewardDto) {
    return this.rewardServiceService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a reward' })
  remove(@Param('id') id: string) {
    return this.rewardServiceService.remove(id);
  }

  @Post(':id/redeem')
  @ApiOperation({ summary: 'Redeem a reward (burns points, creates voucher)' })
  redeem(@Param('id') id: string, @Body() dto: RedeemRewardDto) {
    return this.rewardServiceService.redeem(id, dto);
  }

  @Get(':id/redemptions')
  @ApiOperation({ summary: 'Get redemption history for a reward' })
  getRedemptions(@Param('id') id: string) {
    return this.rewardServiceService.getRedemptions(id);
  }
}
