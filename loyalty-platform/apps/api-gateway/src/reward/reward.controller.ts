import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { RewardService } from './reward.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('Rewards')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('rewards')
export class RewardController {
  constructor(private rewardService: RewardService) {}

  @Post()
  @ApiOperation({ summary: 'Create a reward' })
  create(@Body() body: { name: string; description?: string; type: string; pointsRequired: number; quantity: number; imageUrl?: string; tenantId: string }) {
    return this.rewardService.create(body);
  }

  @Get()
  @ApiOperation({ summary: 'List rewards (with pagination)' })
  findAll(
    @Query('tenantId') tenantId?: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('search') search?: string,
  ) {
    return this.rewardService.findAll(tenantId, page, limit, search);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get reward by ID' })
  findOne(@Param('id') id: string) {
    return this.rewardService.findOne(id);
  }

  @Post(':id/redeem')
  @ApiOperation({ summary: 'Redeem reward with member points' })
  redeem(@Param('id') id: string, @Body() body: { memberId: string; quantity?: number }) {
    return this.rewardService.redeem(id, body.memberId, body.quantity);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update reward' })
  update(@Param('id') id: string, @Body() body: { name?: string; description?: string; pointsRequired?: number; quantity?: number }) {
    return this.rewardService.update(id, body);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete reward' })
  remove(@Param('id') id: string) {
    return this.rewardService.remove(id);
  }
}
