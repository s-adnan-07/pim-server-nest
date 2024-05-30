import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

@Injectable()
export class AppService {
  constructor(private configService: ConfigService) {}

  getServerStatus(): string {
    const NODE_ENV = this.configService.get<string>('NODE_ENV')
    const PORT = this.configService.get<number>('PORT')

    return `Server Running in ${NODE_ENV} mode on port ${PORT}`
  }
}
