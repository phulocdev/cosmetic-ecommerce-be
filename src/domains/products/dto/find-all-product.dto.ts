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
  MaxLength,
  Min,
  ValidateNested
} from 'class-validator'
import { PaginationQueryDto } from 'core/dto/pagination.dto'
import { ProductSortBy, ProductStatus } from 'enums'

/**
 * Attribute filter for faceted search
 */
export class AttributeFilterDto {
  @ApiPropertyOptional({ example: 'attr-1', description: 'Attribute ID' })
  @IsUUID('4', { message: 'Attribute ID must be a valid UUIDv4' })
  attributeId: string

  @ApiPropertyOptional({
    type: [String],
    example: ['val-1', 'val-2'],
    description: 'Value IDs for the attribute'
  })
  @IsArray({ message: 'Value IDs must be an array' })
  @IsUUID('4', { each: true, message: 'Each value ID must be a valid UUIDv4' })
  valueIds: string[]
}

/**
 * Request DTOs
 */

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
export class ProductQueryDto extends PaginationQueryDto {
  // Text
  @ApiPropertyOptional({
    example: 'cotton shirt',
    description: 'Search in product name, description, or code'
  })
  @MaxLength(255, { message: 'Search query must be at most 255 characters' })
  @IsString({ message: 'Search query must be a string' })
  @IsOptional()
  searchQuery?: string

  // Status filter
  @ApiPropertyOptional({
    type: [String],
    enum: ProductStatus,
    enumName: 'ProductStatus',
    example: [ProductStatus.PUBLISHED, ProductStatus.DRAFT],
    description: 'Filter by product statuses (OR logic)'
  })
  @IsArray({ message: 'Status must be an array' })
  @IsEnum(ProductStatus, {
    each: true,
    message: `Each status must be a valid ProductStatus: ${Object.values(ProductStatus).join(', ')}`
  })
  @Transform(({ value }) => (Array.isArray(value) ? value : [value]))
  @IsOptional()
  status?: ProductStatus[]

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

  @ApiPropertyOptional({
    type: [AttributeFilterDto],
    description: 'Faceted attribute filtering',
    example: [{ attributeId: 'color-id', valueIds: ['red-id', 'blue-id'] }]
  })
  @IsArray({ message: 'Attribute filters must be an array' })
  @ValidateNested({ each: true })
  @Type(() => AttributeFilterDto)
  @IsOptional()
  attributes?: AttributeFilterDto[]

  // Variant-specific filters
  @ApiPropertyOptional({
    example: true,
    description: 'Only show products with in-stock variants'
  })
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean({ message: 'In stock filter must be a boolean' })
  @IsOptional()
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
  sku?: string // Sku

  // Sorting
  @ApiPropertyOptional({
    enum: ProductSortBy,
    enumName: 'ProductSortBy',
    example: ProductSortBy.PRICE,
    description: 'Field to sort by'
  })
  @IsEnum(ProductSortBy, {
    message: `Sort by must be a valid ProductSortBy: ${Object.values(ProductSortBy).join(', ')}`
  })
  @IsOptional()
  sortBy?: ProductSortBy = ProductSortBy.CREATED_AT
}
