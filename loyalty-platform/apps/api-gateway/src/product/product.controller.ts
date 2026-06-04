import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards, Req } from '@nestjs/common';
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
    return this.productService.create({ ...body, tenantId: req.tenantId ?? body.tenantId });
  }

  @Get()
  @ApiOperation({ summary: 'List products (with pagination & filter)' })
  findAll(@Req() req: any, @Query() query: ProductQueryDto) {
    return this.productService.findAll(
      req.tenantId ?? query.tenantId,
      query.page, query.limit, query.search,
      query.categoryId, query.status, query.sort,
      query.priceMin, query.priceMax, query.stockStatus,
    );
  }

  @Get('low-stock')
  @ApiOperation({ summary: 'Get products with low stock (≤ threshold)' })
  lowStock(@Req() req: any, @Query('threshold') threshold?: number) {
    return this.productService.lowStock(req.tenantId, threshold || 10);
  }

  @Post('bulk/delete')
  @Roles('HOST', 'ADMIN')
  @ApiOperation({ summary: 'Bulk soft delete products' })
  bulkDelete(@Body() body: BulkIdsDto) {
    return this.productService.bulkDelete(body.ids);
  }

  @Post('bulk/status')
  @Roles('HOST', 'ADMIN')
  @ApiOperation({ summary: 'Bulk update product status' })
  bulkStatus(@Body() body: BulkStatusDto) {
    return this.productService.bulkStatus(body.ids, body.status);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get product by ID' })
  findOne(@Param('id') id: string) {
    return this.productService.findOne(id);
  }

  @Put(':id')
  @Roles('HOST', 'ADMIN')
  @ApiOperation({ summary: 'Update product' })
  update(@Param('id') id: string, @Body() body: UpdateProductDto) {
    return this.productService.update(id, body);
  }

  @Delete(':id')
  @Roles('HOST', 'ADMIN')
  @ApiOperation({ summary: 'Soft delete product' })
  remove(@Param('id') id: string) {
    return this.productService.softRemove(id);
  }
}
