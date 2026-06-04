import { Injectable, CanActivate, ExecutionContext, ForbiddenException, Logger } from '@nestjs/common';
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
      this.logger.debug('TenantCheck skipped via @SkipTenantCheck()');
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
          const payload: any = this.jwtService.decode(token);
          userTenantId = payload?.tenantId;
        } catch {
          this.logger.warn('Failed to decode JWT in TenantGuard');
        }
      }
    }

    this.logger.debug(`TenantGuard: userTenantId=${userTenantId}`);

    if (!userTenantId) {
      this.logger.debug('No tenantId in token or user, allowing');
      return true;
    }

    const reqTenantId =
      req.tenantId || req.query?.tenantId || req.body?.tenantId || req.params?.tenantId;

    const userRole = user?.role || '';

    if (userRole === 'HOST') {
      req.tenantId = reqTenantId || userTenantId;
      this.logger.debug(`HOST access: req.tenantId=${req.tenantId}`);
      return true;
    }

    if (reqTenantId && reqTenantId !== userTenantId) {
      this.logger.warn(`Cross-tenant access denied: user=${userTenantId}, requested=${reqTenantId}`);
      throw new ForbiddenException('Cross-tenant access denied');
    }

    req.tenantId = userTenantId;
    this.logger.debug(`Auto-scoped to tenant: ${req.tenantId}`);
    return true;
  }
}
