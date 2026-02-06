/**
 * Security Configuration
 */

import { registerAs } from '@nestjs/config'

export default registerAs('security', () => ({
  helmet: process.env.HELMET_ENABLED !== 'false'

  // Password policy
  // password: {
  //   minLength: 8,
  //   maxLength: 128,
  //   requireUppercase: true,
  //   requireLowercase: true,
  //   requireNumbers: true,
  //   requireSpecialChars: true,
  // },

  // // Account lockout
  // lockout: {
  //   maxAttempts: 5,
  //   durationMinutes: 30,
  // },

  // // Session
  // session: {
  //   maxConcurrent: 5, // Max concurrent sessions per user
  //   idleTimeoutMinutes: 30,
  // },
}))
