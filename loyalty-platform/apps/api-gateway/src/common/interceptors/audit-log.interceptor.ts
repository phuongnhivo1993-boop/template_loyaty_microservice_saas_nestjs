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

    async function fetchOldValue() {
      if (!entityId || !modelName || method === 'POST') return null;
      try {
        const model = (prisma as any)[modelName];
        if (model?.findUnique) {
          return await model.findUnique({ where: { id: entityId } });
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
                oldValue: method !== 'POST' && oldValue ? oldValue : null,
                newValue: method !== 'DELETE' ? responseBody : null,
                ipAddress: ip,
              },
            }).catch(() => {});
          }),
        ),
      ),
    );
  }
}
