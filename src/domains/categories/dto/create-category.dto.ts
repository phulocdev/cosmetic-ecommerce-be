import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { Transform } from 'class-transformer'
import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  IsUUID,
  MaxLength,
  MinLength
} from 'class-validator'

export class CreateCategoryDto {
  @ApiProperty({ example: 'Laptops', description: 'Category name' })
  @MaxLength(255, { message: 'Name must be at most 255 characters long' })
  @MinLength(1, { message: 'Name must be at least 1 character long' })
  @IsString({ message: 'Name must be a string' })
  @IsNotEmpty({ message: 'Name is required' })
  name: string

  @ApiPropertyOptional({
    example: 'laptops',
    description: 'URL-friendly slug (auto-generated if not provided)'
  })
  @MaxLength(255, { message: 'Slug must be at most 255 characters long' })
  @IsString({ message: 'Slug must be a string' })
  @IsOptional({ message: 'Slug is required' })
  slug?: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsUrl({}, { message: 'Image URL must be a valid URL' })
  @MaxLength(500, { message: 'Image URL must be at most 500 characters' })
  imageUrl?: string

  @ApiPropertyOptional({
    example: 'uuid-parent-category',
    description: 'Parent category ID for hierarchical structure'
  })
  @IsUUID('4', { message: 'Parent ID must be a valid UUID' })
  @IsOptional()
  parentId?: string

  @ApiPropertyOptional({
    example: 'Browse our collection of laptops',
    description: 'Category description'
  })
  @MaxLength(1000, { message: 'Description must be at most 1000 characters long' })
  @IsString({ message: 'Description must be a string' })
  @IsOptional()
  description?: string

  @ApiPropertyOptional({ example: true, description: 'Whether category is active', default: true })
  @IsBoolean()
  @Transform(({ value }) => value === 'true' || value === true)
  @IsOptional()
  isActive?: boolean

  // SEO fields
  @ApiPropertyOptional({
    example: 'Buy Laptops Online | Best Prices',
    description: 'Meta title for SEO'
  })
  @MaxLength(200, { message: 'Meta title must be at most 200 characters long' })
  @IsString({ message: 'Meta title must be a string' })
  @IsOptional()
  metaTitle?: string

  @ApiPropertyOptional({
    example: 'Shop the latest laptops with free shipping',
    description: 'Meta description for SEO'
  })
  @MaxLength(300, { message: 'Meta description must be at most 300 characters long' })
  @IsString({ message: 'Meta description must be a string' })
  @IsOptional()
  metaDescription?: string

  @IsOptional()
  @IsArray()
  @IsUUID('4', { each: true })
  attributeIds?: string[]
}
