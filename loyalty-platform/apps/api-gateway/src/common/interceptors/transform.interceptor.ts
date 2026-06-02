import {
  Injectable, NestInterceptor, ExecutionContext, CallHandler,
} from '@nestjs/common';
import { Observable, map } from 'rxjs';

export interface PaginatedResult {
  data: any[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

@Injectable()
export class TransformInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const response = context.switchToHttp().getResponse();
    return next.handle().pipe(
      map(result => {
        const payload: any = {
          success: true,
          message: 'Success',
          data: result,
          errors: [],
        };

        if (
          result &&
          typeof result === 'object' &&
          'data' in result &&
          'total' in result &&
          'page' in result &&
          'limit' in result &&
          'totalPages' in result
        ) {
          payload.data = result.data;
          payload.pagination = {
            page: result.page,
            size: result.limit,
            totalItems: result.total,
            totalPages: result.totalPages,
          };
        }

        return payload;
      }),
    );
  }
}
