import {
  WebSocketGateway, WebSocketServer, SubscribeMessage,
  OnGatewayConnection, OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { WebSocketEventService } from './websocket-event.service';

interface AuthenticatedSocket extends Socket {
  userId?: string;
  role?: string;
  tenantId?: string;
  memberId?: string;
}

@Injectable()
@WebSocketGateway({
  cors: { 
    origin: process.env.WS_CORS_ORIGIN?.split(',') || (process.env.NODE_ENV === 'production' ? false : ['http://localhost:3000', 'http://localhost:3001']), 
    credentials: true 
  },
  namespace: '/ws',
})
export class WebSocketGatewayImpl implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server!: Server;

  constructor(
    private jwtService: JwtService,
    private prisma: PrismaService,
    private eventService: WebSocketEventService,
  ) {}

  async handleConnection(client: AuthenticatedSocket) {
    try {
      const token = client.handshake.query.token as string || client.handshake.auth?.token;
      if (!token) { client.disconnect(); return; }

      const payload = this.jwtService.verify(token);
      client.userId = payload.sub || payload.id;
      client.role = payload.role;

      if (client.role === 'MEMBER' || payload.memberId) {
        client.memberId = payload.memberId;
        client.join(`member:${payload.memberId}`);
      } else if (client.role && ['HOST', 'ADMIN', 'STAFF'].includes(client.role)) {
        client.tenantId = payload.tenantId;
        client.join('admin');
        if (payload.tenantId) client.join(`tenant:${payload.tenantId}`);
      }
    } catch {
      client.disconnect();
    }
  }

  handleDisconnect() {}

  @SubscribeMessage('ping')
  handlePing(client: AuthenticatedSocket) {
    client.emit('pong', { time: new Date().toISOString() });
  }

  @SubscribeMessage('replay')
  async handleReplay(client: AuthenticatedSocket, payload: { room?: string; since?: string; limit?: number }) {
    const events = await this.eventService.replay(payload.room, client.memberId, payload.since, payload.limit || 50);
    client.emit('replay.events', events);
  }

  async emitToRoom(room: string, event: string, data: any, memberId?: string, tenantId?: string) {
    this.server.to(room).emit(event, data);
    await this.eventService.log(event, data, room, memberId, tenantId).catch(() => {});
  }

  emitOrderCreated(order: any) {
    const adminData = {
      id: order.id, orderCode: order.orderCode, total: order.total,
      status: order.status, memberId: order.memberId,
      pointsEarned: order.pointsEarned, couponCode: order.couponCode,
      createdAt: order.createdAt,
    };
    this.emitToRoom('admin', 'order.created', adminData, undefined, order.tenantId);
    const memberData = {
      id: order.id, orderCode: order.orderCode, total: order.total,
      status: order.status, pointsEarned: order.pointsEarned,
    };
    this.emitToRoom(`member:${order.memberId}`, 'order.created', memberData, order.memberId);
  }

  emitOrderStatusChanged(orderId: string, orderCode: string, status: string, memberId: string, tenantId?: string) {
    const data = { orderId, orderCode, status };
    this.emitToRoom('admin', 'order.status_changed', data, memberId, tenantId);
    this.emitToRoom(`member:${memberId}`, 'order.status_changed', data, memberId);
  }

  emitPointsEarned(memberId: string, amount: number, balance: number, reason: string, tenantId?: string) {
    this.emitToRoom(`member:${memberId}`, 'points.earned', { amount, balance, reason }, memberId);
    this.emitToRoom('admin', 'points.earned', { memberId, amount, balance, reason }, memberId, tenantId);
  }

  emitCouponApplied(couponCode: string, memberId: string, discount: number, orderCode: string, tenantId?: string) {
    this.emitToRoom('admin', 'coupon.applied', { couponCode, memberId, discount, orderCode }, memberId, tenantId);
  }

  emitNotification(userId: string, notification: { title: string; message: string; type?: string }) {
    this.emitToRoom(`member:${userId}`, 'notification', notification, userId);
    this.emitToRoom('admin', 'notification', notification);
  }
}
