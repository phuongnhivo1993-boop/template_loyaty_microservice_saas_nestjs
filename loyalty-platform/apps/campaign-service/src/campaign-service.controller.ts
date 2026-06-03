import { Controller, Get, Post, Put, Param, Query, Body } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { CampaignServiceService } from './campaign-service.service';
import { CreateCampaignDto, UpdateCampaignDto, CampaignQueryDto } from './dto/campaign.dto';

@ApiTags('Campaigns')
@Controller('campaigns')
export class CampaignServiceController {
  constructor(private readonly campaignServiceService: CampaignServiceService) {}

  @Get()
  @ApiOperation({ summary: 'List campaigns' })
  findAll(@Query() query: CampaignQueryDto) {
    return this.campaignServiceService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get campaign detail' })
  findOne(@Param('id') id: string) {
    return this.campaignServiceService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create campaign' })
  create(@Body() dto: CreateCampaignDto) {
    return this.campaignServiceService.create(dto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update campaign' })
  update(@Param('id') id: string, @Body() dto: UpdateCampaignDto) {
    return this.campaignServiceService.update(id, dto);
  }

  @Get(':id/performance')
  @ApiOperation({ summary: 'Get campaign performance metrics' })
  getPerformance(@Param('id') id: string) {
    return this.campaignServiceService.getPerformance(id);
  }

  @Post(':id/activate')
  @ApiOperation({ summary: 'Activate a campaign' })
  activate(@Param('id') id: string) {
    return this.campaignServiceService.activate(id);
  }

  @Post(':id/end')
  @ApiOperation({ summary: 'End a campaign' })
  end(@Param('id') id: string) {
    return this.campaignServiceService.end(id);
  }
}
