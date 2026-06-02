import { Controller, Post, Get, Param, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { CheckinService } from './checkin.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('Daily Check-in')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('checkin')
export class CheckinController {
  constructor(private checkinService: CheckinService) {}

  @Post()
  @ApiOperation({ summary: 'Daily check-in (earn streak points)' })
  doCheckin(@Req() req: any) {
    return this.checkinService.doCheckin(req.user.id);
  }

  @Get('stats')
  @ApiOperation({ summary: 'Get check-in stats (current streak, total)' })
  getStats(@Req() req: any) {
    return this.checkinService.getStats(req.user.id);
  }

  @Get('history')
  @ApiOperation({ summary: 'Get check-in history for this month' })
  getHistory(@Req() req: any) {
    return this.checkinService.getHistory(req.user.id);
  }
}
