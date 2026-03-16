"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("@nestjs/config");
exports.default = (0, config_1.registerAs)('swagger', () => ({
    enabled: process.env.SWAGGER_ENABLED !== 'false',
    title: process.env.SWAGGER_TITLE || 'Cosmetic_Ecommerce_Platform',
    description: process.env.SWAGGER_DESCRIPTION || 'Cosmetic_Ecommerce_Platform_API_Documentation',
    version: process.env.SWAGGER_VERSION || '1.0',
    path: process.env.SWAGGER_PATH || 'docs'
}));
//# sourceMappingURL=swagger.config.js.map