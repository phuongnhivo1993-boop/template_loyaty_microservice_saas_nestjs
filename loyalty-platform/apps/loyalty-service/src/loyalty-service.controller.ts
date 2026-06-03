import { Controller, Get, Post, Param, Query, Body } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { LoyaltyServiceService } from './loyalty-service.service';
import { EarnPointsDto, BurnPointsDto, PointsQueryDto } from './dto/point.dto';

@ApiTags('Points')
@Controller('points')
export class LoyaltyServiceController {
  constructor(private readonly loyaltyServiceService: LoyaltyServiceService) {}

  @Get('wallet/:memberId')
  @ApiOperation({ summary: 'Get point balance for a member' })
  getWallet(@Param('memberId') memberId: string) {
    return this.loyaltyServiceService.getWallet(memberId);
  }

  @Post('earn')
  @ApiOperation({ summary: 'Earn points (with tier multiplier)' })
  earn(@Body() dto: EarnPointsDto) {
    return this.loyaltyServiceService.earn(dto);
  }

  @Post('burn')
  @ApiOperation({ summary: 'Burn points' })
  burn(@Body() dto: BurnPointsDto) {
    return this.loyaltyServiceService.burn(dto);
  }

  @Get('transactions/:memberId')
  @ApiOperation({ summary: 'List point transactions for a member' })
  getTransactions(@Param('memberId') memberId: string, @Query() query: PointsQueryDto) {
    return this.loyaltyServiceService.getTransactions(memberId, query);
  }
}
