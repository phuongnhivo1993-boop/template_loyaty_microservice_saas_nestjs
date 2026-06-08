import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { parseSort } from '../common/utils/sort.util';

@Injectable()
export class StoreService {
  constructor(private prisma: PrismaService) {}

  async create(data: { name: string; code: string; address?: string; phone?: string; email?: string; latitude?: number; longitude?: number; openingHours?: any; tenantId: string }) {
    const existing = await this.prisma.store.findUnique({ where: { code: data.code } });
    if (existing) throw new BadRequestException('Store code already exists');
    return this.prisma.store.create({
      data: {
        name: data.name,
        code: data.code,
        address: data.address,
        phone: data.phone,
        email: data.email,
        latitude: data.latitude,
        longitude: data.longitude,
        openingHours: data.openingHours || null,
        tenantId: data.tenantId,
      },
    });
  }

  async findAll(tenantId?: string, page = 1, limit = 20, search?: string, status?: string, sort?: string) {
    const where: any = {};
    if (tenantId) where.tenantId = tenantId;
    if (status) where.status = status;
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { code: { contains: search, mode: 'insensitive' } },
        { address: { contains: search, mode: 'insensitive' } },
      ];
    }
    const { orderBy, orderDirection } = parseSort(sort);
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      this.prisma.store.findMany({ where, orderBy: { [orderBy]: orderDirection }, skip, take: limit }),
      this.prisma.store.count({ where }),
    ]);
    return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async findOne(id: string, tenantId?: string) {
    const store = await this.prisma.store.findFirst({ where: { id, ...(tenantId ? { tenantId } : {}) }, include: { storeStaff: true } });
    if (!store) throw new NotFoundException('Store not found');
    return store;
  }

  async update(id: string, data: { name?: string; address?: string; phone?: string; email?: string; latitude?: number; longitude?: number; openingHours?: any; status?: string }, tenantId?: string) {
    await this.findOne(id, tenantId);
    return this.prisma.store.update({ where: { id }, data: data as any });
  }

  async remove(id: string, tenantId?: string) {
    await this.findOne(id, tenantId);
    await this.prisma.storeStaff.deleteMany({ where: { storeId: id } });
    return this.prisma.store.delete({ where: { id } });
  }

  async addStaff(storeId: string, data: { name: string; phone: string; pinCode?: string }, tenantId?: string) {
    await this.findOne(storeId, tenantId);
    return this.prisma.storeStaff.create({ data: { ...data, storeId } });
  }

  async listStaff(storeId: string, tenantId?: string) {
    await this.findOne(storeId, tenantId);
    return this.prisma.storeStaff.findMany({ where: { storeId } });
  }

  async updateStaff(staffId: string, data: { name?: string; phone?: string; pinCode?: string; active?: boolean }, tenantId?: string) {
    const staff = await this.prisma.storeStaff.findFirst({
      where: { id: staffId, store: { ...(tenantId ? { tenantId } : {}) } },
      include: { store: { select: { tenantId: true } } },
    });
    if (!staff) throw new NotFoundException('Staff not found');
    return this.prisma.storeStaff.update({ where: { id: staffId }, data });
  }

  async removeStaff(staffId: string, tenantId?: string) {
    const staff = await this.prisma.storeStaff.findFirst({
      where: { id: staffId, store: { ...(tenantId ? { tenantId } : {}) } },
      include: { store: { select: { tenantId: true } } },
    });
    if (!staff) throw new NotFoundException('Staff not found');
    return this.prisma.storeStaff.delete({ where: { id: staffId } });
  }
}
