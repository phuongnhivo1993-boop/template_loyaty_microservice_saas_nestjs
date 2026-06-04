import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { WebhookService } from './webhook.service';
import { CreateWebhookEndpointDto, UpdateWebhookEndpointDto } from './dto/webhook.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';

@ApiTags('Webhooks')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('webhooks')
export class WebhookController {
  constructor(private webhookService: WebhookService) {}

  @Post('endpoints')
  @Roles('HOST', 'ADMIN')
  @ApiOperation({ summary: 'Create webhook endpoint' })
  createEndpoint(@Body() dto: CreateWebhookEndpointDto) {
    return this.webhookService.createEndpoint(dto);
  }

  @Get('endpoints')
  @Roles('HOST', 'ADMIN', 'STAFF')
  @ApiOperation({ summary: 'List webhook endpoints' })
  listEndpoints(@Query() query: any) {
    return this.webhookService.listEndpoints(query.tenantId);
  }

  @Get('endpoints/:id')
  @Roles('HOST', 'ADMIN', 'STAFF')
  @ApiOperation({ summary: 'Get webhook endpoint' })
  getEndpoint(@Param('id') id: string) {
    return this.webhookService.getEndpoint(id);
  }

  @Put('endpoints/:id')
  @Roles('HOST', 'ADMIN')
  @ApiOperation({ summary: 'Update webhook endpoint' })
  updateEndpoint(@Param('id') id: string, @Body() dto: UpdateWebhookEndpointDto) {
    return this.webhookService.updateEndpoint(id, dto);
  }

  @Delete('endpoints/:id')
  @Roles('HOST', 'ADMIN')
  @ApiOperation({ summary: 'Delete webhook endpoint' })
  deleteEndpoint(@Param('id') id: string) {
    return this.webhookService.deleteEndpoint(id);
  }

  @Post('endpoints/:id/test')
  @Roles('HOST', 'ADMIN')
  @ApiOperation({ summary: 'Test webhook endpoint' })
  testEndpoint(@Param('id') id: string) {
    return this.webhookService.testEndpoint(id);
  }

  @Get('logs')
  @Roles('HOST', 'ADMIN', 'STAFF')
  @ApiOperation({ summary: 'List webhook event logs' })
  listLogs(@Query() query: any) {
    return this.webhookService.listLogs(query.endpointId, query.page, query.limit);
  }

  @Get('logs/:id')
  @Roles('HOST', 'ADMIN', 'STAFF')
  @ApiOperation({ summary: 'Get webhook event log' })
  getLog(@Param('id') id: string) {
    return this.webhookService.getLog(id);
  }
}
