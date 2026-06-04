import {
  Controller, Post, Body, HttpCode, HttpStatus, UseGuards, Request, Headers,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiBody, ApiResponse } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
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
  @ApiBody({ type: RegisterHostDto })
  @ApiOperation({ summary: 'Register a new host (super admin)' })
  @ApiResponse({ status: 201, description: 'Host registered successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  registerHost(@Body() body: RegisterHostDto) {
    return this.authService.registerHost(body.email, body.password, body.name);
  }

  @Post('host/login')
  @SkipTenantCheck()
  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @HttpCode(HttpStatus.OK)
  @ApiBody({ type: LoginDto })
  @ApiOperation({ summary: 'Login as host' })
  @ApiResponse({ status: 200, description: 'Login successful' })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  loginHost(@Body() body: LoginDto, @Headers('x-forwarded-for') ip?: string) {
    return this.authService.loginHost(body.email, body.password, ip);
  }

  @Post('tenant/login')
  @SkipTenantCheck()
  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @HttpCode(HttpStatus.OK)
  @ApiBody({ schema: { allOf: [{ $ref: '#/components/schemas/LoginDto' }, { type: 'object', properties: { tenantId: { type: 'string' } } }] } })
  @ApiOperation({ summary: 'Login as tenant admin/user' })
  @ApiResponse({ status: 200, description: 'Login successful' })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  loginTenant(
    @Body() body: LoginDto & { tenantId?: string },
    @Headers('x-forwarded-for') ip?: string,
  ) {
    return this.authService.loginTenant(body.email, body.password, body.tenantId, ip);
  }

  @Post('member/login')
  @SkipTenantCheck()
  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @HttpCode(HttpStatus.OK)
  @ApiBody({ type: LoginDto })
  @ApiOperation({ summary: 'Login as member' })
  @ApiResponse({ status: 200, description: 'Login successful' })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  loginMember(@Body() body: LoginDto, @Headers('x-forwarded-for') ip?: string) {
    return this.authService.loginMember(body.email, body.password, ip);
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Logout - blacklist access token' })
  @ApiResponse({ status: 200, description: 'Logged out successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
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
  @ApiBody({ schema: { type: 'object', properties: { refreshToken: { type: 'string' } } } })
  @ApiOperation({ summary: 'Refresh access token' })
  @ApiResponse({ status: 200, description: 'Token refreshed' })
  @ApiResponse({ status: 401, description: 'Invalid refresh token' })
  refresh(@Body() body: { refreshToken: string }) {
    return this.authService.refreshToken(body.refreshToken);
  }

  @Post('change-password')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiBody({ schema: { type: 'object', properties: { oldPassword: { type: 'string' }, newPassword: { type: 'string' } } } })
  @ApiOperation({ summary: 'Change password for authenticated user' })
  @ApiResponse({ status: 201, description: 'Password changed' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async changePassword(
    @Request() req: any,
    @Body() body: { oldPassword: string; newPassword: string },
  ) {
    return this.authService.changePassword(req.user, body.oldPassword, body.newPassword);
  }

  @Post('forgot-password')
  @SkipTenantCheck()
  @Throttle({ default: { limit: 3, ttl: 60000 } })
  @HttpCode(HttpStatus.OK)
  @ApiBody({ schema: { type: 'object', properties: { email: { type: 'string' } } } })
  @ApiOperation({ summary: 'Request password reset (sends email with reset token)' })
  @ApiResponse({ status: 200, description: 'Reset email sent' })
  @ApiResponse({ status: 400, description: 'Email not found' })
  forgotPassword(@Body() body: { email: string }) {
    return this.authService.forgotPassword(body.email);
  }

  @Post('reset-password')
  @SkipTenantCheck()
  @Throttle({ default: { limit: 3, ttl: 60000 } })
  @ApiBody({ schema: { type: 'object', properties: { token: { type: 'string' }, newPassword: { type: 'string' } } } })
  @ApiOperation({ summary: 'Reset password using reset token' })
  @ApiResponse({ status: 201, description: 'Password reset successfully' })
  @ApiResponse({ status: 400, description: 'Invalid or expired token' })
  resetPassword(@Body() body: { token: string; newPassword: string }) {
    return this.authService.resetPassword(body.token, body.newPassword);
  }
}
