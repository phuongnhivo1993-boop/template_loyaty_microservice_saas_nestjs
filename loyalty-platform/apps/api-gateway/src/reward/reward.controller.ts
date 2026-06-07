import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiBody, ApiParam, ApiQuery, ApiResponse } from '@nestjs/swagger';
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
  @ApiBody({ type: CreateRewardDto })
  @ApiOperation({ summary: 'Create a reward' })
  @ApiResponse({ status: 201, description: 'Reward created' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  create(@Req() req: any, @Body() body: CreateRewardDto) {
    return this.rewardService.create({ ...body, tenantId: req.tenantId ?? body.tenantId });
  }

  @Get()
  @ApiOperation({ summary: 'List rewards (with pagination & sort & type filter)' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'search', required: false, type: String })
  @ApiQuery({ name: 'sort', required: false, type: String })
  @ApiQuery({ name: 'type', required: false, type: String })
  @ApiQuery({ name: 'tenantId', required: false, type: String })
  @ApiResponse({ status: 200, description: 'List of rewards' })
  findAll(@Req() req: any, @Query() query: RewardQueryDto) {
    return this.rewardService.findAll(req.tenantId ?? query.tenantId, query.page, query.limit, query.search, query.sort, query.type);
  }

  @Get(':id')
  @ApiParam({ name: 'id', type: String, description: 'Reward ID' })
  @ApiOperation({ summary: 'Get reward by ID' })
  @ApiResponse({ status: 200, description: 'Reward found' })
  @ApiResponse({ status: 404, description: 'Reward not found' })
  findOne(@Param('id') id: string) {
    return this.rewardService.findOne(id);
  }

  @Post(':id/redeem')
  @Roles('HOST', 'ADMIN', 'STAFF')
  @ApiParam({ name: 'id', type: String, description: 'Reward ID' })
  @ApiBody({ type: RedeemRewardDto })
  @ApiOperation({ summary: 'Redeem reward with member points' })
  @ApiResponse({ status: 201, description: 'Reward redeemed' })
  @ApiResponse({ status: 400, description: 'Insufficient points' })
  @ApiResponse({ status: 404, description: 'Reward not found' })
  redeem(@Param('id') id: string, @Body() body: RedeemRewardDto) {
    return this.rewardService.redeem(id, body.memberId, body.quantity);
  }

  @Post(':id/duplicate')
  @Roles('HOST', 'ADMIN')
  @ApiParam({ name: 'id', type: String, description: 'Reward ID' })
  @ApiOperation({ summary: 'Duplicate a reward' })
  @ApiResponse({ status: 201, description: 'Reward duplicated' })
  @ApiResponse({ status: 404, description: 'Reward not found' })
  duplicate(@Param('id') id: string) {
    return this.rewardService.duplicate(id);
  }

  @Put(':id')
  @Roles('HOST', 'ADMIN')
  @ApiParam({ name: 'id', type: String, description: 'Reward ID' })
  @ApiBody({ type: UpdateRewardDto })
  @ApiOperation({ summary: 'Update reward' })
  @ApiResponse({ status: 200, description: 'Reward updated' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Reward not found' })
  update(@Param('id') id: string, @Body() body: UpdateRewardDto) {
    return this.rewardService.update(id, body);
  }

  @Delete(':id')
  @Roles('HOST', 'ADMIN')
  @ApiParam({ name: 'id', type: String, description: 'Reward ID' })
  @ApiOperation({ summary: 'Delete reward' })
  @ApiResponse({ status: 200, description: 'Reward deleted' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Reward not found' })
  remove(@Param('id') id: string) {
    return this.rewardService.remove(id);
  }

  @Get(':id/redemptions')
  @Roles('HOST', 'ADMIN', 'STAFF')
  @ApiParam({ name: 'id', type: String, description: 'Reward ID' })
  @ApiOperation({ summary: 'Get reward redemption history' })
  @ApiResponse({ status: 200, description: 'Redemption history' })
  @ApiResponse({ status: 404, description: 'Reward not found' })
  getRedemptionStats(@Param('id') id: string) {
    return this.rewardService.getRedemptionStats(id);
  }
}
