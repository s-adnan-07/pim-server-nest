import { Module } from '@nestjs/common'
import { AuthController } from './controllers/auth.controller'
import { AuthService } from './services/auth.service'
import { MongooseModule } from '@nestjs/mongoose'
import { Person, PersonSchema } from './schemas/person.schema'
import { JwtModule } from '@nestjs/jwt'
import { ConfigService } from '@nestjs/config'
import { LocalStrategy } from './strategies/local.strategy'
import { UsersModule } from '@/users/users.module'

@Module({
  imports: [
    UsersModule,
    MongooseModule.forFeature(
      [{ name: Person.name, schema: PersonSchema }],
      'pim-prod',
    ),
    JwtModule.registerAsync({
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET'),
        signOptions: {
          expiresIn: configService.get('TOKEN_EXPIRY_IN_DAYS'),
        },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy],
})
export class AuthModule {}
