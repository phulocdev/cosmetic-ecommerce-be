// src/auth/strategies/jwt.strategy.ts
import { BadRequestException, Inject, Injectable, UnauthorizedException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { PassportStrategy } from '@nestjs/passport'
import { REDIS_CLIENT } from 'database/redis/redis.module'
import { UsersService } from 'domains/users/users.service'
import Redis from 'ioredis'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { AccessTokenPayload } from 'types'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private configService: ConfigService,
    private usersService: UsersService,
    @Inject(REDIS_CLIENT) private redis: Redis
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('JWT_ACCESS_SECRET')
    })
  }

  async validate(payload: AccessTokenPayload): Promise<AccessTokenPayload> {
    // Check if user's token version has been invalidated
    const currentTokenVersion = await this.redis.get(`user:${payload.userId}:access_token_version`)

    if (currentTokenVersion && parseInt(currentTokenVersion) > payload.version) {
      throw new UnauthorizedException('Access token has been invalidated')
    }

    const user = await this.usersService.findOne(payload.userId)

    if (!user || !user.isActive) {
      throw new BadRequestException('User not found or inactive')
    }

    return payload
  }
}
