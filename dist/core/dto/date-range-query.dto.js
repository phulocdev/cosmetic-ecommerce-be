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
exports.DateRangeQueryDto = void 0;
const class_validator_1 = require("class-validator");
const is_before_date_decorator_1 = require("../decorators/is-before-date.decorator");
class DateRangeQueryDto {
    startDate;
    endDate;
    timezone;
}
exports.DateRangeQueryDto = DateRangeQueryDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    (0, is_before_date_decorator_1.IsBeforeDate)('endDate'),
    __metadata("design:type", String)
], DateRangeQueryDto.prototype, "startDate", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], DateRangeQueryDto.prototype, "endDate", void 0);
__decorate([
    (0, class_validator_1.IsTimeZone)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], DateRangeQueryDto.prototype, "timezone", void 0);
//# sourceMappingURL=date-range-query.dto.js.map