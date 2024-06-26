import { Injectable, Logger, UnauthorizedException } from '@nestjs/common'
import * as bcrypt from 'bcrypt'

import LoginDetailsDto from '../dtos/login-details.dto'
import { JwtService } from '@nestjs/jwt'
import { UsersService } from '@/users/services/users.service'

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private usersService: UsersService,
  ) {}

  private readonly logger = new Logger(AuthService.name, { timestamp: true })

  async login({ username, password }: LoginDetailsDto) {
    const person = await this.usersService.findOne(username)

    if (!person) return null

    const passwordsMatch = await this.comparePasswords(
      password,
      person.password,
    )

    if (!passwordsMatch) return null
    return this.jwtService.signAsync({ username })
  }

  async validate({ username, password }: LoginDetailsDto) {
    const person = await this.usersService.findOne(username)

    if (!person) return null

    const passwordsMatch = await this.comparePasswords(
      password,
      person.password,
    )

    if (!passwordsMatch) return null
    return { user: username }
  }

  comparePasswords(password = '', hashedPassword = '') {
    return bcrypt.compare(password, hashedPassword)
  }

  validateToken(token: string) {
    try {
      return this.jwtService.verifyAsync(token)
    } catch (e) {
      throw new UnauthorizedException()
    }
  }
}
