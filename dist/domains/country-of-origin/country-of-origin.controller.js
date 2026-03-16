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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CountryOfOriginController = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("../../core");
const country_of_origin_service_1 = require("./country-of-origin.service");
const create_country_of_origin_dto_1 = require("./dto/create-country-of-origin.dto");
const find_all_country_of_origin_dto_1 = require("./dto/find-all-country-of-origin.dto");
const update_country_of_origin_dto_1 = require("./dto/update-country-of-origin.dto");
let CountryOfOriginController = class CountryOfOriginController {
    countryOfOriginService;
    constructor(countryOfOriginService) {
        this.countryOfOriginService = countryOfOriginService;
    }
    create(createCountryOfOriginDto) {
        return this.countryOfOriginService.create(createCountryOfOriginDto);
    }
    findAll(query) {
        return this.countryOfOriginService.findAll(query);
    }
    findOne(id) {
        return this.countryOfOriginService.findOne(id);
    }
    update(id, updateCountryOfOriginDto) {
        return this.countryOfOriginService.update(id, updateCountryOfOriginDto);
    }
    async softDelete(id) {
        return this.countryOfOriginService.softDelete(id);
    }
    remove(id) {
        return this.countryOfOriginService.remove(id);
    }
};
exports.CountryOfOriginController = CountryOfOriginController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_country_of_origin_dto_1.CreateCountryOfOriginDto]),
    __metadata("design:returntype", Promise)
], CountryOfOriginController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [find_all_country_of_origin_dto_1.FindAllCountryOfOriginDto]),
    __metadata("design:returntype", Promise)
], CountryOfOriginController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id', core_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CountryOfOriginController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id', core_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_country_of_origin_dto_1.UpdateCountryOfOriginDto]),
    __metadata("design:returntype", Promise)
], CountryOfOriginController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id/soft'),
    __param(0, (0, common_1.Param)('id', core_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CountryOfOriginController.prototype, "softDelete", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id', core_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CountryOfOriginController.prototype, "remove", null);
exports.CountryOfOriginController = CountryOfOriginController = __decorate([
    (0, common_1.Controller)('country-of-origin'),
    __metadata("design:paramtypes", [country_of_origin_service_1.CountryOfOriginService])
], CountryOfOriginController);
//# sourceMappingURL=country-of-origin.controller.js.map