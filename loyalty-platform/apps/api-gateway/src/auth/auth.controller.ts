import {
  Controller, Post, Body, HttpCode, HttpStatus, UseGuards, Request, Headers,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { SkipTenantCheck } from './skip-tenant.decorator';
import { LoginDto, RegisterHostDto } from '../common/dto/common.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('host/register')
  @SkipTenantCheck()
  @ApiOperation({ summary: 'Register a new host (super admin)' })
  registerHost(@Body() body: RegisterHostDto) {
    return this.authService.registerHost(body.email, body.password, body.name);
  }

  @Post('host/login')
  @SkipTenantCheck()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login as host' })
  loginHost(@Body() body: LoginDto, @Headers('x-forwarded-for') ip?: string) {
    return this.authService.loginHost(body.email, body.password, ip);
  }

  @Post('tenant/login')
  @SkipTenantCheck()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login as tenant admin/user' })
  loginTenant(
    @Body() body: LoginDto & { tenantId?: string },
    @Headers('x-forwarded-for') ip?: string,
  ) {
    return this.authService.loginTenant(body.email, body.password, body.tenantId, ip);
  }

  @Post('member/login')
  @SkipTenantCheck()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login as member' })
  loginMember(@Body() body: LoginDto, @Headers('x-forwarded-for') ip?: string) {
    return this.authService.loginMember(body.email, body.password, ip);
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Logout - blacklist access token' })
  async logout(
    @Request() req: any,
    @Headers('authorization') authHeader?: string,
  ) {
    const token = authHeader?.replace('Bearer ', '');
    await this.authService.logout(req.user, token || '');
    return { message: 'Logged out successfully' };
  }

  @Post('refresh')
  @SkipTenantCheck()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Refresh access token' })
  refresh(@Body() body: { refreshToken: string }) {
    return this.authService.refreshToken(body.refreshToken);
  }

  @Post('change-password')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Change password for authenticated user' })
  async changePassword(
    @Request() req: any,
    @Body() body: { oldPassword: string; newPassword: string },
  ) {
    return this.authService.changePassword(req.user, body.oldPassword, body.newPassword);
  }

  @Post('forgot-password')
  @SkipTenantCheck()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Request password reset (sends email with reset token)' })
  forgotPassword(@Body() body: { email: string }) {
    return this.authService.forgotPassword(body.email);
  }

  @Post('reset-password')
  @SkipTenantCheck()
  @ApiOperation({ summary: 'Reset password using reset token' })
  resetPassword(@Body() body: { token: string; newPassword: string }) {
    return this.authService.resetPassword(body.token, body.newPassword);
  }
}
