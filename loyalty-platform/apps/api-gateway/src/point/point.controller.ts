import { Controller, Get, Post, Param, Body, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { PointService } from './point.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AdjustPointsDto, EarnPointsDto } from '../common/dto/common.dto';

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
  earn(@Body() body: EarnPointsDto) {
    return this.pointService.earn(body.memberId, body.amount, body.reason);
  }

  @Post('burn')
  @ApiOperation({ summary: 'Burn points' })
  burn(@Body() body: EarnPointsDto) {
    return this.pointService.burn(body.memberId, body.amount, body.reason);
  }

  @Get('transactions/:id')
  @ApiOperation({ summary: 'Get point transaction by ID' })
  getTransaction(@Param('id') id: string) {
    return this.pointService.getTransaction(id);
  }

  @Get('transactions')
  @ApiOperation({ summary: 'List point transactions (paginated)' })
  getTransactions(
    @Query('memberId') memberId?: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('type') type?: string,
  ) {
    return this.pointService.getTransactions(memberId, page, limit, type);
  }

  @Post('adjust')
  @ApiOperation({ summary: 'Admin: adjust member points' })
  adjust(@Body() body: AdjustPointsDto) {
    return this.pointService.adjust(body.memberId, body.amount, body.reason);
  }
}
