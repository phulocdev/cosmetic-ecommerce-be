import { IsOptional, IsString, IsBoolean, IsEnum, IsUUID, IsArray } from 'class-validator'
import { Transform } from 'class-transformer'
import { ApiPropertyOptional } from '@nestjs/swagger'
import { PaginationQueryDto } from 'core'
import { CollectionSortBy } from 'enums'

export class GetCollectionsQueryDto extends PaginationQueryDto {
  @ApiPropertyOptional({ example: 'summer collection', description: 'Search by title or slug' })
  @IsOptional()
  @IsString({ message: 'Search must be a string' })
  search?: string

  @ApiPropertyOptional({ example: true, description: 'Filter by deleted status' })
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean({ message: 'isDeleted must be a boolean' })
  isDeleted?: boolean

  @ApiPropertyOptional({ example: true, description: 'Filter by active status' })
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean({ message: 'isActive must be a boolean' })
  isActive?: boolean

  @ApiPropertyOptional({
    enum: CollectionSortBy,
    enumName: 'CollectionSortBy',
    example: CollectionSortBy.CREATED_AT,
    default: CollectionSortBy.CREATED_AT,
    description: 'Field to sort collections by'
  })
  @IsEnum(CollectionSortBy, {
    message: `Sort by must be a valid CollectionSortBy: ${Object.values(CollectionSortBy).join(
      ', '
    )}`
  })
  @IsOptional()
  sortBy?: CollectionSortBy = CollectionSortBy.CREATED_AT

  @ApiPropertyOptional({
    example: true,
    description: 'Include product count in response',
    default: false
  })
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean({ message: 'includeProductCount must be a boolean' })
  includeProductCount?: boolean

  @ApiPropertyOptional({
    example: true,
    description: 'Include products in response',
    default: false
  })
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean({ message: 'includeProducts must be a boolean' })
  includeProducts?: boolean

  @ApiPropertyOptional({
    example: true,
    description: 'Include attributes in response',
    default: false
  })
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean({ message: 'includeAttributes must be a boolean' })
  includeAttributes?: boolean

  @ApiPropertyOptional({
    example: true,
    description: 'Include categories in response',
    default: false
  })
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean({ message: 'includeCategories must be a boolean' })
  includeCategories?: boolean
}

export class DeriveFromProductsDto {
  @IsOptional()
  @IsArray()
  @IsUUID('4', { each: true })
  productIds?: string[]
}
