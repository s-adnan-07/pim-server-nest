import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument } from 'mongoose'

// * Using Person instead of User as there is already a user collection
export type PersonDocument = HydratedDocument<Person>

@Schema({ timestamps: true })
export class Person {
  @Prop({ required: true })
  username: string

  @Prop({ required: true })
  name: string

  @Prop()
  email: string

  @Prop({ required: true })
  password: string
}

export const PersonSchema = SchemaFactory.createForClass(Person)
