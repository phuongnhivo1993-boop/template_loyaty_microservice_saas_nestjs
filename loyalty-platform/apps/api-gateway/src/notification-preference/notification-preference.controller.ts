import { Controller, Get, Put, Body, Req, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { NotificationPreferenceService } from './notification-preference.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { NotificationPreferencesDto } from './dto/notification-preference.dto';

@ApiTags('Notification Preferences')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('me/notification-preferences')
export class NotificationPreferenceController {
  constructor(private service: NotificationPreferenceService) {}

  @Get()
  @Roles('MEMBER')
  @ApiOperation({ summary: 'Get member notification preferences' })
  get(@Req() req: any) {
    const memberId = req.user?.memberId ?? req.user?.id;
    return this.service.get(req.tenantId, memberId);
  }

  @Put()
  @Roles('MEMBER')
  @ApiOperation({ summary: 'Update member notification preferences' })
  update(@Req() req: any, @Body() body: NotificationPreferencesDto) {
    const memberId = req.user?.memberId ?? req.user?.id;
    return this.service.update(req.tenantId, memberId, body);
  }
}
