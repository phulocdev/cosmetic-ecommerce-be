/**
 * JWT Configuration
 */

import { registerAs } from '@nestjs/config'

export default registerAs('jwt', () => ({
  accessSecret: process.env.JWT_ACCESS_SECRET || 'b60a8f865581b9bab0a575fa7ef439236d5c38a1f9314f9c461983be2fd75a3f',
  accessExpiration: process.env.JWT_ACCESS_EXPIRATION || '15m',

  refreshSecret: process.env.JWT_REFRESH_SECRET || '14885ace93197ee156d0b48e87d5f4ea721ce6a951b7cf57ae09c3c844e9e948',
  refreshExpiration: process.env.JWT_REFRESH_EXPIRATION || '7d',

  // Token settings
  issuer: process.env.JWT_ISSUER || 'cosmetic_ecommerce_app',
  audience: process.env.JWT_AUDIENCE || 'cosmetic_ecommerce_users'
}))
