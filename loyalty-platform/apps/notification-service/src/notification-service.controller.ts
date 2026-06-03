import { Controller, Get, Post, Put, Delete, Param, Body, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { NotificationServiceService } from './notification-service.service';
import { CreateNotificationTemplateDto, UpdateNotificationTemplateDto } from './dto/template.dto';
import { SendNotificationDto, BroadcastDto, NotificationLogQueryDto } from './dto/send.dto';

@ApiTags('Notifications')
@ApiBearerAuth()
@Controller('notifications')
export class NotificationServiceController {
  constructor(private readonly service: NotificationServiceService) {}

  @Post('templates')
  @ApiOperation({ summary: 'Create a notification template' })
  createTemplate(@Body() dto: CreateNotificationTemplateDto) {
    return this.service.createTemplate(dto);
  }

  @Get('templates')
  @ApiOperation({ summary: 'List notification templates' })
  listTemplates(@Query('tenantId') tenantId: string, @Query('page') page?: number, @Query('limit') limit?: number) {
    return this.service.listTemplates(tenantId, page, limit);
  }

  @Get('templates/:id')
  @ApiOperation({ summary: 'Get template by id' })
  getTemplate(@Param('id') id: string) {
    return this.service.getTemplate(id);
  }

  @Put('templates/:id')
  @ApiOperation({ summary: 'Update a notification template' })
  updateTemplate(@Param('id') id: string, @Body() dto: UpdateNotificationTemplateDto) {
    return this.service.updateTemplate(id, dto);
  }

  @Delete('templates/:id')
  @ApiOperation({ summary: 'Delete a notification template' })
  deleteTemplate(@Param('id') id: string) {
    return this.service.deleteTemplate(id);
  }

  @Post('send')
  @ApiOperation({ summary: 'Send a notification' })
  send(@Body() dto: SendNotificationDto) {
    return this.service.send(dto);
  }

  @Post('broadcast')
  @ApiOperation({ summary: 'Broadcast to all active members' })
  broadcast(@Body() dto: BroadcastDto) {
    return this.service.broadcast(dto);
  }

  @Get('logs')
  @ApiOperation({ summary: 'List notification logs' })
  getLogs(@Query() query: NotificationLogQueryDto) {
    return this.service.getLogs(query.tenantId, query.status, query.channel, query.page, query.limit);
  }
}
