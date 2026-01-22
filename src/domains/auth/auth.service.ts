import { Injectable, OnModuleInit } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'
import { EmailVerificationStatus, Role } from 'core/constants/enum'
import { addMilliseconds } from 'date-fns'
import { ChangePasswordDto } from 'domains/auth/dtos/change-password.dto'
import { LogoutDto } from 'domains/auth/dtos/logout.dto'
import { RefreshTokenDto } from 'domains/auth/dtos/refresh-token.dto'
import { RegisterDto } from 'domains/auth/dtos/register.dto'
import { UsersService } from 'domains/users/users.service'
import mongoose from 'mongoose'
import ms, { StringValue } from 'ms'

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService
  ) {}

  async register(registerUserDto: RegisterDto) {
    const userId = new mongoose.Types.ObjectId().toString()
    const customerCode = `CUST-${Date.now().toString().slice(-6)}`

    const { email, fullName, password, gender, phoneNumber, address: addressDto } = registerUserDto

    if (addressDto) {
      // await this.addressesService.create({ userId, ...addressDto })
    }

    const user = await this.usersService.create({
      _id: userId,
      email,
      code: customerCode,
      fullName,
      password,
      role: Role.CUSTOMER,
      gender,
      phoneNumber: phoneNumber
    })

    const [accessToken, refreshToken] = await Promise.all([
      this.signAccessToken({
        _id: user._id,
        email,
        role: Role.CUSTOMER,
        isEmailVerified: EmailVerificationStatus.UNVERIFIED
      }),
      this.signRefreshToken({
        _id: user._id,
        email,
        role: Role.CUSTOMER,
        isEmailVerified: EmailVerificationStatus.UNVERIFIED
      })
    ])

    const ttlMs = ms(this.configService.get<StringValue>('REFRESH_TOKEN_EXPIRATION_TIME'))
    const expiresAt = addMilliseconds(new Date(), ttlMs)
    await this.usersService.createRefreshToken({ user: userId, expiresAt, value: refreshToken })

    return {
      accessToken,
      refreshToken,
      user
    }
  }

  async validateUser(email: string, password: string) {
    const user = await this.usersService.findUserByEmailAndPassword({ email, password })
    if (user) {
      const { password, ...result } = user.toObject()
      return result
    }
    return null
  }

  async login(user: UserType) {
    const payload = user
    const [accessToken, refreshToken] = await Promise.all([
      this.signAccessToken(payload),
      this.signRefreshToken(payload)
    ])
    // await this.usersService.updateRefreshToken(user._id.toString(), refreshToken)

    return {
      accessToken,
      refreshToken,
      user
    }
  }

  async refreshToken(refreshTokenDto: RefreshTokenDto) {
    // let userId: string | undefined = undefined
    // try {
    //   const user = await this.usersService.findByRefreshToken(refreshTokenDto.refreshToken)
    //   if (!user || !refreshTokenDto.refreshToken) {
    //     throw new UnauthorizedError('INVALID_REFRESH_TOKEN')
    //   }
    //   userId = user._id.toString()
    //   const decodedOldRefreshToken = await this.jwtService.verifyAsync<AuthTokenPayload>(refreshTokenDto.refreshToken, {
    //     secret: this.configService.get<string>('REFRESH_TOKEN_SECRET')
    //   })
    //   const { iat, exp, ...payload } = decodedOldRefreshToken
    //   const [accessToken, refreshToken] = await Promise.all([
    //     this.signAccessToken(payload),
    //     this.signRefreshToken(payload, decodedOldRefreshToken.exp)
    //   ])
    //   await this.usersService.updateRefreshToken(user._id.toString(), refreshToken)
    //   return {
    //     accessToken,
    //     refreshToken,
    //     user: payload
    //   }
    // } catch (error) {
    //   if (error instanceof TokenExpiredError) {
    //     if (userId) {
    //       this.usersService.updateRefreshToken(userId, '')
    //     }
    //     throw new UnauthorizedError('REFRESH_TOKEN_EXPIRED')
    //   }
    //   throw error
    // }
  }

  async changePassword(changePasswordDto: ChangePasswordDto, user: UserType) {
    // const { oldPassword, newPassword } = changePasswordDto
    // const userDocument = await this.usersService.findByEmail(user.email)
    // if (!userDocument) {
    //   throw new NotFoundError('Tài khoản không tồn tại trên hệ thống')
    // }
    // const isMatchPassowrd = await this.usersService.comparePassword(oldPassword, userDocument.password)
    // if (!isMatchPassowrd) {
    //   throw new BadRequestError('Mật khẩu cũ không chính xác')
    // }
    // const payload = user
    // // const decodedOldRefreshToken = this.jwtService.decode<AuthTokenPayload>(userDocument.refreshToken)
    // const [accessToken, refreshToken] = await Promise.all([
    //   this.signAccessToken(payload),
    //   // this.signRefreshToken(payload, decodedOldRefreshToken.exp),
    //   this.usersService.updatePassword(userDocument._id.toString(), newPassword)
    // ])
    // return {
    //   accessToken,
    //   refreshToken,
    //   User: {
    //     _id: user._id,
    //     avatarUrl: user.avatarUrl,
    //     email: user.email,
    //     fullName: user.fullName,
    //     role: user.role,
    //     phoneNumber: user.phoneNumber
    //   }
    // }
  }

  async logout(logoutDto: LogoutDto) {
    // try {
    //   const { refreshToken } = logoutDto
    //   const decodedRefreshToken = await this.jwtService.verifyAsync<AuthTokenPayload>(refreshToken, {
    //     secret: this.configService.get<string>('REFRESH_TOKEN_SECRET')
    //   })
    //   this.usersService.updateRefreshToken(decodedRefreshToken._id.toString(), '')
    // } catch (error) {
    //   if (error instanceof TokenExpiredError) {
    //     throw new UnauthorizedError('REFRESH_TOKEN_EXPIRED')
    //   }
    //   throw error
    // }
  }

  signAccessToken(payload: UserType) {
    return this.jwtService.signAsync(payload, {
      secret: this.configService.get<string>('ACCESS_TOKEN_SECRET'),
      expiresIn: ms(this.configService.get<StringValue>('ACCESS_TOKEN_EXPIRATION_TIME')) / 1000
    })
  }

  signRefreshToken(payload: UserType, exp?: number) {
    if (exp) {
      return this.jwtService.signAsync(
        { ...payload, exp },
        {
          secret: this.configService.get<string>('REFRESH_TOKEN_SECRET')
        }
      )
    }
    return this.jwtService.signAsync(payload, {
      secret: this.configService.get<string>('REFRESH_TOKEN_SECRET'),
      expiresIn: ms(this.configService.get<StringValue>('REFRESH_TOKEN_EXPIRATION_TIME')) / 1000
    })
  }

  // public async getUserFromAuthenticationToken(token: string) {
  //   const payload: AuthTokenPayload = this.jwtService.verify(token, {
  //     secret: this.configService.get<string>('ACCESS_TOKEN_SECRET')
  //   })
  //   if (payload._id) {
  //     return this.usersService.findOne(payload._id)
  //   }
  // }
}
