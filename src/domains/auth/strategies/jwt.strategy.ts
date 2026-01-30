// src/auth/strategies/jwt.strategy.ts
import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { PassportStrategy } from '@nestjs/passport'
import { BadRequestError } from 'core/exceptions/errors.exception'
import { UsersService } from 'domains/users/users.service'
import { ExtractJwt, Strategy } from 'passport-jwt'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    private usersService: UsersService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('JWT_ACCESS_SECRET')
    })
  }

  async validate(payload: JwtPayload) {
    const user = await this.usersService.findOne(payload.userId)

    if (!user || !user.isActive) {
      throw new BadRequestError('User not found or inactive')
    }

    return payload
  }
}
