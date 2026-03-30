import { ApiPropertyOptional } from '@nestjs/swagger'
import { Transform, Type } from 'class-transformer'
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Max,
  MaxLength,
  Min,
  ValidateNested
} from 'class-validator'
import { AttributeFilterDto } from 'domains/products'
import { ProductSortBy, ProductStatus, SortOrder } from 'enums'

/**
 * Attribute filter for faceted search
 */
export class SearchAttributeFilterDto extends AttributeFilterDto {}

/**
 * Unified search DTO for the `GET /search/products` endpoint.
 *
 * Supports both:
 * - **AdvancedSearchBar** — keyword search with `q` + small `limit`
 * - **Collection Page** — full filtering, sorting, cursor pagination, and facets
 */
export class SearchProductsDto {
  // ─── Text search ──────────────────────────────────────────────────────
  @ApiPropertyOptional({
    example: 'kem chống nắng',
    description: 'Full-text search query. When provided, results are ranked by relevance.'
  })
  @MaxLength(255, { message: 'Search query must be at most 255 characters' })
  @IsString({ message: 'Search query must be a string' })
  @IsOptional()
  searchQuery?: string

  // Product IDs filter (used for Collection Page to limit search within a specific set of products)
  @ApiPropertyOptional({
    type: [String],
    description: 'Filter by product IDs (OR logic)'
  })
  @IsArray({ message: 'Product IDs must be an array' })
  @IsUUID('4', { each: true, message: 'Each product ID must be a valid UUIDv4' })
  @Transform(({ value }) => (Array.isArray(value) ? value : [value]))
  @IsOptional()
  productIds?: string[]

  // ─── Filters ──────────────────────────────────────────────────────────
  @ApiPropertyOptional({
    type: [String],
    enum: ProductStatus,
    description: 'Filter by product statuses (OR logic)'
  })
  @IsArray({ message: 'Status must be an array' })
  @IsEnum(ProductStatus, { each: true, message: 'Each status must be a valid ProductStatus' })
  @Transform(({ value }) => (Array.isArray(value) ? value : [value]))
  @IsOptional()
  status?: ProductStatus[]

  @ApiPropertyOptional({
    type: [String],
    description: 'Filter by category IDs (OR logic)'
  })
  @IsArray({ message: 'Category IDs must be an array' })
  @IsUUID('4', { each: true, message: 'Each category ID must be a valid UUIDv4' })
  @Transform(({ value }) => (Array.isArray(value) ? value : [value]))
  @IsOptional()
  categoryIds?: string[]

  @ApiPropertyOptional({ description: 'Filter by category slug' })
  @IsString()
  @IsOptional()
  categorySlug?: string

  @ApiPropertyOptional({ description: 'Filter by category path (startsWith match)' })
  @IsString()
  @IsOptional()
  categoryPath?: string

  @ApiPropertyOptional({
    type: [String],
    description: 'Filter by brand IDs (OR logic)'
  })
  @IsArray({ message: 'Brand IDs must be an array' })
  @IsUUID('4', { each: true, message: 'Each brand ID must be a valid UUIDv4' })
  @Transform(({ value }) => (Array.isArray(value) ? value : [value]))
  @IsOptional()
  brandIds?: string[]

  @ApiPropertyOptional({
    type: [String],
    description: 'Filter by country of origin IDs (OR logic)'
  })
  @IsArray({ message: 'Country IDs must be an array' })
  @IsUUID('4', { each: true, message: 'Each country ID must be a valid UUIDv4' })
  @Transform(({ value }) => (Array.isArray(value) ? value : [value]))
  @IsOptional()
  countryIds?: string[]

  @ApiPropertyOptional({ example: 50000, description: 'Minimum base price' })
  @IsNumber({}, { message: 'Minimum price must be a number' })
  @Min(0)
  @IsOptional()
  @Type(() => Number)
  minPrice?: number

  @ApiPropertyOptional({ example: 500000, description: 'Maximum base price' })
  @IsNumber({}, { message: 'Maximum price must be a number' })
  @Min(0)
  @IsOptional()
  @Type(() => Number)
  maxPrice?: number

  @ApiPropertyOptional({
    type: [SearchAttributeFilterDto],
    description: 'Attribute filters for faceted search'
  })
  @IsArray({ message: 'Attribute filters must be an array' })
  @ValidateNested({ each: true })
  @Type(() => SearchAttributeFilterDto)
  @IsOptional()
  attributes?: SearchAttributeFilterDto[]

  @ApiPropertyOptional({ description: 'Only show products with in-stock variants' })
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean()
  @IsOptional()
  inStock?: boolean

  @ApiPropertyOptional({ description: 'Only show products with active variants' })
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean()
  @IsOptional()
  hasActiveVariants?: boolean

  // ─── Sorting ──────────────────────────────────────────────────────────
  @ApiPropertyOptional({
    enum: ProductSortBy,
    description: 'Field to sort by. Ignored when `q` is provided (uses relevance instead).'
  })
  @IsEnum(ProductSortBy)
  @IsOptional()
  sortBy?: ProductSortBy

  @ApiPropertyOptional({
    enum: SortOrder,
    description: 'Sort direction'
  })
  @IsEnum(SortOrder)
  @IsOptional()
  sortOrder?: SortOrder

  // ─── Pagination ───────────────────────────────────────────────────────
  @ApiPropertyOptional({
    description: 'Number of items per page',
    minimum: 1,
    maximum: 100,
    default: 20
  })
  @IsInt()
  @Min(1)
  @Max(100)
  @IsOptional()
  @Type(() => Number)
  limit?: number = 20

  @ApiPropertyOptional({
    description:
      'Page number for offset-based pagination (1-based). Mutually exclusive with `cursor`.',
    minimum: 1,
    default: 1
  })
  @IsInt()
  @Min(1)
  @IsOptional()
  @Type(() => Number)
  page?: number // Don't set default value for page, as it will interfere with cursor-based pagination

  @ApiPropertyOptional({
    description:
      'Base64-encoded cursor for search_after pagination. Mutually exclusive with `page`.'
  })
  @IsString()
  @IsOptional()
  cursor?: string

  // ─── Facets ───────────────────────────────────────────────────────────
  @ApiPropertyOptional({
    description: 'Include aggregation facets (brand counts, category counts, etc.)',
    default: false
  })
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean()
  @IsOptional()
  includeFacets?: boolean = false
}
