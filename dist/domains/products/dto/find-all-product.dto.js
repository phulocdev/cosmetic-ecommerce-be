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
exports.CursorPaginatedProductListResponse = exports.OffsetPaginatedProductListResponse = exports.ProductFiltersAppliedDto = exports.ProductQueryDto = exports.StockRangeDto = exports.PriceRangeDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const pagination_dto_1 = require("../../../core/dto/pagination.dto");
const enums_1 = require("../../../enums");
class PriceRangeDto {
    min;
    max;
}
exports.PriceRangeDto = PriceRangeDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 10.0, description: 'Minimum price' }),
    (0, class_validator_1.IsNumber)({}, { message: 'Minimum price must be a number' }),
    (0, class_validator_1.Min)(0, { message: 'Minimum price must be at least 0' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], PriceRangeDto.prototype, "min", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 100.0, description: 'Maximum price' }),
    (0, class_validator_1.IsNumber)({}, { message: 'Maximum price must be a number' }),
    (0, class_validator_1.Min)(0, { message: 'Maximum price must be at least 0' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], PriceRangeDto.prototype, "max", void 0);
class StockRangeDto {
    min;
    max;
}
exports.StockRangeDto = StockRangeDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 0, description: 'Minimum stock quantity' }),
    (0, class_validator_1.IsInt)({ message: 'Minimum stock must be an integer' }),
    (0, class_validator_1.Min)(0, { message: 'Minimum stock must be at least 0' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], StockRangeDto.prototype, "min", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 1000, description: 'Maximum stock quantity' }),
    (0, class_validator_1.IsInt)({ message: 'Maximum stock must be an integer' }),
    (0, class_validator_1.Min)(0, { message: 'Maximum stock must be at least 0' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], StockRangeDto.prototype, "max", void 0);
class ProductQueryDto extends pagination_dto_1.PaginationQueryDto {
    search;
    status;
    categoryIds;
    categorySlug;
    categoryPath;
    brandIds;
    countryIds;
    minPrice;
    maxPrice;
    attributes;
    inStock;
    minStock;
    maxStock;
    hasActiveVariants;
    minVariantPrice;
    maxVariantPrice;
    sku;
    sortBy = enums_1.ProductSortBy.CREATED_AT;
    includeImages = true;
    includeVariants;
    includeAttributes;
    includeBrandAndCountry = true;
    includeCategories = true;
}
exports.ProductQueryDto = ProductQueryDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: 'cotton shirt',
        description: 'Search in product name, description, or code'
    }),
    (0, class_validator_1.MaxLength)(255, { message: 'Search query must be at most 255 characters' }),
    (0, class_validator_1.IsString)({ message: 'Search query must be a string' }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], ProductQueryDto.prototype, "search", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        type: [String],
        enum: enums_1.ProductStatus,
        enumName: 'ProductStatus',
        example: [enums_1.ProductStatus.PUBLISHED, enums_1.ProductStatus.DRAFT],
        description: 'Filter by product statuses (OR logic)'
    }),
    (0, class_validator_1.IsArray)({ message: 'Status must be an array' }),
    (0, class_validator_1.IsEnum)(enums_1.ProductStatus, {
        each: true,
        message: `Each status must be a valid ProductStatus: ${Object.values(enums_1.ProductStatus).join(', ')}`
    }),
    (0, class_transformer_1.Transform)(({ value }) => {
        if (Array.isArray(value))
            return value;
        if (typeof value === 'string')
            return value.split(',');
        return value;
    }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], ProductQueryDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        type: [String],
        description: 'Filter by category IDs (OR logic)',
        example: ['cat-1', 'cat-2']
    }),
    (0, class_validator_1.IsArray)({ message: 'Category IDs must be an array' }),
    (0, class_validator_1.IsUUID)('4', { each: true, message: 'Each category ID must be a valid UUIDv4' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(({ value }) => (Array.isArray(value) ? value : [value])),
    __metadata("design:type", Array)
], ProductQueryDto.prototype, "categoryIds", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: 'cat-clothing-123',
        description: 'Filter by category slug'
    }),
    (0, class_validator_1.IsString)({ message: 'Category slug must be a string' }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], ProductQueryDto.prototype, "categorySlug", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: '/clothing/tshirts/',
        description: 'Filter by category path (includes subcategories)'
    }),
    (0, class_validator_1.IsString)({ message: 'Category path must be a string' }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], ProductQueryDto.prototype, "categoryPath", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        type: [String],
        description: 'Filter by brand IDs (OR logic)',
        example: ['brand-1', 'brand-2']
    }),
    (0, class_validator_1.IsArray)({ message: 'Brand IDs must be an array' }),
    (0, class_validator_1.IsUUID)('4', { each: true, message: 'Each brand ID must be a valid UUIDv4' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(({ value }) => (Array.isArray(value) ? value : [value])),
    __metadata("design:type", Array)
], ProductQueryDto.prototype, "brandIds", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        type: [String],
        description: 'Filter by country IDs (OR logic)',
        example: ['country-1', 'country-2']
    }),
    (0, class_validator_1.IsArray)({ message: 'Country IDs must be an array' }),
    (0, class_validator_1.IsUUID)('4', { each: true, message: 'Each country ID must be a valid UUIDv4' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(({ value }) => (Array.isArray(value) ? value : [value])),
    __metadata("design:type", Array)
], ProductQueryDto.prototype, "countryIds", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: 10.0,
        description: 'Minimum price'
    }),
    (0, class_validator_1.IsNumber)({}, { message: 'Minimum price must be a number' }),
    (0, class_validator_1.Min)(0, { message: 'Minimum price must be at least 0' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], ProductQueryDto.prototype, "minPrice", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: 100.0,
        description: 'Maximum price'
    }),
    (0, class_validator_1.IsNumber)({}, { message: 'Maximum price must be a number' }),
    (0, class_validator_1.Min)(0, { message: 'Maximum price must be at least 0' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], ProductQueryDto.prototype, "maxPrice", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        type: 'object',
        example: { color: 'red,blue', size: 'large' },
        additionalProperties: { type: 'string' }
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)({ message: 'Attributes must be an object' }),
    __metadata("design:type", Object)
], ProductQueryDto.prototype, "attributes", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: true,
        description: 'Only show products with in-stock variants'
    }),
    (0, class_transformer_1.Transform)(({ value }) => value === 'true' || value === true),
    (0, class_validator_1.IsBoolean)({ message: 'In stock filter must be a boolean' }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], ProductQueryDto.prototype, "inStock", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: 0,
        description: 'Minimum stock quantity across all variants'
    }),
    (0, class_validator_1.IsInt)({ message: 'Minimum stock must be an integer' }),
    (0, class_validator_1.Min)(0, { message: 'Minimum stock must be at least 0' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], ProductQueryDto.prototype, "minStock", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: 1000,
        description: 'Maximum stock quantity across all variants'
    }),
    (0, class_validator_1.IsInt)({ message: 'Maximum stock must be an integer' }),
    (0, class_validator_1.Min)(0, { message: 'Maximum stock must be at least 0' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], ProductQueryDto.prototype, "maxStock", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: true,
        description: 'Only show products with active variants'
    }),
    (0, class_validator_1.IsBoolean)({ message: 'Has active variants filter must be a boolean' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(({ value }) => value === 'true' || value === true),
    __metadata("design:type", Boolean)
], ProductQueryDto.prototype, "hasActiveVariants", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: 10.0,
        description: 'Minimum variant selling price'
    }),
    (0, class_validator_1.IsNumber)({}, { message: 'Minimum variant price must be a number' }),
    (0, class_validator_1.Min)(0, { message: 'Minimum variant price must be at least 0' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], ProductQueryDto.prototype, "minVariantPrice", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: 100.0,
        description: 'Maximum variant selling price'
    }),
    (0, class_validator_1.IsNumber)({}, { message: 'Maximum variant price must be a number' }),
    (0, class_validator_1.Min)(0, { message: 'Maximum variant price must be at least 0' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], ProductQueryDto.prototype, "maxVariantPrice", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: 'SKU-12345',
        description: 'Filter by variant SKU (exact or partial match)'
    }),
    (0, class_validator_1.IsString)({ message: 'SKU must be a string' }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], ProductQueryDto.prototype, "sku", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        enum: enums_1.ProductSortBy,
        enumName: 'ProductSortBy',
        example: enums_1.ProductSortBy.CREATED_AT,
        default: enums_1.ProductSortBy.CREATED_AT
    }),
    (0, class_validator_1.IsEnum)(enums_1.ProductSortBy, {
        message: `Sort by must be a valid ProductSortBy: ${Object.values(enums_1.ProductSortBy).join(', ')}`
    }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], ProductQueryDto.prototype, "sortBy", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: true,
        description: 'Include product images',
        default: false
    }),
    (0, class_validator_1.IsBoolean)({ message: 'Include images must be a boolean' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(({ value }) => value === 'true' || value === true),
    __metadata("design:type", Boolean)
], ProductQueryDto.prototype, "includeImages", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: true,
        description: 'Include product variants',
        default: false
    }),
    (0, class_validator_1.IsBoolean)({ message: 'Include variants must be a boolean' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(({ value }) => value === 'true' || value === true),
    __metadata("design:type", Boolean)
], ProductQueryDto.prototype, "includeVariants", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: true,
        description: 'Include product attributes',
        default: false
    }),
    (0, class_validator_1.IsBoolean)({ message: 'Include attributes must be a boolean' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(({ value }) => value === 'true' || value === true),
    __metadata("design:type", Boolean)
], ProductQueryDto.prototype, "includeAttributes", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: true,
        description: 'Include brand and country information',
        default: true
    }),
    (0, class_validator_1.IsBoolean)({ message: 'Include brand and country must be a boolean' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(({ value }) => value === 'true' || value === true),
    __metadata("design:type", Boolean)
], ProductQueryDto.prototype, "includeBrandAndCountry", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: true,
        description: 'Include category information',
        default: true
    }),
    (0, class_validator_1.IsBoolean)({ message: 'Include categories must be a boolean' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(({ value }) => value === 'true' || value === true),
    __metadata("design:type", Boolean)
], ProductQueryDto.prototype, "includeCategories", void 0);
class ProductFiltersAppliedDto {
    applied;
    available;
}
exports.ProductFiltersAppliedDto = ProductFiltersAppliedDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Applied filters',
        type: 'object',
        example: { status: 'PUBLISHED', brandIds: ['brand-1', 'brand-2'] },
        additionalProperties: { type: 'string' }
    }),
    __metadata("design:type", Object)
], ProductFiltersAppliedDto.prototype, "applied", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Available filters with counts',
        type: 'object',
        example: { status: { PUBLISHED: 120, DRAFT: 30 }, brandIds: { 'brand-1': 80, 'brand-2': 70 } },
        additionalProperties: { type: 'object' }
    }),
    __metadata("design:type", Object)
], ProductFiltersAppliedDto.prototype, "available", void 0);
class OffsetPaginatedProductListResponse extends pagination_dto_1.OffsetPaginatedResponseDto {
    filters;
    constructor({ items, total, page, limit, filters }) {
        super({ items, total, page, limit });
        this.filters = filters;
    }
}
exports.OffsetPaginatedProductListResponse = OffsetPaginatedProductListResponse;
class CursorPaginatedProductListResponse extends pagination_dto_1.CursorPaginatedResponseDto {
    filters;
    constructor({ items, nextCursor, previousCursor, hasNextPage, hasPreviousPage, filters }) {
        super({ items, nextCursor, previousCursor, hasNextPage, hasPreviousPage });
        this.filters = filters;
    }
}
exports.CursorPaginatedProductListResponse = CursorPaginatedProductListResponse;
//# sourceMappingURL=find-all-product.dto.js.map