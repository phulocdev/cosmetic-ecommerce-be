import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { RESPONSE_MESSAGE_KEY } from 'core/decorators/response-message.decorator'
import { map, Observable } from 'rxjs'

export interface Response<T> {
  success: boolean
  statusCode: number
  message: string
  data: T
  meta?: any
}

@Injectable()
export class TransformResponseInterceptor<T> implements NestInterceptor<T, Response<T>> {
  constructor(private reflector: Reflector) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<Response<T>> {
    const responseMessage = this.reflector.getAllAndOverride<string>(RESPONSE_MESSAGE_KEY, [
      context.getHandler(),
      context.getClass()
    ])

    const { statusCode } = context.switchToHttp().getResponse()

    return next.handle().pipe(
      map((response) => {
        if (!response) {
          return {
            success: true,
            statusCode,
            message: responseMessage ?? 'OK',
            data: []
          }
        }

        // Case: Response with pagination metadata
        if (response.data && response.meta) {
          return {
            success: true,
            statusCode,
            message: responseMessage || 'OK',
            data: response.data,
            meta: response.meta
          }
        }
        return { success: true, statusCode, message: responseMessage || 'OK', data: response }
      })
    )
  }
}
