import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'
import * as Extractor from 'passport-jwt-cookie-extractor'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(configService: ConfigService) {
    // Note: You cannot use 'this' before or inside a super() call
    // > Hence we don't mark the config service as private

    super({
      // jwtFromRequest: Extractor.fromCookie('jwt'),
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get<string>('JWT_SECRET'),
      ignoreExpiration: false,
    })
  }

  validate(payload: any) {
    return payload
  }
}
