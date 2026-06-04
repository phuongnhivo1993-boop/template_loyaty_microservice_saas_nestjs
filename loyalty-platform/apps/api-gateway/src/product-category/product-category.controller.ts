import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ProductCategoryService } from './product-category.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { CreateProductCategoryDto, UpdateProductCategoryDto, ProductCategoryQueryDto } from './dto/product-category.dto';

@ApiTags('Product Categories')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('product-categories')
export class ProductCategoryController {
  constructor(private categoryService: ProductCategoryService) {}

  @Post()
  @Roles('HOST', 'ADMIN')
  @ApiOperation({ summary: 'Create a product category' })
  create(@Req() req: any, @Body() body: CreateProductCategoryDto) {
    return this.categoryService.create({ ...body, tenantId: req.tenantId ?? body.tenantId });
  }

  @Get()
  @ApiOperation({ summary: 'List product categories' })
  findAll(@Req() req: any, @Query() query: ProductCategoryQueryDto) {
    return this.categoryService.findAll(req.tenantId ?? query.tenantId, query.page, query.limit, query.search, query.sort);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get category by ID' })
  findOne(@Param('id') id: string) {
    return this.categoryService.findOne(id);
  }

  @Put(':id')
  @Roles('HOST', 'ADMIN')
  @ApiOperation({ summary: 'Update category' })
  update(@Param('id') id: string, @Body() body: UpdateProductCategoryDto) {
    return this.categoryService.update(id, body);
  }

  @Delete(':id')
  @Roles('HOST', 'ADMIN')
  @ApiOperation({ summary: 'Delete category' })
  remove(@Param('id') id: string) {
    return this.categoryService.remove(id);
  }
}
