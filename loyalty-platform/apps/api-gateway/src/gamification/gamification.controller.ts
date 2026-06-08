import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { GamificationService } from './gamification.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { CreateBadgeDto, UpdateBadgeDto, BadgeQueryDto, CreateMissionDto, UpdateMissionDto, MissionQueryDto, AssignBadgeDto, UpdateMissionProgressDto } from './dto/create-gamification.dto';

@ApiTags('Gamification')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller()
export class GamificationController {
  constructor(private gamificationService: GamificationService) {}

  @Post('badges')
  @Roles('HOST', 'ADMIN')
  @ApiOperation({ summary: 'Create a badge' })
  createBadge(@Req() req: any, @Body() body: CreateBadgeDto) {
    return this.gamificationService.createBadge({ ...body, tenantId: req.tenantId });
  }

  @Get('badges')
  @Roles('HOST', 'ADMIN', 'STAFF')
  @ApiOperation({ summary: 'List badges (with pagination & sort)' })
  findAllBadges(@Req() req: any, @Query() query: BadgeQueryDto) {
    return this.gamificationService.findAllBadges(req.tenantId, query.page, query.limit, query.search, query.sort);
  }

  @Get('badges/:id')
  @Roles('HOST', 'ADMIN', 'STAFF')
  @ApiOperation({ summary: 'Get badge by ID' })
  findOneBadge(@Req() req: any, @Param('id') id: string) {
    return this.gamificationService.findOneBadge(id, req.tenantId);
  }

  @Put('badges/:id')
  @Roles('HOST', 'ADMIN')
  @ApiOperation({ summary: 'Update badge' })
  updateBadge(@Req() req: any, @Param('id') id: string, @Body() body: UpdateBadgeDto) {
    return this.gamificationService.updateBadge(id, body, req.tenantId);
  }

  @Delete('badges/:id')
  @Roles('HOST', 'ADMIN')
  @ApiOperation({ summary: 'Delete badge' })
  removeBadge(@Req() req: any, @Param('id') id: string) {
    return this.gamificationService.removeBadge(id, req.tenantId);
  }

  @Post('missions')
  @Roles('HOST', 'ADMIN')
  @ApiOperation({ summary: 'Create a mission' })
  createMission(@Req() req: any, @Body() body: CreateMissionDto) {
    return this.gamificationService.createMission({ ...body, tenantId: req.tenantId });
  }

  @Get('missions')
  @Roles('HOST', 'ADMIN', 'STAFF')
  @ApiOperation({ summary: 'List missions (with pagination & sort)' })
  findAllMissions(@Req() req: any, @Query() query: MissionQueryDto) {
    return this.gamificationService.findAllMissions(req.tenantId, query.page, query.limit, query.search, query.sort);
  }

  @Get('missions/:id')
  @Roles('HOST', 'ADMIN', 'STAFF')
  @ApiOperation({ summary: 'Get mission by ID' })
  findOneMission(@Req() req: any, @Param('id') id: string) {
    return this.gamificationService.findOneMission(id, req.tenantId);
  }

  @Put('missions/:id')
  @Roles('HOST', 'ADMIN')
  @ApiOperation({ summary: 'Update mission' })
  updateMission(@Req() req: any, @Param('id') id: string, @Body() body: UpdateMissionDto) {
    return this.gamificationService.updateMission(id, body, req.tenantId);
  }

  @Delete('missions/:id')
  @Roles('HOST', 'ADMIN')
  @ApiOperation({ summary: 'Delete mission' })
  removeMission(@Req() req: any, @Param('id') id: string) {
    return this.gamificationService.removeMission(id, req.tenantId);
  }

  @Post('badges/:id/assign')
  @Roles('HOST', 'ADMIN')
  @ApiOperation({ summary: 'Assign badge to members' })
  assignBadge(@Req() req: any, @Param('id') id: string, @Body() body: AssignBadgeDto) {
    return this.gamificationService.assignBadge(id, body.memberIds, req.tenantId);
  }

  @Get('members/:memberId/badges')
  @Roles('HOST', 'ADMIN', 'STAFF')
  @ApiOperation({ summary: 'Get badges for a member' })
  getMemberBadges(@Param('memberId') memberId: string) {
    return this.gamificationService.getMemberBadges(memberId);
  }

  @Delete('badges/:id/unassign/:memberId')
  @Roles('HOST', 'ADMIN')
  @ApiOperation({ summary: 'Remove badge from member' })
  unassignBadge(@Req() req: any, @Param('id') id: string, @Param('memberId') memberId: string) {
    return this.gamificationService.unassignBadge(id, memberId, req.tenantId);
  }

  @Post('missions/:id/progress')
  @Roles('HOST', 'ADMIN', 'STAFF', 'MEMBER')
  @ApiOperation({ summary: 'Update mission progress for member' })
  updateMissionProgress(@Req() req: any, @Param('id') id: string, @Body() body: UpdateMissionProgressDto) {
    return this.gamificationService.updateMissionProgress(id, body.memberId, body.progress);
  }

  @Get('missions/:id/leaderboard')
  @Roles('HOST', 'ADMIN', 'STAFF', 'MEMBER')
  @ApiOperation({ summary: 'Get mission leaderboard' })
  getMissionLeaderboard(@Param('id') id: string) {
    return this.gamificationService.getMissionLeaderboard(id);
  }
}
