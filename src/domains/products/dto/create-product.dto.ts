import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { Transform, Type } from 'class-transformer'
import {
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  IsUUID,
  IsUrl,
  MaxLength,
  Min,
  MinLength,
  ValidateNested
} from 'class-validator'
import { ProductStatus } from 'enums'

/**
 * DTO for creating product images
 */
export class CreateProductImageDto {
  @ApiProperty({ example: 'https://example.com/image.jpg' })
  @IsUrl({}, { message: 'URL must be a valid URL' })
  @IsNotEmpty({ message: 'URL is required' })
  url: string

  @IsPositive({ message: 'Display order must be a positive integer' })
  @IsInt({ message: 'Display order must be an integer' })
  @IsOptional()
  displayOrder?: number

  @ApiPropertyOptional({ example: 'Product main image' })
  @IsString({ message: 'Alt text must be a string' })
  @MaxLength(255, { message: 'Alt text must be at most 255 characters' })
  @IsOptional()
  altText?: string
}

/**
 * DTO for variant attribute values
 */
export class CreateVariantAttributeValueDto {
  @ApiProperty({
    example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    description: 'AttributeValue ID from the Attribute table'
  })
  @IsUUID('4', { message: 'Attribute value ID must be a valid UUID' })
  @IsNotEmpty({ message: 'Attribute value ID is required' })
  attributeValueId: string

  @ApiProperty({
    example: 'Red',
    description: 'The actual value for this attribute (e.g., Red, Large)'
  })
  @IsString({ message: 'Attribute value must be a string' })
  @MaxLength(255, { message: 'Attribute value must be at most 255 characters' })
  @MinLength(1, { message: 'Attribute value must be at least 1 character' })
  @IsNotEmpty({ message: 'Attribute value is required' })
  value: string
}

/**
 * DTO for variant images
 */
// export class CreateVariantImageDto {
//   @ApiProperty({ example: 'https://example.com/variant-image.jpg' })
//   @IsUrl({}, { message: 'URL must be a valid URL' })
//   @IsNotEmpty({ message: 'URL is required' })
//   url: string

//   @ApiPropertyOptional({ example: 'Red variant image' })
//   @IsString({ message: 'Alt text must be a string' })
//   @MaxLength(255, { message: 'Alt text must be at most 255 characters' })
//   @IsOptional()
//   altText?: string
// }

/**
 * DTO for creating product variants
 */
export class CreateProductVariantDto {
  @ApiProperty({ example: 'SKU-12345' })
  @IsString({ message: 'SKU must be a string' })
  @MaxLength(100, { message: 'SKU must be at most 100 characters' })
  // @MinLength(1, { message: 'SKU must be at least 1 character' })
  @IsOptional()
  sku?: string

  @ApiProperty({ example: 'Red - Large' })
  @IsString({ message: 'Name must be a string' })
  @MaxLength(255, { message: 'Name must be at most 255 characters' })
  @MinLength(1, { message: 'Name must be at least 1 character' })
  @IsNotEmpty({ message: 'Name is required' })
  name: string

  @ApiProperty({ example: 'BAR-67890' })
  @IsString({ message: 'Barcode must be a string' })
  @MaxLength(100, { message: 'Barcode must be at most 100 characters' })
  // @MinLength(1, { message: 'Barcode must be at least 1 character' })
  @IsOptional()
  barcode?: string | undefined

  @ApiProperty({ example: 50.0, description: 'Cost price in decimal format' })
  @IsNumber({}, { message: 'Cost price must be a number' })
  @Min(0, { message: 'Cost price must be at least 0' })
  @IsNotEmpty({ message: 'Cost price is required' })
  @Type(() => Number)
  costPrice: number

  @ApiProperty({ example: 99.99, description: 'Selling price in decimal format' })
  @IsNumber({}, { message: 'Selling price must be a number' })
  @Min(0, { message: 'Selling price must be at least 0' })
  @IsNotEmpty({ message: 'Selling price is required' })
  @Type(() => Number)
  sellingPrice: number

  @ApiProperty({ example: 100, description: 'Stock quantity' })
  @IsInt({ message: 'Stock on hand must be an integer' })
  @Min(0, { message: 'Stock on hand must be at least 0' })
  @IsOptional()
  stockOnHand?: number

  @ApiPropertyOptional({ example: 'https://example.com/variant.jpg' })
  @IsUrl({}, { message: 'Image URL must be a valid URL' })
  @MaxLength(500, { message: 'Image URL must be at most 500 characters' })
  @IsOptional()
  imageUrl?: string

  @ApiPropertyOptional({ example: 10, description: 'Low stock threshold' })
  @IsInt({ message: 'Low stock threshold must be an integer' })
  @Min(0, { message: 'Low stock threshold must be at least 0' })
  @IsOptional()
  lowStockThreshold?: number

  @ApiPropertyOptional({ example: 1000, description: 'Maximum stock threshold' })
  @IsInt({ message: 'Max stock threshold must be an integer' })
  @Min(0, { message: 'Max stock threshold must be at least 0' })
  @IsOptional()
  maxStockThreshold?: number

  @ApiPropertyOptional({ example: true, default: true })
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean({ message: 'isPrimary must be a boolean' })
  @IsOptional()
  isActive?: boolean

  @ApiProperty({
    type: [CreateVariantAttributeValueDto],
    description: 'Attribute values for this variant (e.g., Color: Red, Size: Large)'
  })
  @IsArray({ message: 'Attribute values must be an array' })
  @ValidateNested({ each: true })
  @Type(() => CreateVariantAttributeValueDto)
  @ArrayMinSize(1, { message: 'At least one attribute value is required' })
  attributeValues: CreateVariantAttributeValueDto[]

  // @ApiPropertyOptional({
  //   type: [CreateVariantImageDto],
  //   description: 'Additional images for this variant'
  // })
  // @IsArray({ message: 'Images must be an array' })
  // @ValidateNested({ each: true })
  // @Type(() => CreateVariantImageDto)
  // @IsOptional()
  // images?: CreateVariantImageDto[]
}

/**
 * DTO for product categories (many-to-many)
 */
export class CreateProductCategoryDto {
  @ApiProperty({
    example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    description: 'Category ID'
  })
  @IsUUID('4', { message: 'Category ID must be a valid UUID' })
  @IsNotEmpty({ message: 'Category ID is required' })
  categoryId: string

  @ApiProperty({
    example: true,
    description: 'Is this the primary category for breadcrumbs?',
    default: false
  })
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean({ message: 'isPrimary must be a boolean' })
  isPrimary: boolean
}

/**
 * DTO for product attributes
 */
export class CreateProductAttributeDto {
  @ApiProperty({
    example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    description: 'Attribute ID (e.g., Color, Size, Material)'
  })
  @IsUUID('4', { message: 'Attribute ID must be a valid UUID' })
  @IsNotEmpty({ message: 'Attribute ID is required' })
  attributeId: string

  @ApiPropertyOptional({
    example: true,
    description: 'Is this attribute required for the product?',
    default: true
  })
  @IsBoolean({ message: 'isRequired must be a boolean value' })
  @IsOptional()
  isRequired?: boolean
}

/**
 * Main DTO for creating a product
 */
export class CreateProductDto {
  @ApiProperty({ example: 'PROD-001' })
  @IsString({ message: 'Code must be a string' })
  @MaxLength(50, { message: 'Code must be at most 50 characters' })
  @MinLength(1, { message: 'Code must be at least 1 character' })
  @IsOptional({ message: 'Code is required' })
  code?: string

  @ApiProperty({ example: 'Premium Cotton T-Shirt' })
  @IsString({ message: 'Name must be a string' })
  @MaxLength(255, { message: 'Name must be at most 255 characters' })
  @MinLength(1, { message: 'Name must be at least 1 character' })
  @IsNotEmpty({ message: 'Name is required' })
  name: string

  @ApiProperty({ example: 'premium-cotton-t-shirt' })
  @IsString({ message: 'Slug must be a string' })
  @MaxLength(255, { message: 'Slug must be at most 255 characters' })
  @MinLength(1, { message: 'Slug must be at least 1 character' })
  @IsString({ message: 'Slug must be a string' })
  @IsOptional({ message: 'Slug is required' })
  slug?: string

  @ApiPropertyOptional({ example: 'High-quality cotton t-shirt with superior comfort' })
  @IsString({ message: 'Description must be a string' })
  @MaxLength(10000, { message: 'Description must be at most 10000 characters' })
  @IsOptional()
  description?: string

  @ApiPropertyOptional({
    enum: ProductStatus,
    example: ProductStatus.PUBLISHED,
    default: ProductStatus.PUBLISHED
  })
  @IsEnum(ProductStatus, {
    message: `Status must be a valid ProductStatus ${Object.values(ProductStatus).join(', ')}`
  })
  @IsOptional()
  status?: ProductStatus

  @ApiProperty({ example: 29.99, description: 'Base price of the product' })
  @Type(() => Number)
  @Min(0, { message: 'Base price must be at least 0' })
  @IsNumber({}, { message: 'Base price must be a number' })
  @IsNotEmpty({ message: 'Base price is required' })
  basePrice: number

  @ApiProperty({
    example: 'b2c3d4e5-f6a7-8901-bcde-f12345678901',
    description: 'Brand ID'
  })
  @IsUUID('4', { message: 'Brand ID must be a valid UUID' })
  @IsNotEmpty({ message: 'Brand ID is required' })
  brandId: string

  @ApiProperty({
    example: 'c3d4e5f6-a7b8-9012-cdef-123456789012',
    description: 'Country of Origin ID'
  })
  @IsUUID('4', { message: 'Country of Origin ID must be a valid UUID' })
  @IsNotEmpty({ message: 'Country of Origin ID is required' })
  countryOriginId: string

  @ApiProperty({
    type: [CreateProductCategoryDto],
    description: 'Categories this product belongs to (including primary)'
  })
  @ValidateNested({ each: true })
  @Type(() => CreateProductCategoryDto)
  @ArrayMinSize(1, { message: 'At least one category is required' })
  @IsArray({ message: 'Categories must be an array' })
  categories: CreateProductCategoryDto[]

  @ApiPropertyOptional({
    type: [CreateProductImageDto],
    description: 'Product images'
  })
  @ValidateNested({ each: true })
  @Type(() => CreateProductImageDto)
  @IsArray({ message: 'Images must be an array' })
  @ArrayMinSize(1, { message: 'At least one image is required' })
  @IsOptional()
  images?: CreateProductImageDto[]

  @ApiProperty({
    type: [CreateProductVariantDto],
    description: 'Product variants with their attributes and stock'
  })
  @ValidateNested({ each: true })
  @Type(() => CreateProductVariantDto)
  // @ArrayMinSize(1, { message: 'At least one variant is required' })
  @IsArray({ message: 'Variants must be an array' })
  @IsOptional()
  variants: CreateProductVariantDto[]

  // @ApiProperty({
  //   type: [CreateProductAttributeDto],
  //   description: 'Attributes that this product has (e.g., Color, Size)'
  // })
  // @IsArray({ message: 'Attributes must be an array' })
  // @ValidateNested({ each: true })
  // @Type(() => CreateProductAttributeDto)
  // @ArrayMinSize(1, { message: 'At least one attribute is required' })
  // attributes: CreateProductAttributeDto[]
}
