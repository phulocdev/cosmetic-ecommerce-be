import { Logger, VersioningType } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { NestFactory } from '@nestjs/core'
import { NestExpressApplication, ExpressAdapter } from '@nestjs/platform-express'
import cookieParser from 'cookie-parser'
import helmet from 'helmet'
import path from 'path'
import express from 'express'

import { AppModule } from './app.module'
import { WinstonModule } from 'nest-winston'
import { winstonConfig } from 'config/winston.config'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'

const server = express()

async function bootstrap() {
  const logger = new Logger('Bootstrap')

  const app = await NestFactory.create<NestExpressApplication>(
    AppModule,
    new ExpressAdapter(server),
    {
      logger: WinstonModule.createLogger(winstonConfig)
    }
  )

  const configService = app.get(ConfigService)

  const apiPrefix = configService.get<string>('app.apiPrefix', 'api')
  const corsEnabled = configService.get<boolean>('cors.enabled', true)
  const corsOrigin = configService.get<string[]>('cors.origin', ['*'])
  const helmetEnabled = configService.get<boolean>('security.helmet', true)
  const swaggerEnabled = configService.get<boolean>('swagger.enabled', true)

  const swaggerTitle = configService.get<string>('swagger.title', 'NestJS API')
  const swaggerDescription = configService.get<string>(
    'swagger.description',
    'Production-ready NestJS API'
  )
  const swaggerVersion = configService.get<string>('swagger.version', '1.0')
  const swaggerPath = configService.get<string>('swagger.path', 'docs')

  const uploadDest = configService.get<string>('app.uploadDest', './uploads')
  const assetPrefix = configService.get<string>('app.assetPrefix', '/public/')

  app.set('query parser', 'extended')

  app.setGlobalPrefix(apiPrefix)

  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
    prefix: 'v'
  })

  if (helmetEnabled) {
    app.use(
      helmet({
        contentSecurityPolicy: {
          directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'"],
            imgSrc: ["'self'", 'data:', 'https:'],
            scriptSrc: ["'self'"]
          }
        },
        crossOriginEmbedderPolicy: false
      })
    )
    logger.log('Helmet enabled')
  }

  if (corsEnabled) {
    app.enableCors({
      origin: corsOrigin,
      credentials: true
    })
  }

  app.set('trust proxy', 1)

  if (swaggerEnabled) {
    const swaggerConfig = new DocumentBuilder()
      .setTitle(swaggerTitle)
      .setDescription(swaggerDescription)
      .setVersion(swaggerVersion)
      .addBearerAuth(
        {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          name: 'JWT',
          description: 'Enter JWT token',
          in: 'header'
        },
        'JWT-auth'
      )
      .build()

    const document = SwaggerModule.createDocument(app, swaggerConfig)

    SwaggerModule.setup(swaggerPath, app, document)

    logger.log(`Swagger running at /${swaggerPath}`)
  }

  app.useStaticAssets(path.join(__dirname, `../../${uploadDest}`), {
    prefix: assetPrefix
  })

  app.enableShutdownHooks()

  app.use(cookieParser())

  await app.init()

  logger.log('NestJS serverless bootstrap completed')
}

const bootstrapPromise = bootstrap()

export default async function handler(req, res) {
  await bootstrapPromise
  server(req, res)
}
