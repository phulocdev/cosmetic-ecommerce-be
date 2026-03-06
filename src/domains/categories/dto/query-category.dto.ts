import { IsOptional, IsString, IsBoolean, IsInt, Min, IsEnum, IsUUID } from 'class-validator'
import { Type, Transform } from 'class-transformer'
import { ApiPropertyOptional } from '@nestjs/swagger'

export class GetCategoriesQueryDto {
  @ApiPropertyOptional({ example: 1, description: 'Page number', default: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1

  @ApiPropertyOptional({ example: 20, description: 'Items per page', default: 20 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number = 20

  @ApiPropertyOptional({ example: 'laptops', description: 'Search by name or slug' })
  @IsOptional()
  @IsString()
  search?: string

  @ApiPropertyOptional({ example: 'uuid-parent-id', description: 'Filter by parent category ID' })
  @IsOptional()
  @IsUUID('4', { message: 'Parent ID must be a valid UUID' })
  parentId?: string

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
}

export enum CategoryTreeFormat {
  NESTED = 'nested',
  FLAT = 'flat'
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
}

export class MoveCategoryDto {
  @ApiPropertyOptional({
    example: 'uuid-new-parent-id',
    description: 'New parent category ID (null for root)'
  })
  @IsUUID('4', { message: 'New newParentId must be a valid UUID or Null' })
  newParentId: string | null
}
