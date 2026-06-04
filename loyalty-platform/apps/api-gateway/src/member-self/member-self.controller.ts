import { Controller, Get, Post, Patch, Body, UseGuards, Req, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { MemberSelfService } from './member-self.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('Member Self-Service')
@Controller('me')
export class MemberSelfController {
  constructor(private memberSelfService: MemberSelfService) {}

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get own member profile' })
  getProfile(@Req() req: any) {
    return this.memberSelfService.getProfile(req.user.id);
  }

  @Get('wallet')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get own wallet (points + transactions)' })
  getWallet(@Req() req: any) {
    return this.memberSelfService.getWallet(req.user.id);
  }

  @Post('set-password')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Set initial password' })
  setPassword(@Req() req: any, @Body() body: { password: string }) {
    return this.memberSelfService.setPassword(req.user.id, body.password);
  }

  @Post('change-password')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Change own password' })
  changePassword(
    @Req() req: any,
    @Body() body: { oldPassword: string; newPassword: string },
  ) {
    return this.memberSelfService.changePassword(
      req.user.id,
      body.oldPassword,
      body.newPassword,
    );
  }

  @Get('badges')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get own badges' })
  getBadges(@Req() req: any) {
    return this.memberSelfService.getBadges(req.user.id);
  }

  @Get('referrals')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get own referral links and stats' })
  getReferrals(@Req() req: any) {
    return this.memberSelfService.getReferrals(req.user.id);
  }

  @Get('vouchers')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get own vouchers' })
  getVouchers(@Req() req: any) {
    return this.memberSelfService.getVouchers(req.user.id);
  }

  @Get('missions')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get own missions' })
  getMissions(@Req() req: any) {
    return this.memberSelfService.getMissions(req.user.id);
  }

  @Get('notifications')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get own notifications' })
  getNotifications(@Req() req: any) {
    return this.memberSelfService.getNotifications(req.user.id);
  }

  @Patch('profile')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update own profile' })
  updateProfile(@Req() req: any, @Body() body: { fullName?: string; phone?: string }) {
    return this.memberSelfService.updateProfile(req.user.id, body);
  }

  @Post('cart-redeem')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Redeem multiple rewards in one cart' })
  cartRedeem(@Req() req: any, @Body() body: { items: { rewardId: string; quantity: number }[] }) {
    return this.memberSelfService.cartRedeem(req.user.id, body.items);
  }

  @Get('transactions')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get own point transactions (paginated, filterable)' })
  getTransactions(
    @Req() req: any,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('type') type?: string,
  ) {
    return this.memberSelfService.getTransactions(req.user.id, page || 1, limit || 50, type);
  }

  @Get('cashback')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get own cashback balance and transactions' })
  getCashback(@Req() req: any) {
    return this.memberSelfService.getCashback(req.user.id);
  }

  @Get('gift-cards')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get own gift cards' })
  getGiftCards(@Req() req: any) {
    return this.memberSelfService.getGiftCards(req.user.id);
  }

  @Get('tier-progress')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get tier progress (current tier, next tier, points to next)' })
  getTierProgress(@Req() req: any) {
    return this.memberSelfService.getTierProgress(req.user.id);
  }

  @Get('stores')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get nearby stores / store list' })
  getStores(@Req() req: any) {
    return this.memberSelfService.getStores(req.user.id);
  }

  @Post('feedback')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Submit feedback/review' })
  createFeedback(@Req() req: any, @Body() body: { entityType: string; entityId: string; rating: number; content?: string }) {
    return this.memberSelfService.createFeedback(req.user.id, body);
  }

  @Get('orders')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get own orders' })
  getOrders(
    @Req() req: any,
    @Query('status') status?: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.memberSelfService.getOrders(req.user.id, status, page || 1, limit || 20);
  }

  @Get('feedback')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get own feedback history' })
  getFeedback(@Req() req: any) {
    return this.memberSelfService.getFeedback(req.user.id);
  }
}
