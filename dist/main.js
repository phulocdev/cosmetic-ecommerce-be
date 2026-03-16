"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = handler;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const core_1 = require("@nestjs/core");
const platform_express_1 = require("@nestjs/platform-express");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const helmet_1 = __importDefault(require("helmet"));
const path_1 = __importDefault(require("path"));
const express_1 = __importDefault(require("express"));
const app_module_1 = require("./app.module");
const nest_winston_1 = require("nest-winston");
const winston_config_1 = require("./config/winston.config");
const swagger_1 = require("@nestjs/swagger");
const server = (0, express_1.default)();
async function bootstrap() {
    const logger = new common_1.Logger('Bootstrap');
    const app = await core_1.NestFactory.create(app_module_1.AppModule, new platform_express_1.ExpressAdapter(server), {
        logger: nest_winston_1.WinstonModule.createLogger(winston_config_1.winstonConfig)
    });
    const configService = app.get(config_1.ConfigService);
    const apiPrefix = configService.get('app.apiPrefix', 'api');
    const corsEnabled = configService.get('cors.enabled', true);
    const corsOrigin = configService.get('cors.origin', ['*']);
    const helmetEnabled = configService.get('security.helmet', true);
    const swaggerEnabled = configService.get('swagger.enabled', true);
    const swaggerTitle = configService.get('swagger.title', 'NestJS API');
    const swaggerDescription = configService.get('swagger.description', 'Production-ready NestJS API');
    const swaggerVersion = configService.get('swagger.version', '1.0');
    const swaggerPath = configService.get('swagger.path', 'docs');
    const uploadDest = configService.get('app.uploadDest', './uploads');
    const assetPrefix = configService.get('app.assetPrefix', '/public/');
    app.set('query parser', 'extended');
    app.setGlobalPrefix(apiPrefix);
    app.enableVersioning({
        type: common_1.VersioningType.URI,
        defaultVersion: '1',
        prefix: 'v'
    });
    if (helmetEnabled) {
        app.use((0, helmet_1.default)({
            contentSecurityPolicy: {
                directives: {
                    defaultSrc: ["'self'"],
                    styleSrc: ["'self'", "'unsafe-inline'"],
                    imgSrc: ["'self'", 'data:', 'https:'],
                    scriptSrc: ["'self'"]
                }
            },
            crossOriginEmbedderPolicy: false
        }));
        logger.log('Helmet enabled');
    }
    if (corsEnabled) {
        app.enableCors({
            origin: corsOrigin,
            credentials: true
        });
        logger.log(`CORS enabled: ${corsOrigin.join(', ')}`);
    }
    app.set('trust proxy', 1);
    if (swaggerEnabled) {
        const swaggerConfig = new swagger_1.DocumentBuilder()
            .setTitle(swaggerTitle)
            .setDescription(swaggerDescription)
            .setVersion(swaggerVersion)
            .addBearerAuth({
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT',
            name: 'JWT',
            description: 'Enter JWT token',
            in: 'header'
        }, 'JWT-auth')
            .build();
        const document = swagger_1.SwaggerModule.createDocument(app, swaggerConfig);
        swagger_1.SwaggerModule.setup(swaggerPath, app, document);
        logger.log(`Swagger running at /${swaggerPath}`);
    }
    app.useStaticAssets(path_1.default.join(__dirname, `../../${uploadDest}`), {
        prefix: assetPrefix
    });
    app.enableShutdownHooks();
    app.use((0, cookie_parser_1.default)());
    await app.init();
    logger.log('NestJS serverless bootstrap completed');
}
const bootstrapPromise = bootstrap();
async function handler(req, res) {
    await bootstrapPromise;
    server(req, res);
}
//# sourceMappingURL=main.js.map