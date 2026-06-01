import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { GamificationService } from './gamification.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('Gamification')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller()
export class GamificationController {
  constructor(private gamificationService: GamificationService) {}

  @Post('badges')
  @ApiOperation({ summary: 'Create a badge' })
  createBadge(@Body() body: { name: string; description?: string; iconUrl?: string; criteria?: any; tenantId: string }) {
    return this.gamificationService.createBadge(body);
  }

  @Get('badges')
  @ApiOperation({ summary: 'List badges (with pagination)' })
  findAllBadges(
    @Query('tenantId') tenantId?: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.gamificationService.findAllBadges(tenantId, page, limit);
  }

  @Put('badges/:id')
  @ApiOperation({ summary: 'Update badge' })
  updateBadge(@Param('id') id: string, @Body() body: { name?: string; description?: string; iconUrl?: string; criteria?: any }) {
    return this.gamificationService.updateBadge(id, body);
  }

  @Delete('badges/:id')
  @ApiOperation({ summary: 'Delete badge' })
  removeBadge(@Param('id') id: string) {
    return this.gamificationService.removeBadge(id);
  }

  @Post('missions')
  @ApiOperation({ summary: 'Create a mission' })
  createMission(@Body() body: { name: string; description?: string; pointsReward?: number; criteria?: any; startDate?: string; endDate?: string; tenantId: string }) {
    return this.gamificationService.createMission(body);
  }

  @Get('missions')
  @ApiOperation({ summary: 'List missions (with pagination)' })
  findAllMissions(
    @Query('tenantId') tenantId?: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.gamificationService.findAllMissions(tenantId, page, limit);
  }

  @Put('missions/:id')
  @ApiOperation({ summary: 'Update mission' })
  updateMission(@Param('id') id: string, @Body() body: { name?: string; description?: string; pointsReward?: number; criteria?: any }) {
    return this.gamificationService.updateMission(id, body);
  }

  @Delete('missions/:id')
  @ApiOperation({ summary: 'Delete mission' })
  removeMission(@Param('id') id: string) {
    return this.gamificationService.removeMission(id);
  }
}
