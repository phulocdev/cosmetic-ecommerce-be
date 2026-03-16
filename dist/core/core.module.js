"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CoreModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const core_1 = require("@nestjs/core");
const throttler_1 = require("@nestjs/throttler");
const config_2 = require("../config");
const filters_1 = require("./filters");
const jwt_auth_guard_1 = require("./guards/jwt-auth.guard");
const interceptors_1 = require("./interceptors");
const utils_1 = require("../utils");
const validation_schema_1 = require("../config/validation.schema");
const event_emitter_1 = require("@nestjs/event-emitter");
const schedule_1 = require("@nestjs/schedule");
const terminus_1 = require("@nestjs/terminus");
let CoreModule = class CoreModule {
};
exports.CoreModule = CoreModule;
exports.CoreModule = CoreModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                envFilePath: [`.env.${process.env.NODE_ENV}`, '.env'],
                load: [
                    config_2.appConfig,
                    config_2.corsConfig,
                    config_2.databaseConfig,
                    config_2.jwtConfig,
                    config_2.securityConfig,
                    config_2.swaggerConfig,
                    config_2.throttleConfig
                ],
                validationSchema: validation_schema_1.validationSchema,
                validationOptions: {
                    allowUnknown: true,
                    abortEarly: true
                }
            }),
            throttler_1.ThrottlerModule.forRootAsync({
                imports: [config_1.ConfigModule],
                inject: [config_1.ConfigService],
                useFactory: (config) => [
                    {
                        ttl: config.get('throttle.ttl', 60000),
                        limit: config.get('throttle.limit', 100)
                    }
                ]
            }),
            schedule_1.ScheduleModule.forRoot(),
            event_emitter_1.EventEmitterModule.forRoot({
                wildcard: true,
                delimiter: '.',
                newListener: false,
                removeListener: false,
                maxListeners: 20,
                verboseMemoryLeak: true,
                ignoreErrors: false
            }),
            terminus_1.TerminusModule
        ],
        providers: [
            {
                provide: core_1.APP_GUARD,
                useClass: jwt_auth_guard_1.JwtAuthGuard
            },
            {
                provide: core_1.APP_INTERCEPTOR,
                useClass: interceptors_1.TransformInterceptor
            },
            {
                provide: core_1.APP_INTERCEPTOR,
                useClass: interceptors_1.LoggingInterceptor
            },
            {
                provide: core_1.APP_PIPE,
                useValue: new common_1.ValidationPipe({
                    whitelist: true,
                    transform: true,
                    stopAtFirstError: true,
                    validationError: {
                        target: false,
                        value: false
                    },
                    exceptionFactory: (validationErrors = []) => {
                        const errorMessage = (0, utils_1.extractErrorMessageFromDto)(validationErrors);
                        return new common_1.UnprocessableEntityException(validationErrors.map((error, index) => ({
                            field: error.property,
                            message: errorMessage[index]
                        })));
                    }
                })
            },
            { provide: core_1.APP_FILTER, useClass: filters_1.HttpExceptionFilter }
        ],
        exports: []
    })
], CoreModule);
//# sourceMappingURL=core.module.js.map