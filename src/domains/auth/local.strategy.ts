import { Injectable } from '@nestjs/common'
import { Strategy } from 'passport-local'
import { PassportStrategy } from '@nestjs/passport'
import { AuthService } from 'domains/auth/auth.service'
import { UnprocessableEntityError } from 'core/exceptions/errors.exception'
import { validateLoginBody } from 'core/utils/utils'
import { UserStatus } from 'core/constants/enum'

@Injectable()
export class LocalEmployeeStrategy extends PassportStrategy(Strategy, 'local') {
  constructor(private authService: AuthService) {
    super({ usernameField: 'email' })
  }

  async validate(email: string, password: string): Promise<UserType> {
    validateLoginBody(email, password)

    const user = await this.authService.validateUser(email, password.toString())
    if (!user) {
      throw new UnprocessableEntityError([{ field: 'password', message: 'Email/Password không tồn tại trên hệ thống' }])
    }

    if ((user.status = UserStatus.INACTIVE)) {
      throw new UnprocessableEntityError([{ field: 'password', message: 'Tài khoản đã bị khóa!' }])
    }

    // Gán vào req.user
    return {
      _id: user._id.toString(),
      email: user.email,
      isEmailVerified: user.isEmailVerified,
      role: user.role
    }
  }
}
