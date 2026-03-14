import {
  IsArray,
  IsBoolean,
  IsOptional,
  IsString,
  IsUUID,
  IsUrl,
  MaxLength,
  MinLength,
  ValidateNested
} from 'class-validator'
import { Type } from 'class-transformer'
import { ApiPropertyOptional, OmitType, PartialType } from '@nestjs/swagger'
import {
  CreateProductAttributeDto,
  CreateProductCategoryDto,
  CreateProductDto,
  CreateProductImageDto,
  CreateProductVariantDto,
  CreateVariantAttributeValueDto
} from './create-product.dto'

/**
 * DTO for updating product images.
 * Extends CreateProductImageDto (all fields made optional via PartialType).
 * Add id to target an existing record; use _delete: true to remove it.
 */
export class UpdateProductImageDto extends PartialType(CreateProductImageDto) {
  @ApiPropertyOptional({ example: 'existing-image-id' })
  @IsUUID('4', { message: 'ID must be a valid UUID' })
  @IsOptional()
  id?: string

  @ApiPropertyOptional({ example: true, description: 'Set to true to delete this image' })
  @IsBoolean({ message: 'Delete flag must be a boolean value' })
  @IsOptional()
  _delete?: boolean
}

/**
 * DTO for updating variant attribute values.
 * Extends CreateVariantAttributeValueDto (all fields made optional via PartialType).
 */
export class UpdateVariantAttributeValueDto extends PartialType(CreateVariantAttributeValueDto) {
  @ApiPropertyOptional({ example: 'existing-vav-id' })
  @IsUUID('4', { message: 'ID must be a valid UUID' })
  @IsOptional()
  id?: string // id of the VariantAttributeValue record, used for precise deletion if needed

  @ApiPropertyOptional({
    example: true,
    description: 'Set to true to delete this attribute value'
  })
  @IsBoolean({ message: 'Delete flag must be a boolean value' })
  @IsOptional()
  _delete?: boolean
}

/**
 * DTO for updating variant images.
 * CreateVariantImageDto is commented out in the create file, so kept standalone here.
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

  @ApiPropertyOptional({ example: true, description: 'Set to true to delete this image' })
  @IsBoolean({ message: 'Delete flag must be a boolean value' })
  @IsOptional()
  _delete?: boolean
}

/**
 * DTO for updating product variants.
 * Extends CreateProductVariantDto (all fields optional via PartialType).
 * 'sku' is omitted — SKU cannot be changed after creation.
 * 'attributeValues' is omitted and re-declared to use UpdateVariantAttributeValueDto.
 */
export class UpdateProductVariantDto extends PartialType(
  OmitType(CreateProductVariantDto, ['sku', 'attributeValues'] as const)
) {
  @ApiPropertyOptional({ example: 'existing-variant-id' })
  @IsUUID('4', { message: 'ID must be a valid UUID' })
  @IsOptional()
  id?: string

  @ApiPropertyOptional({
    type: [UpdateVariantAttributeValueDto],
    description: 'Attribute values for this variant'
  })
  @IsArray({ message: 'Attribute values must be an array' })
  @ValidateNested({ each: true })
  @Type(() => UpdateVariantAttributeValueDto)
  @IsOptional()
  attributeValues?: UpdateVariantAttributeValueDto[]

  // @ApiPropertyOptional({
  //   type: [UpdateVariantImageDto],
  //   description: 'Images for this variant'
  // })
  // @IsArray({ message: 'Images must be an array' })
  // @ValidateNested({ each: true })
  // @Type(() => UpdateVariantImageDto)
  // @IsOptional()
  // images?: UpdateVariantImageDto[]

  @ApiPropertyOptional({ example: true, description: 'Set to true to delete this variant' })
  @IsBoolean({ message: 'Delete flag must be a boolean value' })
  @IsOptional()
  _delete?: boolean
}

/**
 * DTO for updating product categories.
 * Extends CreateProductCategoryDto (all fields optional via PartialType).
 */
export class UpdateProductCategoryDto extends PartialType(CreateProductCategoryDto) {
  @ApiPropertyOptional({ example: 'existing-product-category-id' })
  @IsUUID('4', { message: 'ID must be a valid UUID' })
  @IsOptional()
  id?: string

  @ApiPropertyOptional({
    example: true,
    description: 'Set to true to delete this category association'
  })
  @IsBoolean({ message: 'Delete flag must be a boolean value' })
  @IsOptional()
  _delete?: boolean
}

/**
 * DTO for updating product attributes.
 * Extends CreateProductAttributeDto (all fields optional via PartialType).
 */
export class UpdateProductAttributeDto extends PartialType(CreateProductAttributeDto) {
  @ApiPropertyOptional({ example: 'existing-product-attribute-id' })
  @IsUUID('4', { message: 'ID must be a valid UUID' })
  @IsOptional()
  id?: string

  @ApiPropertyOptional({ example: true, description: 'Set to true to delete this attribute' })
  @IsBoolean({ message: 'Delete flag must be a boolean value' })
  @IsOptional()
  _delete?: boolean
}

/**
 * Main DTO for updating a product.
 * Extends CreateProductDto (all scalar fields optional via PartialType).
 * Nested arrays that use Update* types are omitted from the base and re-declared here.
 */
export class UpdateProductDto extends PartialType(
  OmitType(CreateProductDto, ['categories', 'images', 'variants'] as const)
) {
  @ApiPropertyOptional({ example: 'PROD-001' })
  @IsString({ message: 'Code must be a string' })
  @MaxLength(50, { message: 'Code must be at most 50 characters' })
  @MinLength(1, { message: 'Code must be at least 1 character' })
  @IsOptional()
  code?: string

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
