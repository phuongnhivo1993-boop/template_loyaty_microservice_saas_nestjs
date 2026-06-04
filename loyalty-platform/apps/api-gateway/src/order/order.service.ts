import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CouponService } from '../coupon/coupon.service';
import { PointService } from '../point/point.service';
import { WebSocketGatewayImpl } from '../websocket/websocket.gateway';
import { parseSort } from '../common/utils/sort.util';

@Injectable()
export class OrderService {
  constructor(
    private prisma: PrismaService,
    private couponService: CouponService,
    private pointService: PointService,
    private wsGateway: WebSocketGatewayImpl,
  ) {}

  async create(data: { memberId: string; tenantId: string; items: { productId: string; quantity: number; price?: number }[]; storeId?: string; shippingFee?: number; tax?: number; discount?: number; couponCode?: string; paymentMethod?: string; notes?: string; shippingAddress?: any }) {
    const member = await this.prisma.member.findUnique({ where: { id: data.memberId } });
    if (!member) throw new NotFoundException('Member not found');

    const productIds = data.items.map(i => i.productId);
    const products = await this.prisma.product.findMany({ where: { id: { in: productIds }, tenantId: data.tenantId, deletedAt: null } });
    if (products.length !== productIds.length) throw new BadRequestException('Some products not found or deleted');

    const productMap = new Map(products.map(p => [p.id, p]));
    let subtotal = 0;
    const orderItems = data.items.map(item => {
      const product = productMap.get(item.productId)!;
      if (product.status !== 'ACTIVE') throw new BadRequestException(`Product ${product.name} is not available`);
      const price = item.price ?? product.price;
      const lineTotal = price * item.quantity;
      subtotal += lineTotal;
      return { productId: item.productId, name: product.name, price, quantity: item.quantity, subtotal: lineTotal };
    });

    let discount = data.discount ?? 0;
    let couponCode = data.couponCode;
    if (data.couponCode) {
      try {
        const result = await this.couponService.validate(data.couponCode, data.memberId, subtotal - discount, data.tenantId);
        if (result.valid) {
          discount += result.discount;
          couponCode = data.couponCode;
        }
      } catch { }
    }
    const shippingFee = data.shippingFee ?? 0;
    const tax = data.tax ?? 0;
    const total = Math.max(0, subtotal - discount + shippingFee + tax);

    const orderCode = `ORD-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

    const earningRule = await this.prisma.pointEarningRule.findFirst({
      where: { tenantId: data.tenantId, status: 'ACTIVE', category: null },
      orderBy: { createdAt: 'desc' },
    });
    const pointsEarned = earningRule ? Math.floor(total * Number(earningRule.pointsPerUnit)) : Math.floor(total);

    const order = await this.prisma.order.create({
      data: {
        orderCode,
        memberId: data.memberId,
        tenantId: data.tenantId,
        storeId: data.storeId,
        subtotal,
        discount,
        shippingFee,
        tax,
        total,
        pointsEarned,
        couponCode,
        notes: data.notes,
        shippingAddress: data.shippingAddress ?? undefined,
        paymentMethod: data.paymentMethod,
        items: { create: orderItems },
      },
      include: { items: true },
    });

    await this.prisma.member.update({
      where: { id: data.memberId },
      data: {
        totalPoints: { increment: pointsEarned },
        availablePoints: { increment: pointsEarned },
      },
    });

    await this.prisma.pointTransaction.create({
      data: {
        memberId: data.memberId,
        type: 'EARN',
        amount: pointsEarned,
        balance: member.availablePoints + pointsEarned,
        reason: `Points from order ${orderCode}`,
        reference: order.id,
      },
    });

    if (data.couponCode) {
      try {
        await this.couponService.apply(data.couponCode, data.memberId, order.id, subtotal, data.tenantId);
      } catch { }
    }

    try {
      this.wsGateway.emitOrderCreated(order);
      this.wsGateway.emitPointsEarned(data.memberId, pointsEarned, member.availablePoints + pointsEarned, `Points from order ${orderCode}`);
      if (data.couponCode) {
        this.wsGateway.emitCouponApplied(data.couponCode, data.memberId, discount, orderCode);
      }
    } catch { }

    return order;
  }

  async findAll(query: { tenantId?: string; memberId?: string; page?: number; limit?: number; status?: string; search?: string; sort?: string; storeId?: string; paymentMethod?: string; dateFrom?: string; dateTo?: string }) {
    const { tenantId, memberId, page = 1, limit = 20, status, search, sort, storeId, paymentMethod, dateFrom, dateTo } = query;
    const where: any = {};
    if (tenantId) where.tenantId = tenantId;
    if (memberId) where.memberId = memberId;
    if (status) where.status = status;
    if (storeId) where.storeId = storeId;
    if (paymentMethod) where.paymentMethod = paymentMethod;
    if (dateFrom || dateTo) {
      where.createdAt = {};
      if (dateFrom) where.createdAt.gte = new Date(dateFrom);
      if (dateTo) where.createdAt.lte = new Date(dateTo);
    }
    if (search) {
      where.OR = [
        { orderCode: { contains: search, mode: 'insensitive' } },
        { member: { fullName: { contains: search, mode: 'insensitive' } } },
        { member: { phone: { contains: search, mode: 'insensitive' } } },
      ];
    }
    const { orderBy, orderDirection } = parseSort(sort);
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      this.prisma.order.findMany({
        where, orderBy: { [orderBy]: orderDirection }, skip, take: limit,
        include: { items: { include: { product: true } }, member: { select: { id: true, fullName: true, email: true, phone: true } } },
      }),
      this.prisma.order.count({ where }),
    ]);
    return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async findOne(id: string) {
    const order = await this.prisma.order.findUnique({
      where: { id },
      include: { items: { include: { product: true } }, member: { select: { id: true, fullName: true, email: true, phone: true } } },
    });
    if (!order) throw new NotFoundException('Order not found');
    return order;
  }

  async updateStatus(id: string, status: string, cancelReason?: string) {
    const order = await this.findOne(id);
    const validTransitions: Record<string, string[]> = {
      PENDING: ['CONFIRMED', 'CANCELLED'],
      CONFIRMED: ['PROCESSING', 'CANCELLED'],
      PROCESSING: ['SHIPPED', 'CANCELLED'],
      SHIPPED: ['DELIVERED', 'CANCELLED'],
      DELIVERED: [],
      CANCELLED: ['REFUNDED'],
      REFUNDED: [],
    };
    const allowed = validTransitions[order.status] || [];
    if (!allowed.includes(status)) throw new BadRequestException(`Cannot transition from ${order.status} to ${status}`);

    const historyEntry = {
      from: order.status,
      to: status,
      timestamp: new Date().toISOString(),
    };
    const currentHistory = Array.isArray(order.statusHistory) ? order.statusHistory : [];
    const updateData: any = {
      status,
      statusHistory: [...currentHistory, historyEntry],
    };

    if (status === 'CANCELLED') {
      updateData.cancelledAt = new Date();
      updateData.cancelReason = cancelReason;
    }
    if (status === 'DELIVERED') updateData.deliveredAt = new Date();

    const updated = await this.prisma.order.update({
      where: { id },
      data: updateData,
      include: { items: true, member: { select: { id: true, fullName: true, email: true, tenantId: true } } },
    });

    if (status === 'CANCELLED' && order.pointsEarned > 0) {
      try {
        const member = await this.prisma.member.findUnique({ where: { id: order.memberId } });
        if (member && member.availablePoints >= order.pointsEarned) {
          await this.prisma.$transaction([
            this.prisma.pointTransaction.create({
              data: {
                memberId: order.memberId,
                type: 'ADJUST',
                amount: -order.pointsEarned,
                balance: member.availablePoints - order.pointsEarned,
                reason: `Points reversed from cancelled order ${order.orderCode}`,
                reference: order.id,
              },
            }),
            this.prisma.member.update({
              where: { id: order.memberId },
              data: {
                totalPoints: { decrement: order.pointsEarned },
                availablePoints: { decrement: order.pointsEarned },
              },
            }),
          ]);
        }
      } catch (err) {
        // Log but don't fail the status update
      }
    }

    try {
      this.wsGateway.emitOrderStatusChanged(id, order.orderCode, status, order.memberId);
    } catch {}

    return updated;
  }

  async getTimeline(id: string) {
    const order = await this.findOne(id);
    return {
      orderCode: order.orderCode,
      status: order.status,
      history: Array.isArray(order.statusHistory) ? order.statusHistory : [],
      createdAt: order.createdAt,
      deliveredAt: order.deliveredAt,
      cancelledAt: order.cancelledAt,
    };
  }
}
