import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { PromotionService } from './promotion.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { CreatePromotionDto, UpdatePromotionDto, PromotionQueryDto } from './dto/create-promotion.dto';

@ApiTags('Promotions')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('promotions')
export class PromotionController {
  constructor(private promotionService: PromotionService) {}

  @Post()
  @Roles('HOST', 'ADMIN')
  @ApiOperation({ summary: 'Create a promotion rule' })
  create(@Req() req: any, @Body() body: CreatePromotionDto) {
    return this.promotionService.create({ ...body, tenantId: req.tenantId ?? body.tenantId });
  }

  @Get()
  @ApiOperation({ summary: 'List promotion rules (with pagination & sort)' })
  findAll(@Req() req: any, @Query() query: PromotionQueryDto) {
    return this.promotionService.findAll(req.tenantId ?? query.tenantId, query.page, query.limit, query.search, query.sort, query.status);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get promotion rule' })
  findOne(@Param('id') id: string) {
    return this.promotionService.findOne(id);
  }

  @Put(':id')
  @Roles('HOST', 'ADMIN')
  @ApiOperation({ summary: 'Update promotion rule' })
  update(@Param('id') id: string, @Body() body: UpdatePromotionDto) {
    return this.promotionService.update(id, body);
  }

  @Delete(':id')
  @Roles('HOST', 'ADMIN')
  @ApiOperation({ summary: 'Delete promotion rule' })
  remove(@Param('id') id: string) {
    return this.promotionService.remove(id);
  }
}
