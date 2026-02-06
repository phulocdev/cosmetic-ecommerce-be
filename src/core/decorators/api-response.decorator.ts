/**
 * API Response Decorator
 * ===========================================
 * Custom decorator for API response metadata
 */

import { SetMetadata, applyDecorators, Type } from '@nestjs/common'
import {
  ApiResponse,
  ApiOperation,
  ApiBearerAuth,
  ApiExtraModels,
  getSchemaPath
} from '@nestjs/swagger'
import { OffsetPaginatedResponseDto } from 'core/dto'

// Skip response transformation
export const SKIP_TRANSFORM_KEY = 'skipTransform'
export const SkipTransform = () => SetMetadata(SKIP_TRANSFORM_KEY, true)

// Custom response message
export const RESPONSE_MESSAGE_KEY = 'responseMessage'
export const ResponseMessage = (message: string) => SetMetadata(RESPONSE_MESSAGE_KEY, message)

/**
 * Combined API documentation decorator
 */
export function ApiEndpoint(options: {
  summary: string
  description?: string
  deprecated?: boolean
}) {
  return applyDecorators(
    ApiOperation({
      summary: options.summary,
      description: options.description,
      deprecated: options.deprecated
    })
  )
}

/**
 * Paginated response decorator for Swagger
 */
export function ApiOffsetPaginatedResponse<TModel extends Type<any>>(model: TModel) {
  return applyDecorators(
    ApiExtraModels(OffsetPaginatedResponseDto, model),
    ApiResponse({
      status: 200,
      description: 'Successfully retrieved paginated list',
      schema: {
        allOf: [
          { $ref: getSchemaPath(OffsetPaginatedResponseDto) },
          {
            properties: {
              data: {
                type: 'array',
                items: { $ref: getSchemaPath(model) }
              }
            }
          }
        ]
      }
    })
  )
}

export function ApiCursorPaginatedResponse<TModel extends Type<any>>(model: TModel) {
  return applyDecorators(
    ApiExtraModels(OffsetPaginatedResponseDto, model),
    ApiResponse({
      status: 200,
      description: 'Successfully retrieved paginated list',
      schema: {
        allOf: [
          { $ref: getSchemaPath(OffsetPaginatedResponseDto) },
          {
            properties: {
              data: {
                type: 'array',
                items: { $ref: getSchemaPath(model) }
              }
            }
          }
        ]
      }
    })
  )
}

/**
 * Protected route decorator
 */
export function ApiProtected() {
  return applyDecorators(ApiBearerAuth('JWT-auth'))
}
