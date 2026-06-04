import { Injectable, CanActivate, ExecutionContext, ForbiddenException, Logger, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { TENANT_SKIP_KEY } from './skip-tenant.decorator';

@Injectable()
export class TenantGuard implements CanActivate {
  private readonly logger = new Logger(TenantGuard.name);

  constructor(
    private reflector: Reflector,
    private jwtService: JwtService,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const skip = this.reflector.getAllAndOverride<boolean>(TENANT_SKIP_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (skip) {
      return true;
    }

    const req = context.switchToHttp().getRequest();
    const user = req.user;

    let userTenantId: string | undefined;

    if (user && user.tenantId) {
      userTenantId = user.tenantId;
    } else {
      const authHeader = req.headers?.authorization;
      if (authHeader && authHeader.startsWith('Bearer ')) {
        try {
          const token = authHeader.slice(7);
          const payload: any = this.jwtService.verify(token);
          userTenantId = payload?.tenantId;
        } catch {
          throw new UnauthorizedException('Invalid or expired token');
        }
      }
    }

    if (!userTenantId) {
      throw new ForbiddenException('Tenant context required');
    }

    const userRole = user?.role || '';

    if (userRole === 'HOST') {
      req.tenantId = userTenantId;
      return true;
    }

    req.tenantId = userTenantId;
    return true;
  }
}
