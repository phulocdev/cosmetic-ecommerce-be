import { Module } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { PassportModule } from '@nestjs/passport'
import { EmailModule } from 'domains/email/email.module'
import { JwtStrategy } from 'domains/auth/strategies/jwt.strategy'
import { UsersModule } from 'domains/users/users.module'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'
import { GoogleStrategy } from 'domains/auth/strategies/google.strategy'
import { FacebookStrategy } from 'domains/auth/strategies'

@Module({
  imports: [PassportModule, UsersModule, EmailModule],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, GoogleStrategy, FacebookStrategy, JwtService]
})
export class AuthModule {}
