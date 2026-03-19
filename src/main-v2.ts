import { Logger, VersioningType } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { NestFactory } from '@nestjs/core'
import { NestExpressApplication } from '@nestjs/platform-express'
import cookieParser from 'cookie-parser'
import helmet from 'helmet'
import path from 'path'
import { AppModule } from './app.module'
import { WinstonModule } from 'nest-winston'
import { winstonConfig } from 'config/winston.config'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'

async function bootstrap() {
  const logger = new Logger('Bootstrap')

  // Create NestJS application with Winston logger
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    logger: WinstonModule.createLogger(winstonConfig)
  })

  // Get configuration service
  const configService = app.get(ConfigService)

  // Get environment variables
  const port = configService.get<number>('app.port', 3000)
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

  // Enable Express “extended” query parser, ex: when your query params is:
  app.set('query parser', 'extended')

  // Set global prefix
  app.setGlobalPrefix(apiPrefix)

  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
    prefix: 'v'
  })

  // Security: Helmet
  // Explanation the above configuration:
  // To allow loading resources such as images and styles from the same origin and data URIs,
  // while restricting scripts to only be loaded from the same origin.
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
    logger.log('Helmet security headers enabled')
  }

  // Security: CORS
  if (corsEnabled) {
    app.enableCors({
      origin: corsOrigin,
      methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
      credentials: true,
      allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
      exposedHeaders: ['X-Total-Count', 'X-Page-Count']
    })
  }

  // Trust proxy (for production behind load balancer)
  // Explaination of the below setting:
  // This setting is important when your application is behind a proxy or load balancer.
  // It ensures that the application correctly interprets the original client IP address
  // and protocol (HTTP/HTTPS) from the X-Forwarded-* headers set by the proxy
  app.set('trust proxy', 1)

  // Swagger documentation
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
      .addTag('Auth', 'Authentication endpoints')
      .addTag('Users', 'User management endpoints')
      .addTag('Health', 'Health check endpoints')
      .build()

    const document = SwaggerModule.createDocument(app, swaggerConfig)
    SwaggerModule.setup(swaggerPath, app, document, {
      swaggerOptions: {
        persistAuthorization: true,
        tagsSorter: 'alpha',
        operationsSorter: 'alpha'
      },
      customSiteTitle: 'NestJS API Documentation'
    })
    logger.log(`Swagger documentation available at /${swaggerPath}`)
  }

  /**
   * First parameter: đường dẫn đến thư mục mà mình muốn serve static
   * Second parameter: options -> thêm prefix vào đường dẫn
   * -> khi truy cập vào: my_url/public/{đường dẫn còn lại dẫn đến file}
   */
  app.useStaticAssets(path.join(__dirname, `../../${uploadDest}`), { prefix: assetPrefix })

  // Graceful shutdown
  app.enableShutdownHooks()

  // Middleware: Cookie Parser
  // Explanation: Middleware to parse cookies from incoming requests
  // Example: If a request contains a header "Cookie: sessionId=abc123;",
  // this middleware will parse it and populate req.cookies with { sessionId: 'abc123' }
  // Usually used for handling sessions, authentication, and user preferences
  app.use(cookieParser())

  // Start server
  await app.listen(port)

  logger.log(`Application is running on: http://localhost:${port}/${apiPrefix}`)
  logger.log(`Environment: ${configService.get('app.nodeEnv')}`)
}
bootstrap()
