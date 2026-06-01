import { Controller, Get, Post, Param, Body, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { PointService } from './point.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('Points')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('points')
export class PointController {
  constructor(private pointService: PointService) {}

  @Get('wallet/:memberId')
  @ApiOperation({ summary: 'Get member point wallet' })
  getWallet(@Param('memberId') memberId: string) {
    return this.pointService.getWallet(memberId);
  }

  @Post('earn')
  @ApiOperation({ summary: 'Earn points' })
  earn(@Body() body: { memberId: string; amount: number; reason?: string }) {
    return this.pointService.earn(body.memberId, body.amount, body.reason);
  }

  @Post('burn')
  @ApiOperation({ summary: 'Burn points' })
  burn(@Body() body: { memberId: string; amount: number; reason?: string }) {
    return this.pointService.burn(body.memberId, body.amount, body.reason);
  }

  @Get('transactions')
  @ApiOperation({ summary: 'List point transactions' })
  getTransactions(@Query('memberId') memberId?: string) {
    return this.pointService.getTransactions(memberId);
  }
}
