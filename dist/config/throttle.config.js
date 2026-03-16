"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("@nestjs/config");
exports.default = (0, config_1.registerAs)('throttle', () => ({
    ttl: parseInt(process.env.THROTTLE_TTL || '60000', 10),
    limit: parseInt(process.env.THROTTLE_LIMIT || '100', 10),
    auth: {
        ttl: 60000,
        limit: 10,
    },
    login: {
        ttl: 900000,
        limit: 5,
    },
}));
//# sourceMappingURL=throttle.config.js.map