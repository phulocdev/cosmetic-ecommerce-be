import { Body, Controller, Get, HttpCode, HttpStatus, Ip, Post } from '@nestjs/common'
import { AuthUser } from 'core/decorators/auth-user.decorator'
import { Public } from 'core/decorators/public.decorator'
import { ResponseMessage } from 'core/decorators/response-message.decorator'
import { EmailProducer } from 'domains/email/email.producer'
import { AuthService } from 'domains/auth/auth.service'
import {
  ChangePasswordDto,
  ForgotPasswordDto,
  LoginDto,
  RefreshTokenDto,
  RegisterDto,
  ResetPasswordDto
} from 'domains/auth/dtos/auth.dto'
import { AccessTokenPayload } from 'types'
import { normalizeIp } from 'utils'

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post('register')
  @ResponseMessage('Register successfully')
  @HttpCode(HttpStatus.OK)
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto)
  }

  @Public()
  @Post('login')
  @ResponseMessage('Login successfully')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: LoginDto, @Ip() ip: string) {
    const clientIp = normalizeIp(ip)
    return this.authService.login(loginDto, clientIp)
  }

  @Public()
  @Post('refresh-token')
  @ResponseMessage('Token refreshed successfully')
  @HttpCode(HttpStatus.OK)
  async refresh(@Body() refreshTokenDto: RefreshTokenDto) {
    return this.authService.refreshTokens(refreshTokenDto.refreshToken)
  }

  @Post('logout')
  @ResponseMessage('Logout successfully')
  @HttpCode(HttpStatus.OK)
  async logout(@AuthUser() accessTokenPayload: AccessTokenPayload, @Body() refreshTokenDto: RefreshTokenDto) {
    return this.authService.logout(accessTokenPayload, refreshTokenDto.refreshToken)
  }

  @Post('change-password')
  @ResponseMessage('Password changed successfully')
  @HttpCode(HttpStatus.OK)
  async changePassword(
    @AuthUser() accessTokenPayload: AccessTokenPayload,
    @Body() changePasswordDto: ChangePasswordDto
  ) {
    this.authService.changePassword(accessTokenPayload, changePasswordDto)
  }

  @Public()
  @Post('forgot-password') // ~ reset-password-request
  @ResponseMessage('Password reset link sent successfully')
  @HttpCode(HttpStatus.OK)
  async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    return this.authService.forgotPassword(forgotPasswordDto)
  }

  @Public()
  @Post('reset-password')
  @ResponseMessage('Password reset successfully')
  @HttpCode(HttpStatus.OK)
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    return this.authService.resetPassword(resetPasswordDto)
  }

  @Get('me')
  @ResponseMessage('User profile fetched successfully')
  @HttpCode(HttpStatus.OK)
  async getProfile() {
    return 'Loc'
  }
}
