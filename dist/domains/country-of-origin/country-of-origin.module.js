"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CountryOfOriginModule = void 0;
const common_1 = require("@nestjs/common");
const country_of_origin_service_1 = require("./country-of-origin.service");
const country_of_origin_controller_1 = require("./country-of-origin.controller");
let CountryOfOriginModule = class CountryOfOriginModule {
};
exports.CountryOfOriginModule = CountryOfOriginModule;
exports.CountryOfOriginModule = CountryOfOriginModule = __decorate([
    (0, common_1.Module)({
        controllers: [country_of_origin_controller_1.CountryOfOriginController],
        providers: [country_of_origin_service_1.CountryOfOriginService],
    })
], CountryOfOriginModule);
//# sourceMappingURL=country-of-origin.module.js.map