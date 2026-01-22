import { PassportStrategy } from '@nestjs/passport'
import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { ExtractJwt, Strategy } from 'passport-jwt'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private readonly configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('ACCESS_TOKEN_SECRET')
    })
  }

  /**
   * @param payload là object decode từ accessToken
   * @returns object user mà ta gán vào req - phục vụ cho các route tiếp theo
   */
  validate(payload: AuthTokenPayload): UserType {
    delete payload.exp
    delete payload.iat
    return payload
  }
}
