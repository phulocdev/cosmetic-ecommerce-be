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
exports.CreateCategoryDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
class CreateCategoryDto {
    name;
    slug;
    parentId;
    description;
    isActive;
    metaTitle;
    metaDescription;
    attributeIds;
}
exports.CreateCategoryDto = CreateCategoryDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Laptops', description: 'Category name' }),
    (0, class_validator_1.MaxLength)(255, { message: 'Name must be at most 255 characters long' }),
    (0, class_validator_1.MinLength)(1, { message: 'Name must be at least 1 character long' }),
    (0, class_validator_1.IsString)({ message: 'Name must be a string' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Name is required' }),
    __metadata("design:type", String)
], CreateCategoryDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: 'laptops',
        description: 'URL-friendly slug (auto-generated if not provided)'
    }),
    (0, class_validator_1.MaxLength)(255, { message: 'Slug must be at most 255 characters long' }),
    (0, class_validator_1.IsString)({ message: 'Slug must be a string' }),
    (0, class_validator_1.IsOptional)({ message: 'Slug is required' }),
    __metadata("design:type", String)
], CreateCategoryDto.prototype, "slug", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: 'uuid-parent-category',
        description: 'Parent category ID for hierarchical structure'
    }),
    (0, class_validator_1.IsUUID)('4', { message: 'Parent ID must be a valid UUID' }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateCategoryDto.prototype, "parentId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: 'Browse our collection of laptops',
        description: 'Category description'
    }),
    (0, class_validator_1.MaxLength)(1000, { message: 'Description must be at most 1000 characters long' }),
    (0, class_validator_1.IsString)({ message: 'Description must be a string' }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateCategoryDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: true, description: 'Whether category is active', default: true }),
    (0, class_validator_1.IsBoolean)(),
    (0, class_transformer_1.Transform)(({ value }) => value === 'true' || value === true),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], CreateCategoryDto.prototype, "isActive", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: 'Buy Laptops Online | Best Prices',
        description: 'Meta title for SEO'
    }),
    (0, class_validator_1.MaxLength)(200, { message: 'Meta title must be at most 200 characters long' }),
    (0, class_validator_1.IsString)({ message: 'Meta title must be a string' }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateCategoryDto.prototype, "metaTitle", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: 'Shop the latest laptops with free shipping',
        description: 'Meta description for SEO'
    }),
    (0, class_validator_1.MaxLength)(300, { message: 'Meta description must be at most 300 characters long' }),
    (0, class_validator_1.IsString)({ message: 'Meta description must be a string' }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateCategoryDto.prototype, "metaDescription", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsUUID)('4', { each: true }),
    __metadata("design:type", Array)
], CreateCategoryDto.prototype, "attributeIds", void 0);
//# sourceMappingURL=create-category.dto.js.map