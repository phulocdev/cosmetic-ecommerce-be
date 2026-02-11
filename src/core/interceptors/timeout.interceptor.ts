/**
 * Timeout Interceptor
 * ===========================================
 * Handles request timeout
 */

import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  RequestTimeoutException
} from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Observable, throwError, TimeoutError } from 'rxjs'
import { catchError, timeout } from 'rxjs/operators'

@Injectable()
export class TimeoutInterceptor implements NestInterceptor {
  private readonly timeoutMs: number

  constructor(private configService: ConfigService) {
    this.timeoutMs = this.configService.get<number>('app.requestTimeoutMs', 30000)
  }

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      timeout(this.timeoutMs),
      catchError((err) => {
        if (err instanceof TimeoutError) {
          return throwError(() => new RequestTimeoutException('Request timeout'))
        }
        return throwError(() => err)
      })
    )
  }
}
