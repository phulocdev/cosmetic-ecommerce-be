"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.validationSchema = void 0;
const Joi = __importStar(require("joi"));
exports.validationSchema = Joi.object({
    NODE_ENV: Joi.string()
        .valid('development', 'production', 'test', 'staging')
        .default('development'),
    APP_NAME: Joi.string().default('NestJS API'),
    APP_PORT: Joi.number().port().default(3000),
    APP_HOST: Joi.string().default('localhost'),
    API_PREFIX: Joi.string().default('api'),
    API_VERSION: Joi.string().default('v1'),
    APP_URL: Joi.string().uri().default('http://localhost:3000'),
    DATABASE_URL: Joi.string().required().description('PostgreSQL connection string'),
    DATABASE_HOST: Joi.string().default('localhost'),
    DATABASE_PORT: Joi.number().port().default(5432),
    DATABASE_NAME: Joi.string().default('nestjs_db'),
    DATABASE_USER: Joi.string().default('postgres'),
    DATABASE_PASSWORD: Joi.string().default('postgres'),
    DATABASE_POOL_MIN: Joi.number().default(2),
    DATABASE_POOL_MAX: Joi.number().default(10),
    DATABASE_LOGGING: Joi.boolean().default(false),
    JWT_ACCESS_EXPIRATION: Joi.string().default('15m'),
    JWT_REFRESH_SECRET: Joi.string().min(32).required().description('JWT refresh secret key'),
    JWT_REFRESH_EXPIRATION: Joi.string().default('7d'),
    JWT_ISSUER: Joi.string().default('nestjs-app'),
    JWT_AUDIENCE: Joi.string().default('nestjs-users'),
    BCRYPT_SALT_ROUNDS: Joi.number().min(10).max(14).default(12),
    THROTTLE_TTL: Joi.number().default(60000),
    THROTTLE_LIMIT: Joi.number().default(100),
    CORS_ENABLED: Joi.boolean().default(true),
    CORS_ORIGIN: Joi.string().default('http://localhost:3000'),
    SWAGGER_ENABLED: Joi.boolean().default(true),
    SWAGGER_TITLE: Joi.string().default('NestJS API'),
    SWAGGER_DESCRIPTION: Joi.string().default('Production-ready NestJS API'),
    SWAGGER_VERSION: Joi.string().default('1.0'),
    SWAGGER_PATH: Joi.string().default('docs'),
    LOG_LEVEL: Joi.string()
        .valid('error', 'warn', 'info', 'http', 'verbose', 'debug', 'silly')
        .default('debug'),
    LOG_FORMAT: Joi.string().valid('combined', 'json', 'simple').default('combined'),
    SENTRY_DSN: Joi.string().uri().allow('').optional(),
    SENTRY_ENABLED: Joi.boolean().default(false),
    REDIS_HOST: Joi.string().default('localhost'),
    REDIS_PORT: Joi.number().port().default(6379),
    REDIS_PASSWORD: Joi.string().allow('').optional(),
    MAX_FILE_SIZE: Joi.number().default(10485760),
    UPLOAD_DEST: Joi.string().default('./uploads'),
    HELMET_ENABLED: Joi.boolean().default(true),
    CLIENT_APP_URL: Joi.string().uri().default('http://localhost:3000'),
    CLIENT_APP_URL_2: Joi.string().uri().allow('').optional(),
    CLOUDINARY_CLOUD_NAME: Joi.string().allow('').optional(),
    CLOUDINARY_API_KEY: Joi.string().allow('').optional(),
    CLOUDINARY_API_SECRET: Joi.string().allow('').optional(),
    EMAIL_HOST: Joi.string().default('smtp.mailtrap.io'),
    EMAIL_SENDER: Joi.string().email().default('no-reply@example.com'),
    EMAIL_APP_PASSWORD: Joi.string().allow('').optional(),
    EMAIL_PORT: Joi.number().port().default(587),
    EMAIL_SECURE: Joi.boolean().default(false),
    LOGIN_ATTEMPTS_WINDOW_SECONDS: Joi.number().default(900),
    MAX_LOGIN_ATTEMPTS: Joi.number().default(5),
    APP_REQUEST_TIMEOUT_MS: Joi.number().default(30000)
});
//# sourceMappingURL=validation.schema.js.map