import { Controller, Get, Post, Put, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { GiftCardService } from './gift-card.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';

@ApiTags('Gift Cards')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('gift-cards')
export class GiftCardController {
  constructor(private giftCardService: GiftCardService) {}

  @Post()
  @Roles('HOST', 'ADMIN')
  @ApiOperation({ summary: 'Create a gift card' })
  create(@Body() body: any) {
    return this.giftCardService.create(body);
  }

  @Get()
  @Roles('HOST', 'ADMIN', 'STAFF')
  @ApiOperation({ summary: 'List gift cards' })
  findAll(@Query() query: any) {
    return this.giftCardService.findAll(query.tenantId, query.page, query.limit, query.search, query.status, query.sort);
  }

  @Get(':id')
  @Roles('HOST', 'ADMIN', 'STAFF')
  @ApiOperation({ summary: 'Get gift card by ID' })
  findOne(@Param('id') id: string) {
    return this.giftCardService.findOne(id);
  }

  @Put(':id')
  @Roles('HOST', 'ADMIN')
  @ApiOperation({ summary: 'Update gift card' })
  update(@Param('id') id: string, @Body() body: any) {
    return this.giftCardService.update(id, body);
  }

  @Post(':id/assign')
  @Roles('HOST', 'ADMIN', 'STAFF')
  @ApiOperation({ summary: 'Assign gift card to member' })
  assign(@Param('id') id: string, @Body() body: any) {
    return this.giftCardService.assign(id, body.memberId);
  }

  @Get('member/:memberId')
  @ApiOperation({ summary: 'Get member gift cards' })
  getMemberGiftCards(@Param('memberId') memberId: string) {
    return this.giftCardService.getMemberGiftCards(memberId);
  }

  @Post(':id/redeem')
  @Roles('HOST', 'ADMIN', 'STAFF')
  @ApiOperation({ summary: 'Redeem gift card balance' })
  redeem(@Param('id') id: string, @Body() body: any) {
    return this.giftCardService.redeem(id, body.memberId, body.amount);
  }
}
