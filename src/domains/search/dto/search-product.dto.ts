import { ApiPropertyOptional } from '@nestjs/swagger'
import { Transform, Type } from 'class-transformer'
import {
  IsArray,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  Min,
  ValidateNested
} from 'class-validator'

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

export class SearchProductsDto {
  @ApiPropertyOptional({
    example: 'cotton shirt',
    description: 'Natural language search term'
  })
  @MaxLength(255, { message: 'Search query must be at most 255 characters' })
  @IsString({ message: 'Search query must be a string' })
  @IsOptional()
  query?: string

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
    type: [String],
    description: 'Filter by brand IDs (OR logic)',
    example: ['brand-1', 'brand-2']
  })
  @IsArray({ message: 'Brand IDs must be an array' })
  @IsUUID('4', { each: true, message: 'Each brand ID must be a valid UUIDv4' })
  @IsOptional()
  @Transform(({ value }) => (Array.isArray(value) ? value : [value]))
  brandIds?: string[]

  @ApiPropertyOptional({
    type: [String],
    description: 'Filter by country of origin IDs (OR logic)',
    example: ['country-1', 'country-2']
  })
  @IsArray({ message: 'Country IDs must be an array' })
  @IsUUID('4', { each: true, message: 'Each country ID must be a valid UUIDv4' })
  @IsOptional()
  @Transform(({ value }) => (Array.isArray(value) ? value : [value]))
  countryOriginIds?: string[]

  @ApiPropertyOptional({
    type: [AttributeFilterDto],
    description: 'Faceted attribute filtering',
    example: [{ attributeId: 'color-id', valueIds: ['red-id', 'blue-id'] }]
  })
  @IsArray({ message: 'Attribute filters must be an array' })
  @ValidateNested({ each: true })
  @Type(() => AttributeFilterDto)
  @IsOptional()
  attributeFilters?: AttributeFilterDto[]

  @ApiPropertyOptional({
    example: 10.0,
    description: 'Minimum price'
  })
  @IsNumber({}, { message: 'Minimum price must be a number' })
  @Min(0, { message: 'Minimum price must be at least 0' })
  @IsOptional()
  @Type(() => Number)
  priceMin?: number

  @ApiPropertyOptional({
    example: 100.0,
    description: 'Maximum price'
  })
  @IsNumber({}, { message: 'Maximum price must be a number' })
  @Min(0, { message: 'Maximum price must be at least 0' })
  @IsOptional()
  @Type(() => Number)
  priceMax?: number

  @ApiPropertyOptional({
    example: 'PUBLISHED',
    description: 'Product status filter'
  })
  @IsString({ message: 'Status must be a string' })
  @IsOptional()
  status?: string

  @ApiPropertyOptional({
    example: 0,
    description: 'Starting index for pagination'
  })
  @IsInt({ message: 'From must be an integer' })
  @Min(0, { message: 'From must be at least 0' })
  @IsOptional()
  @Type(() => Number)
  from?: number

  @ApiPropertyOptional({
    example: 20,
    description: 'Number of results to return'
  })
  @IsInt({ message: 'Size must be an integer' })
  @Min(1, { message: 'Size must be at least 1' })
  @IsOptional()
  @Type(() => Number)
  size?: number
}
