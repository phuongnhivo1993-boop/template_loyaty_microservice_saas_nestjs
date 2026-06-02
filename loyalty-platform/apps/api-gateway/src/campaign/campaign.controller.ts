import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
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
  @ApiOperation({ summary: 'Create a campaign' })
  create(@Body() body: CreateCampaignDto) {
    return this.campaignService.create(body);
  }

  @Get()
  @ApiOperation({ summary: 'List campaigns (with pagination & sort)' })
  findAll(@Query() query: CampaignQueryDto) {
    return this.campaignService.findAll(query.tenantId, query.page, query.limit, query.status, query.search, query.sort);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get campaign by ID' })
  findOne(@Param('id') id: string) {
    return this.campaignService.findOne(id);
  }

  @Put(':id')
  @Roles('HOST', 'ADMIN')
  @ApiOperation({ summary: 'Update campaign' })
  update(@Param('id') id: string, @Body() body: UpdateCampaignDto) {
    return this.campaignService.update(id, body);
  }

  @Delete(':id')
  @Roles('HOST', 'ADMIN')
  @ApiOperation({ summary: 'Delete campaign' })
  remove(@Param('id') id: string) {
    return this.campaignService.remove(id);
  }
}
