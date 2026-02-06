/**
 * Application Configuration
 */

import { registerAs } from '@nestjs/config'

// eslint-disable-next-line complexity
export default registerAs('app', () => ({
  nodeEnv: process.env.NODE_ENV || 'development',
  name: process.env.APP_NAME || 'NestJS API',
  port: parseInt(process.env.APP_PORT || '3000', 10),
  host: process.env.APP_HOST || 'localhost',
  apiPrefix: process.env.API_PREFIX || 'api',
  apiVersion: process.env.API_VERSION || 'v1',
  url: process.env.APP_URL || 'http://localhost:8000',

  // File upload
  maxFileSize: parseInt(process.env.MAX_FILE_SIZE || '10485760', 10), // 10MB
  uploadDest: process.env.UPLOAD_DEST || './uploads',
  assetPrefix: process.env.APP_ASSET_PREFIX || '/public/',

  // Security
  bcryptSaltRounds: parseInt(process.env.BCRYPT_SALT_ROUNDS || '12', 10)
}))
