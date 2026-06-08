import { Controller, Get, Post, Put, Patch, Delete, Body, Param, Query, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ProductService } from './product.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { CreateProductDto, UpdateProductDto, ProductQueryDto, BulkStatusDto, BulkIdsDto } from './dto/product.dto';

@ApiTags('Products')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('products')
export class ProductController {
  constructor(private productService: ProductService) {}

  @Post()
  @Roles('HOST', 'ADMIN')
  @ApiOperation({ summary: 'Create a product' })
  create(@Req() req: any, @Body() body: CreateProductDto) {
    return this.productService.create({ ...body, tenantId: req.tenantId });
  }

  @Get()
  @Roles('HOST', 'ADMIN', 'STAFF')
  @ApiOperation({ summary: 'List products (with pagination & filter)' })
  findAll(@Req() req: any, @Query() query: ProductQueryDto) {
    return this.productService.findAll(
      req.tenantId,
      query.page, query.limit, query.search,
      query.categoryId, query.status, query.sort,
      query.priceMin, query.priceMax, query.stockStatus,
    );
  }

  @Get('low-stock')
  @Roles('HOST', 'ADMIN', 'STAFF')
  @ApiOperation({ summary: 'Get products with low stock (≤ threshold)' })
  lowStock(@Req() req: any, @Query('threshold') threshold?: number) {
    return this.productService.lowStock(req.tenantId, threshold || 10);
  }

  @Post('bulk/delete')
  @Roles('HOST', 'ADMIN')
  @ApiOperation({ summary: 'Bulk soft delete products' })
  bulkDelete(@Req() req: any, @Body() body: BulkIdsDto) {
    return this.productService.bulkDelete(body.ids, req.tenantId);
  }

  @Post('bulk/status')
  @Roles('HOST', 'ADMIN')
  @ApiOperation({ summary: 'Bulk update product status' })
  bulkStatus(@Req() req: any, @Body() body: BulkStatusDto) {
    return this.productService.bulkStatus(body.ids, body.status, req.tenantId);
  }

  @Get(':id')
  @Roles('HOST', 'ADMIN', 'STAFF')
  @ApiOperation({ summary: 'Get product by ID' })
  findOne(@Req() req: any, @Param('id') id: string) {
    return this.productService.findOne(id, req.tenantId);
  }

  @Put(':id')
  @Roles('HOST', 'ADMIN')
  @ApiOperation({ summary: 'Update product' })
  update(@Req() req: any, @Param('id') id: string, @Body() body: UpdateProductDto) {
    return this.productService.update(id, body, req.tenantId);
  }

  @Patch(':id/restore')
  @Roles('HOST', 'ADMIN')
  @ApiOperation({ summary: 'Restore a soft-deleted product' })
  restore(@Req() req: any, @Param('id') id: string) {
    return this.productService.restore(id, req.tenantId);
  }

  @Delete(':id')
  @Roles('HOST', 'ADMIN')
  @ApiOperation({ summary: 'Soft delete product' })
  remove(@Req() req: any, @Param('id') id: string) {
    return this.productService.softRemove(id, req.tenantId);
  }
}
