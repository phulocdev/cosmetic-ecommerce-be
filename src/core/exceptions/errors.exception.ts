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
        message: message || 'Lỗi xác thực dữ liệu',
        errors
      },
      HttpStatus.UNPROCESSABLE_ENTITY
    )
  }
}
