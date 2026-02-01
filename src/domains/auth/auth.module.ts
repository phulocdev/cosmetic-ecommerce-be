import { Module } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { PassportModule } from '@nestjs/passport'
import { PrismaModule } from 'database/prisma/prisma.module'
import { JwtStrategy } from 'domains/auth/strategies/jwt.strategy'
import { UsersModule } from 'domains/users/users.module'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'
import { EmailModule } from 'core/email/email.module'

@Module({
  imports: [PassportModule, UsersModule, PrismaModule, EmailModule],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, JwtService]
})
export class AuthModule {}
