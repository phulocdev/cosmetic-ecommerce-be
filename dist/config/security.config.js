"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("@nestjs/config");
exports.default = (0, config_1.registerAs)('security', () => ({
    helmet: process.env.HELMET_ENABLED !== 'false'
}));
//# sourceMappingURL=security.config.js.map