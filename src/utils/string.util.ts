/**
 * String Utilities
 * ===========================================
 * Helper functions for string manipulation
 */

/**
 * Generate a random string
 */

import * as crypto from 'crypto'
import slugify from 'slugify'

export function generateRandomString(length: number): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let result = ''
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

/**
 * Generate a secure random token
 */
export function generateSecureToken(length: number = 32): string {
  return crypto.randomBytes(length).toString('hex')
}

/**
 * Slugify a string
 */
export function slugifyString(text: string): string {
  return slugify(text, { lower: true, strict: true })
}

/**
 * Truncate a string
 */
export function truncate(str: string, length: number, suffix: string = '...'): string {
  if (str.length <= length) {
    return str
  }
  return str.substring(0, length - suffix.length) + suffix
}

/**
 * Capitalize first letter
 */
export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
}

/**
 * Convert to title case
 */
export function toTitleCase(str: string): string {
  return str.replace(/\w\S*/g, (txt) => capitalize(txt))
}

/**
 * Mask email address
 */
export function maskEmail(email: string): string {
  const [username, domain] = email.split('@')
  const masked =
    username.charAt(0) + '*'.repeat(Math.max(username.length - 2, 1)) + username.slice(-1)
  return `${masked}@${domain}`
}

/**
 * Mask sensitive data
 */
export function maskString(str: string, visibleChars: number = 4): string {
  if (str.length <= visibleChars) {
    return '*'.repeat(str.length)
  }
  return str.substring(0, visibleChars) + '*'.repeat(str.length - visibleChars)
}
