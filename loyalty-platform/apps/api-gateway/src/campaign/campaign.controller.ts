import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiBody, ApiParam, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { CampaignService } from './campaign.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { CreateCampaignDto, UpdateCampaignDto, CampaignQueryDto } from './dto/create-campaign.dto';

@ApiTags('Campaigns')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('campaigns')
export class CampaignController {
  constructor(private campaignService: CampaignService) {}

  @Post()
  @Roles('HOST', 'ADMIN')
  @ApiBody({ type: CreateCampaignDto })
  @ApiOperation({ summary: 'Create a campaign' })
  @ApiResponse({ status: 201, description: 'Campaign created' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  create(@Req() req: any, @Body() body: CreateCampaignDto) {
    return this.campaignService.create({ ...body, tenantId: req.tenantId });
  }

  @Get()
  @Roles('HOST', 'ADMIN', 'STAFF')
  @ApiOperation({ summary: 'List campaigns (with pagination & sort)' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'search', required: false, type: String })
  @ApiQuery({ name: 'status', required: false, type: String })
  @ApiQuery({ name: 'sort', required: false, type: String })
  @ApiQuery({ name: 'tenantId', required: false, type: String })
  @ApiResponse({ status: 200, description: 'List of campaigns' })
  findAll(@Req() req: any, @Query() query: CampaignQueryDto) {
    return this.campaignService.findAll(req.tenantId, query.page, query.limit, query.status, query.search, query.sort);
  }

  @Get(':id')
  @Roles('HOST', 'ADMIN', 'STAFF')
  @ApiParam({ name: 'id', type: String, description: 'Campaign ID' })
  @ApiOperation({ summary: 'Get campaign by ID' })
  @ApiResponse({ status: 200, description: 'Campaign found' })
  @ApiResponse({ status: 404, description: 'Campaign not found' })
  findOne(@Req() req: any, @Param('id') id: string) {
    return this.campaignService.findOne(id, req.tenantId);
  }

  @Put(':id')
  @Roles('HOST', 'ADMIN')
  @ApiParam({ name: 'id', type: String, description: 'Campaign ID' })
  @ApiBody({ type: UpdateCampaignDto })
  @ApiOperation({ summary: 'Update campaign' })
  @ApiResponse({ status: 200, description: 'Campaign updated' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Campaign not found' })
  update(@Req() req: any, @Param('id') id: string, @Body() body: UpdateCampaignDto) {
    return this.campaignService.update(id, body, req.tenantId);
  }

  @Post(':id/duplicate')
  @Roles('HOST', 'ADMIN')
  @ApiParam({ name: 'id', type: String, description: 'Campaign ID' })
  @ApiOperation({ summary: 'Duplicate a campaign' })
  @ApiResponse({ status: 201, description: 'Campaign duplicated' })
  @ApiResponse({ status: 404, description: 'Campaign not found' })
  duplicate(@Req() req: any, @Param('id') id: string) {
    return this.campaignService.duplicate(id, req.tenantId);
  }

  @Delete(':id')
  @Roles('HOST', 'ADMIN')
  @ApiParam({ name: 'id', type: String, description: 'Campaign ID' })
  @ApiOperation({ summary: 'Delete campaign' })
  @ApiResponse({ status: 200, description: 'Campaign deleted' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Campaign not found' })
  remove(@Req() req: any, @Param('id') id: string) {
    return this.campaignService.remove(id, req.tenantId);
  }

  @Get(':id/performance')
  @Roles('HOST', 'ADMIN', 'STAFF')
  @ApiParam({ name: 'id', type: String, description: 'Campaign ID' })
  @ApiOperation({ summary: 'Get campaign performance metrics' })
  @ApiResponse({ status: 200, description: 'Campaign performance data' })
  @ApiResponse({ status: 404, description: 'Campaign not found' })
  getPerformance(@Req() req: any, @Param('id') id: string) {
    return this.campaignService.getPerformance(id, req.tenantId);
  }
}
