import { BullModule } from '@nestjs/bull'
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { RequestLoggerMiddleware } from 'core'
import { EmailModule } from 'domains/email/email.module'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { CoreModule } from './core/core.module'
import { RedisModule } from './database/redis/redis.module'
import { AuthModule } from 'domains/auth'
import { UsersModule } from 'domains/users'
import { ProductsModule } from 'domains/products'
import { CategoriesModule } from 'domains/categories/categories.module'
import { DatabaseModule } from './database/database.module'
import { BrandsModule } from './domains/brands/brands.module'
import { CountryOfOriginModule } from './domains/country-of-origin/country-of-origin.module'
import { AttributesModule } from './domains/attributes/attributes.module'
import { UploadModule } from './domains/upload/upload.module'
@Module({
  imports: [
    // Core Modules
    CoreModule,

    DatabaseModule,

    // Email Modules,
    EmailModule,

    // Queue Modules
    BullModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        redis: {
          host: configService.get('REDIS_HOST'),
          port: parseInt(configService.get('REDIS_PORT'), 10),
          password: configService.get('REDIS_PASSWORD'),
          db: parseInt(configService.get('REDIS_DB'), 10)
        }
      }),
      inject: [ConfigService]
    }),

    // Feature Modules
    AuthModule,
    UsersModule,
    ProductsModule,
    CategoriesModule,
    DatabaseModule,
    BrandsModule,
    CountryOfOriginModule,
    AttributesModule,
    UploadModule
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(RequestLoggerMiddleware).forRoutes('*')
  }
}
