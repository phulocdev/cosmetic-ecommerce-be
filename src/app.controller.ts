import { Controller, Get, Inject, Logger } from '@nestjs/common'
import { AppService } from 'app.service'
import { CurrentUser } from 'core'
import { Public } from 'core/decorators/public.decorator'
import { User } from 'types'
@Controller()
export class AppController {
  private readonly logger = new Logger(AppController.name)

  constructor(
    @Inject() private readonly appService: AppService // private readonly mailerService: MailerService
  ) {}

  // @Inject('app_service  ')
  // private readonly newAppService: AppService
  @Public()
  @Get()
  getHello() {
    this.logger.log('Hello endpoint called')
    return this.appService.getHello()
  }

  @Get('verify-user')
  verifyUser(@CurrentUser() user: User) {
    this.logger.log('Verify user endpoint called')

    return user
  }

  @Public()
  @Get('test-email')
  async testEmail() {
    // await this.mailerService.sendWelcomeEmail('test@example.com', 'Pham Phu Loc')
  }
}
