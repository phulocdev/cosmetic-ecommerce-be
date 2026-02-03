import { HttpException, HttpStatus } from '@nestjs/common'

export class BadRequestError extends HttpException {
  constructor(message: string) {
    super(
      {
        title: 'Bad Request',
        statusCode: HttpStatus.BAD_REQUEST,
        message
      },
      HttpStatus.BAD_REQUEST
    )
  }
}

export class NotFoundError extends HttpException {
  constructor(message: string) {
    super(
      {
        title: 'Not Found',
        statusCode: HttpStatus.NOT_FOUND,
        message
      },
      HttpStatus.NOT_FOUND
    )
  }
}

export class UnauthorizedError extends HttpException {
  constructor(message: string) {
    super(
      {
        title: 'Unauthorized',
        statusCode: HttpStatus.UNAUTHORIZED,
        message
      },
      HttpStatus.UNAUTHORIZED
    )
  }
}

export class UnprocessableEntityError extends HttpException {
  constructor(errors: { field: string; message: string }[], message?: string | undefined) {
    super(
      {
        title: 'Unprocessable Entity',
        statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        message: message || 'Error related to validation fields',
        errors
      },
      HttpStatus.UNPROCESSABLE_ENTITY
    )
  }
}

export class TooManyRequestsError extends HttpException {
  constructor(message: string) {
    super(
      {
        title: 'Too Many Requests',
        statusCode: HttpStatus.TOO_MANY_REQUESTS,
        message
      },
      HttpStatus.TOO_MANY_REQUESTS
    )
  }
}

export class InternalServerError extends HttpException {
  constructor(message: string) {
    super(
      {
        title: 'Internal Server Error',
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message
      },
      HttpStatus.INTERNAL_SERVER_ERROR
    )
  }
}

export class ForbiddenError extends HttpException {
  constructor(message: string) {
    super(
      {
        title: 'Forbidden',
        statusCode: HttpStatus.FORBIDDEN,
        message
      },
      HttpStatus.FORBIDDEN
    )
  }
}

export class ConflictError extends HttpException {
  constructor(message: string) {
    super(
      {
        title: 'Conflict',
        statusCode: HttpStatus.CONFLICT,
        message
      },
      HttpStatus.CONFLICT
    )
  }
}
