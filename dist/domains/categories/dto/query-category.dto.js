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
exports.MoveCategoryDto = exports.GetCategoryTreeQueryDto = exports.GetCategoriesQueryDto = void 0;
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const swagger_1 = require("@nestjs/swagger");
const core_1 = require("../../../core");
const enums_1 = require("../../../enums");
class GetCategoriesQueryDto extends core_1.PaginationQueryDto {
    search;
    parentId;
    isDeleted;
    isActive;
    depth;
    sortBy = enums_1.CategorySortBy.CREATED_AT;
    includeChildren;
    includeParent;
    includeProductCount;
    includeAttributes;
}
exports.GetCategoriesQueryDto = GetCategoriesQueryDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'laptops', description: 'Search by name or slug' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], GetCategoriesQueryDto.prototype, "search", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'uuid-parent-id', description: 'Filter by parent category ID' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)('4', { message: 'Parent ID must be a valid UUID' }),
    __metadata("design:type", String)
], GetCategoriesQueryDto.prototype, "parentId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: true, description: 'Filter by deleted status' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(({ value }) => value === 'true' || value === true),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], GetCategoriesQueryDto.prototype, "isDeleted", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: true, description: 'Filter by active status' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(({ value }) => value === 'true' || value === true),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], GetCategoriesQueryDto.prototype, "isActive", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 0, description: 'Filter by depth level' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], GetCategoriesQueryDto.prototype, "depth", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        enum: enums_1.CategorySortBy,
        enumName: 'CategorySortBy',
        example: enums_1.CategorySortBy.CREATED_AT,
        default: enums_1.CategorySortBy.CREATED_AT
    }),
    (0, class_validator_1.IsEnum)(enums_1.CategorySortBy, {
        message: `Sort by must be a valid CategorySortBy: ${Object.values(enums_1.CategorySortBy).join(', ')}`
    }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], GetCategoriesQueryDto.prototype, "sortBy", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: true,
        description: 'Include children in response',
        default: false
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(({ value }) => value === 'true' || value === true),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], GetCategoriesQueryDto.prototype, "includeChildren", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: true,
        description: 'Include parent category in response',
        default: false
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(({ value }) => value === 'true' || value === true),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], GetCategoriesQueryDto.prototype, "includeParent", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: true, description: 'Include product count', default: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(({ value }) => value === 'true' || value === true),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], GetCategoriesQueryDto.prototype, "includeProductCount", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(({ value }) => value === 'true' || value === true),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], GetCategoriesQueryDto.prototype, "includeAttributes", void 0);
class GetCategoryTreeQueryDto {
    rootId;
    maxDepth;
    isDeleted;
    activeOnly = true;
    format = enums_1.CategoryTreeFormat.NESTED;
    includeProductCount;
}
exports.GetCategoryTreeQueryDto = GetCategoryTreeQueryDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'uuid-root-id', description: 'Root category ID (optional)' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)('4', { message: 'Root ID must be a valid UUID' }),
    __metadata("design:type", String)
], GetCategoryTreeQueryDto.prototype, "rootId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 3, description: 'Maximum depth to fetch' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], GetCategoryTreeQueryDto.prototype, "maxDepth", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: true, description: 'Filter by deleted status' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(({ value }) => value === 'true' || value === true),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], GetCategoryTreeQueryDto.prototype, "isDeleted", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: true,
        description: 'Include only active categories',
        default: true
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(({ value }) => value === 'true' || value === true),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], GetCategoryTreeQueryDto.prototype, "activeOnly", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        enum: enums_1.CategoryTreeFormat,
        example: enums_1.CategoryTreeFormat.NESTED,
        description: 'Response format',
        default: enums_1.CategoryTreeFormat.NESTED
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(enums_1.CategoryTreeFormat),
    __metadata("design:type", String)
], GetCategoryTreeQueryDto.prototype, "format", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: true,
        description: 'Include product count for each category',
        default: false
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(({ value }) => value === 'true' || value === true),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], GetCategoryTreeQueryDto.prototype, "includeProductCount", void 0);
class MoveCategoryDto {
    newParentId;
}
exports.MoveCategoryDto = MoveCategoryDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: 'uuid-new-parent-id',
        description: 'New parent category ID (null for root)'
    }),
    (0, class_validator_1.IsUUID)('4', { message: 'New newParentId must be a valid UUID or Null' }),
    __metadata("design:type", String)
], MoveCategoryDto.prototype, "newParentId", void 0);
//# sourceMappingURL=query-category.dto.js.map