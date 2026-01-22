import { Module } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { PassportModule } from '@nestjs/passport'
import { JwtStrategy } from 'domains/auth/jwt.strategy'
import { LocalEmployeeStrategy } from 'domains/auth/local.strategy'
import { UsersModule } from 'domains/users/users.module'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'

@Module({
  imports: [PassportModule, UsersModule],
  controllers: [AuthController],
  providers: [AuthService, LocalEmployeeStrategy, JwtStrategy, JwtService]
})
export class AuthModule {}
