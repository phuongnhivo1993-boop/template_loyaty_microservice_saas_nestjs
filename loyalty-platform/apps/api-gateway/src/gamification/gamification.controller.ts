import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { GamificationService } from './gamification.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { CreateBadgeDto, UpdateBadgeDto, BadgeQueryDto, CreateMissionDto, UpdateMissionDto, MissionQueryDto } from './dto/create-gamification.dto';

@ApiTags('Gamification')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller()
export class GamificationController {
  constructor(private gamificationService: GamificationService) {}

  @Post('badges')
  @Roles('HOST', 'ADMIN')
  @ApiOperation({ summary: 'Create a badge' })
  createBadge(@Body() body: CreateBadgeDto) {
    return this.gamificationService.createBadge(body);
  }

  @Get('badges')
  @ApiOperation({ summary: 'List badges (with pagination & sort)' })
  findAllBadges(@Query() query: BadgeQueryDto) {
    return this.gamificationService.findAllBadges(query.tenantId, query.page, query.limit, query.search, query.sort);
  }

  @Get('badges/:id')
  @ApiOperation({ summary: 'Get badge by ID' })
  findOneBadge(@Param('id') id: string) {
    return this.gamificationService.findOneBadge(id);
  }

  @Put('badges/:id')
  @Roles('HOST', 'ADMIN')
  @ApiOperation({ summary: 'Update badge' })
  updateBadge(@Param('id') id: string, @Body() body: UpdateBadgeDto) {
    return this.gamificationService.updateBadge(id, body);
  }

  @Delete('badges/:id')
  @Roles('HOST', 'ADMIN')
  @ApiOperation({ summary: 'Delete badge' })
  removeBadge(@Param('id') id: string) {
    return this.gamificationService.removeBadge(id);
  }

  @Post('missions')
  @Roles('HOST', 'ADMIN')
  @ApiOperation({ summary: 'Create a mission' })
  createMission(@Body() body: CreateMissionDto) {
    return this.gamificationService.createMission(body);
  }

  @Get('missions')
  @ApiOperation({ summary: 'List missions (with pagination & sort)' })
  findAllMissions(@Query() query: MissionQueryDto) {
    return this.gamificationService.findAllMissions(query.tenantId, query.page, query.limit, query.search, query.sort);
  }

  @Get('missions/:id')
  @ApiOperation({ summary: 'Get mission by ID' })
  findOneMission(@Param('id') id: string) {
    return this.gamificationService.findOneMission(id);
  }

  @Put('missions/:id')
  @Roles('HOST', 'ADMIN')
  @ApiOperation({ summary: 'Update mission' })
  updateMission(@Param('id') id: string, @Body() body: UpdateMissionDto) {
    return this.gamificationService.updateMission(id, body);
  }

  @Delete('missions/:id')
  @Roles('HOST', 'ADMIN')
  @ApiOperation({ summary: 'Delete mission' })
  removeMission(@Param('id') id: string) {
    return this.gamificationService.removeMission(id);
  }
}
