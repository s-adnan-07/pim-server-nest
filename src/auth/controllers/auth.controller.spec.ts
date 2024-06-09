import { Response } from 'express'

import { Test, TestingModule } from '@nestjs/testing'
import { getModelToken } from '@nestjs/mongoose'
import { JwtService } from '@nestjs/jwt'
import { ConfigService } from '@nestjs/config'
import { HttpStatus, UnauthorizedException } from '@nestjs/common'

import { UsersService } from '@/users/services/users.service'
import { Person } from '@/users/schemas/person.schema'

import { AuthController } from './auth.controller'
import { AuthService } from '../services/auth.service'
import LoginDetailsDto from '../dtos/login-details.dto'

describe('AuthController', () => {
  let controller: AuthController
  let service: AuthService
  let loginDetails: LoginDetailsDto
  let res = {
    cookie: jest.fn(),
  } as unknown as Response

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        AuthService,
        UsersService,
        ConfigService,
        JwtService,
        {
          provide: getModelToken(Person.name, 'pim-prod'),
          useValue: {
            findOne: jest.fn(),
          },
        },
      ],
    }).compile()

    controller = module.get<AuthController>(AuthController)
    service = module.get<AuthService>(AuthService)

    loginDetails = {
      username: 'username',
      password: 'password',
    }
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })

  describe('login', () => {
    it('should return username on success', async () => {
      const token = 'token'
      jest.spyOn(service, 'login').mockImplementation(async arg => token)

      const result = await controller.login(loginDetails, res)

      // expect(res.cookie).toHaveBeenCalled()

      expect(result).toStrictEqual({
        statusCode: HttpStatus.OK,
        message: 'success',
        user: loginDetails.username,
        token,
      })
    })

    it('should throw an unathorized error on fail', async () => {
      jest.spyOn(service, 'login').mockImplementation(async () => null)

      // don't use await here for rejects to work we need a promise
      const result = controller.login(loginDetails, res)

      await expect(result).rejects.toThrow(UnauthorizedException)
    })
  })
})
