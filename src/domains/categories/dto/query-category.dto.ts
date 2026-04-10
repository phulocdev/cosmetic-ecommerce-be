import { IsOptional, IsString, IsBoolean, IsInt, Min, IsEnum, IsUUID, Max } from 'class-validator'
import { Type, Transform } from 'class-transformer'
import { ApiPropertyOptional } from '@nestjs/swagger'
import { PaginationQueryDto } from 'core'
import { CategorySortBy, CategoryTreeFormat } from 'enums'

export class GetCategoriesQueryDto extends PaginationQueryDto {
  @ApiPropertyOptional({ example: 'laptops', description: 'Search by name or slug' })
  @IsOptional()
  @IsString()
  search?: string

  @ApiPropertyOptional({ example: 'uuid-parent-id', description: 'Filter by parent category ID' })
  @IsOptional()
  @IsUUID('4', { message: 'Parent ID must be a valid UUID' })
  parentId?: string

  @ApiPropertyOptional({ example: true, description: 'Filter by deleted status' })
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean()
  isDeleted?: boolean

  @ApiPropertyOptional({ example: true, description: 'Filter by active status' })
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean()
  isActive?: boolean

  @ApiPropertyOptional({ example: 0, description: 'Filter by depth level' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  depth?: number

  @ApiPropertyOptional({
    enum: CategorySortBy,
    enumName: 'CategorySortBy',
    example: CategorySortBy.CREATED_AT,
    default: CategorySortBy.CREATED_AT
  })
  @IsEnum(CategorySortBy, {
    message: `Sort by must be a valid CategorySortBy: ${Object.values(CategorySortBy).join(', ')}`
  })
  @IsOptional()
  sortBy?: CategorySortBy = CategorySortBy.CREATED_AT

  @ApiPropertyOptional({
    example: true,
    description: 'Include children in response',
    default: false
  })
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean()
  includeChildren?: boolean

  @ApiPropertyOptional({
    example: true,
    description: 'Include parent category in response',
    default: false
  })
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean()
  includeParent?: boolean

  @ApiPropertyOptional({ example: true, description: 'Include product count', default: false })
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean()
  includeProductCount?: boolean

  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean()
  includeAttributes?: boolean

  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean()
  getAll?: boolean
}

export class GetCategoryTreeQueryDto {
  @ApiPropertyOptional({ example: 'uuid-root-id', description: 'Root category ID (optional)' })
  @IsOptional()
  @IsUUID('4', { message: 'Root ID must be a valid UUID' })
  rootId?: string

  @ApiPropertyOptional({ example: 3, description: 'Maximum depth to fetch' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  maxDepth?: number

  @ApiPropertyOptional({ example: true, description: 'Filter by deleted status' })
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean()
  isDeleted?: boolean

  @ApiPropertyOptional({
    example: true,
    description: 'Include only active categories',
    default: true
  })
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean()
  activeOnly?: boolean = true

  @ApiPropertyOptional({
    enum: CategoryTreeFormat,
    example: CategoryTreeFormat.NESTED,
    description: 'Response format',
    default: CategoryTreeFormat.NESTED
  })
  @IsOptional()
  @IsEnum(CategoryTreeFormat)
  format?: CategoryTreeFormat = CategoryTreeFormat.NESTED

  @ApiPropertyOptional({
    example: true,
    description: 'Include product count for each category',
    default: false
  })
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean()
  includeProductCount?: boolean

  @IsInt({ message: 'Limit must be an integer' })
  @Min(1, { message: 'Limit must be at least 1' })
  @Max(100, { message: 'Limit must be at most 100' })
  @IsOptional()
  @Type(() => Number)
  limit?: number = 5
}

export class MoveCategoryDto {
  @ApiPropertyOptional({
    example: 'uuid-new-parent-id',
    description: 'New parent category ID (null for root)'
  })
  @IsUUID('4', { message: 'New newParentId must be a valid UUID or Null' })
  newParentId: string | null
}
