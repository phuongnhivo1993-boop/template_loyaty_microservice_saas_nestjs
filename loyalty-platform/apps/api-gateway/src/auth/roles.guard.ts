import { Injectable, CanActivate, ExecutionContext, Logger } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from './roles.decorator';
import { IS_PUBLIC_KEY } from './public.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  private readonly logger = new Logger(RolesGuard.name);
  private readonly strictMode = process.env.AUTH_STRICT_MODE === 'true';

  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) return true;

    const requiredRoles = this.reflector.getAllAndOverride<string[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredRoles || requiredRoles.length === 0) {
      const handler = context.getHandler().name;
      const controller = context.getClass().name;
      if (this.strictMode) {
        this.logger.warn(`Denied access to ${controller}.${handler} — no @Roles() decorator`);
        return false;
      }
      return true;
    }

    const { user } = context.switchToHttp().getRequest();
    if (!user) return false;
    return requiredRoles.includes(user.role);
  }
}
