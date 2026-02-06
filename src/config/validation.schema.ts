/**
 * Environment Validation Schema
 * Using Joi for strict validation
 */

import * as Joi from 'joi'

export const validationSchema = Joi.object({
  // Node environment
  NODE_ENV: Joi.string()
    .valid('development', 'production', 'test', 'staging')
    .default('development'),

  // Application
  APP_NAME: Joi.string().default('NestJS API'),
  APP_PORT: Joi.number().port().default(3000),
  APP_HOST: Joi.string().default('localhost'),
  API_PREFIX: Joi.string().default('api'),
  API_VERSION: Joi.string().default('v1'),
  APP_URL: Joi.string().uri().default('http://localhost:3000'),

  // Database
  DATABASE_URL: Joi.string().required().description('PostgreSQL connection string'),
  DATABASE_HOST: Joi.string().default('localhost'),
  DATABASE_PORT: Joi.number().port().default(5432),
  DATABASE_NAME: Joi.string().default('nestjs_db'),
  DATABASE_USER: Joi.string().default('postgres'),
  DATABASE_PASSWORD: Joi.string().default('postgres'),
  DATABASE_POOL_MIN: Joi.number().default(2),
  DATABASE_POOL_MAX: Joi.number().default(10),
  DATABASE_LOGGING: Joi.boolean().default(false),

  // JWT
  JWT_ACCESS_EXPIRATION: Joi.string().default('15m'),
  JWT_REFRESH_SECRET: Joi.string().min(32).required().description('JWT refresh secret key'),
  JWT_REFRESH_EXPIRATION: Joi.string().default('7d'),
  JWT_ISSUER: Joi.string().default('nestjs-app'),
  JWT_AUDIENCE: Joi.string().default('nestjs-users'),

  // Security
  BCRYPT_SALT_ROUNDS: Joi.number().min(10).max(14).default(12),

  // Rate Limiting
  THROTTLE_TTL: Joi.number().default(60000),
  THROTTLE_LIMIT: Joi.number().default(100),

  // CORS
  CORS_ENABLED: Joi.boolean().default(true),
  CORS_ORIGIN: Joi.string().default('http://localhost:3000'),

  // Swagger
  SWAGGER_ENABLED: Joi.boolean().default(true),
  SWAGGER_TITLE: Joi.string().default('NestJS API'),
  SWAGGER_DESCRIPTION: Joi.string().default('Production-ready NestJS API'),
  SWAGGER_VERSION: Joi.string().default('1.0'),
  SWAGGER_PATH: Joi.string().default('docs'),

  // Logging
  LOG_LEVEL: Joi.string()
    .valid('error', 'warn', 'info', 'http', 'verbose', 'debug', 'silly')
    .default('debug'),
  LOG_FORMAT: Joi.string().valid('combined', 'json', 'simple').default('combined'),

  // Sentry
  SENTRY_DSN: Joi.string().uri().allow('').optional(),
  SENTRY_ENABLED: Joi.boolean().default(false),

  // Redis
  REDIS_HOST: Joi.string().default('localhost'),
  REDIS_PORT: Joi.number().port().default(6379),
  REDIS_PASSWORD: Joi.string().allow('').optional(),

  // File Upload
  MAX_FILE_SIZE: Joi.number().default(10485760),
  UPLOAD_DEST: Joi.string().default('./uploads'),

  // Helmet
  HELMET_ENABLED: Joi.boolean().default(true),

  // Added validation for CLIENT_APP_URL
  CLIENT_APP_URL: Joi.string().uri().default('http://localhost:3000'),

  // Added validation for CLIENT_APP_URL_2
  CLIENT_APP_URL_2: Joi.string().uri().allow('').optional(),

  // Added validation for CLOUDINARY_CLOUD_NAME
  CLOUDINARY_CLOUD_NAME: Joi.string().allow('').optional(),

  // Added validation for CLOUDINARY_API_KEY
  CLOUDINARY_API_KEY: Joi.string().allow('').optional(),

  // Added validation for CLOUDINARY_API_SECRET
  CLOUDINARY_API_SECRET: Joi.string().allow('').optional(),

  // Added validation for EMAIL_HOST
  EMAIL_HOST: Joi.string().default('smtp.mailtrap.io'),

  // Added validation for EMAIL_SENDER
  EMAIL_SENDER: Joi.string().email().default('no-reply@example.com'),

  // Added validation for EMAIL_APP_PASSWORD
  EMAIL_APP_PASSWORD: Joi.string().allow('').optional(),

  // Added validation for EMAIL_PORT
  EMAIL_PORT: Joi.number().port().default(587),

  // Added validation for EMAIL_SECURE
  EMAIL_SECURE: Joi.boolean().default(false),

  // Added validation for LOGIN_ATTEMPTS_WINDOW_SECONDS
  LOGIN_ATTEMPTS_WINDOW_SECONDS: Joi.number().default(900),

  // Added validation for MAX_LOGIN_ATTEMPTS
  MAX_LOGIN_ATTEMPTS: Joi.number().default(5)
})
