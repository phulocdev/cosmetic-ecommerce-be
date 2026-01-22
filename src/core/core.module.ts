import { Module, ValidationPipe } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core'
import { MongooseModule } from '@nestjs/mongoose'
import { ValidationError } from 'class-validator'
import AnyExceptionFilter from 'core/exceptions/any-exception-filter'
import { UnprocessableEntityError } from 'core/exceptions/errors.exception'
import { ApiKeyGuard } from 'core/guards/api-key.guard'
import { JwtAuthGuard } from 'core/guards/jwt-auth.guard'
import { TransformResponseInterceptor } from 'core/interceptors/transform-response.interceptor'
import Joi from 'joi'
import { extractErrorMessageFromDto } from 'core/utils/utils'
import { TrimBodyPayloadPipe } from 'core/pipes/trim-body-payload.pipe'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        NODE_ENV: Joi.string().valid('development', 'production', 'test', 'provision').required(),
        PORT: Joi.number().port().required(),
        API_KEY: Joi.string().required(),
        DATABASE_URI: Joi.string().required(),
        ACCESS_TOKEN_SECRET: Joi.string().required(),
        ACCESS_TOKEN_EXPIRATION_TIME: Joi.string().required(),
        REFRESH_TOKEN_SECRET: Joi.string().required(),
        REFRESH_TOKEN_EXPIRATION_TIME: Joi.string().required(),
        SERVER_BASE_URL: Joi.string().required(),
        CLOUDINARY_API_KEY: Joi.string().required(),
        CLOUDINARY_API_SECRET: Joi.string().required(),
        CLOUDINARY_CLOUD_NAME: Joi.string().required(),
        EMAIL_HOST: Joi.string().required(),
        EMAIL_SENDER: Joi.string().required(),
        EMAIL_APP_PASSWORD: Joi.string().required(),
        EMAIL_PREVIEW: Joi.string().required(),
        PRODUCT_PREFIX_CODE: Joi.string().required(),
        PRODUCT_COUNTER_NAME: Joi.string().required(),
        MAX_LENGTH_PRODUCT_CODE: Joi.string().required(),
        CUSTOMER_PREFIX_CODE: Joi.string().required(),
        CUSTOMER_COUNTER_NAME: Joi.string().required(),
        MAX_LENGTH_CUSTOMER_CODE: Joi.string().required(),
        ORDER_PREFIX_CODE: Joi.string().required(),
        ORDER_COUNTER_NAME: Joi.string().required(),
        MAX_LENGTH_ORDER_CODE: Joi.string().required(),
        INBOUND_TRANSACTION_PREFIX_CODE: Joi.string().required(),
        INBOUND_TRANSACTION_COUNTER_NAME: Joi.string().required(),
        MAX_LENGTH_INBOUND_TRANSACTION_CODE: Joi.string().required(),
        OUTBOUND_TRANSACTION_PREFIX_CODE: Joi.string().required(),
        OUTBOUND_TRANSACTION_COUNTER_NAME: Joi.string().required(),
        MAX_LENGTH_OUTBOUND_TRANSACTION_CODE: Joi.string().required(),
        SUPPLIER_TRANSACTION_PREFIX_CODE: Joi.string().required(),
        SUPPLIER_TRANSACTION_COUNTER_NAME: Joi.string().required(),
        MAX_LENGTH_SUPPLIER_TRANSACTION_CODE: Joi.string().required()
      })
    }),
    MongooseModule.forRootAsync({
      useFactory: async (configService: ConfigService) => {
        return {
          uri: configService.get<string>('DATABASE_URI')
        }
      },
      inject: [ConfigService]
    })
  ],
  providers: [
    { provide: APP_GUARD, useClass: ApiKeyGuard },
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard
    },
    // {
    //   provide: APP_GUARD,
    //   useClass: RolesGuard
    // },
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
    { provide: APP_FILTER, useClass: AnyExceptionFilter }
  ],
  exports: []
})
export class CoreModule {}
