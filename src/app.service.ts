import { Injectable } from '@nestjs/common'

@Injectable()
export class AppService {
  getServerStatus(): string {
    return 'Server Running'
  }
}
