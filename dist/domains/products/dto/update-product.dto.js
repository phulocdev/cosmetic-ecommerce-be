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
exports.UpdateProductDto = exports.UpdateProductAttributeDto = exports.UpdateProductCategoryDto = exports.UpdateProductVariantDto = exports.UpdateVariantImageDto = exports.UpdateVariantAttributeValueDto = exports.UpdateProductImageDto = void 0;
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const swagger_1 = require("@nestjs/swagger");
const create_product_dto_1 = require("./create-product.dto");
class UpdateProductImageDto extends (0, swagger_1.PartialType)(create_product_dto_1.CreateProductImageDto) {
    id;
    _delete;
}
exports.UpdateProductImageDto = UpdateProductImageDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'existing-image-id' }),
    (0, class_validator_1.IsUUID)('4', { message: 'ID must be a valid UUID' }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateProductImageDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: true, description: 'Set to true to delete this image' }),
    (0, class_validator_1.IsBoolean)({ message: 'Delete flag must be a boolean value' }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], UpdateProductImageDto.prototype, "_delete", void 0);
class UpdateVariantAttributeValueDto extends (0, swagger_1.PartialType)(create_product_dto_1.CreateVariantAttributeValueDto) {
    id;
    _delete;
}
exports.UpdateVariantAttributeValueDto = UpdateVariantAttributeValueDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'existing-vav-id' }),
    (0, class_validator_1.IsUUID)('4', { message: 'ID must be a valid UUID' }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateVariantAttributeValueDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: true,
        description: 'Set to true to delete this attribute value'
    }),
    (0, class_validator_1.IsBoolean)({ message: 'Delete flag must be a boolean value' }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], UpdateVariantAttributeValueDto.prototype, "_delete", void 0);
class UpdateVariantImageDto {
    id;
    url;
    altText;
    _delete;
}
exports.UpdateVariantImageDto = UpdateVariantImageDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'existing-variant-image-id' }),
    (0, class_validator_1.IsUUID)('4', { message: 'ID must be a valid UUID' }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateVariantImageDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'https://example.com/variant-image.jpg' }),
    (0, class_validator_1.IsUrl)({}, { message: 'URL must be a valid URL' }),
    (0, class_validator_1.MaxLength)(500, { message: 'URL must be at most 500 characters' }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateVariantImageDto.prototype, "url", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Red variant image' }),
    (0, class_validator_1.IsString)({ message: 'Alt text must be a string' }),
    (0, class_validator_1.MaxLength)(255, { message: 'Alt text must be at most 255 characters' }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateVariantImageDto.prototype, "altText", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: true, description: 'Set to true to delete this image' }),
    (0, class_validator_1.IsBoolean)({ message: 'Delete flag must be a boolean value' }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], UpdateVariantImageDto.prototype, "_delete", void 0);
class UpdateProductVariantDto extends (0, swagger_1.PartialType)((0, swagger_1.OmitType)(create_product_dto_1.CreateProductVariantDto, ['sku', 'attributeValues'])) {
    id;
    attributeValues;
    _delete;
}
exports.UpdateProductVariantDto = UpdateProductVariantDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'existing-variant-id' }),
    (0, class_validator_1.IsUUID)('4', { message: 'ID must be a valid UUID' }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateProductVariantDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        type: [UpdateVariantAttributeValueDto],
        description: 'Attribute values for this variant'
    }),
    (0, class_validator_1.IsArray)({ message: 'Attribute values must be an array' }),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => UpdateVariantAttributeValueDto),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], UpdateProductVariantDto.prototype, "attributeValues", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: true, description: 'Set to true to delete this variant' }),
    (0, class_validator_1.IsBoolean)({ message: 'Delete flag must be a boolean value' }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], UpdateProductVariantDto.prototype, "_delete", void 0);
class UpdateProductCategoryDto extends (0, swagger_1.PartialType)(create_product_dto_1.CreateProductCategoryDto) {
    id;
    _delete;
}
exports.UpdateProductCategoryDto = UpdateProductCategoryDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'existing-product-category-id' }),
    (0, class_validator_1.IsUUID)('4', { message: 'ID must be a valid UUID' }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateProductCategoryDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: true,
        description: 'Set to true to delete this category association'
    }),
    (0, class_validator_1.IsBoolean)({ message: 'Delete flag must be a boolean value' }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], UpdateProductCategoryDto.prototype, "_delete", void 0);
class UpdateProductAttributeDto extends (0, swagger_1.PartialType)(create_product_dto_1.CreateProductAttributeDto) {
    id;
    _delete;
}
exports.UpdateProductAttributeDto = UpdateProductAttributeDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'existing-product-attribute-id' }),
    (0, class_validator_1.IsUUID)('4', { message: 'ID must be a valid UUID' }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateProductAttributeDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: true, description: 'Set to true to delete this attribute' }),
    (0, class_validator_1.IsBoolean)({ message: 'Delete flag must be a boolean value' }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], UpdateProductAttributeDto.prototype, "_delete", void 0);
class UpdateProductDto extends (0, swagger_1.PartialType)((0, swagger_1.OmitType)(create_product_dto_1.CreateProductDto, ['categories', 'images', 'variants'])) {
    code;
    categories;
    images;
    variants;
    attributes;
}
exports.UpdateProductDto = UpdateProductDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'PROD-001' }),
    (0, class_validator_1.IsString)({ message: 'Code must be a string' }),
    (0, class_validator_1.MaxLength)(50, { message: 'Code must be at most 50 characters' }),
    (0, class_validator_1.MinLength)(1, { message: 'Code must be at least 1 character' }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateProductDto.prototype, "code", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        type: [UpdateProductCategoryDto],
        description: 'Update, add, or remove categories. Use _delete: true to remove.'
    }),
    (0, class_validator_1.IsArray)({ message: 'Categories must be an array' }),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => UpdateProductCategoryDto),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], UpdateProductDto.prototype, "categories", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        type: [UpdateProductImageDto],
        description: 'Update, add, or remove product images. Use _delete: true to remove.'
    }),
    (0, class_validator_1.IsArray)({ message: 'Images must be an array' }),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => UpdateProductImageDto),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], UpdateProductDto.prototype, "images", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        type: [UpdateProductVariantDto],
        description: 'Update, add, or remove variants. Use _delete: true to remove.'
    }),
    (0, class_validator_1.IsArray)({ message: 'Variants must be an array' }),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => UpdateProductVariantDto),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], UpdateProductDto.prototype, "variants", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        type: [UpdateProductAttributeDto],
        description: 'Update, add, or remove attributes. Use _delete: true to remove.'
    }),
    (0, class_validator_1.IsArray)({ message: 'Attributes must be an array' }),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => UpdateProductAttributeDto),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], UpdateProductDto.prototype, "attributes", void 0);
//# sourceMappingURL=update-product.dto.js.map