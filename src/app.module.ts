import { Module } from '@nestjs/common'
import { AuthModule } from 'domains/auth/auth.module'
import { UsersModule } from 'domains/users/users.module'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { CoreModule } from './core/core.module'

@Module({
  imports: [CoreModule, AuthModule, UsersModule],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}
