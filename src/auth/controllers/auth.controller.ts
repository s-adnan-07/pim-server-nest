import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Logger,
  Post,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Request, Response } from 'express'

import LoginDetailsDto from '../dtos/login-details.dto'
import { AuthService } from '../services/auth.service'
import { JwtGuard } from '../guards/jwt.guard'
import { Public } from '@/shared/decorators/public.decorator'

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

  private readonly logger = new Logger(AuthController.name, { timestamp: true })

  @Public()
  @Post('login')
  async login(
    @Body() loginDetails: LoginDetailsDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const COOKIE_EXPIRY_IN_DAYS =
      this.configService.get<number>('COOKIE_EXPIRY_IN_DAYS') || THIRTY_DAYS

    const token = await this.authService.login(loginDetails)

    if (!token) throw new UnauthorizedException('Invalid username or password')

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
      user: loginDetails.username,
    }
  }

  @Public()
  @Post('logout')
  logout(@Res({ passthrough: true }) response: Response) {
    response.cookie('jwt', '', { maxAge: 0 })
    // or the below line too
    // response.clearCookie('jwt')

    return {
      statusCode: HttpStatus.OK,
      message: 'success',
    }
  }

  @Get('validate')
  validate(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ) {
    const token = request.cookies.jwt as string
    return this.authService.validateToken(token)
  }

  @Get('status')
  @UseGuards(JwtGuard)
  status(@Req() req: Request) {
    return req.user
  }
}
