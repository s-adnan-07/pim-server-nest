import { Model } from 'mongoose'
import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Person } from '../schemas/person.schema'

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(Person.name, 'pim-prod') private personModel: Model<Person>,
  ) {}

  findOne(username: string) {
    return this.personModel.findOne({ username })
  }
}
