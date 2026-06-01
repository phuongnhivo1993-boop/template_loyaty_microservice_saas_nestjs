import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable, tap } from 'rxjs';
import { PrismaService } from '../../prisma/prisma.service';

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

    return next.handle().pipe(
      tap((responseBody) => {
        const entityMatch = url.match(/\/api\/v1\/(\w+)/);
        const entityType = entityMatch ? entityMatch[1] : 'unknown';
        const entityId = request.params?.id || responseBody?.id || 'unknown';

        this.prisma.auditLog.create({
          data: {
            entityType,
            entityId,
            action: method === 'POST' ? 'CREATE' : method === 'DELETE' ? 'DELETE' : 'UPDATE',
            userId: user?.id || user?.sub || null,
            userEmail: user?.email || null,
            newValue: method !== 'DELETE' ? responseBody : null,
            ipAddress: ip,
          },
        }).catch(() => {});
      }),
    );
  }
}
