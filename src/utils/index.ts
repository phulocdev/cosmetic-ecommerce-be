import { ValidationError } from 'class-validator'
import { UnprocessableEntityError } from 'core/exceptions/errors.exception'

export const extractErrorMessageFromDto = (errors: ValidationError[]): string[] => {
  const messages: string[] = []

  errors.forEach((error) => {
    if (error.constraints) {
      messages.push(...Object.values(error.constraints))
    }
    if (error.children && error.children.length > 0) {
      messages.push(...extractErrorMessageFromDto(error.children))
    }
  })
  return messages
}

export function isEmptyObject(obj: object) {
  for (const prop in obj) {
    if (Object.hasOwn(obj, prop)) {
      return false
    }
  }
  return true
}

export function normalizeIp(ip: string): string {
  if (ip === '::1') return '127.0.0.1'
  if (ip.startsWith('::ffff:')) return ip.replace('::ffff:', '')
  return ip
}
