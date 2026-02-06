import { VersioningType } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { NestFactory } from '@nestjs/core'
import { NestExpressApplication } from '@nestjs/platform-express'
import { UPLOAD_CONFIG } from 'config/upload.config'
import cookieParser from 'cookie-parser'
import helmet from 'helmet'
import path from 'path'
import { AppModule } from './app.module'

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule)

  // app.useLogger(new MyLoggerDev())

  app.use(helmet())

  // Enable Express “extended” query parser
  app.set('query parser', 'extended')

  const configService = app.get(ConfigService)
  const port = configService.get<number>('PORT')

  app.enableVersioning({
    type: VersioningType.URI,
    prefix: 'api/v',
    defaultVersion: '1'
  })

  /**
   * First parameter: đường dẫn đến thư mục mà mình muốn serve static
   * Second parameter: options -> thêm prefix vào đường dẫn
   * -> khi truy cập vào: my_url/public/{đường dẫn còn lại dẫn đến file}
   */
  app.useStaticAssets(path.join(__dirname, `../../${UPLOAD_CONFIG.UPLOAD_PATH}`), { prefix: '/public/' })

  app.enableCors({ origin: '*' })

  app.use(cookieParser())

  await app.listen(port)
}
bootstrap()
