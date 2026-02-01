import { Module, ValidationPipe } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core'
import { ValidationError } from 'class-validator'
import { EmailModule } from 'core/email/email.module'
import { UnprocessableEntityError } from 'core/exceptions/errors.exception'
import GlobalExceptionFilter from 'core/exceptions/global-exception-filter'
import { TransformResponseInterceptor } from 'core/interceptors/transform-response.interceptor'
import { TrimBodyPayloadPipe } from 'core/pipes/trim-body-payload.pipe'
import { JwtAuthGuard } from 'domains/auth/guards/jwt-auth.guard'
import Joi from 'joi'
import { extractErrorMessageFromDto } from 'utils'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        NODE_ENV: Joi.string().valid('development', 'production', 'test', 'provision').required(),
        PORT: Joi.number().port().required(),
        API_KEY: Joi.string().required(),
        JWT_ACCESS_SECRET: Joi.string().required(),
        JWT_ACCESS_EXPIRATION: Joi.string().required(),
        JWT_REFRESH_SECRET: Joi.string().required(),
        JWT_REFRESH_EXPIRATION: Joi.string().required(),
        SERVER_BASE_URL: Joi.string().required(),
        CLOUDINARY_API_KEY: Joi.string().required(),
        CLOUDINARY_API_SECRET: Joi.string().required(),
        CLOUDINARY_CLOUD_NAME: Joi.string().required(),
        EMAIL_HOST: Joi.string().required(),
        EMAIL_SENDER: Joi.string().required(),
        EMAIL_APP_PASSWORD: Joi.string().required(),
        REDIS_HOST: Joi.string().required(),
        REDIS_PORT: Joi.number().port().required(),
        REDIS_PASSWORD: Joi.string().allow('').optional(),
        REDIS_DB: Joi.number().optional(),
        LOGIN_ATTEMPTS_WINDOW_SECONDS: Joi.number().optional(),
        MAX_LOGIN_ATTEMPTS: Joi.number().optional()
      })
    }),
    EmailModule
  ],
  providers: [
    // { provide: APP_GUARD, useClass: ApiKeyGuard },
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: TransformResponseInterceptor
    },
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        whitelist: true,
        transform: true,
        transformOptions: { enableImplicitConversion: true },
        stopAtFirstError: true,
        exceptionFactory: (validationErrors: ValidationError[] = []) => {
          const errorMessage = extractErrorMessageFromDto(validationErrors)
          return new UnprocessableEntityError(
            validationErrors.map((error, index) => ({
              field: error.property,
              message: errorMessage[index]
            }))
          )
        }
      })
    },
    { provide: APP_PIPE, useValue: new TrimBodyPayloadPipe() },
    { provide: APP_FILTER, useClass: GlobalExceptionFilter }
  ],
  exports: []
})
export class CoreModule {}
