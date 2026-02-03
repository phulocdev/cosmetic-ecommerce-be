import { IsBoolean, IsNotEmpty, IsOptional, IsString, IsUUID, MaxLength, Min, MinLength } from 'class-validator'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

export class CreateCategoryDto {
  @ApiProperty({ example: 'Laptops', description: 'Category name' })
  @MaxLength(50, { message: 'Name must be at most 50 characters long' })
  @MinLength(1, { message: 'Name must be at least 1 character long' })
  @IsString({ message: 'Name must be a string' })
  @IsNotEmpty({ message: 'Name is required' })
  name: string

  @ApiPropertyOptional({ example: 'laptops', description: 'URL-friendly slug (auto-generated if not provided)' })
  @MaxLength(50, { message: 'Slug must be at most 50 characters long' })
  @MinLength(1, { message: 'Slug must be at least 1 character long' })
  @IsString({ message: 'Slug must be a string' })
  @IsOptional({ message: 'Slug is required' })
  slug?: string

  @ApiPropertyOptional({
    example: 'uuid-parent-category',
    description: 'Parent category ID for hierarchical structure'
  })
  @IsUUID('4', { message: 'Parent ID must be a valid UUID' })
  @IsOptional()
  parentId?: string

  @ApiPropertyOptional({ example: 'Browse our collection of laptops', description: 'Category description' })
  @MaxLength(1000, { message: 'Description must be at most 1000 characters long' })
  @IsString({ message: 'Description must be a string' })
  @IsOptional()
  description?: string

  @ApiPropertyOptional({ example: true, description: 'Whether category is active', default: true })
  @IsBoolean({ message: 'isActive must be a boolean value' })
  @IsOptional()
  isActive?: boolean

  // SEO fields
  @ApiPropertyOptional({ example: 'Buy Laptops Online | Best Prices', description: 'Meta title for SEO' })
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
}
