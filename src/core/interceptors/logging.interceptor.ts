/**
 * Logging Interceptor
 * ===========================================
 * Logs request/response details
 */

import { Injectable, NestInterceptor, ExecutionContext, CallHandler, Logger } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Request, Response } from 'express';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger('HTTP');

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const ctx = context.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();

    const { method, url, body, ip } = request;
    const userAgent = request.get('user-agent') || '';
    const userId = (request as any).user?.id;

    const startTime = Date.now();

    return next.handle().pipe(
      tap({
        next: () => {
          const duration = Date.now() - startTime;
          const statusCode = response.statusCode;

          this.logger.log(
            `${method} ${url} ${statusCode} - ${duration}ms - ${ip} - ${userAgent.substring(0, 50)}`,
            {
              method,
              url,
              statusCode,
              duration,
              userId,
              ip,
            },
          );
        },
        error: error => {
          const duration = Date.now() - startTime;
          const statusCode = error.status || 500;

          this.logger.error(`${method} ${url} ${statusCode} - ${duration}ms - ${ip}`, {
            method,
            url,
            statusCode,
            duration,
            userId,
            ip,
            error: error.message,
            body: process.env.NODE_ENV !== 'production' ? body : undefined,
          });
        },
      }),
    );
  }
}
