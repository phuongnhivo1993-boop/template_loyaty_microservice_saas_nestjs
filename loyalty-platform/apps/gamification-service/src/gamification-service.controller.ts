import { Controller, Get, Post, Put, Delete, Param, Body, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { GamificationServiceService } from './gamification-service.service';
import { CreateBadgeDto, UpdateBadgeDto, BadgeQueryDto } from './dto/badge.dto';
import { CreateMissionDto, UpdateMissionDto, MissionQueryDto } from './dto/mission.dto';

@ApiTags('Gamification')
@ApiBearerAuth()
@Controller('gamification')
export class GamificationServiceController {
  constructor(private readonly service: GamificationServiceService) {}

  @Post('badges')
  @ApiOperation({ summary: 'Create a badge' })
  createBadge(@Body() dto: CreateBadgeDto) {
    return this.service.createBadge(dto);
  }

  @Get('badges')
  @ApiOperation({ summary: 'List badges' })
  listBadges(@Query() query: BadgeQueryDto) {
    return this.service.listBadges(query.tenantId, query.page, query.limit);
  }

  @Get('badges/:id')
  @ApiOperation({ summary: 'Get badge by id' })
  getBadge(@Param('id') id: string) {
    return this.service.getBadge(id);
  }

  @Put('badges/:id')
  @ApiOperation({ summary: 'Update a badge' })
  updateBadge(@Param('id') id: string, @Body() dto: UpdateBadgeDto) {
    return this.service.updateBadge(id, dto);
  }

  @Delete('badges/:id')
  @ApiOperation({ summary: 'Delete a badge' })
  deleteBadge(@Param('id') id: string) {
    return this.service.deleteBadge(id);
  }

  @Post('missions')
  @ApiOperation({ summary: 'Create a mission' })
  createMission(@Body() dto: CreateMissionDto) {
    return this.service.createMission(dto);
  }

  @Get('missions')
  @ApiOperation({ summary: 'List missions' })
  listMissions(@Query() query: MissionQueryDto) {
    return this.service.listMissions(query.tenantId, query.page, query.limit);
  }

  @Get('missions/:id')
  @ApiOperation({ summary: 'Get mission by id' })
  getMission(@Param('id') id: string) {
    return this.service.getMission(id);
  }

  @Put('missions/:id')
  @ApiOperation({ summary: 'Update a mission' })
  updateMission(@Param('id') id: string, @Body() dto: UpdateMissionDto) {
    return this.service.updateMission(id, dto);
  }

  @Delete('missions/:id')
  @ApiOperation({ summary: 'Delete a mission' })
  deleteMission(@Param('id') id: string) {
    return this.service.deleteMission(id);
  }

  @Get('leaderboard')
  @ApiOperation({ summary: 'Top members by points' })
  getLeaderboard(@Query('tenantId') tenantId: string, @Query('limit') limit?: number) {
    return this.service.getLeaderboard(tenantId, limit);
  }

  @Get('member/:memberId/badges')
  @ApiOperation({ summary: "Get member's badges" })
  getMemberBadges(@Param('memberId') memberId: string) {
    return this.service.getMemberBadges(memberId);
  }

  @Get('member/:memberId/missions')
  @ApiOperation({ summary: "Get member's missions" })
  getMemberMissions(@Param('memberId') memberId: string) {
    return this.service.getMemberMissions(memberId);
  }
}
