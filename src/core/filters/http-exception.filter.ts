/**
 * HTTP Exception Filter
 * ===========================================
 * Global exception handling with standardized responses
 */

import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus, Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Request, Response } from 'express'
import { ErrorResponse } from 'types/common.type'
// import * as Sentry from '@sentry/node';

@Catch() // Catch all exceptions ~ Global Error Handler in other frameworks: Express, Django, Spring, etc.
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name)
  private readonly isProduction: boolean
  private readonly sentryEnabled: boolean

  constructor(private readonly configService: ConfigService) {
    this.isProduction = configService.get('app.nodeEnv') === 'production'
    this.sentryEnabled = configService.get('SENTRY_ENABLED') === 'true'
  }

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse<Response>()
    const request = ctx.getRequest<Request>()

    // Determine status code
    const status = exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR

    // Extract error details
    const errorResponse = this.getErrorResponse(exception)

    // Build response
    const responseBody: ErrorResponse = {
      success: false,
      statusCode: status,
      message: errorResponse.message,
      error: errorResponse.error,
      details: this.isProduction ? undefined : errorResponse.details,
      path: request.url,
      timestamp: new Date().toISOString(),
      requestId: request.headers['x-request-id'] as string
    }

    // Log error
    this.logError(exception, request, status)

    // Report to Sentry (only for 5xx errors)
    if (status >= 500 && this.sentryEnabled) {
      this.reportToSentry(exception, request)
    }

    response.status(status).json(responseBody)
  }

  private getErrorResponse(exception: unknown): {
    message: string
    error: string
    details?: any
  } {
    if (exception instanceof HttpException) {
      const response = exception.getResponse()

      if (typeof response === 'object') {
        const responseObj = response as any
        return {
          message: responseObj.message || exception.message,
          error: responseObj.error || exception.name,
          details: responseObj.details
        }
      }

      return {
        message: response as string,
        error: exception.name
      }
    }

    if (exception instanceof Error) {
      return {
        // Prevent leaking internal error messages in production
        message: this.isProduction ? 'Internal server error' : exception.message,
        error: exception.name,
        details: this.isProduction ? undefined : exception.stack
      }
    }

    return {
      message: 'Internal server error',
      error: 'UnknownError'
    }
  }

  private logError(exception: unknown, request: Request, status: number): void {
    const logContext = {
      method: request.method,
      url: request.url,
      body: request.body,
      user: (request as any).user?.id,
      ip: request.ip,
      userAgent: request.headers['user-agent']
    }

    if (status >= 500) {
      this.logger.error(
        `${request.method} ${request.url} - ${status}`,
        exception instanceof Error ? exception.stack : 'Unknown error',
        logContext
      )
    } else if (status >= 400) {
      this.logger.warn(`${request.method} ${request.url} - ${status}`, logContext)
    }
  }

  private reportToSentry(exception: unknown, request: Request): void {
    // Sentry.withScope(scope => {
    //   scope.setTag('url', request.url);
    //   scope.setTag('method', request.method);
    //   scope.setUser({
    //     id: (request as any).user?.id,
    //     email: (request as any).user?.email,
    //     ip_address: request.ip,
    //   });
    //   scope.setExtra('body', request.body);
    //   scope.setExtra('headers', request.headers);
    //   Sentry.captureException(exception);
    // });
  }
}
