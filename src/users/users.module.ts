import { Module } from '@nestjs/common'
import { UsersService } from './services/users.service'
import { MongooseModule } from '@nestjs/mongoose'
import { Person, PersonSchema } from '@/auth/schemas/person.schema'

@Module({
  imports: [
    MongooseModule.forFeature(
      [{ name: Person.name, schema: PersonSchema }],
      'pim-prod',
    ),
  ],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
