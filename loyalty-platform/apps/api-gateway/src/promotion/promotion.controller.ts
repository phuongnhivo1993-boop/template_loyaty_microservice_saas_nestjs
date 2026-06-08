import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiBody, ApiParam, ApiQuery, ApiResponse } from '@nestjs/swagger';
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
  @ApiBody({ type: CreatePromotionDto })
  @ApiOperation({ summary: 'Create a promotion rule' })
  @ApiResponse({ status: 201, description: 'Promotion created' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  create(@Req() req: any, @Body() body: CreatePromotionDto) {
    return this.promotionService.create({ ...body, tenantId: req.tenantId });
  }

  @Get()
  @Roles('HOST', 'ADMIN', 'STAFF')
  @ApiOperation({ summary: 'List promotion rules (with pagination & sort)' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'search', required: false, type: String })
  @ApiQuery({ name: 'sort', required: false, type: String })
  @ApiQuery({ name: 'status', required: false, type: String })
  @ApiQuery({ name: 'tenantId', required: false, type: String })
  @ApiResponse({ status: 200, description: 'List of promotions' })
  findAll(@Req() req: any, @Query() query: PromotionQueryDto) {
    return this.promotionService.findAll(req.tenantId, query.page, query.limit, query.search, query.sort, query.status);
  }

  @Get(':id')
  @Roles('HOST', 'ADMIN', 'STAFF')
  @ApiParam({ name: 'id', type: String, description: 'Promotion ID' })
  @ApiOperation({ summary: 'Get promotion rule' })
  @ApiResponse({ status: 200, description: 'Promotion found' })
  @ApiResponse({ status: 404, description: 'Promotion not found' })
  findOne(@Req() req: any, @Param('id') id: string) {
    return this.promotionService.findOne(id, req.tenantId);
  }

  @Put(':id')
  @Roles('HOST', 'ADMIN')
  @ApiParam({ name: 'id', type: String, description: 'Promotion ID' })
  @ApiBody({ type: UpdatePromotionDto })
  @ApiOperation({ summary: 'Update promotion rule' })
  @ApiResponse({ status: 200, description: 'Promotion updated' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Promotion not found' })
  update(@Req() req: any, @Param('id') id: string, @Body() body: UpdatePromotionDto) {
    return this.promotionService.update(id, body, req.tenantId);
  }

  @Delete(':id')
  @Roles('HOST', 'ADMIN')
  @ApiParam({ name: 'id', type: String, description: 'Promotion ID' })
  @ApiOperation({ summary: 'Delete promotion rule' })
  @ApiResponse({ status: 200, description: 'Promotion deleted' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Promotion not found' })
  remove(@Req() req: any, @Param('id') id: string) {
    return this.promotionService.remove(id, req.tenantId);
  }
}
