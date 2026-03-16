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
exports.AddAttributeToCategoryDto = exports.CategoryAttributeBaseDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class CategoryAttributeBaseDto {
    attributeId;
    displayName;
    displayOrder;
    isFilterable;
    isRequired;
    inheritToChildren;
}
exports.CategoryAttributeBaseDto = CategoryAttributeBaseDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'uuid-attribute', description: 'Attribute ID' }),
    (0, class_validator_1.IsString)({ message: 'Attribute ID must be a string' }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CategoryAttributeBaseDto.prototype, "attributeId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Color', description: 'Display name for the attribute' }),
    (0, class_validator_1.IsString)({ message: 'Display name must be a string' }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CategoryAttributeBaseDto.prototype, "displayName", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 1, description: 'Display order' }),
    (0, class_validator_1.IsNumber)({}, { message: 'Display order must be a number' }),
    (0, class_validator_1.Min)(0, { message: 'Display order must be at least 0' }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], CategoryAttributeBaseDto.prototype, "displayOrder", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: true, description: 'Whether the attribute is filterable' }),
    (0, class_validator_1.IsBoolean)({ message: 'isFilterable must be a boolean value' }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], CategoryAttributeBaseDto.prototype, "isFilterable", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: false, description: 'Whether the attribute is required' }),
    (0, class_validator_1.IsBoolean)({ message: 'isRequired must be a boolean value' }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], CategoryAttributeBaseDto.prototype, "isRequired", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: true, description: 'Whether to inherit to children' }),
    (0, class_validator_1.IsBoolean)({ message: 'inheritToChildren must be a boolean value' }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], CategoryAttributeBaseDto.prototype, "inheritToChildren", void 0);
class AddAttributeToCategoryDto extends CategoryAttributeBaseDto {
}
exports.AddAttributeToCategoryDto = AddAttributeToCategoryDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'uuid-attribute', description: 'Attribute ID' }),
    (0, class_validator_1.IsString)({ message: 'Attribute ID must be a string' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Attribute ID is required' }),
    __metadata("design:type", String)
], AddAttributeToCategoryDto.prototype, "attributeId", void 0);
//# sourceMappingURL=add-attribute-to-category.dto.js.map