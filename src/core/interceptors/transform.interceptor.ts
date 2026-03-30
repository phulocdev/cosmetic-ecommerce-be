import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common'
import { ConfigService } from '@nestjs/config/dist/config.service'
import { Reflector } from '@nestjs/core'
import { SKIP_TRANSFORM_KEY } from 'core/decorators'
import { RESPONSE_MESSAGE_KEY } from 'core/decorators/response-message.decorator'
import { map, Observable } from 'rxjs'
import { ApiResponse } from 'types/common.type'

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T, ApiResponse<T>> {
  constructor(
    private reflector: Reflector,
    private readonly configService: ConfigService
  ) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler
  ): Promise<Observable<ApiResponse<T>>> {
    // Check if transformation should be skipped
    const skipTransform = this.reflector.getAllAndOverride<boolean>(SKIP_TRANSFORM_KEY, [
      context.getHandler(),
      context.getClass()
    ])

    if (skipTransform) {
      return next.handle()
    }

    const responseMessage = this.reflector.getAllAndOverride<string>(RESPONSE_MESSAGE_KEY, [
      context.getHandler(),
      context.getClass()
    ])

    const { statusCode } = context.switchToHttp().getResponse()

    if (this.configService.get('NODE_ENV') === 'development') {
      await new Promise((resolve) => setTimeout(resolve, 3000)) // Simulate delay for testing loading states
    }

    return next.handle().pipe(
      map((data) => {
        // Handle pagination responses
        if (data && typeof data === 'object' && 'items' in data && 'meta' in data) {
          return {
            success: true,
            statusCode,
            message: responseMessage || 'Success',
            data: data.items,
            meta: data.filters ? { ...data.meta, filters: data.filters } : data.meta,
            timestamp: new Date().toISOString()
          }
        }

        return {
          success: true,
          statusCode,
          message: responseMessage || 'Success',
          data: data || [],
          timestamp: new Date().toISOString()
        }
      })
    )
  }
}
