import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { Transform, Type } from 'class-transformer'
import {
  IsArray,
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  IsUrl,
  MaxLength,
  Min,
  MinLength,
  ValidateNested
} from 'class-validator'

// ─── Nested DTOs ─────────────────────────────────────────────────────────────

export class CollectionProductItemDto {
  @ApiProperty({ description: 'Product UUID' })
  @IsUUID('4', { message: 'Product ID must be a valid UUID' })
  @IsNotEmpty({ message: 'Product ID is required' })
  productId: string

  @ApiPropertyOptional({ default: 0 })
  @IsOptional()
  @IsInt({ message: 'Display order must be an integer' })
  @Min(0, { message: 'Display order must be at least 0' })
  displayOrder?: number = 0
}

export class CollectionAttributeItemDto {
  @ApiProperty({ description: 'Attribute UUID' })
  @IsUUID('4', { message: 'Attribute ID must be a valid UUID' })
  @IsNotEmpty({ message: 'Attribute ID is required' })
  attributeId: string

  @ApiPropertyOptional({ default: 0 })
  @IsOptional()
  @IsInt({ message: 'Display order must be an integer' })
  @Min(0, { message: 'Display order must be at least 0' })
  displayOrder?: number = 0
}

export class CollectionCategoryItemDto {
  @ApiProperty({ description: 'Category UUID' })
  @IsUUID('4', { message: 'Category ID must be a valid UUID' })
  @IsNotEmpty({ message: 'Category ID is required' })
  categoryId: string
}

// ─── Create Collection ────────────────────────────────────────────────────────

export class CreateCollectionDto {
  @ApiProperty()
  @IsString({ message: 'Title must be a string' })
  @MinLength(1, { message: 'Title must be at least 1 character' })
  @MaxLength(255, { message: 'Title must be at most 255 characters' })
  @IsNotEmpty({ message: 'Title is required' })
  title: string

  @ApiProperty({ description: 'URL-friendly slug, must be unique' })
  @MaxLength(255, { message: 'Slug must be at most 255 characters' })
  @MinLength(1, { message: 'Slug must be at least 1 character' })
  @IsString({ message: 'Slug must be a string' })
  @IsOptional()
  slug?: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString({ message: 'Description must be a string' })
  @MaxLength(10000, { message: 'Description must be at most 10000 characters' })
  description?: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsUrl({}, { message: 'Image URL must be a valid URL' })
  @MaxLength(500, { message: 'Image URL must be at most 500 characters' })
  imageUrl?: string

  @ApiPropertyOptional({ default: true })
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean({ message: 'Is active must be a boolean' })
  isActive?: boolean = true

  // SEO
  @ApiPropertyOptional()
  @IsOptional()
  @IsString({ message: 'Meta title must be a string' })
  @MaxLength(255, { message: 'Meta title must be at most 255 characters' })
  metaTitle?: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString({ message: 'Meta description must be a string' })
  @MaxLength(500, { message: 'Meta description must be at most 500 characters' })
  metaDescription?: string

  // Manually assigned products
  @ApiPropertyOptional({ type: [CollectionProductItemDto] })
  @IsOptional()
  @IsArray({ message: 'Products must be an array' })
  @ValidateNested({ each: true })
  @Type(() => CollectionProductItemDto)
  products?: CollectionProductItemDto[]

  // Attributes to show in the filter panel
  @ApiPropertyOptional({ type: [CollectionAttributeItemDto] })
  @IsOptional()
  @IsArray({ message: 'Attributes must be an array' })
  @ValidateNested({ each: true })
  @Type(() => CollectionAttributeItemDto)
  attributes?: CollectionAttributeItemDto[]

  // Categories to show in the filter panel
  @ApiPropertyOptional({ type: [CollectionCategoryItemDto] })
  @IsOptional()
  @IsArray({ message: 'Categories must be an array' })
  @ValidateNested({ each: true })
  @Type(() => CollectionCategoryItemDto)
  categories?: CollectionCategoryItemDto[]
}
