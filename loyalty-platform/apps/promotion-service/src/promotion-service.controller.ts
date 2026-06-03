import { Controller, Get, Post, Body, Param, Patch, Delete, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { PromotionServiceService } from './promotion-service.service';
import { CreatePromotionDto, UpdatePromotionDto } from './dto';

@ApiTags('Promotions')
@ApiBearerAuth()
@Controller('promotions')
export class PromotionServiceController {
  constructor(private readonly promotionServiceService: PromotionServiceService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new promotion rule' })
  create(@Body() dto: CreatePromotionDto) {
    return this.promotionServiceService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'List all promotions' })
  @ApiQuery({ name: 'tenantId', required: false })
  findAll(@Query('tenantId') tenantId?: string) {
    return this.promotionServiceService.findAll(tenantId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get promotion by ID' })
  findOne(@Param('id') id: string) {
    return this.promotionServiceService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a promotion rule' })
  update(@Param('id') id: string, @Body() dto: UpdatePromotionDto) {
    return this.promotionServiceService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a promotion rule' })
  remove(@Param('id') id: string) {
    return this.promotionServiceService.remove(id);
  }
}
