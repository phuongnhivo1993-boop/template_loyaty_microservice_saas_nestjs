import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { CampaignService } from './campaign.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('Campaigns')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('campaigns')
export class CampaignController {
  constructor(private campaignService: CampaignService) {}

  @Post()
  @ApiOperation({ summary: 'Create a campaign' })
  create(@Body() body: { name: string; description?: string; startDate: string; endDate: string; budget?: number; tenantId: string }) {
    return this.campaignService.create(body);
  }

  @Get()
  @ApiOperation({ summary: 'List campaigns (with pagination & sort)' })
  findAll(
    @Query('tenantId') tenantId?: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('status') status?: string,
    @Query('search') search?: string,
    @Query('sort') sort?: string,
  ) {
    return this.campaignService.findAll(tenantId, page, limit, status, search, sort);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get campaign by ID' })
  findOne(@Param('id') id: string) {
    return this.campaignService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update campaign' })
  update(@Param('id') id: string, @Body() body: { name?: string; description?: string; status?: string; budget?: number }) {
    return this.campaignService.update(id, body);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete campaign' })
  remove(@Param('id') id: string) {
    return this.campaignService.remove(id);
  }
}
