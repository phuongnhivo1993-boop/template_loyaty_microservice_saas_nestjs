import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { FeedbackService } from './feedback.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';

@ApiTags('Feedback')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('feedback')
export class FeedbackController {
  constructor(private feedbackService: FeedbackService) {}

  @Post()
  @Roles('MEMBER')
  @ApiOperation({ summary: 'Create feedback/review' })
  create(@Body() body: any) {
    return this.feedbackService.create(body);
  }

  @Get()
  @Roles('HOST', 'ADMIN', 'STAFF')
  @ApiOperation({ summary: 'List feedback (admin)' })
  findAll(@Query() query: any) {
    return this.feedbackService.findAll(query.tenantId, query.page, query.limit, query.entityType, query.entityId, query.rating, query.status, query.sort);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get feedback by ID' })
  findOne(@Param('id') id: string) {
    return this.feedbackService.findOne(id);
  }

  @Put(':id')
  @Roles('HOST', 'ADMIN')
  @ApiOperation({ summary: 'Update feedback status' })
  update(@Param('id') id: string, @Body() body: any) {
    return this.feedbackService.update(id, body);
  }

  @Delete(':id')
  @Roles('HOST', 'ADMIN')
  @ApiOperation({ summary: 'Delete feedback' })
  remove(@Param('id') id: string) {
    return this.feedbackService.remove(id);
  }

  @Get('public/:entityType/:entityId')
  @ApiOperation({ summary: 'Get public feedback for entity' })
  getPublic(@Param('entityType') entityType: string, @Param('entityId') entityId: string) {
    return this.feedbackService.getPublic(entityType, entityId);
  }
}
