/**
 * Pagination DTOs
 * ===========================================
 * Common pagination utilities
 */

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { IsEnum, IsInt, IsOptional, IsString, Max, Min } from 'class-validator'
import { PaginationType, SortOrder } from 'enums'

/**
 * The only one Pagination Query DTO - used for both OFFSET-BASED and CURSOR-BASED pagination
 */

export class PaginationQueryDto {
  @ApiPropertyOptional({
    enum: PaginationType,
    enumName: 'PaginationType',
    example: PaginationType.OFFSET,
    default: PaginationType.OFFSET,
    description: 'Pagination strategy to use'
  })
  @IsEnum(PaginationType, {
    message: `Pagination type must be a valid PaginationType ${Object.values(PaginationType).join(
      ', '
    )}`
  })
  @IsOptional()
  paginationType?: PaginationType = PaginationType.OFFSET

  @ApiPropertyOptional({
    description: 'Page number (1-based)',
    minimum: 1,
    default: 1
  })
  @IsInt({ message: 'Page must be an integer' })
  @Min(1, { message: 'Page must be at least 1' })
  @IsOptional()
  @Type(() => Number)
  page?: number = 1

  @ApiPropertyOptional({
    description: 'Number of items per page',
    minimum: 1,
    maximum: 100,
    default: 10
  })
  @IsInt({ message: 'Limit must be an integer' })
  @Min(1, { message: 'Limit must be at least 1' })
  @Max(100, { message: 'Limit must be at most 100' })
  @IsOptional()
  @Type(() => Number)
  limit?: number = 10

  @ApiPropertyOptional({
    description: 'Sort order',
    enum: SortOrder,
    default: SortOrder.DESC
  })
  @IsOptional()
  @IsEnum(SortOrder)
  sortOrder?: SortOrder = SortOrder.DESC

  @ApiPropertyOptional({
    description: 'Cursor for pagination'
  })
  @IsOptional()
  @IsString()
  cursor?: string

  // @ApiPropertyOptional({
  //   description: 'Direction of pagination',
  //   enum: ['forward', 'backward'],
  //   default: 'forward'
  // })
  // @IsOptional()
  // @IsString()
  // direction?: 'forward' | 'backward' = 'forward'

  // @ApiPropertyOptional({
  //     enum: SortOrder,
  //     description: 'Direction to paginate (forward or backward)',
  //     example: SortOrder.DESC,
  //     default: SortOrder.DESC
  //   })
  //   @IsEnum(SortOrder, { message: 'Direction must be a valid SortOrder' })
  //   @IsOptional()
  //   direction?: SortOrder = SortOrder.DESC
}

/**
 * The parent Pagination Meta DTO class - in response metadata
 */

export class PaginationMetaDto {
  @ApiProperty({ description: 'Items per page' })
  limit: number

  @ApiProperty({ description: 'Has previous page' })
  hasPreviousPage: boolean

  @ApiProperty({ description: 'Has next page' })
  hasNextPage: boolean
}

/**
 * Offset Pagination meta DTO
 */
export class OffsetPaginationMetaDto extends PaginationMetaDto {
  @ApiProperty({ description: 'Total number of items' })
  total: number

  @ApiProperty({ description: 'Current page' })
  page: number

  @ApiProperty({ description: 'Total number of pages' })
  totalPages: number
}

/**
 * Cursor pagination meta DTO
 */
export class CursorPaginationMetaDto extends PaginationMetaDto {
  @ApiProperty({ description: 'Next cursor for pagination' })
  nextCursor: string | null

  @ApiProperty({ description: 'Previous cursor for pagination' })
  previousCursor: string | null
}

/**
 * Paginated response DTO - Use this class to return paginated data rather than manually constructing the response
 * Must use constructor function to create an instance. If not, we cannot new PaginatedResponseDto<T>()
 */
export class OffsetPaginatedResponseDto<T> {
  @ApiProperty({ isArray: true })
  items: T[]

  @ApiProperty({ type: OffsetPaginationMetaDto })
  meta: OffsetPaginationMetaDto

  constructor({
    items,
    total,
    page,
    limit
  }: {
    items: T[]
    total: number
    page: number
    limit: number
  }) {
    this.items = items
    const totalPages = Math.ceil(total / limit)
    this.meta = {
      total,
      page,
      limit,
      totalPages,
      hasPreviousPage: page > 1,
      hasNextPage: page < totalPages
    }
  }
}

/**
 * Cursor paginated response DTO
 */
export class CursorPaginatedResponseDto<T> {
  @ApiProperty({ isArray: true })
  items: T[]

  @ApiProperty({ type: CursorPaginationMetaDto })
  meta: CursorPaginationMetaDto

  constructor({
    items,
    nextCursor,
    previousCursor,
    hasNextPage,
    hasPreviousPage
  }: {
    items: T[]
    nextCursor: string | null
    previousCursor: string | null
    hasNextPage: boolean
    hasPreviousPage: boolean
  }) {
    this.items = items
    this.meta = {
      nextCursor,
      previousCursor,
      limit: items.length,
      hasNextPage,
      hasPreviousPage
    }
  }
}
