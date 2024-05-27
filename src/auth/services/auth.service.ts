import { Model } from 'mongoose'
import { Injectable, Logger, UnauthorizedException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import * as bcrypt from 'bcrypt'

import LoginDetailsDto from '../dtos/login-details.dto'
import { Person } from '../schemas/person.schema'
import { JwtService } from '@nestjs/jwt'

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(Person.name, 'pim-prod') private personModel: Model<Person>,
    private jwtService: JwtService,
  ) {}

  private readonly logger = new Logger(AuthService.name, { timestamp: true })

  async login({ username, password }: LoginDetailsDto) {
    const person = await this.personModel.findOne({ username })

    const passwordsMatch = await this.comparePasswords(
      password,
      person?.password,
    )

    if (!person || !passwordsMatch) {
      this.logger.error(`Invalid username or password for '${username}'`)
      throw new UnauthorizedException('Invalid username or password')
    }

    this.logger.log(`User '${username}' logged in successfully`)
    return this.jwtService.sign({ username })
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
