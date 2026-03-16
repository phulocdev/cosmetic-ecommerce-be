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
exports.CreateAttributeDto = void 0;
const class_validator_1 = require("class-validator");
class CreateAttributeDto {
    name;
    slug;
    isGlobalFilter;
    values;
}
exports.CreateAttributeDto = CreateAttributeDto;
__decorate([
    (0, class_validator_1.MaxLength)(255, { message: 'Name must be at most 255 characters' }),
    (0, class_validator_1.MinLength)(1, { message: 'Name must be at least 1 character' }),
    (0, class_validator_1.IsString)({ message: 'name must be a string' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Name is required' }),
    __metadata("design:type", String)
], CreateAttributeDto.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsString)({ message: 'slug must be a string' }),
    (0, class_validator_1.MaxLength)(255, { message: 'Slug must be at most 255 characters' }),
    (0, class_validator_1.MinLength)(1, { message: 'Slug must be at least 1 character' }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateAttributeDto.prototype, "slug", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)({ message: 'isGlobalFilter must be a boolean' }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], CreateAttributeDto.prototype, "isGlobalFilter", void 0);
__decorate([
    (0, class_validator_1.IsArray)({ message: 'values must be an array' }),
    (0, class_validator_1.ArrayMinSize)(1, { message: 'At least one attribute value is required' }),
    (0, class_validator_1.ArrayUnique)((value) => value.toLowerCase(), {
        message: 'Attribute values must be unique'
    }),
    (0, class_validator_1.IsString)({ each: true, message: 'Each attribute value in values field must be a string' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'values are required', each: true }),
    __metadata("design:type", Array)
], CreateAttributeDto.prototype, "values", void 0);
//# sourceMappingURL=create-attribute.dto.js.map