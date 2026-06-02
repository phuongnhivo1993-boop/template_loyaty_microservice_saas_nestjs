import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { NotificationService } from './notification.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { CreateNotificationTemplateDto, SendNotificationDto, BroadcastNotificationDto } from '../common/dto/common.dto';

@ApiTags('Notifications')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('notifications')
export class NotificationController {
  constructor(private notificationService: NotificationService) {}

  @Post('templates')
  @Roles('HOST', 'ADMIN')
  @ApiOperation({ summary: 'Create a notification template' })
  createTemplate(@Body() body: CreateNotificationTemplateDto) {
    return this.notificationService.createTemplate(body);
  }

  @Get('templates')
  @ApiOperation({ summary: 'List notification templates' })
  listTemplates(@Query('tenantId') tenantId?: string, @Query('page') page?: number, @Query('limit') limit?: number, @Query('search') search?: string, @Query('sort') sort?: string) {
    return this.notificationService.listTemplates(tenantId, page, limit, search, sort);
  }

  @Get('templates/:id')
  @ApiOperation({ summary: 'Get notification template by ID' })
  findTemplateOne(@Param('id') id: string) {
    return this.notificationService.findTemplateOne(id);
  }

  @Put('templates/:id')
  @Roles('HOST', 'ADMIN')
  @ApiOperation({ summary: 'Update notification template' })
  updateTemplate(@Param('id') id: string, @Body() body: Partial<CreateNotificationTemplateDto>) {
    return this.notificationService.updateTemplate(id, body);
  }

  @Delete('templates/:id')
  @Roles('HOST', 'ADMIN')
  @ApiOperation({ summary: 'Delete notification template' })
  deleteTemplate(@Param('id') id: string) {
    return this.notificationService.deleteTemplate(id);
  }

  @Post('send')
  @Roles('HOST', 'ADMIN', 'STAFF')
  @ApiOperation({ summary: 'Send a notification (email/SMS)' })
  send(@Body() body: SendNotificationDto) {
    return this.notificationService.send(body);
  }

  @Post('broadcast')
  @Roles('HOST', 'ADMIN')
  @ApiOperation({ summary: 'Broadcast notification to all active members of a tenant' })
  broadcast(@Body() body: BroadcastNotificationDto) {
    return this.notificationService.broadcast(body);
  }

  @Get('logs')
  @ApiOperation({ summary: 'List notification logs' })
  listLogs(@Query('tenantId') tenantId?: string, @Query('page') page?: number, @Query('limit') limit?: number, @Query('search') search?: string, @Query('sort') sort?: string) {
    return this.notificationService.listLogs(tenantId, page, limit, search, sort);
  }

  @Get('logs/:id')
  @ApiOperation({ summary: 'Get notification log by ID' })
  findLogOne(@Param('id') id: string) {
    return this.notificationService.findLogOne(id);
  }
}
