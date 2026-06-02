import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { NotificationService } from './notification.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateNotificationTemplateDto, SendNotificationDto } from '../common/dto/common.dto';

@ApiTags('Notifications')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('notifications')
export class NotificationController {
  constructor(private notificationService: NotificationService) {}

  @Post('templates')
  @ApiOperation({ summary: 'Create a notification template' })
  createTemplate(@Body() body: CreateNotificationTemplateDto) {
    return this.notificationService.createTemplate(body);
  }

  @Get('templates')
  @ApiOperation({ summary: 'List notification templates' })
  listTemplates(@Query('tenantId') tenantId?: string, @Query('page') page?: number, @Query('limit') limit?: number, @Query('search') search?: string, @Query('sort') sort?: string) {
    return this.notificationService.listTemplates(tenantId, page, limit, search, sort);
  }

  @Put('templates/:id')
  @ApiOperation({ summary: 'Update notification template' })
  updateTemplate(@Param('id') id: string, @Body() body: Partial<CreateNotificationTemplateDto>) {
    return this.notificationService.updateTemplate(id, body);
  }

  @Delete('templates/:id')
  @ApiOperation({ summary: 'Delete notification template' })
  deleteTemplate(@Param('id') id: string) {
    return this.notificationService.deleteTemplate(id);
  }

  @Post('send')
  @ApiOperation({ summary: 'Send a notification (email/SMS)' })
  send(@Body() body: SendNotificationDto) {
    return this.notificationService.send(body);
  }

  @Get('logs')
  @ApiOperation({ summary: 'List notification logs' })
  listLogs(@Query('tenantId') tenantId?: string, @Query('page') page?: number, @Query('limit') limit?: number, @Query('search') search?: string, @Query('sort') sort?: string) {
    return this.notificationService.listLogs(tenantId, page, limit, search, sort);
  }
}
