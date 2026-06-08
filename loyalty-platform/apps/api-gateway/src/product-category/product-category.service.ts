import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ProductCategoryService {
  constructor(private prisma: PrismaService) {}

  async create(data: { name: string; tenantId: string; slug?: string; description?: string; icon?: string; sortOrder?: number }) {
    const slug = data.slug || data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const existing = await this.prisma.productCategory.findUnique({ where: { slug_tenantId: { slug, tenantId: data.tenantId } } });
    if (existing) throw new BadRequestException('Category slug already exists');
    return this.prisma.productCategory.create({ data: { ...data, slug } });
  }

  async findAll(tenantId?: string, page = 1, limit = 20, search?: string, sort?: string) {
    const where: any = {};
    if (tenantId) where.tenantId = tenantId;
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { slug: { contains: search, mode: 'insensitive' } },
      ];
    }
    const orderBy = sort || 'sortOrder';
    const orderDirection = sort?.startsWith('-') ? 'desc' : 'asc';
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      this.prisma.productCategory.findMany({
        where,
        orderBy: { [orderBy.replace(/^-/, '')]: orderDirection },
        skip,
        take: limit,
        include: { _count: { select: { products: true } } },
      }),
      this.prisma.productCategory.count({ where }),
    ]);
    return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async findOne(id: string, tenantId?: string) {
    const category = await this.prisma.productCategory.findFirst({
      where: { id, ...(tenantId ? { tenantId } : {}) },
      include: { _count: { select: { products: true } } },
    });
    if (!category) throw new NotFoundException('Category not found');
    return category;
  }

  async update(id: string, data: any, tenantId?: string) {
    await this.findOne(id, tenantId);
    return this.prisma.productCategory.update({ where: { id }, data });
  }

  async remove(id: string, tenantId?: string) {
    const productCount = await this.prisma.product.count({ where: { categoryId: id } });
    if (productCount > 0) throw new BadRequestException('Cannot delete category with existing products');
    await this.findOne(id, tenantId);
    return this.prisma.productCategory.delete({ where: { id } });
  }
}
