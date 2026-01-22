import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common'
import { Request, Response } from 'express'

@Catch()
export default class AnyExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse<Response>()
    const request = ctx.getRequest<Request>()
    const statusCode = exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR

    if (statusCode === HttpStatus.INTERNAL_SERVER_ERROR) {
      response.status(statusCode).json({
        timestamp: new Date().toISOString(),
        instance: request.url,
        title: 'Internal Server Error',
        statusCode,
        message: (exception as any).message ?? 'Đã xảy ra lỗi không mong muốn. Vui lòng thử lại sau.'
      })
    } else {
      response.status(statusCode).json((exception as HttpException).getResponse())
    }
  }
}
