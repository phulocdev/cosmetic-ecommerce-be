import { Injectable } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { Strategy, Profile } from 'passport-facebook'
import { ConfigService } from '@nestjs/config'
import { AuthService } from '../auth.service'

export interface FacebookUser {
  facebookId: string
  email: string | null // can be null for phone-only FB accounts
  displayName: string
  avatar: string | null
}

@Injectable()
export class FacebookStrategy extends PassportStrategy(Strategy, 'facebook') {
  constructor(
    private configService: ConfigService,
    private authService: AuthService
  ) {
    super({
      clientID: configService.get('oauth.facebookAppId'),
      clientSecret: configService.get('oauth.facebookAppSecret'),
      callbackURL: configService.get('oauth.facebookCallbackUrl'),
      // Must explicitly request these fields from the Graph API
      profileFields: ['id', 'displayName', 'email', 'photos'],
      scope: ['email', 'public_profile']
    })
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    done: Function
  ): Promise<any> {
    const { id, displayName, emails, photos } = profile

    // Facebook may not return email if user hasn't granted permission
    // or if the account has no email (e.g. phone-number-only accounts)
    const email = emails?.[0]?.value ?? null

    const facebookUser: FacebookUser = {
      facebookId: id,
      email,
      displayName,
      avatar: photos?.[0]?.value ?? null
    }

    const user = await this.authService.findOrCreateUserByFacebook(facebookUser)
    done(null, user)
  }
}
