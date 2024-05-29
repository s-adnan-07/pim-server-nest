import { Model } from 'mongoose'

import { Test, TestingModule } from '@nestjs/testing'
import { getModelToken } from '@nestjs/mongoose'
import { JwtService } from '@nestjs/jwt'
import { ConfigService } from '@nestjs/config'

import { UsersService } from '@/users/services/users.service'
import { Person, PersonDocument } from '@/users/schemas/person.schema'

import { AuthService } from './auth.service'
import LoginDetailsDto from '../dtos/login-details.dto'

describe('AuthService', () => {
  let service: AuthService
  let usersService: UsersService
  let jwtService: JwtService

  let user = {
    username: 'username',
    password: 'password',
  } as unknown as PersonDocument

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      // Need to use injection tokens next time
      // so that I can mock specific functions
      providers: [
        AuthService,
        UsersService,
        ConfigService,
        JwtService,
        {
          provide: getModelToken(Person.name, 'pim-prod'),
          useValue: {
            findOne: jest.fn(async () => user),
          },
        },
      ],
    }).compile()

    service = module.get<AuthService>(AuthService)
    usersService = module.get<UsersService>(UsersService)
    jwtService = module.get<JwtService>(JwtService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  describe('login', () => {
    it('should return null for non-existant user', async () => {
      const invalidUsername: LoginDetailsDto = {
        username: 'invalid_username',
        password: 'password',
      }

      jest.spyOn(usersService, 'findOne').mockImplementation(() => null)

      expect(await service.login(invalidUsername)).toStrictEqual(null)
    })

    it('should return null for incorrect password', async () => {
      const invalidPassword: LoginDetailsDto = {
        username: 'username',
        password: 'invalid_password',
      }

      jest
        .spyOn(service, 'comparePasswords')
        .mockImplementation(async () => false)

      expect(await service.login(invalidPassword)).toStrictEqual(null)
    })

    it('should return a jwt for an authenticated user', async () => {
      const validDetails: LoginDetailsDto = {
        username: 'username',
        password: 'password',
      }

      jest
        .spyOn(service, 'comparePasswords')
        .mockImplementation(async () => true)

      jest
        .spyOn(jwtService, 'signAsync')
        .mockImplementation(async () => 'token')

      expect(await service.login(validDetails)).toStrictEqual('token')
    })
  })
})
