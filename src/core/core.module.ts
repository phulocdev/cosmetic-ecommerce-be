import { Module, UnprocessableEntityException, ValidationPipe } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core'
import { ThrottlerModule } from '@nestjs/throttler'
import { ValidationError } from 'class-validator'
import {
  appConfig,
  corsConfig,
  databaseConfig,
  jwtConfig,
  securityConfig,
  swaggerConfig,
  throttleConfig
} from 'config'
import { HttpExceptionFilter } from 'core/filters'
import { JwtAuthGuard } from 'core/guards/jwt-auth.guard'
import { LoggingInterceptor, TimeoutInterceptor, TransformInterceptor } from 'core/interceptors'
import { extractErrorMessageFromDto } from 'utils'
import { validationSchema } from '../config/validation.schema'
import { EventEmitterModule } from '@nestjs/event-emitter'
import { ScheduleModule } from '@nestjs/schedule'
import { TerminusModule } from '@nestjs/terminus'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [`.env.${process.env.NODE_ENV}`, '.env'],
      load: [
        appConfig,
        corsConfig,
        databaseConfig,
        jwtConfig,
        securityConfig,
        swaggerConfig,
        throttleConfig
      ],
      validationSchema,
      validationOptions: {
        allowUnknown: true, // allow environment variables that are not specified in the schema
        abortEarly: true // stop validation on the first error
      }
    }),
    // Rate Limiting
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => [
        {
          ttl: config.get<number>('throttle.ttl', 60000),
          limit: config.get<number>('throttle.limit', 100)
        }
      ]
    }),

    // Scheduling
    ScheduleModule.forRoot(),

    // Event Emitter
    EventEmitterModule.forRoot({
      wildcard: true,
      delimiter: '.',
      newListener: false,
      removeListener: false,
      maxListeners: 20,
      verboseMemoryLeak: true,
      ignoreErrors: false
    }),

    // Health Checks
    TerminusModule
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: TransformInterceptor
    },
    // {
    //   provide: APP_INTERCEPTOR,
    //   useClass: TimeoutInterceptor
    // },
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor
    },
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        whitelist: true, // strip or remove properties that do not have any decorators
        transform: true, // automatically transform payloads to DTO instances
        // forbidNonWhitelisted: true, // throw error on unexpected properties in DTO
        // transformOptions: { enableImplicitConversion: true }, //
        stopAtFirstError: true,
        validationError: {
          target: false, // do not include the object that was validated in the error output
          value: false // do not include the value that was validated in the error output
        },
        exceptionFactory: (validationErrors: ValidationError[] = []) => {
          const errorMessage = extractErrorMessageFromDto(validationErrors)
          return new UnprocessableEntityException(
            validationErrors.map((error, index) => ({
              field: error.property,
              message: errorMessage[index]
            }))
          )
        }
      })
    },
    { provide: APP_FILTER, useClass: HttpExceptionFilter }
  ],
  exports: []
})
export class CoreModule {}
