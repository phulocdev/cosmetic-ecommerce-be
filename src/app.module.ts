import { MiddlewareConsumer, Module } from '@nestjs/common'
import { PrismaModule } from 'database/prisma/prisma.module'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { CoreModule } from './core/core.module'
import { AuthModule } from './domains/auth/auth.module';
import { UsersModule } from './domains/users/users.module';
@Module({
  imports: [CoreModule, PrismaModule, AuthModule, UsersModule],
  controllers: [AppController],
  providers: [{ provide: AppService, useClass: AppService }]
})
export class AppModule {}
