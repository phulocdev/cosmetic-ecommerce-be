import { Inject, Injectable, UnauthorizedException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtService, TokenExpiredError } from '@nestjs/jwt'
import { BadRequestError, UnauthorizedError } from 'core/exceptions/errors.exception'
import { PrismaService } from 'database/prisma/prisma.service'
import {
  ChangePasswordDto,
  ForgotPasswordDto,
  LoginDto,
  RegisterDto,
  ResetPasswordDto
} from 'domains/auth/dtos/auth.dto'
import * as bcrypt from 'bcrypt'
import ms from 'ms'
import { REDIS_CLIENT } from 'database/redis/redis.module'
import Redis from 'ioredis'
import { UsersService } from 'domains/users/users.service'
import crypto from 'crypto'
import { EmailProducer } from 'core/email/email.producer'

@Injectable()
export class AuthService {
  private readonly LOGIN_ATTEMPTS_PREFIX = 'login_attempts:'

  constructor(
    @Inject() private prismaService: PrismaService,
    @Inject() private jwtService: JwtService,
    @Inject() private configService: ConfigService,
    @Inject() private usersService: UsersService,
    @Inject(REDIS_CLIENT)
    @Inject()
    private readonly redis: Redis,
    @Inject() private emailProducer: EmailProducer
  ) {}

  async register(registerDto: RegisterDto) {
    const existingUser = await this.prismaService.user.findFirst({
      where: { email: registerDto.email }
    })

    if (existingUser) {
      throw new BadRequestError('Email already exists')
    }

    // Check the unique phone number if provided
    if (registerDto.phoneNumber) {
      const existingPhoneUser = await this.prismaService.user.findFirst({
        where: { phoneNumber: registerDto.phoneNumber }
      })

      if (existingPhoneUser) {
        throw new BadRequestError('Phone number already exists')
      }
    }

    const hashedPassword = await this.hashPassword(registerDto.password)

    const user = await this.prismaService.user.create({
      data: {
        email: registerDto.email,
        password: hashedPassword,
        fullName: registerDto.fullName,
        phoneNumber: registerDto.phoneNumber
      }
    })

    // When user logs in / register, get/set their current token version
    const tokenVersion = Number(await this.getTokenVersion(user.id)) + 0

    const accessTokenPayload: AccessTokenPayload = {
      userId: user.id,
      email: user.email,
      role: user.role,
      version: tokenVersion
    }
    const refreshTokenPayload: RefreshTokenPayload = { userId: user.id, email: user.email, role: user.role }

    const [accessToken, refreshToken] = await Promise.all([
      this.signAccessToken(accessTokenPayload),
      this.signRefreshToken(refreshTokenPayload)
    ])

    await this.createRefreshTokenRecord(user.id, refreshToken)

    return { user: this.sanitizeUser(user), accessToken, refreshToken }
  }

  async login(loginDto: LoginDto, ipAddress?: string) {
    // Rate limiting: Check login attempts
    if (ipAddress) {
      const attempts = await this.checkLoginAttempts(loginDto.email, ipAddress)
      if (attempts >= this.configService.get<number>('MAX_LOGIN_ATTEMPTS')) {
        throw new BadRequestError('Too many failed login attempts. Try again in 15 minutes')
      }
    }

    const user = await this.prismaService.user.findFirst({
      where: { email: loginDto.email }
    })

    if (!user || !user.isActive) {
      if (ipAddress) {
        await this.recordFailedLogin(loginDto.email, ipAddress)
      }
      throw new UnauthorizedError('Invalid credentials')
    }

    const isPasswordValid = await bcrypt.compare(loginDto.password, user.password)

    if (!isPasswordValid) {
      if (ipAddress) {
        await this.recordFailedLogin(loginDto.email, ipAddress)
      }
      throw new UnauthorizedError('Invalid credentials')
    }

    // Clear failed attempts on successful login
    if (ipAddress) {
      await this.clearLoginAttempts(loginDto.email, ipAddress)
    }

    const tokenVersion = Number(await this.getTokenVersion(user.id)) || 0
    const accessTokenPayload: AccessTokenPayload = {
      userId: user.id,
      email: user.email,
      role: user.role,
      version: +tokenVersion
    }
    const refreshTokenPayload: RefreshTokenPayload = { userId: user.id, email: user.email, role: user.role }

    const [accessToken, refreshToken] = await Promise.all([
      this.signAccessToken(accessTokenPayload),
      this.signRefreshToken(refreshTokenPayload)
    ])

    await this.createRefreshTokenRecord(user.id, refreshToken)

    return { user: this.sanitizeUser(user), accessToken, refreshToken }
  }

  async refreshTokens(refreshToken: string) {
    const tokenRecord = await this.prismaService.refreshToken.findFirst({
      where: { token: refreshToken },
      include: { user: true }
    })

    if (!tokenRecord) {
      throw new UnauthorizedError('Refresh token not found')
    }

    // Check if revoked RT is used => Remove all RTs of the user
    if (tokenRecord.isRevoked) {
      await this.cleanAllUserTokens(tokenRecord.userId)
      throw new UnauthorizedError('Invalid refresh token')
    }

    // Check if user is still active
    if (!tokenRecord.user.isActive) {
      throw new UnauthorizedError('User is inactive')
    }

    // Verify RT signature and expiration by using async verify function
    let decodedRefreshToken: JwtPayload | undefined

    try {
      decodedRefreshToken = await this.jwtService.verifyAsync<JwtPayload>(refreshToken, {
        secret: this.configService.get('JWT_REFRESH_SECRET')
      })
    } catch (error) {
      if (error instanceof TokenExpiredError) {
        // Revoke the expired token
        // await this.revokeRefreshToken(refreshToken)
        await this.cleanUserToken(refreshToken)
        throw new UnauthorizedError('Refresh token has expired')
      }

      throw new UnauthorizedError('Invalid refresh token')
    }

    // Check the existing token version
    let tokenVersion = +(await this.getTokenVersion(tokenRecord.user.id))

    // Edge case: Initialize token version if not exists
    if (tokenVersion === null) {
      tokenVersion = 0
      await this.saveTokenVersion(tokenVersion, tokenRecord.user.id)
    }

    // Generate new tokens
    const accessTokenPayload: AccessTokenPayload = {
      userId: tokenRecord.user.id,
      email: tokenRecord.user.email,
      role: tokenRecord.user.role,
      version: tokenVersion
    }
    const refreshTokenPayload: RefreshTokenPayload = {
      userId: tokenRecord.user.id,
      email: tokenRecord.user.email,
      role: tokenRecord.user.role
    }

    const [accessToken, newRefreshToken] = await Promise.all([
      this.signAccessToken(accessTokenPayload),
      this.signRefreshToken(refreshTokenPayload, decodedRefreshToken.exp)
    ])

    // Mark old token as replaced and save new refresh token
    await Promise.all([
      this.createRefreshTokenRecord(tokenRecord.user.id, newRefreshToken, tokenRecord.expiresAt),
      this.revokeRefreshToken(refreshToken)
    ])

    return { user: this.sanitizeUser(tokenRecord.user), accessToken, refreshToken: newRefreshToken }
  }

  async logout(accessTokenPayload: AccessTokenPayload, refreshToken: string) {
    // *------- Blacklist access token (Add access token to Redis) and Remove refresh token from database ----- *

    // Old way: Blacklist access token and remove only the used refresh token
    // await Promise.all([this.blacklistAccessToken(accessTokenPayload), this.cleanUserToken(refreshToken)])

    // New way: Just remove the refresh token and increment the token version to invalidate all existing access tokens
    await Promise.all([this.cleanUserToken(refreshToken), this.increaseTokenVersion(accessTokenPayload.userId)])

    return { message: 'Logged out successfully' }
  }

  async changePassword(jwtPayload: JwtPayload, changePasswordDto: ChangePasswordDto) {
    const user = await this.usersService.findOne(jwtPayload.userId)

    // Check if current password is correct
    const isCurrentPasswordValid = await bcrypt.compare(changePasswordDto.currentPassword, user.password)

    if (!isCurrentPasswordValid) {
      throw new BadRequestError('Current password is incorrect')
    }

    // Check that new password is different from current password
    if (changePasswordDto.currentPassword === changePasswordDto.newPassword) {
      throw new BadRequestError('New password must be different from the current password')
    }

    const hashedNewPassword = await this.hashPassword(changePasswordDto.newPassword)

    await this.prismaService.$transaction(async (prisma) => {
      // Update user's password
      await prisma.user.update({
        where: { id: jwtPayload.userId },
        data: { password: hashedNewPassword }
      })

      // Remove all existing refresh tokens
      await this.cleanAllUserTokens(jwtPayload.userId)
    })

    // Increase token version to invalidate all existing access tokens
    const newTokenVersion = await this.increaseTokenVersion(jwtPayload.userId)

    // Generate new tokens
    const accessTokenPayload: AccessTokenPayload = {
      userId: user.id,
      email: user.email,
      role: user.role,
      version: newTokenVersion
    }
    const refreshTokenPayload: RefreshTokenPayload = { userId: user.id, email: user.email, role: user.role }
    const [accessToken, refreshToken] = await Promise.all([
      this.signAccessToken(accessTokenPayload),
      this.signRefreshToken(refreshTokenPayload)
    ])

    await this.createRefreshTokenRecord(user.id, refreshToken)
    return { accessToken, refreshToken }
  }

  async forgotPassword(forgotPasswordDto: ForgotPasswordDto) {
    const user = await this.usersService.findByEmail(forgotPasswordDto.email)

    // Generate password reset token and save to database
    const resetPasswordToken = await this.generateSecureToken()

    // Upsert password reset token record => Overrite if already exists
    await this.prismaService.passwordResetToken.upsert({
      where: { userId: user.id },
      create: {
        userId: user.id,
        token: resetPasswordToken
      },
      update: {
        token: resetPasswordToken
      }
    })

    // e.g., https://your-frontend.com/reset-password?token=resetPasswordToken
    await this.emailProducer.sendPasswordResetEmail(user.email, resetPasswordToken) // Non-blocking
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto) {
    const tokenRecord = await this.prismaService.passwordResetToken.findFirst({
      where: { token: resetPasswordDto.resetToken },
      include: { user: true }
    })

    if (!tokenRecord) {
      throw new BadRequestError('Invalid password reset token')
    }

    const hashedNewPassword = await this.hashPassword(resetPasswordDto.newPassword)

    await this.prismaService.$transaction(async (prisma) => {
      // Update user's password
      await prisma.user.update({
        where: { id: tokenRecord.userId },
        data: { password: hashedNewPassword }
      })
      // Delete the used password reset token
      await prisma.passwordResetToken.delete({
        where: { userId: tokenRecord.userId }
      })
      // Remove all existing refresh tokens
      await this.cleanAllUserTokens(tokenRecord.userId)
    })

    // Increase token version to invalidate all existing access tokens
    await this.increaseTokenVersion(tokenRecord.userId)
  }

  // ------------------------------------ Helper methods ------------------------------------
  private async hashPassword(password: string, saltRounds: number = 10): Promise<string> {
    return bcrypt.hash(password, saltRounds)
  }

  private signAccessToken(payload: AccessTokenPayload) {
    return this.jwtService.signAsync(payload, {
      secret: this.configService.get('JWT_ACCESS_SECRET'),
      expiresIn: this.configService.get('JWT_ACCESS_EXPIRATION')
    })
  }

  /**
   * @param expiresAt seconds since epoch
   */
  private signRefreshToken(payload: RefreshTokenPayload, expiresAt?: number) {
    // Case: Refresh token with the original expiration time of the previous RT
    if (expiresAt) {
      return this.jwtService.signAsync(
        { ...payload, exp: expiresAt },
        {
          secret: this.configService.get('JWT_REFRESH_SECRET')
        }
      )
    }

    // Case: New refresh token with standard expiration time: Login or Register
    return this.jwtService.signAsync(payload, {
      secret: this.configService.get('JWT_REFRESH_SECRET'),
      expiresIn: this.configService.get('JWT_REFRESH_EXPIRATION')
    })
  }

  private createRefreshTokenRecord(userId: string, token: string, expiresAt?: Date) {
    // Case: Refresh token
    if (expiresAt) {
      return this.prismaService.refreshToken.create({
        data: {
          userId,
          token,
          expiresAt
        }
      })
    }

    // Case: Login or Register
    const standardRTExpiration = new Date()
    const refreshTokenTTL = ms(this.configService.get('JWT_REFRESH_EXPIRATION')) // miliseconds
    standardRTExpiration.setTime(standardRTExpiration.getTime() + Number(refreshTokenTTL))

    return this.prismaService.refreshToken.create({
      data: {
        userId,
        token,
        expiresAt: standardRTExpiration
      }
    })
  }

  private revokeRefreshToken(refreshToken: string) {
    return this.prismaService.refreshToken.update({
      where: { token: refreshToken, isRevoked: false },
      data: { isRevoked: true }
    })
  }

  private cleanUserToken(refreshToken: string) {
    return this.prismaService.refreshToken.delete({
      where: { token: refreshToken }
    })
  }

  private cleanAllUserTokens(userId: string) {
    return this.prismaService.refreshToken.deleteMany({
      where: { userId }
    })
  }

  private sanitizeUser(user: User) {
    const { password, ...result } = user
    return result
  }

  private async checkLoginAttempts(email: string, ipAddress: string): Promise<number> {
    const key = `${this.LOGIN_ATTEMPTS_PREFIX}${email}:${ipAddress}`
    const attempts = await this.redis.get(key)
    return attempts ? parseInt(attempts, 10) : 0
  }

  private async recordFailedLogin(email: string, ipAddress: string) {
    const key = `${this.LOGIN_ATTEMPTS_PREFIX}${email}:${ipAddress}`
    const attempts = await this.redis.incr(key)

    if (attempts === 1) {
      // Set expiration on first failed attempt (15 minutes)
      await this.redis.expire(key, this.configService.get<number>('LOGIN_ATTEMPTS_WINDOW_SECONDS'))
    }
  }

  private async clearLoginAttempts(email: string, ipAddress: string) {
    const key = `${this.LOGIN_ATTEMPTS_PREFIX}${email}:${ipAddress}`
    await this.redis.del(key)
  }

  private async saveTokenVersion(tokenVersion: number, userId: string) {
    // Initialize if not exists (edge case: Redis was cleared)
    await this.redis.set(`user:${userId}:access_token_version`, tokenVersion)
    await this.redis.expire(
      `user:${userId}:access_token_version`,
      (+ms(this.configService.get('JWT_ACCESS_EXPIRATION')) + 5 * 60 * 1000) / // buffer time = 5 minutes
        1000
    )
  }

  private async increaseTokenVersion(userId: string) {
    const newTokenVersion = await this.redis.incr(`user:${userId}:access_token_version`)
    await this.redis.expire(
      `user:${userId}:access_token_version`,
      (+ms(this.configService.get('JWT_ACCESS_EXPIRATION')) + 5 * 60 * 1000) / // buffer time = 5 minutes
        1000
    )

    return newTokenVersion
  }

  private getTokenVersion(userId: string) {
    return this.redis.get(`user:${userId}:access_token_version`)
  }

  // Generate cryptographically secure token (32+ bytes)
  private generateSecureToken(bytes = 32): Promise<string> {
    return new Promise((resolve, reject) => {
      crypto.randomBytes(bytes, (err, buffer) => {
        if (err) {
          return reject(err)
        }
        resolve(buffer.toString('hex'))
      })
    })
  }

  // private async blacklistAccessToken(accessTokenPayload: AccessTokenPayload) {
  //   const now = Math.floor(Date.now() / 1000) // current time in seconds
  //   const { exp, jti, userId } = accessTokenPayload
  //   const ttl = exp - now

  //   if (ttl > 0 && jti) {
  //     // Store in Redis with TTL matching token expiration
  //     await this.redis.setex(`${this.ACCESS_TOKEN_BLACKLIST_PREFIX}${jti}`, ttl, userId)
  //   }
  // }
}
