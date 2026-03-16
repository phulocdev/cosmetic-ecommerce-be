"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const bull_1 = require("@nestjs/bull");
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const core_1 = require("./core");
const email_module_1 = require("./domains/email/email.module");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const core_module_1 = require("./core/core.module");
const auth_1 = require("./domains/auth");
const users_1 = require("./domains/users");
const products_1 = require("./domains/products");
const categories_module_1 = require("./domains/categories/categories.module");
const database_module_1 = require("./database/database.module");
const brands_module_1 = require("./domains/brands/brands.module");
const country_of_origin_module_1 = require("./domains/country-of-origin/country-of-origin.module");
const attributes_module_1 = require("./domains/attributes/attributes.module");
const upload_module_1 = require("./domains/upload/upload.module");
let AppModule = class AppModule {
    configure(consumer) {
        consumer.apply(core_1.RequestLoggerMiddleware).forRoutes('*');
    }
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            core_module_1.CoreModule,
            database_module_1.DatabaseModule,
            email_module_1.EmailModule,
            bull_1.BullModule.forRootAsync({
                useFactory: (configService) => ({
                    redis: {
                        host: configService.get('REDIS_HOST'),
                        port: parseInt(configService.get('REDIS_PORT'), 10),
                        password: configService.get('REDIS_PASSWORD'),
                        db: parseInt(configService.get('REDIS_DB'), 10)
                    }
                }),
                inject: [config_1.ConfigService]
            }),
            auth_1.AuthModule,
            users_1.UsersModule,
            products_1.ProductsModule,
            categories_module_1.CategoriesModule,
            database_module_1.DatabaseModule,
            brands_module_1.BrandsModule,
            country_of_origin_module_1.CountryOfOriginModule,
            attributes_module_1.AttributesModule,
            upload_module_1.UploadModule
        ],
        controllers: [app_controller_1.AppController],
        providers: [app_service_1.AppService]
    })
], AppModule);
//# sourceMappingURL=app.module.js.map