import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { AuthService } from './auth.service';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('host/register')
  @ApiOperation({ summary: 'Register a new host (super admin)' })
  registerHost(@Body() body: { email: string; password: string; name: string }) {
    return this.authService.registerHost(body.email, body.password, body.name);
  }

  @Post('host/login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login as host' })
  loginHost(@Body() body: { email: string; password: string }) {
    return this.authService.loginHost(body.email, body.password);
  }

  @Post('tenant/login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login as tenant admin/user' })
  loginTenant(@Body() body: { email: string; password: string; tenantId?: string }) {
    return this.authService.loginTenant(body.email, body.password, body.tenantId);
  }
}
