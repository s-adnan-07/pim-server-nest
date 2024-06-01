import { Test, TestingModule } from '@nestjs/testing'
import { ConfigService } from '@nestjs/config'
import { MaintiveService } from './maintive.service'

describe('MaintiveService', () => {
  let service: MaintiveService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MaintiveService, ConfigService],
    }).compile()

    service = module.get<MaintiveService>(MaintiveService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
