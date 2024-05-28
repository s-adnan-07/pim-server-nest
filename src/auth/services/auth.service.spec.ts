import { Model } from 'mongoose'

import { Test, TestingModule } from '@nestjs/testing'
import { getModelToken } from '@nestjs/mongoose'
import { JwtService } from '@nestjs/jwt'
import { ConfigService } from '@nestjs/config'

import { UsersService } from '@/users/services/users.service'
import { Person } from '@/users/schemas/person.schema'

import { AuthService } from './auth.service'

describe('AuthService', () => {
  let service: AuthService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        UsersService,
        ConfigService,
        JwtService,
        { provide: getModelToken(Person.name, 'pim-prod'), useValue: Model },
      ],
    }).compile()

    service = module.get<AuthService>(AuthService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
