import {
  ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus, Logger,
} from '@nestjs/common';
import { Response } from 'express';
import { ErrorCodes, ServiceException } from '../errors/error-codes';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private logger = new Logger('ExceptionFilter');

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let code: string = ErrorCodes.INTERNAL_ERROR;
    let message = 'Internal server error';
    let details: any = null;

    if (exception instanceof ServiceException) {
      status = exception.httpStatus;
      code = exception.code;
      message = exception.message;
    } else if (exception instanceof HttpException) {
      status = exception.getStatus();
      const res = exception.getResponse();
      message = typeof res === 'string' ? res : (res as any).message || exception.message;
      details = (res as any).errors || null;

      if (status === 401) code = ErrorCodes.AUTH_INVALID_CREDENTIALS;
      else if (status === 403) code = ErrorCodes.FORBIDDEN;
      else if (status === 404) code = ErrorCodes.NOT_FOUND;
      else if (status === 409) code = ErrorCodes.CONFLICT;
      else if (status === 422) code = ErrorCodes.VALIDATION_ERROR;
      else if (status === 429) code = ErrorCodes.RATE_LIMIT_EXCEEDED;
    } else if (exception instanceof Error) {
      message = exception.message;
      this.logger.error(`${request.method} ${request.url} - ${exception.message}`, exception.stack);
    }

    response.status(status).json({
      success: false,
      code,
      message: Array.isArray(message) ? message.join('; ') : message,
      data: null,
      errors: details || (Array.isArray(message) ? message : [message]),
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
