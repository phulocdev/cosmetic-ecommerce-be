/**
 * Winston Logger Configuration
 */

import { WinstonModuleOptions } from 'nest-winston'
import * as winston from 'winston'

const { combine, timestamp, printf, colorize, errors, json } = winston.format

// Custom log format for development
const devFormat = printf(({ level, message, timestamp, context, trace, ...meta }) => {
  const contextStr = context ? `[${context}]` : ''
  const metaStr = Object.keys(meta).length ? JSON.stringify(meta) : ''
  const traceStr = trace ? `\n${trace}` : ''
  return `${timestamp} ${level} ${contextStr} ${message} ${metaStr}${traceStr}`
})

// Production format (JSON for log aggregation)
const prodFormat = combine(timestamp(), errors({ stack: true }), json())

// Development format (colorized, human-readable)
const developmentFormat = combine(
  colorize({ all: true }),
  timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  errors({ stack: true }),
  devFormat
)

export const winstonConfig: WinstonModuleOptions = {
  level: process.env.LOG_LEVEL || 'debug',
  format: process.env.NODE_ENV === 'production' ? prodFormat : developmentFormat,
  defaultMeta: {
    service: process.env.APP_NAME || 'PL.inc'
  },
  transports: [
    // Console transport
    new winston.transports.Console({
      stderrLevels: ['error']
    }),

    // File transport for errors
    ...(process.env.NODE_ENV === 'production'
      ? [
          new winston.transports.File({
            filename: 'logs/error.log',
            level: 'error',
            maxsize: 10485760, // 10MB
            maxFiles: 5,
            tailable: true
          }),
          new winston.transports.File({
            filename: 'logs/combined.log',
            maxsize: 10485760, // 10MB
            maxFiles: 10,
            tailable: true
          })
        ]
      : [])
  ],
  exceptionHandlers: [
    new winston.transports.Console(),
    ...(process.env.NODE_ENV === 'production'
      ? [new winston.transports.File({ filename: 'logs/exceptions.log' })]
      : [])
  ],
  rejectionHandlers: [
    new winston.transports.Console(),
    ...(process.env.NODE_ENV === 'production'
      ? [new winston.transports.File({ filename: 'logs/rejections.log' })]
      : [])
  ]
}
