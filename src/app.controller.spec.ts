import { Test, TestingModule } from '@nestjs/testing'
import { ConfigService } from '@nestjs/config'

import { AppController } from './app.controller'
import { AppService } from './app.service'

describe('AppController', () => {
  let appController: AppController

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService, ConfigService],
    }).compile()

    appController = app.get<AppController>(AppController)
  })

  it('should be defined', () => {
    expect(appController).toBeDefined()
  })

  // TODO: See how to use env variables in testing
  // describe('root', () => {
  //   it('should return "Server Running"', () => {
  //     expect(appController.getServerStatus()).toBe('Server Running')
  //   })
  // })
})
