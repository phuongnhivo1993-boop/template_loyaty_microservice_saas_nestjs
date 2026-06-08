import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { CashbackService } from './cashback.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import {
  CreateCashbackConfigDto,
  UpdateCashbackConfigDto,
  EarnCashbackDto,
  RedeemCashbackDto,
} from './dto/cashback.dto';

@ApiTags('Cashback')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('cashback')
export class CashbackController {
  constructor(private cashbackService: CashbackService) {}

  @Post('configs')
  @Roles('HOST', 'ADMIN')
  @ApiOperation({ summary: 'Create cashback config' })
  createConfig(@Body() body: CreateCashbackConfigDto) {
    return this.cashbackService.createConfig(body);
  }

  @Get('configs')
  @Roles('HOST', 'ADMIN', 'STAFF')
  @ApiOperation({ summary: 'List cashback configs' })
  listConfigs(@Query() query: any) {
    return this.cashbackService.listConfigs(query.tenantId, query.page, query.limit);
  }

  @Get('configs/:id')
  @Roles('HOST', 'ADMIN', 'STAFF')
  @ApiOperation({ summary: 'Get cashback config' })
  getConfig(@Param('id') id: string) {
    return this.cashbackService.getConfig(id);
  }

  @Put('configs/:id')
  @Roles('HOST', 'ADMIN')
  @ApiOperation({ summary: 'Update cashback config' })
  updateConfig(@Param('id') id: string, @Body() body: UpdateCashbackConfigDto) {
    return this.cashbackService.updateConfig(id, body);
  }

  @Delete('configs/:id')
  @Roles('HOST', 'ADMIN')
  @ApiOperation({ summary: 'Delete cashback config' })
  deleteConfig(@Param('id') id: string) {
    return this.cashbackService.deleteConfig(id);
  }

  @Post('earn')
  @Roles('HOST', 'ADMIN', 'STAFF')
  @ApiOperation({ summary: 'Earn cashback for member' })
  earn(@Body() body: EarnCashbackDto) {
    return this.cashbackService.earn(body.memberId, body.amount, body.description, body.referenceId);
  }

  @Post('redeem')
  @Roles('HOST', 'ADMIN', 'STAFF')
  @ApiOperation({ summary: 'Redeem cashback for member' })
  redeem(@Body() body: RedeemCashbackDto) {
    return this.cashbackService.redeem(body.memberId, body.amount, body.description);
  }

  @Get('balance/:memberId')
  @Roles('HOST', 'ADMIN', 'STAFF')
  @ApiOperation({ summary: 'Get member cashback balance' })
  getBalance(@Param('memberId') memberId: string) {
    return this.cashbackService.getBalance(memberId);
  }

  @Get('transactions/:memberId')
  @Roles('HOST', 'ADMIN', 'STAFF')
  @ApiOperation({ summary: 'Get member cashback transactions' })
  getTransactions(@Param('memberId') memberId: string, @Query() query: any) {
    return this.cashbackService.getTransactions(memberId, query.page, query.limit, query.type);
  }
}
