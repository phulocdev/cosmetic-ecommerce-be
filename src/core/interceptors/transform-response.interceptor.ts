import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { RESPONSE_MESSAGE } from 'core/decorators/response-message.decorator'
import { map, Observable } from 'rxjs'

export interface Response<T> {
  statusCode: number
  message: string
  data: T
}

@Injectable()
export class TransformResponseInterceptor<T> implements NestInterceptor<T, Response<T>> {
  constructor(private reflector: Reflector) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<Response<T>> {
    const responseMessage = this.reflector.getAllAndOverride<string>(RESPONSE_MESSAGE, [
      context.getHandler(),
      context.getClass()
    ])

    const { statusCode } = context.switchToHttp().getResponse()

    return next.handle().pipe(
      map((response) => {
        if (!response) {
          return {
            statusCode,
            message: 'Không có dữ liệu trả về',
            data: []
          }
        }
        if (response.data && response.meta) {
          return {
            statusCode,
            message: responseMessage ?? 'Gọi API thành công',
            data: response.data,
            meta: response.meta
          }
        }
        return { statusCode, message: responseMessage ?? 'Gọi API thành công', data: response }
      })
    )
  }
}
