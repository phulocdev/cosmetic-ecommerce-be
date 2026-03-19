/**
 * CORS Configuration
 */

import { registerAs } from '@nestjs/config'

export default registerAs('cors', () => ({
  enabled: process.env.CORS_ENABLED === 'true',
  origin: process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN : 'http://localhost:3000',
  methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
  credentials: true
}))
