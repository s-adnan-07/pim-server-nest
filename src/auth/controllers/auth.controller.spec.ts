import { Model } from 'mongoose'

import { Test, TestingModule } from '@nestjs/testing'
import { getModelToken } from '@nestjs/mongoose'
import { JwtService } from '@nestjs/jwt'
import { ConfigService } from '@nestjs/config'

import { UsersService } from '@/users/services/users.service'
import { Person } from '@/users/schemas/person.schema'

import { AuthController } from './auth.controller'
import { AuthService } from '../services/auth.service'

describe('AuthController', () => {
  let controller: AuthController
  let service: AuthService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        AuthService,
        UsersService,
        ConfigService,
        JwtService,
        { provide: getModelToken(Person.name, 'pim-prod'), useValue: Model },
      ],
    }).compile()

    controller = module.get<AuthController>(AuthController)
    service = module.get<AuthService>(AuthService)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })
})
