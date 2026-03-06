/**
 * Date Utilities
 * ===========================================
 * Helper functions for date manipulation
 */

/**
 * Parse duration string to milliseconds
 * Supports: s (seconds), m (minutes), h (hours), d (days)
 */
export function parseDuration(duration: string): number {
  const match = duration.match(/^(\d+)(s|m|h|d)$/)
  if (!match) {
    throw new Error(`Invalid duration format: ${duration}`)
  }

  const value = parseInt(match[1], 10)
  const unit = match[2]

  const multipliers: Record<string, number> = {
    s: 1000,
    m: 60 * 1000,
    h: 60 * 60 * 1000,
    d: 24 * 60 * 60 * 1000
  }

  return value * multipliers[unit]
}

/**
 * Add duration to date
 */
export function addDuration(date: Date, duration: string): Date {
  const ms = parseDuration(duration)
  return new Date(date.getTime() + ms)
}

/**
 * Check if date is expired
 */
export function isExpired(date: Date): boolean {
  return date.getTime() < Date.now()
}

/**
 * Format date to ISO string without milliseconds
 */
export function formatDate(date: Date): string {
  return date.toISOString().split('.')[0] + 'Z'
}

/**
 * Get start of day
 */
export function startOfDay(date: Date): Date {
  const result = new Date(date)
  result.setHours(0, 0, 0, 0)
  return result
}

/**
 * Get end of day
 */
export function endOfDay(date: Date): Date {
  const result = new Date(date)
  result.setHours(23, 59, 59, 999)
  return result
}

/**
 * Calculate age from date of birth
 */
export function calculateAge(dateOfBirth: Date): number {
  const today = new Date()
  let age = today.getFullYear() - dateOfBirth.getFullYear()
  const monthDiff = today.getMonth() - dateOfBirth.getMonth()

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dateOfBirth.getDate())) {
    age--
  }

  return age
}

/**
 * Get relative time string
 */
export function getRelativeTime(date: Date): string {
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffSeconds = Math.floor(diffMs / 1000)
  const diffMinutes = Math.floor(diffSeconds / 60)
  const diffHours = Math.floor(diffMinutes / 60)
  const diffDays = Math.floor(diffHours / 24)

  if (diffSeconds < 60) {
    return 'just now'
  } else if (diffMinutes < 60) {
    return `${diffMinutes} minute${diffMinutes > 1 ? 's' : ''} ago`
  } else if (diffHours < 24) {
    return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`
  } else if (diffDays < 7) {
    return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`
  } else {
    return date.toLocaleDateString()
  }
}

import { fromZonedTime } from 'date-fns-tz'
import { BadRequestException } from '@nestjs/common'

export interface UtcDateRange {
  from: Date
  to: Date
}

export function buildUtcDateRange(
  startDate?: string,
  endDate?: string,
  timezone: string = 'UTC' // safe fallback
): UtcDateRange | undefined {
  if (!startDate && !endDate) return undefined

  if (!startDate || !endDate) {
    throw new BadRequestException('Both startDate and endDate must be provided together')
  }

  try {
    // Interprets midnight/end-of-day in the USER'S timezone, then converts to UTC
    const start = fromZonedTime(`${startDate}T00:00:00`, timezone)
    const end = fromZonedTime(`${endDate}T23:59:59.999`, timezone)

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      throw new Error()
    }

    if (start > end) {
      throw new BadRequestException('startDate must be before or equal to endDate')
    }

    return { from: start, to: end }
  } catch (e) {
    if (e instanceof BadRequestException) throw e
    throw new BadRequestException(
      'Invalid date or timezone. Use YYYY-MM-DD and a valid IANA timezone'
    )
  }
}
