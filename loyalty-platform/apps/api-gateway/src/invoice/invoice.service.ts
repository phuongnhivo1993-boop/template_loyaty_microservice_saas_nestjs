import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateInvoiceDto, UpdateInvoiceDto } from './dto/invoice.dto';

@Injectable()
export class InvoiceService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateInvoiceDto) {
    const subscription = await this.prisma.subscription.findUnique({
      where: { id: dto.subscriptionId },
    });
    if (!subscription) throw new NotFoundException('Subscription not found');

    return this.prisma.invoice.create({
      data: {
        subscriptionId: dto.subscriptionId,
        amount: dto.amount,
        currency: dto.currency || 'VND',
        dueDate: new Date(dto.dueDate),
        description: dto.description,
        metadata: dto.metadata || undefined,
      },
      include: { subscription: { include: { tenant: { select: { id: true, name: true, domain: true } } } } },
    });
  }

  async findAll(query: {
    page?: number;
    limit?: number;
    search?: string;
    subscriptionId?: string;
    tenantId?: string;
    status?: string;
  }) {
    const page = query.page || 1;
    const limit = query.limit || 20;
    const skip = (page - 1) * limit;
    const where: any = {};

    if (query.subscriptionId) where.subscriptionId = query.subscriptionId;
    if (query.status) where.status = query.status;
    if (query.tenantId) where.subscription = { tenantId: query.tenantId };
    if (query.search) {
      where.OR = [
        { description: { contains: query.search, mode: 'insensitive' } },
        { subscription: { tenant: { name: { contains: query.search, mode: 'insensitive' } } } },
      ];
    }

    const [data, total] = await Promise.all([
      this.prisma.invoice.findMany({
        where,
        include: { subscription: { include: { tenant: { select: { id: true, name: true, domain: true } } } } },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.invoice.count({ where }),
    ]);

    return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async findOne(id: string) {
    const invoice = await this.prisma.invoice.findUnique({
      where: { id },
      include: { subscription: { include: { tenant: { select: { id: true, name: true, domain: true } } } } },
    });
    if (!invoice) throw new NotFoundException('Invoice not found');
    return invoice;
  }

  async findByTenant(tenantId: string, page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    const where = { subscription: { tenantId } };
    const [data, total] = await Promise.all([
      this.prisma.invoice.findMany({
        where,
        include: { subscription: { include: { tenant: { select: { id: true, name: true, domain: true } } } } },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.invoice.count({ where }),
    ]);
    return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async update(id: string, dto: UpdateInvoiceDto) {
    await this.findOne(id);
    return this.prisma.invoice.update({
      where: { id },
      data: {
        status: dto.status as any,
        paymentMethod: dto.paymentMethod,
        paidAt: dto.paidAt ? new Date(dto.paidAt) : undefined,
        metadata: dto.metadata !== undefined ? dto.metadata : undefined,
      },
      include: { subscription: { include: { tenant: { select: { id: true, name: true, domain: true } } } } },
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.prisma.invoice.delete({ where: { id } });
    return { deleted: true };
  }
}
