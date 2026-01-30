import { Injectable, UnauthorizedException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtService, TokenExpiredError } from '@nestjs/jwt'
import { BadRequestError, UnauthorizedError } from 'core/exceptions/errors.exception'
import { PrismaService } from 'database/prisma/prisma.service'
import { LoginDto, RegisterDto } from 'domains/auth/dtos/auth.dto'
import * as bcrypt from 'bcrypt'
import ms from 'ms'
import { User } from '@prisma/client'

@Injectable()
export class AuthService {
  constructor(
    private prismaService: PrismaService,
    private jwtService: JwtService,
    private configService: ConfigService
  ) {}

  async register(registerDto: RegisterDto) {
    const existingUser = await this.prismaService.user.findFirst({
      where: { email: registerDto.email }
    })

    if (existingUser) {
      throw new BadRequestError('Email already exists')
    }

    const hashedPassword = await bcrypt.hash(registerDto.password, 10)

    const user = await this.prismaService.user.create({
      data: {
        email: registerDto.email,
        password: hashedPassword,
        fullName: registerDto.fullName
      }
    })

    // Generate tokens and save refresh token to database
    const jwtPayload: JwtPayload = { userId: user.id, email: user.email, role: user.role }

    const [accessToken, refreshToken] = await Promise.all([
      this.signAccessToken(jwtPayload),
      this.signRefreshToken(jwtPayload)
    ])

    await this.createRefreshTokenRecord(user.id, refreshToken)

    return { user: this.sanitizeUser(user), accessToken, refreshToken }
  }

  async login(loginDto: LoginDto) {
    const user = await this.prismaService.user.findFirst({
      where: { email: loginDto.email }
    })

    if (!user || !user.isActive) {
      throw new UnauthorizedError('Invalid credentials')
    }

    const isPasswordValid = await bcrypt.compare(loginDto.password, user.password)

    if (!isPasswordValid) {
      throw new UnauthorizedError('Invalid credentials')
    }

    const jwtPayload: JwtPayload = { userId: user.id, email: user.email, role: user.role }
    const [accessToken, refreshToken] = await Promise.all([
      this.signAccessToken(jwtPayload),
      this.signRefreshToken(jwtPayload)
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
        throw new UnauthorizedError('Refresh token has expired')
      }

      throw new UnauthorizedError('Invalid refresh token')
    }

    // Generate new tokens
    const jwtPayload: JwtPayload = {
      userId: tokenRecord.user.id,
      email: tokenRecord.user.email,
      role: tokenRecord.user.role
    }

    const [accessToken, newRefreshToken] = await Promise.all([
      this.signAccessToken(jwtPayload),
      this.signRefreshToken(jwtPayload, decodedRefreshToken.exp)
    ])

    // Mark old token as replaced and save new refresh token
    await Promise.all([
      this.createRefreshTokenRecord(tokenRecord.user.id, newRefreshToken, tokenRecord.expiresAt),
      this.prismaService.refreshToken.update({
        where: { id: tokenRecord.id },
        data: { isRevoked: true, replacedByToken: newRefreshToken }
      })
    ])

    return { user: this.sanitizeUser(tokenRecord.user), accessToken, refreshToken: newRefreshToken }
  }

  async logout(refreshToken: string) {
    await this.prismaService.refreshToken.delete({
      where: { token: refreshToken }
    })
    return { message: 'Logged out successfully' }
  }

  private signAccessToken(payload: JwtPayload) {
    return this.jwtService.signAsync(payload, {
      secret: this.configService.get('JWT_ACCESS_SECRET'),
      expiresIn: this.configService.get('JWT_ACCESS_EXPIRATION')
    })
  }

  private signRefreshToken(payload: JwtPayload, expiresAt?: number) {
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

  private revokeAllUserTokens(userId: string) {
    return this.prismaService.refreshToken.updateMany({
      where: { userId, isRevoked: false },
      data: { isRevoked: true }
    })
  }

  private cleanupExpiredTokens(userId: string) {
    return this.prismaService.refreshToken.deleteMany({
      where: {
        userId,
        expiresAt: { lt: new Date() }
      }
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
}
