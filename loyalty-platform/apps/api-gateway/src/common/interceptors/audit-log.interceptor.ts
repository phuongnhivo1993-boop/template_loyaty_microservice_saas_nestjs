import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable, tap, from, switchMap } from 'rxjs';
import { PrismaService } from '../../prisma/prisma.service';

const ENTITY_MODEL_MAP: Record<string, string> = {
  tenants: 'tenant',
  users: 'user',
  members: 'member',
  tiers: 'tier',
  campaigns: 'campaign',
  rewards: 'reward',
  vouchers: 'voucher',
  promotions: 'promotion',
  referrals: 'referral',
  badges: 'badge',
  missions: 'mission',
  'notification-templates': 'notificationTemplate',
  'member-vouchers': 'memberVoucher',
  stores: 'store',
  products: 'product',
  orders: 'order',
  coupons: 'coupon',
  invoices: 'invoice',
  subscriptions: 'subscription',
  'gift-cards': 'giftCard',
  cashback: 'cashbackConfig',
  settings: 'settings',
  webhooks: 'webhookEndpoint',
  'member-feedback': 'memberFeedback',
};

@Injectable()
export class AuditLogInterceptor implements NestInterceptor {
  constructor(private prisma: PrismaService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { method, url, ip } = request;
    const user = request.user;

    if (!['POST', 'PUT', 'PATCH', 'DELETE'].includes(method)) {
      return next.handle();
    }

    const entityMatch = url.match(/\/api\/v1\/(\w+(?:-\w+)*)/);
    const entityType = entityMatch ? entityMatch[1] : 'unknown';
    const entityId = request.params?.id;
    const modelName = ENTITY_MODEL_MAP[entityType];
    const prisma = this.prisma;

    const SENSITIVE_PATHS = ['password', 'token', 'secret', 'pinCode', 'authorization'];

    function sanitize(obj: any): any {
      if (!obj || typeof obj !== 'object') return obj;
      if (Array.isArray(obj)) return obj.map(sanitize);
      const sanitized: any = {};
      for (const [key, value] of Object.entries(obj)) {
        if (SENSITIVE_PATHS.includes(key.toLowerCase())) {
          sanitized[key] = '[REDACTED]';
        } else if (typeof value === 'object' && value !== null) {
          sanitized[key] = sanitize(value);
        } else {
          sanitized[key] = value;
        }
      }
      return sanitized;
    }

    async function fetchOldValue() {
      if (!entityId || !modelName || method === 'POST') return null;
      try {
        const model = (prisma as any)[modelName];
        if (model?.findUnique) {
          return sanitize(await model.findUnique({ where: { id: entityId } }));
        }
      } catch {}
      return null;
    }

    return from(fetchOldValue()).pipe(
      switchMap((oldValue) =>
        next.handle().pipe(
          tap((responseBody) => {
            const finalEntityId = entityId || responseBody?.id || 'unknown';

            this.prisma.auditLog.create({
              data: {
                entityType,
                entityId: finalEntityId,
                action: method === 'POST' ? 'CREATE' : method === 'DELETE' ? 'DELETE' : 'UPDATE',
                userId: user?.id || user?.sub || null,
                userEmail: user?.email || null,
                oldValue: method !== 'POST' && oldValue ? sanitize(oldValue) : null,
                newValue: method !== 'DELETE' ? sanitize(responseBody) : null,
                ipAddress: ip,
              },
            }).catch(() => {});
          }),
        ),
      ),
    );
  }
}
