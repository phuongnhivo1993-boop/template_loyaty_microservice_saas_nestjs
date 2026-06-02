import { Controller, Get, Put, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { SettingsService } from './settings.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('Settings')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('settings')
export class SettingsController {
  constructor(private settingsService: SettingsService) {}

  @Get('tenant/:tenantId')
  @ApiOperation({ summary: 'Get tenant settings' })
  getTenantSettings(@Param('tenantId') tenantId: string) {
    return this.settingsService.getTenantSettings(tenantId);
  }

  @Put('tenant/:tenantId')
  @ApiOperation({ summary: 'Update tenant settings' })
  updateTenantSettings(
    @Param('tenantId') tenantId: string,
    @Body() body: Record<string, any>,
  ) {
    return this.settingsService.updateTenantSettings(tenantId, body);
  }

  @Get('platform')
  @ApiOperation({ summary: 'Get platform-wide settings' })
  getPlatformSettings() {
    return this.settingsService.getPlatformSettings();
  }

  @Put('platform')
  @ApiOperation({ summary: 'Update platform-wide settings' })
  updatePlatformSettings(@Body() body: Record<string, any>) {
    return this.settingsService.updatePlatformSettings(body);
  }
}
