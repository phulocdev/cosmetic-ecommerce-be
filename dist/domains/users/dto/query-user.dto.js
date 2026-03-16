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
exports.UserQueryDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const core_1 = require("../../../core");
const enums_1 = require("../../../enums");
class UserQueryDto extends core_1.PaginationQueryDto {
    search;
    email;
    code;
    fullName;
    phoneNumber;
    isActive;
    role;
}
exports.UserQueryDto = UserQueryDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: 'cotton shirt',
        description: 'Search in product name, description, or code'
    }),
    (0, class_validator_1.IsString)({ message: 'Search query must be a string' }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UserQueryDto.prototype, "search", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: 'user@example.com',
        description: 'Filter by email address'
    }),
    (0, class_validator_1.IsEmail)({}, { message: 'Invalid email format' }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UserQueryDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: 'USER123',
        description: 'Filter by user code'
    }),
    (0, class_validator_1.IsString)({ message: 'Code must be a string' }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UserQueryDto.prototype, "code", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: 'John Doe',
        description: 'Filter by full name'
    }),
    (0, class_validator_1.IsString)({ message: 'Full name must be a string' }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UserQueryDto.prototype, "fullName", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: '+1234567890',
        description: 'Filter by phone number'
    }),
    (0, class_validator_1.IsString)({ message: 'Phone number must be a string' }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UserQueryDto.prototype, "phoneNumber", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: true,
        description: 'Filter by active status'
    }),
    (0, class_validator_1.IsBoolean)({ message: 'isActive must be a boolean value' }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], UserQueryDto.prototype, "isActive", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        enum: enums_1.UserRole,
        enumName: 'UserRole',
        example: enums_1.UserRole.ADMIN
    }),
    (0, class_validator_1.IsEnum)(enums_1.UserRole, {
        message: `Role must be a valid UserRole: ${Object.values(enums_1.UserRole).join(', ')}`
    }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UserQueryDto.prototype, "role", void 0);
//# sourceMappingURL=query-user.dto.js.map