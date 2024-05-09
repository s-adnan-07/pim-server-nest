import { Module } from '@nestjs/common'
import { MaintiveService } from './services/maintive.service'

@Module({
  providers: [MaintiveService],
  exports: [MaintiveService],
})
export class MaintiveModule {}
