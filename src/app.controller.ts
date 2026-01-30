import { Controller, Get, Inject, Logger } from '@nestjs/common'
import { AppService } from 'app.service'
import { Public } from 'core/decorators/public.decorator'
@Controller()
export class AppController {
  constructor(@Inject() private readonly appService: AppService) {}

  // @Inject('app_service  ')
  // private readonly newAppService: AppService
  @Public()
  @Get()
  getHello() {
    return this.appService.getHello()
  }
}
