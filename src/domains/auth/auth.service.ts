import { BadRequestException, Inject, Injectable, UnauthorizedException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtService, TokenExpiredError } from '@nestjs/jwt'
import * as bcrypt from 'bcrypt'
import { EntityNotFoundException } from 'core/exceptions/custom.exceptions'
import crypto from 'crypto'
import { PrismaService } from 'database/prisma/prisma.service'
import { REDIS_CLIENT } from 'database/redis/redis.module'
import {
  ChangePasswordDto,
  ForgotPasswordDto,
  LoginDto,
  RegisterDto,
  ResetPasswordDto
} from 'domains/auth/dtos/auth.dto'
import { FacebookUser } from 'domains/auth/strategies'
import { GoogleUser } from 'domains/auth/strategies/google.strategy'
import { EmailProducer } from 'domains/email/email.producer'
import { UsersService } from 'domains/users/users.service'
import { UserRole } from 'enums'
import { Response } from 'express'
import Redis from 'ioredis'
import ms from 'ms'
import { AccessTokenPayload, RefreshTokenPayload, User } from 'types'
import { hashToken } from 'utils'
import { v4 as uuidv4 } from 'uuid'

@Injectable()
export class AuthService {
  private readonly LOGIN_ATTEMPTS_PREFIX = 'login_attempts:'
  private readonly ACCESS_TOKEN_BLACKLIST_PREFIX = 'blacklist:access:'

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
      throw new BadRequestException('Email already exists')
    }

    // Check the unique phone number if provided
    if (registerDto.phoneNumber) {
      const existingPhoneUser = await this.prismaService.user.findFirst({
        where: { phoneNumber: registerDto.phoneNumber }
      })

      if (existingPhoneUser) {
        throw new BadRequestException('Phone number already exists')
      }
    }

    const hashedPassword = await this.hashPassword(registerDto.password)

    const user = await this.usersService.create({
      email: registerDto.email,
      fullName: registerDto.fullName,
      phoneNumber: registerDto.phoneNumber,
      password: hashedPassword,
      role: UserRole.CUSTOMER
    })

    // When user logs in / register, get/set their current token version
    const tokenVersion = Number(await this.getTokenVersion(user.id)) + 0
    const accessTokenJti = uuidv4()
    const refreshTokenJti = uuidv4()

    const accessTokenPayload: AccessTokenPayload = {
      userId: user.id,
      jti: accessTokenJti,
      email: user.email,
      role: user.role as UserRole,
      version: tokenVersion
    }
    const refreshTokenPayload: RefreshTokenPayload = {
      userId: user.id,
      jti: refreshTokenJti,
      email: user.email,
      role: user.role as UserRole
    }

    const [accessToken, refreshToken] = await Promise.all([
      this.signAccessToken(accessTokenPayload),
      this.signRefreshToken(refreshTokenPayload)
    ])

    await this.createRefreshTokenRecord(refreshTokenJti, user.id, hashToken(refreshToken))

    return {
      user: this.sanitizeUser(user),
      accessToken,
      refreshToken
    }
  }

  async login(loginDto: LoginDto, ipAddress?: string) {
    // Rate limiting: Check login attempts
    if (ipAddress) {
      const attempts = await this.checkLoginAttempts(loginDto.email, ipAddress)
      if (attempts >= this.configService.get<number>('MAX_LOGIN_ATTEMPTS')) {
        throw new BadRequestException('Too many failed login attempts. Try again in 15 minutes')
      }
    }

    const user = await this.prismaService.user.findFirst({
      where: { email: loginDto.email }
    })

    const isPasswordValid = await bcrypt.compare(loginDto.password, user.password)

    if (!user || !isPasswordValid) {
      if (ipAddress) {
        await this.recordFailedLogin(loginDto.email, ipAddress)
      }
      throw new BadRequestException('Email/Password không chính xác')
    }

    if (!user.isActive) {
      throw new BadRequestException('User is not active')
    }

    // Clear failed attempts on successful login
    if (ipAddress) {
      await this.clearLoginAttempts(loginDto.email, ipAddress)
    }

    const tokenVersion = Number(await this.getTokenVersion(user.id)) || 0
    const accessTokenJti = uuidv4()
    const refreshTokenJti = uuidv4()

    const accessTokenPayload: AccessTokenPayload = {
      userId: user.id,
      jti: accessTokenJti,
      email: user.email,
      role: user.role as UserRole,
      version: +tokenVersion
    }
    const refreshTokenPayload: RefreshTokenPayload = {
      userId: user.id,
      jti: refreshTokenJti,
      email: user.email,
      role: user.role as UserRole
    }

    const [accessToken, refreshToken] = await Promise.all([
      this.signAccessToken(accessTokenPayload),
      this.signRefreshToken(refreshTokenPayload)
    ])

    await this.createRefreshTokenRecord(refreshTokenJti, user.id, hashToken(refreshToken))

    // Case 1: NestJS Server and NextJS Server are in the same domain => Cookies can be set directly here
    // Because NextJS Client can send cookies to both NestJS Server and NextJS Server
    // res.cookie('refreshToken', refreshToken, {
    //   httpOnly: true,
    //   secure: false, // true in production (HTTPS)
    //   sameSite: 'lax',
    //   maxAge: +ms(this.configService.get('JWT_REFRESH_EXPIRATION')) // in milliseconds
    // })

    // res.cookie('accessToken', accessToken, {
    //   httpOnly: true,
    //   secure: false, // true in production (HTTPS)
    //   sameSite: 'lax',
    //   maxAge: +ms(this.configService.get('JWT_ACCESS_EXPIRATION')) // in milliseconds
    // })

    //  return res.send({
    //   user: this.sanitizeUser({ ...user, role: user.role as UserRole }),
    //   accessToken,
    //   refreshToken
    // })

    // Case 2: NestJS Server and NextJS Server are in different domains => Cannot set cookies here
    // Must send tokens in response body and let NextJS Server set the cookies to NextJS Client
    // And then NextJS Client can send cookies to NextJS Server only (not NestJS Server directly)

    return {
      // user: new UserEntity(user), // not working properly, because user is Prisma User type, need to transform manually
      user: this.sanitizeUser(user),
      accessToken,
      refreshToken
    }
  }

  async refreshTokens(refreshToken: string) {
    let decodedRefreshToken: RefreshTokenPayload | undefined

    try {
      decodedRefreshToken = await this.jwtService.verifyAsync<RefreshTokenPayload>(refreshToken, {
        secret: this.configService.get('JWT_REFRESH_SECRET')
      })
    } catch (error) {
      if (error instanceof TokenExpiredError) {
        await this.cleanUserRefreshToken(decodedRefreshToken?.jti)
        throw new UnauthorizedException('Refresh token has expired')
      }

      throw new UnauthorizedException('Invalid refresh token')
    }

    const { jti, userId } = decodedRefreshToken

    if (!jti || !userId) {
      throw new UnauthorizedException('Malformed refresh token')
    }

    // Hash the incoming refresh token to compare with stored hashed token
    const hashedRefreshToken = hashToken(refreshToken)

    const existingRefreshToken = await this.prismaService.refreshToken.findUnique({
      where: { id: jti },
      include: { user: true }
    })

    if (!existingRefreshToken) {
      throw new UnauthorizedException('Refresh token not found')
    }

    if (existingRefreshToken.hashedToken !== hashedRefreshToken) {
      throw new UnauthorizedException('Refresh token mismatch')
    }

    if (existingRefreshToken.userId !== userId || existingRefreshToken.user.id !== userId) {
      throw new UnauthorizedException('Refresh token does not belong to the user')
    }

    // Check if user is still active
    if (!existingRefreshToken.user.isActive) {
      throw new UnauthorizedException('User is inactive')
    }

    /**
     * Check if RT is revoked - Reuse attack detected
     * isRevoked field: using in case admin manually revoke the RT from database or System revoke when refresh token successfully
     */

    if (existingRefreshToken.isRevoked) {
      // Remove all RTs of the user and increase token version to invalidate all existing ATs
      await Promise.all([this.cleanAllUserTokens(userId), this.increaseTokenVersion(userId)])
      throw new UnauthorizedException('Refresh token has been reused or revoked')
    }

    // Atomic Update to prevent reuse attack: Mark the token as used and revoked at the same time - In case Race Condition
    const updateRTResult = await this.prismaService.refreshToken.updateMany({
      where: { id: jti, isUsed: false },
      data: { isUsed: true }
    })

    /**
     * Check if RT is re-used - Reuse attack detected
     * isUsed field: using in case Race Condition where multiple requests with the same RT
     */

    if (updateRTResult.count === 0) {
      // Remove all RTs of the user and increase token version to invalidate all existing ATs
      await Promise.all([this.cleanAllUserTokens(userId), this.increaseTokenVersion(userId)])
      throw new UnauthorizedException('Refresh token has been reused or revoked')
    }

    // Check the existing token version
    let tokenVersion = +(await this.getTokenVersion(userId))
    const accessTokenJti = uuidv4()
    const refreshTokenJti = uuidv4()

    // Edge case: Initialize token version if not exists
    if (tokenVersion === null) {
      tokenVersion = 0
      await this.saveTokenVersion(tokenVersion, userId)
    }

    // Generate new tokens
    const accessTokenPayload: AccessTokenPayload = {
      userId,
      jti: accessTokenJti,
      email: existingRefreshToken.user.email,
      role: existingRefreshToken.user.role as UserRole,
      version: tokenVersion
    }
    const refreshTokenPayload: RefreshTokenPayload = {
      userId,
      jti: refreshTokenJti,
      email: existingRefreshToken.user.email,
      role: existingRefreshToken.user.role as UserRole
    }

    const [accessToken, newRefreshToken] = await Promise.all([
      this.signAccessToken(accessTokenPayload),
      this.signRefreshToken(refreshTokenPayload, decodedRefreshToken.exp)
    ])

    // In case we use Promise.all, if creating new RT fails but revoking old one succeeds,
    // user will lose both tokens and have to login again
    // await Promise.all([
    //   this.createRefreshTokenRecord(
    //     refreshTokenJti,
    //     tokenRecord.user.id,
    //     newRefreshToken,
    //     tokenRecord.expiresAt
    //   ),
    //   this.revokeRefreshToken(refreshToken)
    // ])

    // save new refresh token and mark old token as replaced  - Don't use Promise.all here because
    // We need to make sure that new RT is created before revoking the old one to
    await this.createRefreshTokenRecord(
      refreshTokenJti,
      userId,
      hashToken(newRefreshToken),
      existingRefreshToken.expiresAt
    )
    await this.revokeRefreshToken(jti)

    return {
      user: this.sanitizeUser(existingRefreshToken.user),
      accessToken,
      refreshToken: newRefreshToken
    }
  }

  async logout(accessTokenPayload: AccessTokenPayload, refreshToken: string) {
    let decodedRefreshToken: RefreshTokenPayload | undefined

    // Must verify the refresh token to prevent logging out with a random / invalid RT / hacker modify RT's payload to logout other users
    try {
      decodedRefreshToken = await this.jwtService.verifyAsync<RefreshTokenPayload>(refreshToken, {
        secret: this.configService.get('JWT_REFRESH_SECRET'),
        ignoreExpiration: true
      })
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token')
    }

    // Blacklist access token and remove only the used refresh token
    await Promise.all([
      this.cleanUserRefreshToken(decodedRefreshToken.jti),
      this.blacklistAccessToken(accessTokenPayload)
    ])

    // Old way: Just remove the refresh token and increment the token version to invalidate all existing access tokens
    // This way make all sessions in other devices logged out as well -> Not good about UX
    // -> Save this acccessToken to Redis blacklist to check if this access token is reused later or not. If reuse - throw error
    // await Promise.all([
    //   this.cleanUserRefreshToken(refreshToken),
    //   this.increaseTokenVersion(accessTokenPayload.userId)
    // ])
  }

  async changePassword(
    accessTokenPayload: AccessTokenPayload,
    changePasswordDto: ChangePasswordDto
  ) {
    const user = await this.usersService.findOne(accessTokenPayload.userId)

    // Check if current password is correct
    const isCurrentPasswordValid = await bcrypt.compare(
      changePasswordDto.currentPassword,
      user.password
    )

    if (!isCurrentPasswordValid) {
      throw new BadRequestException('Current password is incorrect')
    }

    // Check that new password is different from current password
    if (changePasswordDto.currentPassword === changePasswordDto.newPassword) {
      throw new BadRequestException('New password must be different from the current password')
    }

    const hashedNewPassword = await this.hashPassword(changePasswordDto.newPassword)

    await this.prismaService.$transaction(async (prisma) => {
      // Update user's password
      await prisma.user.update({
        where: { id: accessTokenPayload.userId },
        data: { password: hashedNewPassword }
      })

      // Remove all existing refresh tokens
      await this.cleanAllUserTokens(accessTokenPayload.userId, prisma)
    })

    // Increase token version to invalidate all existing access tokens
    const newTokenVersion = await this.increaseTokenVersion(accessTokenPayload.userId)
    const accessTokenJti = uuidv4()
    const refreshTokenJti = uuidv4()

    // Generate new tokens
    const newAccessTokenPayload: AccessTokenPayload = {
      userId: user.id,
      jti: accessTokenJti,
      email: user.email,
      role: user.role as UserRole,
      version: newTokenVersion
    }
    const refreshTokenPayload: RefreshTokenPayload = {
      userId: user.id,
      jti: refreshTokenJti,
      email: user.email,
      role: user.role as UserRole
    }
    const [accessToken, refreshToken] = await Promise.all([
      this.signAccessToken(newAccessTokenPayload),
      this.signRefreshToken(refreshTokenPayload)
    ])

    await this.createRefreshTokenRecord(refreshTokenJti, user.id, hashToken(refreshToken))
    return { accessToken, refreshToken }
  }

  async forgotPassword(forgotPasswordDto: ForgotPasswordDto) {
    const user = await this.usersService.findByEmail(forgotPasswordDto.email)

    if (!user) {
      throw new EntityNotFoundException('User', forgotPasswordDto.email)
    }

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
      throw new BadRequestException('Invalid password reset token')
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
      await this.cleanAllUserTokens(tokenRecord.userId, prisma)
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

  private createRefreshTokenRecord(
    jti: string,
    userId: string,
    hashedToken: string,
    expiresAt?: Date
  ) {
    // Case: Refresh token
    if (expiresAt) {
      return this.prismaService.refreshToken.create({
        data: {
          id: jti,
          userId,
          hashedToken,
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
        id: jti,
        userId,
        hashedToken,
        expiresAt: standardRTExpiration
      }
    })
  }

  private revokeRefreshToken(jti: string) {
    return this.prismaService.refreshToken.update({
      where: { id: jti, isRevoked: false },
      data: { isRevoked: true }
    })
  }

  private cleanUserRefreshToken(jti: string) {
    return this.prismaService.refreshToken.delete({
      where: { id: jti }
    })
  }

  private cleanAllUserTokens(userId: string, tx?: any) {
    if (tx) {
      return tx.refreshToken.deleteMany({
        where: { userId }
      })
    }

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

  private async blacklistAccessToken(accessTokenPayload: AccessTokenPayload) {
    const now = Math.floor(Date.now() / 1000) // current time in seconds
    const { exp, jti, userId } = accessTokenPayload
    const ttl = exp - now

    if (ttl > 0 && jti) {
      // Store in Redis with TTL matching token expiration
      await this.redis.setex(`${this.ACCESS_TOKEN_BLACKLIST_PREFIX}${jti}`, ttl, userId)
    }
  }

  async getCurrentUser(userId: string) {
    const user = await this.prismaService.user.findUnique({
      where: { id: userId }
    })
    if (!user) {
      throw new BadRequestException('User not found')
    }

    return this.sanitizeUser(user)
  }

  async findOrCreateUser(googleUser: GoogleUser) {
    let user = await this.usersService.findByGoogleId(googleUser.googleId)

    if (!user) {
      user = await this.usersService.findByEmail(googleUser.email)
    }

    if (!user) {
      // First-time Google login — create the user
      const secureRandomPassword = await this.generateSecureToken(16) // Generate a random password for Google users, length 16 bytes => 32 characters hex string
      const hashedPassword = await this.hashPassword(secureRandomPassword) // Random password for Google users

      user = await this.usersService.create({
        googleId: googleUser.googleId,
        email: googleUser.email,
        fullName: `${googleUser.firstName} ${googleUser.lastName}`,
        avatarUrl: googleUser.avatar,
        password: hashedPassword,
        role: UserRole.CUSTOMER
      })
    } else if (!user.googleId) {
      // Existing email user — link their Google account
      user = await this.usersService.update(user.id, {
        googleId: googleUser.googleId,
        avatarUrl: user.avatarUrl ?? googleUser.avatar
      })
    }

    return user
  }

  async findOrCreateUserByFacebook(facebookUser: FacebookUser) {
    let user = await this.usersService.findByFacebookId(facebookUser.facebookId)

    if (!user && facebookUser.email) {
      user = await this.usersService.findByEmail(facebookUser.email)
    }

    if (!user) {
      const secureRandomPassword = await this.generateSecureToken(16)
      const hashedPassword = await this.hashPassword(secureRandomPassword)

      // New user — create account
      // Note: email may be null here for phone-only FB accounts
      user = await this.usersService.create({
        facebookId: facebookUser.facebookId,
        email: facebookUser.email,
        fullName: facebookUser.displayName,
        avatarUrl: facebookUser.avatar,
        password: hashedPassword,
        role: UserRole.CUSTOMER
      })
    } else if (!user.facebookId) {
      // Existing account (e.g. signed up via email or Google) —
      // link Facebook to it
      user = await this.usersService.update(user.id, {
        facebookId: facebookUser.facebookId,
        avatarUrl: user.avatarUrl ?? facebookUser.avatar
      })
    }

    return user
  }

  async handleOAuthCallback(user: User, res: Response) {
    const tokenVersion = Number(await this.getTokenVersion(user.id)) || 0
    const accessTokenJti = uuidv4()
    const refreshTokenJti = uuidv4()

    const accessTokenPayload: AccessTokenPayload = {
      userId: user.id,
      jti: accessTokenJti,
      email: user.email,
      role: user.role as UserRole,
      version: tokenVersion
    }

    const refreshTokenPayload: RefreshTokenPayload = {
      userId: user.id,
      jti: refreshTokenJti,
      email: user.email,
      role: user.role as UserRole
    }

    const [accessToken, refreshToken] = await Promise.all([
      this.signAccessToken(accessTokenPayload),
      this.signRefreshToken(refreshTokenPayload)
    ])

    await this.createRefreshTokenRecord(refreshTokenJti, user.id, hashToken(refreshToken))

    const frontendUrl = this.configService.get('cors.origin')
    res.redirect(
      `${frontendUrl}/auth/callback?accessToken=${accessToken}&refreshToken=${refreshToken}`
    )
  }
}
