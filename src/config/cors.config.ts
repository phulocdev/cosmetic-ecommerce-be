/**
 * CORS Configuration
 */

import { registerAs } from '@nestjs/config';

export default registerAs('cors', () => ({
  enabled: process.env.CORS_ENABLED === 'true',
  origin: process.env.CORS_ORIGIN
    ? process.env.CORS_ORIGIN.split(',').map(origin => origin.trim())
    : ['http://localhost:3000', 'http://localhost:3001'],
  methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
  credentials: true,
}));
