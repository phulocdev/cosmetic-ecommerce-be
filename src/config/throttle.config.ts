/**
 * Throttle (Rate Limiting) Configuration
 */

import { registerAs } from '@nestjs/config';

export default registerAs('throttle', () => ({
  ttl: parseInt(process.env.THROTTLE_TTL || '60000', 10), // Time to live in milliseconds
  limit: parseInt(process.env.THROTTLE_LIMIT || '100', 10), // Number of requests
  
  // Auth specific rate limits (stricter)
  auth: {
    ttl: 60000, // 1 minute
    limit: 10, // 10 requests per minute
  },
  
  // Login specific (even stricter to prevent brute force)
  login: {
    ttl: 900000, // 15 minutes
    limit: 5, // 5 attempts per 15 minutes
  },
}));
