/**
 * Request Logger Middleware
 * ===========================================
 * Adds request ID and logs incoming requests
 */

import { Injectable, NestMiddleware, Logger } from '@nestjs/common'
import { Request, Response, NextFunction } from 'express'
import { v4 as uuidv4 } from 'uuid'

@Injectable()
export class RequestLoggerMiddleware implements NestMiddleware {
  private readonly logger = new Logger(RequestLoggerMiddleware.name)

  use(req: Request, res: Response, next: NextFunction): void {
    const requestId = (req.headers['x-request-id'] as string) || uuidv4()
    req.headers['x-request-id'] = requestId
    res.setHeader('X-Request-ID', requestId)

    const startTime = Date.now()
    const { method, originalUrl, ip } = req

    res.on('finish', () => {
      const duration = Date.now() - startTime
      const { statusCode } = res
      const contentLength = res.get('content-length') || 0

      const logMessage = `${method} ${originalUrl} ${statusCode} ${contentLength}B - ${duration}ms`
      const idempotencyKey = req.headers['idempotency-key'] as string
      const idempotencyInfo = idempotencyKey ? ` | Idempotency: ${idempotencyKey}` : ''
      const context = `RequestID: ${requestId} | IP: ${ip}${idempotencyInfo}`

      if (statusCode >= 500) {
        this.logger.error(logMessage, context)
      } else if (statusCode >= 400) {
        this.logger.warn(logMessage, context)
      } else {
        this.logger.log(logMessage, context)
      }
    })

    next()
  }
}
