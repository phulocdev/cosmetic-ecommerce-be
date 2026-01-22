import { Body, Controller, Patch, Post, Request, UseGuards } from '@nestjs/common'
import { Public } from 'core/decorators/public.decorator'
import { ResponseMessage } from 'core/decorators/response-message.decorator'
import { User } from 'core/decorators/user.decorator'
import { LocalEmployeeAuthGuard } from 'core/guards/local-auth.guard'
import { AuthService } from 'domains/auth/auth.service'
import { ChangePasswordDto } from 'domains/auth/dtos/change-password.dto'
import { LogoutDto } from 'domains/auth/dtos/logout.dto'
import { RefreshTokenDto } from 'domains/auth/dtos/refresh-token.dto'
import { RegisterDto } from 'domains/auth/dtos/register.dto'
import { Request as RequestType } from 'express'

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('register')
  @ResponseMessage('Đăng ký tài khoản thành công')
  register(@Body() registerDto: RegisterDto, @Request() req: RequestType) {
    return this.authService.register(registerDto)
  }

  @Public()
  @Post('login')
  @UseGuards(LocalEmployeeAuthGuard)
  @ResponseMessage('Đăng nhập thành công')
  login(@Request() req) {
    return this.authService.login(req.user as UserType)
  }

  @Public()
  @Post('refresh-token')
  @ResponseMessage('Refresh Access Token thành công')
  refreshToken(@Body() refreshTokenDto: RefreshTokenDto) {
    return this.authService.refreshToken(refreshTokenDto)
  }

  @Patch('change-password')
  @ResponseMessage('Password đã được thay đổi thành công')
  changePassword(@Body() changePasswordDto: ChangePasswordDto, @User() user: UserType) {
    return this.authService.changePassword(changePasswordDto, user)
  }

  @Post('logout')
  @ResponseMessage('Đăng xuất thành công')
  logout(@Body() logoutDto: LogoutDto) {
    return this.authService.logout(logoutDto)
  }
}
