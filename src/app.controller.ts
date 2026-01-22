import { Controller, Get } from '@nestjs/common'
import { Public } from 'core/decorators/public.decorator'
@Controller()
export class AppController {
  constructor() {}

  @Public()
  @Get()
  getHello() {
    return {
      author: 'Pham Phu Loc'
    }
  }
}
