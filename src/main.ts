import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { ConfigService } from '@nestjs/config'
import { Logger, ValidationPipe } from '@nestjs/common'
import * as cookieParser from 'cookie-parser'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  const configService = app.get(ConfigService)
  const logger = new Logger('NestApplication')

  const NODE_ENV = configService.get<string>('NODE_ENV')
  const PORT = configService.get<number>('PORT')
  const HOST = configService.get<string>('HOST')

  // * The below line is needed for class-validator to work
  app.useGlobalPipes(new ValidationPipe())
  app.use(cookieParser())
  app.enableCors({
    origin: [HOST],
    credentials: true,
    allowedHeaders: ['Content-Type'],
  })

  await app.listen(PORT)

  logger.log('')
  logger.log(`Running in ${NODE_ENV} mode`)
  logger.log(`Listening on port ${PORT}`)
}

bootstrap()
