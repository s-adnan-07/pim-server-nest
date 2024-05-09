import { Model } from 'mongoose'
import { Injectable, UnauthorizedException } from '@nestjs/common'
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

  async login({ username, password }: LoginDetailsDto) {
    const person = await this.personModel.findOne({ username })

    const passwordsMatch = await this.comparePasswords(
      password,
      person?.password,
    )

    if (!person || !passwordsMatch) {
      throw new UnauthorizedException('Invalid username or password')
    }

    // TODO: Sign the actual user from db once we connect to db
    return this.jwtService.sign({ username })
  }

  async comparePasswords(password = '', hashedPassword = '') {
    return bcrypt.compare(password, hashedPassword)
  }
}
