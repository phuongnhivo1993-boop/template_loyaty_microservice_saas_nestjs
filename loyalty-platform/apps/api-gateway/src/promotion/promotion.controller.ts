import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { PromotionService } from './promotion.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('Promotions')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('promotions')
export class PromotionController {
  constructor(private promotionService: PromotionService) {}

  @Post()
  @ApiOperation({ summary: 'Create a promotion rule' })
  create(@Body() body: { name: string; description?: string; priority?: number; conditions?: any; actions?: any; tenantId: string }) {
    return this.promotionService.create(body);
  }

  @Get()
  @ApiOperation({ summary: 'List promotion rules (with pagination)' })
  findAll(
    @Query('tenantId') tenantId?: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('search') search?: string,
  ) {
    return this.promotionService.findAll(tenantId, page, limit, search);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get promotion rule' })
  findOne(@Param('id') id: string) {
    return this.promotionService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update promotion rule' })
  update(@Param('id') id: string, @Body() body: { name?: string; description?: string; priority?: number; status?: string; conditions?: any; actions?: any }) {
    return this.promotionService.update(id, body);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete promotion rule' })
  remove(@Param('id') id: string) {
    return this.promotionService.remove(id);
  }
}
