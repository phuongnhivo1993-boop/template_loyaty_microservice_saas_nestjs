import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

@Injectable()
export class TenantSubdomainMiddleware implements NestMiddleware {
  private readonly logger = new Logger(TenantSubdomainMiddleware.name);

  async use(req: Request, res: Response, next: NextFunction) {
    const host = req.headers.host || '';
    const parts = host.split('.');

    if (parts.length >= 3) {
      const subdomain = parts[0].toLowerCase();

      if (subdomain !== 'www' && subdomain !== 'app' && subdomain !== 'admin') {
        try {
          const tenant = await prisma.tenant.findFirst({
            where: { subdomain },
            select: { id: true },
          });

          if (tenant) {
            if (!req.query) req.query = {};
            if (!req.body) req.body = {};
            (req as any).tenantId = tenant.id;
            this.logger.debug(`Resolved tenant ${tenant.id} from subdomain: ${subdomain}`);
          } else {
            this.logger.warn(`No tenant found for subdomain: ${subdomain}`);
          }
        } catch (err) {
          this.logger.error(`Error resolving tenant from subdomain ${subdomain}: ${err}`);
        }
      }
    }

    next();
  }
}
