import {
  IsString,
  IsOptional,
  IsArray,
  ValidateNested,
  IsBoolean,
  IsUUID,
  IsEnum,
  Min,
  IsInt,
  IsNumber,
  IsUrl,
  MaxLength,
  MinLength
} from 'class-validator'
import { Type } from 'class-transformer'
import { ApiPropertyOptional } from '@nestjs/swagger'
import { ProductStatus } from 'enums'

/**
 * DTO for updating product images
 */
export class UpdateProductImageDto {
  @ApiPropertyOptional({ example: 'existing-image-id' })
  @IsUUID('4', { message: 'ID must be a valid UUID' })
  @IsOptional()
  id?: string // If provided, updates existing image; if null, creates new

  @ApiPropertyOptional({ example: 'https://example.com/image.jpg' })
  @IsUrl({}, { message: 'URL must be a valid URL' })
  @MaxLength(500, { message: 'URL must be at most 500 characters' })
  @IsOptional()
  url?: string

  @ApiPropertyOptional({ example: 'Product main image' })
  @IsString({ message: 'Alt text must be a string' })
  @MaxLength(255, { message: 'Alt text must be at most 255 characters' })
  @IsOptional()
  altText?: string

  @ApiPropertyOptional({
    example: true,
    description: 'Set to true to delete this image'
  })
  @IsBoolean({ message: 'Delete flag must be a boolean value' })
  @IsOptional()
  _delete?: boolean
}

/**
 * DTO for updating variant attribute values
 */
export class UpdateVariantAttributeValueDto {
  @ApiPropertyOptional({ example: 'existing-vav-id' })
  @IsUUID('4', { message: 'ID must be a valid UUID' })
  @IsOptional()
  id?: string

  @ApiPropertyOptional({
    example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    description: 'AttributeValue ID from the Attribute table'
  })
  @IsUUID('4', { message: 'Attribute value ID must be a valid UUID' })
  @IsOptional()
  attributeValueId?: string

  @ApiPropertyOptional({
    example: true,
    description: 'Set to true to delete this attribute value'
  })
  @IsBoolean({ message: 'Delete flag must be a boolean value' })
  @IsOptional()
  _delete?: boolean
}

/**
 * DTO for updating variant images
 */
export class UpdateVariantImageDto {
  @ApiPropertyOptional({ example: 'existing-variant-image-id' })
  @IsUUID('4', { message: 'ID must be a valid UUID' })
  @IsOptional()
  id?: string

  @ApiPropertyOptional({ example: 'https://example.com/variant-image.jpg' })
  @IsUrl({}, { message: 'URL must be a valid URL' })
  @MaxLength(500, { message: 'URL must be at most 500 characters' })
  @IsOptional()
  url?: string

  @ApiPropertyOptional({ example: 'Red variant image' })
  @IsString({ message: 'Alt text must be a string' })
  @MaxLength(255, { message: 'Alt text must be at most 255 characters' })
  @IsOptional()
  altText?: string

  @ApiPropertyOptional({
    example: true,
    description: 'Set to true to delete this image'
  })
  @IsBoolean({ message: 'Delete flag must be a boolean value' })
  @IsOptional()
  _delete?: boolean
}

/**
 * DTO for updating product variants
 */
export class UpdateProductVariantDto {
  @ApiPropertyOptional({ example: 'existing-variant-id' })
  @IsUUID('4', { message: 'ID must be a valid UUID' })
  @IsOptional()
  id?: string // If provided, updates existing; if null, creates new

  @ApiPropertyOptional({ example: 'SKU-12345' })
  @IsString({ message: 'SKU must be a string' })
  @MaxLength(100, { message: 'SKU must be at most 100 characters' })
  @MinLength(1, { message: 'SKU must be at least 1 character' })
  @IsOptional()
  sku?: string

  @ApiPropertyOptional({ example: 'Red - Large' })
  @IsString({ message: 'Name must be a string' })
  @MaxLength(255, { message: 'Name must be at most 255 characters' })
  @MinLength(1, { message: 'Name must be at least 1 character' })
  @IsOptional()
  name?: string

  @ApiPropertyOptional({ example: 'BAR-67890' })
  @IsString({ message: 'Barcode must be a string' })
  @MaxLength(100, { message: 'Barcode must be at most 100 characters' })
  @MinLength(1, { message: 'Barcode must be at least 1 character' })
  @IsOptional()
  barcode?: string

  @ApiPropertyOptional({ example: 50.0, description: 'Cost price in decimal format' })
  @IsNumber({}, { message: 'Cost price must be a number' })
  @Min(0, { message: 'Cost price must be at least 0' })
  @Type(() => Number)
  @IsOptional()
  costPrice?: number

  @ApiPropertyOptional({ example: 99.99, description: 'Selling price in decimal format' })
  @IsNumber({}, { message: 'Selling price must be a number' })
  @Min(0, { message: 'Selling price must be at least 0' })
  @Type(() => Number)
  @IsOptional()
  sellingPrice?: number

  @ApiPropertyOptional({ example: 100, description: 'Stock quantity' })
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

  @ApiPropertyOptional({ example: true })
  @IsBoolean({ message: 'isActive must be a boolean value' })
  @IsOptional()
  isActive?: boolean

  @ApiPropertyOptional({
    type: [UpdateVariantAttributeValueDto],
    description: 'Attribute values for this variant'
  })
  @IsArray({ message: 'Attribute values must be an array' })
  @ValidateNested({ each: true })
  @Type(() => UpdateVariantAttributeValueDto)
  @IsOptional()
  attributeValues?: UpdateVariantAttributeValueDto[]

  @ApiPropertyOptional({
    type: [UpdateVariantImageDto],
    description: 'Images for this variant'
  })
  @IsArray({ message: 'Images must be an array' })
  @ValidateNested({ each: true })
  @Type(() => UpdateVariantImageDto)
  @IsOptional()
  images?: UpdateVariantImageDto[]

  @ApiPropertyOptional({
    example: true,
    description: 'Set to true to delete this variant'
  })
  @IsBoolean({ message: 'Delete flag must be a boolean value' })
  @IsOptional()
  _delete?: boolean
}

/**
 * DTO for updating product categories (many-to-many)
 */
export class UpdateProductCategoryDto {
  @ApiPropertyOptional({ example: 'existing-product-category-id' })
  @IsUUID('4', { message: 'ID must be a valid UUID' })
  @IsOptional()
  id?: string

  @ApiPropertyOptional({
    example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    description: 'Category ID'
  })
  @IsUUID('4', { message: 'Category ID must be a valid UUID' })
  @IsOptional()
  categoryId?: string

  @ApiPropertyOptional({
    example: true,
    description: 'Is this the primary category for breadcrumbs?'
  })
  @IsBoolean({ message: 'isPrimary must be a boolean value' })
  @IsOptional()
  isPrimary?: boolean

  @ApiPropertyOptional({
    example: true,
    description: 'Set to true to delete this category association'
  })
  @IsBoolean({ message: 'Delete flag must be a boolean value' })
  @IsOptional()
  _delete?: boolean
}

/**
 * DTO for updating product attributes
 */
export class UpdateProductAttributeDto {
  @ApiPropertyOptional({ example: 'existing-product-attribute-id' })
  @IsUUID('4', { message: 'ID must be a valid UUID' })
  @IsOptional()
  id?: string

  @ApiPropertyOptional({
    example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    description: 'Attribute ID'
  })
  @IsUUID('4', { message: 'Attribute ID must be a valid UUID' })
  @IsOptional()
  attributeId?: string

  @ApiPropertyOptional({
    example: true,
    description: 'Is this attribute required for the product?'
  })
  @IsBoolean({ message: 'isRequired must be a boolean value' })
  @IsOptional()
  isRequired?: boolean

  @ApiPropertyOptional({
    example: true,
    description: 'Set to true to delete this attribute'
  })
  @IsBoolean({ message: 'Delete flag must be a boolean value' })
  @IsOptional()
  _delete?: boolean
}

/**
 * Main DTO for updating a product
 * All fields are optional - only provided fields will be updated
 */
export class UpdateProductDto {
  @ApiPropertyOptional({ example: 'PROD-001' })
  @IsString({ message: 'Code must be a string' })
  @MaxLength(50, { message: 'Code must be at most 50 characters' })
  @MinLength(1, { message: 'Code must be at least 1 character' })
  @IsOptional()
  code?: string

  @ApiPropertyOptional({ example: 'Premium Cotton T-Shirt' })
  @IsString({ message: 'Name must be a string' })
  @MaxLength(255, { message: 'Name must be at most 255 characters' })
  @MinLength(1, { message: 'Name must be at least 1 character' })
  @IsOptional()
  name?: string

  @ApiPropertyOptional({ example: 'premium-cotton-t-shirt' })
  @IsString({ message: 'Slug must be a string' })
  @MaxLength(255, { message: 'Slug must be at most 255 characters' })
  @MinLength(1, { message: 'Slug must be at least 1 character' })
  @IsOptional()
  slug?: string

  @ApiPropertyOptional({ example: 'High-quality cotton t-shirt with superior comfort' })
  @IsString({ message: 'Description must be a string' })
  @MaxLength(2000, { message: 'Description must be at most 2000 characters' })
  @IsOptional()
  description?: string

  @ApiPropertyOptional({
    enum: ProductStatus,
    example: ProductStatus.PUBLISHED
  })
  @IsEnum(ProductStatus, { message: 'Status must be a valid ProductStatus' })
  @IsOptional()
  status?: ProductStatus

  @ApiPropertyOptional({ example: 29.99, description: 'Base price of the product' })
  @IsNumber({}, { message: 'Base price must be a number' })
  @Min(0, { message: 'Base price must be at least 0' })
  @Type(() => Number)
  @IsOptional()
  basePrice?: number

  @ApiPropertyOptional({
    example: 'b2c3d4e5-f6a7-8901-bcde-f12345678901',
    description: 'Brand ID'
  })
  @IsUUID('4', { message: 'Brand ID must be a valid UUID' })
  @IsOptional()
  brandId?: string

  @ApiPropertyOptional({
    example: 'c3d4e5f6-a7b8-9012-cdef-123456789012',
    description: 'Country of Origin ID'
  })
  @IsUUID('4', { message: 'Country of Origin ID must be a valid UUID' })
  @IsOptional()
  countryOriginId?: string

  @ApiPropertyOptional({
    type: [UpdateProductCategoryDto],
    description: 'Update, add, or remove categories. Use _delete: true to remove.'
  })
  @IsArray({ message: 'Categories must be an array' })
  @ValidateNested({ each: true })
  @Type(() => UpdateProductCategoryDto)
  @IsOptional()
  categories?: UpdateProductCategoryDto[]

  @ApiPropertyOptional({
    type: [UpdateProductImageDto],
    description: 'Update, add, or remove product images. Use _delete: true to remove.'
  })
  @IsArray({ message: 'Images must be an array' })
  @ValidateNested({ each: true })
  @Type(() => UpdateProductImageDto)
  @IsOptional()
  images?: UpdateProductImageDto[]

  @ApiPropertyOptional({
    type: [UpdateProductVariantDto],
    description: 'Update, add, or remove variants. Use _delete: true to remove.'
  })
  @IsArray({ message: 'Variants must be an array' })
  @ValidateNested({ each: true })
  @Type(() => UpdateProductVariantDto)
  @IsOptional()
  variants?: UpdateProductVariantDto[]

  @ApiPropertyOptional({
    type: [UpdateProductAttributeDto],
    description: 'Update, add, or remove attributes. Use _delete: true to remove.'
  })
  @IsArray({ message: 'Attributes must be an array' })
  @ValidateNested({ each: true })
  @Type(() => UpdateProductAttributeDto)
  @IsOptional()
  attributes?: UpdateProductAttributeDto[]
}
