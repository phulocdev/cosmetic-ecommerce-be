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
  private readonly logger = new Logger('CC')

  use(req: Request, res: Response, next: NextFunction): void {
    // Add unique request ID
    // The requesId is added to both request headers and response headers for tracking
    // The requesId is generated using UUID v4 from the server side
    // and then attached to the request by Client must also send the same header back for tracking
    const requestId = (req.headers['x-request-id'] as string) || uuidv4()
    req.headers['x-request-id'] = requestId
    res.setHeader('X-Request-ID', requestId)

    // Log request start
    const startTime = Date.now()
    const { method, originalUrl, ip } = req

    // Log when response finishes
    res.on('finish', () => {
      const duration = Date.now() - startTime
      const { statusCode } = res
      const contentLength = res.get('content-length') || 0

      const logMessage = `${method} ${originalUrl} ${statusCode} ${contentLength}B - ${duration}ms`

      if (statusCode >= 500) {
        this.logger.error(logMessage, { requestId, ip })
      } else if (statusCode >= 400) {
        this.logger.warn(logMessage, { requestId, ip })
      } else {
        this.logger.log(logMessage, { requestId, ip })
      }
    })

    next()
  }
}
