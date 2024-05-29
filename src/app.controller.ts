import { Controller, Get } from '@nestjs/common'
import { AppService } from './app.service'
import { Public } from './shared/decorators/public.decorator'

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @Public()
  getServerStatus(): string {
    return this.appService.getServerStatus()
  }
}
