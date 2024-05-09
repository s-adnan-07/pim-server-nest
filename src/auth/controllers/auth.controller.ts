import { Body, Controller, HttpStatus, Post, Res } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Response } from 'express'

import LoginDetailsDto from '../dtos/login-details.dto'
import { AuthService } from '../services/auth.service'

const THIRTY_DAYS = 30
const TWENTY_FOUR_HOURS = 24
const SIXTY_MINUTES = 60
const SIXTY_SECONDS = 60
const THOUSAND_MILLISECONDS = 1000

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private configService: ConfigService,
  ) {}

  @Post('login')
  async login(
    @Body() loginDetails: LoginDetailsDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const COOKIE_EXPIRY_IN_DAYS =
      this.configService.get<number>('COOKIE_EXPIRY_IN_DAYS') || THIRTY_DAYS

    // TODO: Return some user details apart from token
    const token = await this.authService.login(loginDetails)

    const maxAge =
      COOKIE_EXPIRY_IN_DAYS *
      TWENTY_FOUR_HOURS *
      SIXTY_MINUTES *
      SIXTY_SECONDS *
      THOUSAND_MILLISECONDS

    response.cookie('jwt', token, {
      maxAge,
      httpOnly: true,
      sameSite: 'strict',
    })

    return {
      statusCode: HttpStatus.OK,
      message: 'success',
    }
  }

  @Post('logout')
  logout(@Res({ passthrough: true }) response: Response) {
    response.cookie('jwt', '', { maxAge: 0 })

    return {
      statusCode: HttpStatus.OK,
      message: 'success',
    }
  }
}
