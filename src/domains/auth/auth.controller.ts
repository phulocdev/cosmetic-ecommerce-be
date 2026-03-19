import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Ip,
  Post,
  Req,
  Res,
  UseGuards
} from '@nestjs/common'
import { ConfigService } from '@nestjs/config/dist/config.service'
import { CurrentUser, GoogleAuthGuard } from 'core'
import { Public } from 'core/decorators/public.decorator'
import { ResponseMessage } from 'core/decorators/response-message.decorator'
import { FacebookAuthGuard } from 'core/guards/facebook-auth.guard'
import { AuthService } from 'domains/auth/auth.service'
import {
  ChangePasswordDto,
  ForgotPasswordDto,
  LoginDto,
  RefreshTokenDto,
  RegisterDto,
  ResetPasswordDto
} from 'domains/auth/dtos/auth.dto'
import { Response } from 'express'
import { AccessTokenPayload } from 'types'
import { normalizeIp } from 'utils'

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private configService: ConfigService
  ) {}

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
  async logout(
    @CurrentUser() accessTokenPayload: AccessTokenPayload,
    @Body() refreshTokenDto: RefreshTokenDto
  ) {
    return this.authService.logout(accessTokenPayload, refreshTokenDto.refreshToken)
  }

  @Post('change-password')
  @ResponseMessage('Password changed successfully')
  @HttpCode(HttpStatus.OK)
  async changePassword(
    @CurrentUser() accessTokenPayload: AccessTokenPayload,
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
  @ResponseMessage('Get current user info successfully')
  @HttpCode(HttpStatus.OK)
  async getCurrentUser(@CurrentUser() accessTokenPayload: AccessTokenPayload) {
    return this.authService.getCurrentUser(accessTokenPayload.userId)
  }

  @Public()
  @Get('google')
  @UseGuards(GoogleAuthGuard)
  googleAuth() {
    // Guard handles the redirect automatically
  }

  @Public()
  @Get('google/callback')
  @UseGuards(GoogleAuthGuard)
  async googleCallback(@Req() req, @Res() res: Response) {
    // req.user is set by GoogleStrategy.validate()
    return this.authService.handleOAuthCallback(req.user, res)
  }

  @Public()
  @Get('facebook')
  @UseGuards(FacebookAuthGuard)
  facebookAuth() {
    // Guard redirects to Facebook automatically
  }

  @Public()
  @Get('facebook/callback')
  @UseGuards(FacebookAuthGuard)
  async facebookCallback(@Req() req, @Res() res: Response) {
    // req.user is set by FacebookStrategy.validate()
    return this.authService.handleOAuthCallback(req.user, res)
  }
}
