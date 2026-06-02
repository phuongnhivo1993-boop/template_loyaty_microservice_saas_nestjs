import { Controller, Get, Post, Delete, Param, Body, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { MemberVoucherService } from './member-voucher.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';

@ApiTags('Member Vouchers')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('member-vouchers')
export class MemberVoucherController {
  constructor(private memberVoucherService: MemberVoucherService) {}

  @Post()
  @Roles('HOST', 'ADMIN', 'STAFF')
  @ApiOperation({ summary: 'Assign voucher to member' })
  assign(@Body() body: { memberId: string; voucherId: string }) {
    return this.memberVoucherService.assign(body.memberId, body.voucherId);
  }

  @Get()
  @ApiOperation({ summary: 'List member-voucher assignments' })
  findAll(@Query('memberId') memberId?: string, @Query('page') page?: number, @Query('limit') limit?: number, @Query('search') search?: string) {
    return this.memberVoucherService.findAll(memberId, page, limit, search);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get member-voucher assignment by ID' })
  findOne(@Param('id') id: string) {
    return this.memberVoucherService.findOne(id);
  }

  @Delete(':id')
  @Roles('HOST', 'ADMIN')
  @ApiOperation({ summary: 'Delete member-voucher assignment' })
  remove(@Param('id') id: string) {
    return this.memberVoucherService.remove(id);
  }

  @Post(':id/redeem')
  @Roles('HOST', 'ADMIN', 'STAFF')
  @ApiOperation({ summary: 'Redeem a member voucher' })
  redeem(@Param('id') id: string) {
    return this.memberVoucherService.redeem(id);
  }

  @Post('validate-qr')
  @Roles('HOST', 'ADMIN', 'STAFF')
  @ApiOperation({ summary: 'Validate a member voucher by QR code' })
  validateQr(@Body() body: { qrCode: string }) {
    return this.memberVoucherService.validateByQr(body.qrCode);
  }

  @Post('redeem-qr')
  @Roles('HOST', 'ADMIN', 'STAFF')
  @ApiOperation({ summary: 'Redeem a member voucher by QR code' })
  redeemQr(@Body() body: { qrCode: string }) {
    return this.memberVoucherService.redeemByQr(body.qrCode);
  }
}
