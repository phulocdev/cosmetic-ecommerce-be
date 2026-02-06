import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus, Logger } from '@nestjs/common'
import { Request, Response } from 'express'

export interface ErrorResponse {
  success: false
  statusCode: number
  title: string
  message: string
  path: string
  stack?: string | null
  errors?: { field: string; message: string }[]
}

@Catch()
export default class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse<Response>()
    const request = ctx.getRequest<Request>()
    const statusCode = exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR

    if (statusCode === HttpStatus.INTERNAL_SERVER_ERROR) {
      response.status(statusCode).json({
        instance: request.url,
        title: 'Internal Server Error',
        statusCode,
        stack: exception instanceof Error ? exception.stack : null,
        message: (exception as any).message ?? 'Unexpected error occurred'
      })
    } else {
      response.status(statusCode).json((exception as HttpException).getResponse())
    }
  }
}
