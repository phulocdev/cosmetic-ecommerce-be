import { ApiPropertyOptional } from '@nestjs/swagger'
import { Transform, Type } from 'class-transformer'
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsInt,
  IsISO8601,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  IsUUID,
  Max,
  Min
} from 'class-validator'
import { PaginationType, ProductSortBy, ProductStatus, SortOrder } from 'enums'
import { PaginatedResponse } from 'types'

/**
 * Price range filter
 */
export class PriceRangeDto {
  @ApiPropertyOptional({ example: 10.0, description: 'Minimum price' })
  @IsNumber({}, { message: 'Minimum price must be a number' })
  @Min(0, { message: 'Minimum price must be at least 0' })
  @IsOptional()
  @Type(() => Number)
  min?: number

  @ApiPropertyOptional({ example: 100.0, description: 'Maximum price' })
  @IsNumber({}, { message: 'Maximum price must be a number' })
  @Min(0, { message: 'Maximum price must be at least 0' })
  @IsOptional()
  @Type(() => Number)
  max?: number
}

/**
 * Stock range filter
 */
export class StockRangeDto {
  @ApiPropertyOptional({ example: 0, description: 'Minimum stock quantity' })
  @IsInt({ message: 'Minimum stock must be an integer' })
  @Min(0, { message: 'Minimum stock must be at least 0' })
  @IsOptional()
  @Type(() => Number)
  min?: number

  @ApiPropertyOptional({ example: 1000, description: 'Maximum stock quantity' })
  @IsInt({ message: 'Maximum stock must be an integer' })
  @Min(0, { message: 'Maximum stock must be at least 0' })
  @IsOptional()
  @Type(() => Number)
  max?: number
}

/**
 * Base query parameters for product filtering
 */
export class ProductFilterDto {
  // Text search
  @ApiPropertyOptional({
    example: 'cotton shirt',
    description: 'Search in product name, description, or code'
  })
  @IsString({ message: 'Search query must be a string' })
  @IsOptional()
  search?: string

  // Status filter
  @ApiPropertyOptional({
    enum: ProductStatus,
    enumName: 'ProductStatus',
    example: ProductStatus.PUBLISHED
  })
  @IsEnum(ProductStatus, { message: 'Status must be a valid ProductStatus' })
  @IsOptional()
  status?: ProductStatus

  // Category filters
  @ApiPropertyOptional({
    type: [String],
    description: 'Filter by category IDs (OR logic)',
    example: ['cat-1', 'cat-2']
  })
  @IsArray({ message: 'Category IDs must be an array' })
  @IsUUID('4', { each: true, message: 'Each category ID must be a valid UUIDv4' })
  @IsOptional()
  @Transform(({ value }) => (Array.isArray(value) ? value : [value]))
  categoryIds?: string[]

  @ApiPropertyOptional({
    example: 'cat-clothing-123',
    description: 'Filter by category slug'
  })
  @IsString({ message: 'Category slug must be a string' })
  @IsOptional()
  categorySlug?: string

  @ApiPropertyOptional({
    example: '/clothing/tshirts/',
    description: 'Filter by category path (includes subcategories)'
  })
  @IsString({ message: 'Category path must be a string' })
  @IsOptional()
  categoryPath?: string

  // Brand filter
  @ApiPropertyOptional({
    type: [String],
    description: 'Filter by brand IDs (OR logic)',
    example: ['brand-1', 'brand-2']
  })
  @IsArray({ message: 'Brand IDs must be an array' })
  @IsUUID('4', { each: true, message: 'Each brand ID must be a valid UUIDv4' })
  @IsOptional()
  @Transform(({ value }) => (Array.isArray(value) ? value : [value]))
  brandIds?: string[]

  // Country of origin filter
  @ApiPropertyOptional({
    type: [String],
    description: 'Filter by country IDs (OR logic)',
    example: ['country-1', 'country-2']
  })
  @IsArray({ message: 'Country IDs must be an array' })
  @IsUUID('4', { each: true, message: 'Each country ID must be a valid UUIDv4' })
  @IsOptional()
  @Transform(({ value }) => (Array.isArray(value) ? value : [value]))
  countryIds?: string[]

  // Price range
  @ApiPropertyOptional({
    example: 10.0,
    description: 'Minimum price'
  })
  @IsNumber({}, { message: 'Minimum price must be a number' })
  @Min(0, { message: 'Minimum price must be at least 0' })
  @IsOptional()
  @Type(() => Number)
  minPrice?: number

  @ApiPropertyOptional({
    example: 100.0,
    description: 'Maximum price'
  })
  @IsNumber({}, { message: 'Maximum price must be a number' })
  @Min(0, { message: 'Maximum price must be at least 0' })
  @IsOptional()
  @Type(() => Number)
  maxPrice?: number

  // Attribute filters (dynamic)
  @ApiPropertyOptional({
    type: 'object',
    example: { color: 'red,blue', size: 'large' },
    additionalProperties: { type: 'string' }
  })
  @IsOptional()
  @IsObject({ message: 'Attributes must be an object' })
  attributes?: Record<string, string>

  // Variant-specific filters
  @ApiPropertyOptional({
    example: true,
    description: 'Only show products with in-stock variants'
  })
  @IsBoolean({ message: 'In stock filter must be a boolean' })
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  inStock?: boolean

  @ApiPropertyOptional({
    example: 0,
    description: 'Minimum stock quantity across all variants'
  })
  @IsInt({ message: 'Minimum stock must be an integer' })
  @Min(0, { message: 'Minimum stock must be at least 0' })
  @IsOptional()
  @Type(() => Number)
  minStock?: number

  @ApiPropertyOptional({
    example: 1000,
    description: 'Maximum stock quantity across all variants'
  })
  @IsInt({ message: 'Maximum stock must be an integer' })
  @Min(0, { message: 'Maximum stock must be at least 0' })
  @IsOptional()
  @Type(() => Number)
  maxStock?: number

  @ApiPropertyOptional({
    example: true,
    description: 'Only show products with active variants'
  })
  @IsBoolean({ message: 'Has active variants filter must be a boolean' })
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  hasActiveVariants?: boolean

  // Variant price range (based on variant selling prices)
  @ApiPropertyOptional({
    example: 10.0,
    description: 'Minimum variant selling price'
  })
  @IsNumber({}, { message: 'Minimum variant price must be a number' })
  @Min(0, { message: 'Minimum variant price must be at least 0' })
  @IsOptional()
  @Type(() => Number)
  minVariantPrice?: number

  @ApiPropertyOptional({
    example: 100.0,
    description: 'Maximum variant selling price'
  })
  @IsNumber({}, { message: 'Maximum variant price must be a number' })
  @Min(0, { message: 'Maximum variant price must be at least 0' })
  @IsOptional()
  @Type(() => Number)
  maxVariantPrice?: number

  // SKU filter
  @ApiPropertyOptional({
    example: 'SKU-12345',
    description: 'Filter by variant SKU (exact or partial match)'
  })
  @IsString({ message: 'SKU must be a string' })
  @IsOptional()
  sku?: string

  // Date range filters
  @ApiPropertyOptional({
    example: '2024-01-01',
    description: 'Filter products created after this date (ISO 8601)'
  })
  @IsOptional()
  @IsISO8601({}, { message: 'Created after must be a valid ISO 8601 date string' })
  @Type(() => Date)
  createdAfter?: Date

  @ApiPropertyOptional({
    example: '2024-12-31',
    description: 'Filter products created before this date (ISO 8601)'
  })
  @IsOptional()
  @IsISO8601({}, { message: 'Created before must be a valid ISO 8601 date string' })
  @Type(() => Date)
  createdBefore?: Date

  // Sorting
  @ApiPropertyOptional({
    enum: ProductSortBy,
    enumName: 'ProductSortBy',
    example: ProductSortBy.CREATED_AT,
    default: ProductSortBy.CREATED_AT
  })
  @IsEnum(ProductSortBy, { message: 'Sort by must be a valid ProductSortBy' })
  @IsOptional()
  sortBy?: ProductSortBy = ProductSortBy.CREATED_AT

  @ApiPropertyOptional({
    enum: SortOrder,
    enumName: 'SortOrder',
    example: SortOrder.DESC,
    default: SortOrder.DESC
  })
  @IsEnum(SortOrder, { message: 'Sort order must be a valid SortOrder' })
  @IsOptional()
  sortOrder?: SortOrder = SortOrder.DESC

  // Include relations
  @ApiPropertyOptional({
    example: true,
    description: 'Include product images',
    default: false
  })
  @IsBoolean({ message: 'Include images must be a boolean' })
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  includeImages?: boolean

  @ApiPropertyOptional({
    example: true,
    description: 'Include product variants',
    default: false
  })
  @IsBoolean({ message: 'Include variants must be a boolean' })
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  includeVariants?: boolean

  @ApiPropertyOptional({
    example: true,
    description: 'Include product attributes',
    default: false
  })
  @IsBoolean({ message: 'Include attributes must be a boolean' })
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  includeAttributes?: boolean

  @ApiPropertyOptional({
    example: true,
    description: 'Include brand and country information',
    default: true
  })
  @IsBoolean({ message: 'Include brand and country must be a boolean' })
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  includeBrandAndCountry?: boolean = true

  @ApiPropertyOptional({
    example: true,
    description: 'Include category information',
    default: true
  })
  @IsBoolean({ message: 'Include categories must be a boolean' })
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  includeCategories?: boolean = true
}

/**
 * Offset-based pagination DTO
 */
export class OffsetPaginationDto extends ProductFilterDto {
  @ApiPropertyOptional({
    example: 1,
    description: 'Page number (1-indexed)',
    default: 1,
    minimum: 1
  })
  @IsInt({ message: 'Page must be an integer' })
  @Min(1, { message: 'Page must be at least 1' })
  @IsOptional()
  @Type(() => Number)
  page?: number = 1

  @ApiPropertyOptional({
    example: 20,
    description: 'Number of items per page',
    default: 20,
    minimum: 1,
    maximum: 100
  })
  @IsInt({ message: 'Limit must be an integer' })
  @Min(1, { message: 'Limit must be at least 1' })
  @Max(100, { message: 'Limit must be at most 100' })
  @IsOptional()
  @Type(() => Number)
  limit?: number = 20
}

/**
 * Cursor-based pagination DTO
 */
export class CursorPaginationDto extends ProductFilterDto {
  @ApiPropertyOptional({
    example: 'eyJpZCI6ImFiYzEyMyIsImNyZWF0ZWRBdCI6IjIwMjQtMDEtMDF9',
    description: 'Cursor for pagination (base64 encoded)'
  })
  @IsString({ message: 'Cursor must be a string' })
  @IsOptional()
  cursor?: string

  @ApiPropertyOptional({
    example: 20,
    description: 'Number of items to return',
    default: 20,
    minimum: 1,
    maximum: 100
  })
  @IsInt({ message: 'Limit must be an integer' })
  @Min(1, { message: 'Limit must be at least 1' })
  @Max(100, { message: 'Limit must be at most 100' })
  @IsOptional()
  @Type(() => Number)
  limit?: number = 20

  @ApiPropertyOptional({
    enum: SortOrder,
    description: 'Direction to paginate (forward or backward)',
    example: SortOrder.DESC,
    default: SortOrder.DESC
  })
  @IsEnum(SortOrder, { message: 'Direction must be a valid SortOrder' })
  @IsOptional()
  direction?: SortOrder = SortOrder.DESC
}

/**
 * Unified pagination DTO (accepts both strategies)
 */
export class ProductQueryDto extends ProductFilterDto {
  // Pagination type
  @ApiPropertyOptional({
    enum: PaginationType,
    enumName: 'PaginationType',
    example: PaginationType.OFFSET,
    default: PaginationType.OFFSET,
    description: 'Pagination strategy to use'
  })
  @IsEnum(PaginationType, {
    message: `Pagination type must be a valid PaginationType ${Object.values(PaginationType).join(', ')}`
  })
  @IsOptional()
  paginationType?: PaginationType = PaginationType.OFFSET

  // Offset pagination
  @ApiPropertyOptional({
    example: 1,
    description: 'Page number for offset pagination',
    minimum: 1
  })
  @IsInt({ message: 'Page must be an integer' })
  @Min(1, { message: 'Page must be at least 1' })
  @IsOptional()
  @Type(() => Number)
  page?: number

  // Limit will be used in both pagination types: offset and cursor
  @ApiPropertyOptional({
    example: 20,
    description: 'Items per page',
    default: 20,
    minimum: 1,
    maximum: 100
  })
  @IsInt({ message: 'Limit must be an integer' })
  @Min(1, { message: 'Limit must be at least 1' })
  @Max(100, { message: 'Limit must be at most 100' })
  @IsOptional()
  @Type(() => Number)
  limit?: number = 20

  // Cursor pagination
  @ApiPropertyOptional({
    example: 'eyJpZCI6ImFiYzEyMyIsImNyZWF0ZWRBdCI6IjIwMjQtMDEtMDF9',
    description: 'Cursor for cursor-based pagination'
  })
  @IsString({ message: 'Cursor must be a string' })
  @IsOptional()
  cursor?: string
}

/**
 * Response DTOs
 */

export class ProductListResponseDto extends PaginatedResponse<any> {
  filters?: {
    applied: Record<string, any>
    available?: Record<string, any>
  }
}
