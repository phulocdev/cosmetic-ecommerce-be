/**
 * Date Utilities
 * ===========================================
 * Helper functions for date manipulation
 */

/**
 * Parse duration string to milliseconds
 * Supports: s (seconds), m (minutes), h (hours), d (days)
 */
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
