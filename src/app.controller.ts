import { Controller, Get, Inject, Logger } from '@nestjs/common'
import { AppService } from 'app.service'
import { Public } from 'core/decorators/public.decorator'
@Controller()
export class AppController {
  constructor(
    @Inject() private readonly appService: AppService // private readonly mailerService: MailerService
  ) {}

  // @Inject('app_service  ')
  // private readonly newAppService: AppService
  @Public()
  @Get()
  getHello() {
    return this.appService.getHello()
  }

  @Public()
  @Get('test-email')
  async testEmail() {
    // await this.mailerService.sendWelcomeEmail('test@example.com', 'Pham Phu Loc')
  }
}
