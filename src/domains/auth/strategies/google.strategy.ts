// src/auth/strategies/google.strategy.ts
import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { PassportStrategy } from '@nestjs/passport'
import { AuthService } from 'domains/auth/auth.service'
import { Profile, Strategy, VerifyCallback } from 'passport-google-oauth20'

export interface GoogleUser {
  googleId: string
  email: string
  firstName: string
  lastName: string
  avatar?: string
}

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(
    private configService: ConfigService,
    private authService: AuthService
  ) {
    super({
      clientID: configService.get('oauth.googleClientId'),
      clientSecret: configService.get('oauth.googleClientSecret'),
      callbackURL: configService.get('oauth.googleCallbackUrl'),
      scope: ['email', 'profile']
    })
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    done: VerifyCallback
  ): Promise<any> {
    const { id, name, emails, photos } = profile

    const googleUser: GoogleUser = {
      googleId: id,
      email: emails[0].value,
      firstName: name.givenName,
      lastName: name.familyName,
      avatar: photos[0]?.value
    }

    const user = await this.authService.findOrCreateUser(googleUser)
    done(null, user)
  }
}
