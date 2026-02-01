import { Module } from '@nestjs/common'
import { PrismaModule } from 'database/prisma/prisma.module'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { CoreModule } from './core/core.module'
import { RedisModule } from './database/redis/redis.module'
import { AuthModule } from './domains/auth/auth.module'
import { UsersModule } from './domains/users/users.module'
import { BullModule } from '@nestjs/bull'
import { ConfigService } from '@nestjs/config'
@Module({
  imports: [
    CoreModule,
    PrismaModule,
    AuthModule,
    UsersModule,
    RedisModule,
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
    })
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}
