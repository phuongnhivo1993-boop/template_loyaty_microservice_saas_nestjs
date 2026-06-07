import { Controller, Get, Post, Param, Body, Query, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { PointService } from './point.service';
import { PointExpiryService } from './point-expiry.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { EarnPointsDto, BurnPointsDto, AdjustPointsDto, PointTransactionQueryDto } from './dto/point.dto';

@ApiTags('Points')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('points')
export class PointController {
  constructor(
    private pointService: PointService,
    private pointExpiryService: PointExpiryService,
  ) {}

  @Get('wallet/:memberId')
  @ApiOperation({ summary: 'Get member point wallet' })
  getWallet(@Param('memberId') memberId: string) {
    return this.pointService.getWallet(memberId);
  }

  @Post('earn')
  @Roles('HOST', 'ADMIN', 'STAFF')
  @ApiOperation({ summary: 'Earn points' })
  earn(@Body() body: EarnPointsDto) {
    return this.pointService.earn(body.memberId, body.amount, body.reason);
  }

  @Post('burn')
  @Roles('HOST', 'ADMIN', 'STAFF')
  @ApiOperation({ summary: 'Burn points' })
  burn(@Body() body: BurnPointsDto) {
    return this.pointService.burn(body.memberId, body.amount, body.reason);
  }

  @Get('transactions/:id')
  @ApiOperation({ summary: 'Get point transaction by ID' })
  getTransaction(@Param('id') id: string) {
    return this.pointService.getTransaction(id);
  }

  @Get('transactions')
  @ApiOperation({ summary: 'List point transactions (paginated)' })
  getTransactions(@Req() req: any, @Query() query: PointTransactionQueryDto) {
    return this.pointService.getTransactions(query.memberId, query.page, query.limit, query.type, req.tenantId ?? query.tenantId, query.search, query.sort);
  }

  @Post('adjust')
  @Roles('HOST', 'ADMIN')
  @ApiOperation({ summary: 'Admin: adjust member points' })
  adjust(@Body() body: AdjustPointsDto) {
    return this.pointService.adjust(body.memberId, body.amount, body.reason);
  }

  @Post('trigger-expiry')
  @Roles('HOST', 'ADMIN')
  @ApiOperation({ summary: 'Manually trigger point expiry process' })
  triggerExpiry() {
    return this.pointExpiryService.processExpirations();
  }
}
