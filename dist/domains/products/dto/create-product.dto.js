"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateProductDto = exports.CreateProductAttributeDto = exports.CreateProductCategoryDto = exports.CreateProductVariantDto = exports.CreateVariantAttributeValueDto = exports.CreateProductImageDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const enums_1 = require("../../../enums");
class CreateProductImageDto {
    url;
    displayOrder;
    altText;
}
exports.CreateProductImageDto = CreateProductImageDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'https://example.com/image.jpg' }),
    (0, class_validator_1.IsUrl)({}, { message: 'URL must be a valid URL' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'URL is required' }),
    __metadata("design:type", String)
], CreateProductImageDto.prototype, "url", void 0);
__decorate([
    (0, class_validator_1.IsPositive)({ message: 'Display order must be a positive integer' }),
    (0, class_validator_1.IsInt)({ message: 'Display order must be an integer' }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], CreateProductImageDto.prototype, "displayOrder", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Product main image' }),
    (0, class_validator_1.IsString)({ message: 'Alt text must be a string' }),
    (0, class_validator_1.MaxLength)(255, { message: 'Alt text must be at most 255 characters' }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateProductImageDto.prototype, "altText", void 0);
class CreateVariantAttributeValueDto {
    attributeValueId;
    value;
}
exports.CreateVariantAttributeValueDto = CreateVariantAttributeValueDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
        description: 'AttributeValue ID from the Attribute table'
    }),
    (0, class_validator_1.IsUUID)('4', { message: 'Attribute value ID must be a valid UUID' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Attribute value ID is required' }),
    __metadata("design:type", String)
], CreateVariantAttributeValueDto.prototype, "attributeValueId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'Red',
        description: 'The actual value for this attribute (e.g., Red, Large)'
    }),
    (0, class_validator_1.IsString)({ message: 'Attribute value must be a string' }),
    (0, class_validator_1.MaxLength)(255, { message: 'Attribute value must be at most 255 characters' }),
    (0, class_validator_1.MinLength)(1, { message: 'Attribute value must be at least 1 character' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Attribute value is required' }),
    __metadata("design:type", String)
], CreateVariantAttributeValueDto.prototype, "value", void 0);
class CreateProductVariantDto {
    sku;
    name;
    barcode;
    costPrice;
    sellingPrice;
    stockOnHand;
    imageUrl;
    lowStockThreshold;
    maxStockThreshold;
    isActive;
    attributeValues;
}
exports.CreateProductVariantDto = CreateProductVariantDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'SKU-12345' }),
    (0, class_validator_1.IsString)({ message: 'SKU must be a string' }),
    (0, class_validator_1.MaxLength)(100, { message: 'SKU must be at most 100 characters' }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateProductVariantDto.prototype, "sku", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Red - Large' }),
    (0, class_validator_1.IsString)({ message: 'Name must be a string' }),
    (0, class_validator_1.MaxLength)(255, { message: 'Name must be at most 255 characters' }),
    (0, class_validator_1.MinLength)(1, { message: 'Name must be at least 1 character' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Name is required' }),
    __metadata("design:type", String)
], CreateProductVariantDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'BAR-67890' }),
    (0, class_validator_1.IsString)({ message: 'Barcode must be a string' }),
    (0, class_validator_1.MaxLength)(100, { message: 'Barcode must be at most 100 characters' }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateProductVariantDto.prototype, "barcode", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 50.0, description: 'Cost price in decimal format' }),
    (0, class_validator_1.IsNumber)({}, { message: 'Cost price must be a number' }),
    (0, class_validator_1.Min)(0, { message: 'Cost price must be at least 0' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Cost price is required' }),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], CreateProductVariantDto.prototype, "costPrice", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 99.99, description: 'Selling price in decimal format' }),
    (0, class_validator_1.IsNumber)({}, { message: 'Selling price must be a number' }),
    (0, class_validator_1.Min)(0, { message: 'Selling price must be at least 0' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Selling price is required' }),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], CreateProductVariantDto.prototype, "sellingPrice", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 100, description: 'Stock quantity' }),
    (0, class_validator_1.IsInt)({ message: 'Stock on hand must be an integer' }),
    (0, class_validator_1.Min)(0, { message: 'Stock on hand must be at least 0' }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], CreateProductVariantDto.prototype, "stockOnHand", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'https://example.com/variant.jpg' }),
    (0, class_validator_1.IsUrl)({}, { message: 'Image URL must be a valid URL' }),
    (0, class_validator_1.MaxLength)(500, { message: 'Image URL must be at most 500 characters' }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateProductVariantDto.prototype, "imageUrl", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 10, description: 'Low stock threshold' }),
    (0, class_validator_1.IsInt)({ message: 'Low stock threshold must be an integer' }),
    (0, class_validator_1.Min)(0, { message: 'Low stock threshold must be at least 0' }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], CreateProductVariantDto.prototype, "lowStockThreshold", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 1000, description: 'Maximum stock threshold' }),
    (0, class_validator_1.IsInt)({ message: 'Max stock threshold must be an integer' }),
    (0, class_validator_1.Min)(0, { message: 'Max stock threshold must be at least 0' }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], CreateProductVariantDto.prototype, "maxStockThreshold", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: true, default: true }),
    (0, class_transformer_1.Transform)(({ value }) => value === 'true' || value === true),
    (0, class_validator_1.IsBoolean)({ message: 'isPrimary must be a boolean' }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], CreateProductVariantDto.prototype, "isActive", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: [CreateVariantAttributeValueDto],
        description: 'Attribute values for this variant (e.g., Color: Red, Size: Large)'
    }),
    (0, class_validator_1.IsArray)({ message: 'Attribute values must be an array' }),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => CreateVariantAttributeValueDto),
    (0, class_validator_1.ArrayMinSize)(1, { message: 'At least one attribute value is required' }),
    __metadata("design:type", Array)
], CreateProductVariantDto.prototype, "attributeValues", void 0);
class CreateProductCategoryDto {
    categoryId;
    isPrimary;
}
exports.CreateProductCategoryDto = CreateProductCategoryDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
        description: 'Category ID'
    }),
    (0, class_validator_1.IsUUID)('4', { message: 'Category ID must be a valid UUID' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Category ID is required' }),
    __metadata("design:type", String)
], CreateProductCategoryDto.prototype, "categoryId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: true,
        description: 'Is this the primary category for breadcrumbs?',
        default: false
    }),
    (0, class_transformer_1.Transform)(({ value }) => value === 'true' || value === true),
    (0, class_validator_1.IsBoolean)({ message: 'isPrimary must be a boolean' }),
    __metadata("design:type", Boolean)
], CreateProductCategoryDto.prototype, "isPrimary", void 0);
class CreateProductAttributeDto {
    attributeId;
    isRequired;
}
exports.CreateProductAttributeDto = CreateProductAttributeDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
        description: 'Attribute ID (e.g., Color, Size, Material)'
    }),
    (0, class_validator_1.IsUUID)('4', { message: 'Attribute ID must be a valid UUID' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Attribute ID is required' }),
    __metadata("design:type", String)
], CreateProductAttributeDto.prototype, "attributeId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: true,
        description: 'Is this attribute required for the product?',
        default: true
    }),
    (0, class_validator_1.IsBoolean)({ message: 'isRequired must be a boolean value' }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], CreateProductAttributeDto.prototype, "isRequired", void 0);
class CreateProductDto {
    code;
    name;
    slug;
    description;
    status;
    basePrice;
    brandId;
    countryOriginId;
    categories;
    images;
    variants;
}
exports.CreateProductDto = CreateProductDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'PROD-001' }),
    (0, class_validator_1.IsString)({ message: 'Code must be a string' }),
    (0, class_validator_1.MaxLength)(50, { message: 'Code must be at most 50 characters' }),
    (0, class_validator_1.MinLength)(1, { message: 'Code must be at least 1 character' }),
    (0, class_validator_1.IsOptional)({ message: 'Code is required' }),
    __metadata("design:type", String)
], CreateProductDto.prototype, "code", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Premium Cotton T-Shirt' }),
    (0, class_validator_1.IsString)({ message: 'Name must be a string' }),
    (0, class_validator_1.MaxLength)(255, { message: 'Name must be at most 255 characters' }),
    (0, class_validator_1.MinLength)(1, { message: 'Name must be at least 1 character' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Name is required' }),
    __metadata("design:type", String)
], CreateProductDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'premium-cotton-t-shirt' }),
    (0, class_validator_1.IsString)({ message: 'Slug must be a string' }),
    (0, class_validator_1.MaxLength)(255, { message: 'Slug must be at most 255 characters' }),
    (0, class_validator_1.MinLength)(1, { message: 'Slug must be at least 1 character' }),
    (0, class_validator_1.IsString)({ message: 'Slug must be a string' }),
    (0, class_validator_1.IsOptional)({ message: 'Slug is required' }),
    __metadata("design:type", String)
], CreateProductDto.prototype, "slug", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'High-quality cotton t-shirt with superior comfort' }),
    (0, class_validator_1.IsString)({ message: 'Description must be a string' }),
    (0, class_validator_1.MaxLength)(10000, { message: 'Description must be at most 10000 characters' }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateProductDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        enum: enums_1.ProductStatus,
        example: enums_1.ProductStatus.PUBLISHED,
        default: enums_1.ProductStatus.PUBLISHED
    }),
    (0, class_validator_1.IsEnum)(enums_1.ProductStatus, {
        message: `Status must be a valid ProductStatus ${Object.values(enums_1.ProductStatus).join(', ')}`
    }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateProductDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 29.99, description: 'Base price of the product' }),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.Min)(0, { message: 'Base price must be at least 0' }),
    (0, class_validator_1.IsNumber)({}, { message: 'Base price must be a number' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Base price is required' }),
    __metadata("design:type", Number)
], CreateProductDto.prototype, "basePrice", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'b2c3d4e5-f6a7-8901-bcde-f12345678901',
        description: 'Brand ID'
    }),
    (0, class_validator_1.IsUUID)('4', { message: 'Brand ID must be a valid UUID' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Brand ID is required' }),
    __metadata("design:type", String)
], CreateProductDto.prototype, "brandId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'c3d4e5f6-a7b8-9012-cdef-123456789012',
        description: 'Country of Origin ID'
    }),
    (0, class_validator_1.IsUUID)('4', { message: 'Country of Origin ID must be a valid UUID' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Country of Origin ID is required' }),
    __metadata("design:type", String)
], CreateProductDto.prototype, "countryOriginId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: [CreateProductCategoryDto],
        description: 'Categories this product belongs to (including primary)'
    }),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => CreateProductCategoryDto),
    (0, class_validator_1.ArrayMinSize)(1, { message: 'At least one category is required' }),
    (0, class_validator_1.IsArray)({ message: 'Categories must be an array' }),
    __metadata("design:type", Array)
], CreateProductDto.prototype, "categories", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        type: [CreateProductImageDto],
        description: 'Product images'
    }),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => CreateProductImageDto),
    (0, class_validator_1.IsArray)({ message: 'Images must be an array' }),
    (0, class_validator_1.ArrayMinSize)(1, { message: 'At least one image is required' }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], CreateProductDto.prototype, "images", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: [CreateProductVariantDto],
        description: 'Product variants with their attributes and stock'
    }),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => CreateProductVariantDto),
    (0, class_validator_1.ArrayMinSize)(1, { message: 'At least one variant is required' }),
    (0, class_validator_1.IsArray)({ message: 'Variants must be an array' }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], CreateProductDto.prototype, "variants", void 0);
//# sourceMappingURL=create-product.dto.js.map