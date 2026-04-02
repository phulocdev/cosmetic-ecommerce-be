import { BullModule } from '@nestjs/bull'
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { RequestLoggerMiddleware } from 'core'
import { AuthModule } from 'domains/auth'
import { CategoriesModule } from 'domains/categories/categories.module'
import { EmailModule } from 'domains/email/email.module'
import { ProductsModule } from 'domains/products'
import { UsersModule } from 'domains/users'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { CoreModule } from './core/core.module'
import { DatabaseModule } from './database/database.module'
import { AttributesModule } from './domains/attributes/attributes.module'
import { BrandsModule } from './domains/brands/brands.module'
import { CollectionsModule } from './domains/collections/collections.module'
import { CountryOfOriginModule } from './domains/country-of-origin/country-of-origin.module'
import { UploadModule } from './domains/upload/upload.module'
import { CartModule } from './domains/cart/cart.module';
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
    UploadModule,
    CollectionsModule,
    CartModule
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(RequestLoggerMiddleware).forRoutes('*')
  }
}
