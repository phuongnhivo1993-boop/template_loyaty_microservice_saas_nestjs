import { Controller, Get, Post, Patch, Body, UseGuards, Req } from '@nestjs/common';
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
}
