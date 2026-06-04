import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { parseSort } from '../common/utils/sort.util';

@Injectable()
export class ProductService {
  constructor(private prisma: PrismaService) {}

  async create(data: { name: string; price: number; tenantId: string; slug?: string; description?: string; compareAtPrice?: number; costPrice?: number; imageUrl?: string; unit?: string; stock?: number; sku?: string; barcode?: string; categoryId?: string }) {
    const slug = data.slug || data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const existing = await this.prisma.product.findUnique({ where: { slug_tenantId: { slug, tenantId: data.tenantId } } });
    if (existing) throw new BadRequestException('Product slug already exists');
    if (data.sku) {
      const skuExists = await this.prisma.product.findUnique({ where: { sku_tenantId: { sku: data.sku, tenantId: data.tenantId } } });
      if (skuExists) throw new BadRequestException('Product SKU already exists');
    }
    return this.prisma.product.create({ data: { ...data, slug } });
  }

  async findAll(tenantId?: string, page = 1, limit = 20, search?: string, categoryId?: string, status?: string, sort?: string, priceMin?: number, priceMax?: number, stockStatus?: string) {
    const where: any = { deletedAt: null };
    if (tenantId) where.tenantId = tenantId;
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { sku: { contains: search, mode: 'insensitive' } },
        { barcode: { contains: search, mode: 'insensitive' } },
      ];
    }
    if (categoryId) where.categoryId = categoryId;
    if (status) where.status = status;
    if (priceMin !== undefined || priceMax !== undefined) {
      where.price = {};
      if (priceMin !== undefined) where.price.gte = priceMin;
      if (priceMax !== undefined) where.price.lte = priceMax;
    }
    if (stockStatus === 'OUT_OF_STOCK') where.stock = 0;
    else if (stockStatus === 'LOW_STOCK') where.stock = { gt: 0, lte: 10 };
    else if (stockStatus === 'IN_STOCK') where.stock = { gt: 10 };

    const { orderBy, orderDirection } = parseSort(sort);
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      this.prisma.product.findMany({ where, orderBy: { [orderBy]: orderDirection }, skip, take: limit, include: { category: true } }),
      this.prisma.product.count({ where }),
    ]);
    return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async findOne(id: string) {
    const product = await this.prisma.product.findUnique({ where: { id, deletedAt: null }, include: { category: true } });
    if (!product) throw new NotFoundException('Product not found');
    return product;
  }

  async update(id: string, data: any) {
    await this.findOne(id);
    return this.prisma.product.update({ where: { id }, data });
  }

  async softRemove(id: string) {
    await this.findOne(id);
    return this.prisma.product.update({ where: { id }, data: { deletedAt: new Date(), status: 'INACTIVE' } });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.product.delete({ where: { id } });
  }

  async bulkDelete(ids: string[]) {
    const result = await this.prisma.product.updateMany({
      where: { id: { in: ids }, deletedAt: null },
      data: { deletedAt: new Date(), status: 'INACTIVE' },
    });
    return { deleted: result.count };
  }

  async bulkStatus(ids: string[], status: string) {
    const result = await this.prisma.product.updateMany({
      where: { id: { in: ids }, deletedAt: null },
      data: { status },
    });
    return { updated: result.count };
  }

  async lowStock(tenantId?: string, threshold = 10) {
    const where: any = { deletedAt: null, stock: { lte: threshold } };
    if (tenantId) where.tenantId = tenantId;
    const [data, total] = await Promise.all([
      this.prisma.product.findMany({ where, orderBy: { stock: 'asc' }, take: 50, include: { category: true } }),
      this.prisma.product.count({ where }),
    ]);
    const outOfStock = data.filter(p => p.stock === 0).length;
    const lowStock = data.filter(p => p.stock > 0 && p.stock <= threshold).length;
    return { data, total, outOfStock, lowStock, threshold };
  }
}
