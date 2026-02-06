/**
 * Swagger Configuration
 */

import { registerAs } from '@nestjs/config'

export default registerAs('swagger', () => ({
  enabled: process.env.SWAGGER_ENABLED !== 'false',
  title: process.env.SWAGGER_TITLE || 'Cosmetic_Ecommerce_Platform',
  description: process.env.SWAGGER_DESCRIPTION || 'Cosmetic_Ecommerce_Platform_API_Documentation',
  version: process.env.SWAGGER_VERSION || '1.0',
  path: process.env.SWAGGER_PATH || 'docs'
}))
