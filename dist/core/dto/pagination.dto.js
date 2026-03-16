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
exports.CursorPaginatedResponseDto = exports.OffsetPaginatedResponseDto = exports.CursorPaginationMetaDto = exports.OffsetPaginationMetaDto = exports.PaginationMetaDto = exports.PaginationQueryDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const enums_1 = require("../../enums");
class PaginationQueryDto {
    paginationType = enums_1.PaginationType.OFFSET;
    page = 1;
    limit = 10;
    sortBy = 'createdAt';
    sortOrder = enums_1.SortOrder.DESC;
    cursor;
}
exports.PaginationQueryDto = PaginationQueryDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        enum: enums_1.PaginationType,
        enumName: 'PaginationType',
        example: enums_1.PaginationType.OFFSET,
        default: enums_1.PaginationType.OFFSET,
        description: 'Pagination strategy to use'
    }),
    (0, class_validator_1.IsEnum)(enums_1.PaginationType, {
        message: `Pagination type must be a valid PaginationType ${Object.values(enums_1.PaginationType).join(', ')}`
    }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], PaginationQueryDto.prototype, "paginationType", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Page number (1-based)',
        minimum: 1,
        default: 1
    }),
    (0, class_validator_1.IsInt)({ message: 'Page must be an integer' }),
    (0, class_validator_1.Min)(1, { message: 'Page must be at least 1' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], PaginationQueryDto.prototype, "page", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Number of items per page',
        minimum: 1,
        maximum: 100,
        default: 10
    }),
    (0, class_validator_1.IsInt)({ message: 'Limit must be an integer' }),
    (0, class_validator_1.Min)(1, { message: 'Limit must be at least 1' }),
    (0, class_validator_1.Max)(100, { message: 'Limit must be at most 100' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], PaginationQueryDto.prototype, "limit", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Field to sort by'
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], PaginationQueryDto.prototype, "sortBy", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Sort order',
        enum: enums_1.SortOrder,
        default: enums_1.SortOrder.DESC
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(enums_1.SortOrder),
    __metadata("design:type", String)
], PaginationQueryDto.prototype, "sortOrder", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Cursor for pagination'
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], PaginationQueryDto.prototype, "cursor", void 0);
class PaginationMetaDto {
    limit;
    hasPreviousPage;
    hasNextPage;
}
exports.PaginationMetaDto = PaginationMetaDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Items per page' }),
    __metadata("design:type", Number)
], PaginationMetaDto.prototype, "limit", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Has previous page' }),
    __metadata("design:type", Boolean)
], PaginationMetaDto.prototype, "hasPreviousPage", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Has next page' }),
    __metadata("design:type", Boolean)
], PaginationMetaDto.prototype, "hasNextPage", void 0);
class OffsetPaginationMetaDto extends PaginationMetaDto {
    total;
    page;
    totalPages;
}
exports.OffsetPaginationMetaDto = OffsetPaginationMetaDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Total number of items' }),
    __metadata("design:type", Number)
], OffsetPaginationMetaDto.prototype, "total", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Current page' }),
    __metadata("design:type", Number)
], OffsetPaginationMetaDto.prototype, "page", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Total number of pages' }),
    __metadata("design:type", Number)
], OffsetPaginationMetaDto.prototype, "totalPages", void 0);
class CursorPaginationMetaDto extends PaginationMetaDto {
    nextCursor;
    previousCursor;
}
exports.CursorPaginationMetaDto = CursorPaginationMetaDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Next cursor for pagination' }),
    __metadata("design:type", String)
], CursorPaginationMetaDto.prototype, "nextCursor", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Previous cursor for pagination' }),
    __metadata("design:type", String)
], CursorPaginationMetaDto.prototype, "previousCursor", void 0);
class OffsetPaginatedResponseDto {
    items;
    meta;
    constructor({ items, total, page, limit }) {
        this.items = items;
        const totalPages = Math.ceil(total / limit);
        this.meta = {
            total,
            page,
            limit,
            totalPages,
            hasPreviousPage: page > 1,
            hasNextPage: page < totalPages
        };
    }
}
exports.OffsetPaginatedResponseDto = OffsetPaginatedResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ isArray: true }),
    __metadata("design:type", Array)
], OffsetPaginatedResponseDto.prototype, "items", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: OffsetPaginationMetaDto }),
    __metadata("design:type", OffsetPaginationMetaDto)
], OffsetPaginatedResponseDto.prototype, "meta", void 0);
class CursorPaginatedResponseDto {
    items;
    meta;
    constructor({ items, nextCursor, previousCursor, hasNextPage, hasPreviousPage }) {
        this.items = items;
        this.meta = {
            nextCursor,
            previousCursor,
            limit: items.length,
            hasNextPage,
            hasPreviousPage
        };
    }
}
exports.CursorPaginatedResponseDto = CursorPaginatedResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ isArray: true }),
    __metadata("design:type", Array)
], CursorPaginatedResponseDto.prototype, "items", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: CursorPaginationMetaDto }),
    __metadata("design:type", CursorPaginationMetaDto)
], CursorPaginatedResponseDto.prototype, "meta", void 0);
//# sourceMappingURL=pagination.dto.js.map