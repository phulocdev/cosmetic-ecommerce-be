/**
 * Custom HTTP Exceptions
 * ===========================================
 * Standardized exception classes
 */

import { HttpException, HttpStatus } from '@nestjs/common'

/**
 * Base custom exception
 */
export class BaseException extends HttpException {
  constructor(
    message: string,
    statusCode: HttpStatus,
    public readonly errorCode?: string,
    public readonly details?: any
  ) {
    super(
      {
        message,
        error: errorCode || 'Error',
        statusCode,
        details
      },
      statusCode
    )
  }
}

/**
 * Business logic exception
 */
export class BusinessException extends BaseException {
  constructor(message: string, details?: any) {
    super(message, HttpStatus.BAD_REQUEST, 'BUSINESS_ERROR', details)
  }
}

/**
 * Entity not found exception
 */
export class EntityNotFoundException extends BaseException {
  constructor(entity: string, identifier?: string | number) {
    const message = identifier
      ? `${entity} with identifier "${identifier}" not found`
      : `${entity} not found`
    super(message, HttpStatus.NOT_FOUND, 'ENTITY_NOT_FOUND')
  }
}

/**
 * Duplicate entity exception
 */
export class DuplicateEntityException extends BaseException {
  constructor(entity: string, field: string) {
    super(`${entity} with this ${field} already exists`, HttpStatus.CONFLICT, 'DUPLICATE_ENTITY')
  }
}

/**
 * Validation exception
 */
export class ValidationException extends BaseException {
  constructor(details: Record<string, string[]>) {
    super('Validation failed', HttpStatus.BAD_REQUEST, 'VALIDATION_ERROR', details)
  }
}

/**
 * Authentication exception
 */
export class AuthenticationException extends BaseException {
  constructor(message = 'Authentication failed') {
    super(message, HttpStatus.UNAUTHORIZED, 'AUTHENTICATION_ERROR')
  }
}

/**
 * Authorization exception
 */
export class AuthorizationException extends BaseException {
  constructor(message = 'Access denied') {
    super(message, HttpStatus.FORBIDDEN, 'AUTHORIZATION_ERROR')
  }
}

/**
 * Rate limit exception
 */
export class RateLimitException extends BaseException {
  constructor(retryAfter?: number) {
    super('Too many requests', HttpStatus.TOO_MANY_REQUESTS, 'RATE_LIMIT_ERROR', {
      retryAfter
    })
  }
}

export class LockTimeoutException extends BaseException {
  constructor(message = 'Failed to acquire lock, please try again later') {
    super(message, HttpStatus.CONFLICT, 'LOCK_TIMEOUT')
  }
}

export class LockTimeoutError extends Error {
  constructor(key: string) {
    super(`Could not acquire lock for "${key}" within the timeout`)
    this.name = 'LockTimeoutError'
  }
}

export class LockNotOwnedError extends Error {
  constructor(key: string) {
    super(`Cannot release lock "${key}": token mismatch (already expired or stolen)`)
    this.name = 'LockNotOwnedError'
  }
}

export class LockNotOwnedException extends BaseException {
  constructor(message = 'Failed to release lock, lock not owned by requester') {
    super(message, HttpStatus.CONFLICT, 'LOCK_NOT_OWNED')
  }
}
