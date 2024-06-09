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
    const token = await this.authService.login(loginDetails)

    if (!token) throw new UnauthorizedException('Invalid username or password')

    return {
      statusCode: HttpStatus.OK,
      message: 'success',
      user: loginDetails.username,
      token,
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
