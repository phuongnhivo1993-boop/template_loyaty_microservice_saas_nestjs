import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { RewardService } from './reward.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { CreateRewardDto, UpdateRewardDto, RedeemRewardDto, RewardQueryDto } from './dto/create-reward.dto';

@ApiTags('Rewards')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('rewards')
export class RewardController {
  constructor(private rewardService: RewardService) {}

  @Post()
  @Roles('HOST', 'ADMIN')
  @ApiOperation({ summary: 'Create a reward' })
  create(@Req() req: any, @Body() body: CreateRewardDto) {
    return this.rewardService.create({ ...body, tenantId: req.tenantId ?? body.tenantId });
  }

  @Get()
  @ApiOperation({ summary: 'List rewards (with pagination & sort & type filter)' })
  findAll(@Req() req: any, @Query() query: RewardQueryDto) {
    return this.rewardService.findAll(req.tenantId ?? query.tenantId, query.page, query.limit, query.search, query.sort, query.type);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get reward by ID' })
  findOne(@Param('id') id: string) {
    return this.rewardService.findOne(id);
  }

  @Post(':id/redeem')
  @Roles('HOST', 'ADMIN', 'STAFF')
  @ApiOperation({ summary: 'Redeem reward with member points' })
  redeem(@Param('id') id: string, @Body() body: RedeemRewardDto) {
    return this.rewardService.redeem(id, body.memberId, body.quantity);
  }

  @Put(':id')
  @Roles('HOST', 'ADMIN')
  @ApiOperation({ summary: 'Update reward' })
  update(@Param('id') id: string, @Body() body: UpdateRewardDto) {
    return this.rewardService.update(id, body);
  }

  @Delete(':id')
  @Roles('HOST', 'ADMIN')
  @ApiOperation({ summary: 'Delete reward' })
  remove(@Param('id') id: string) {
    return this.rewardService.remove(id);
  }

  @Get(':id/redemptions')
  @Roles('HOST', 'ADMIN', 'STAFF')
  @ApiOperation({ summary: 'Get reward redemption history' })
  getRedemptionStats(@Param('id') id: string) {
    return this.rewardService.getRedemptionStats(id);
  }
}
