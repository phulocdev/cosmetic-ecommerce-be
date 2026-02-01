import { MailerModule } from '@nestjs-modules/mailer'
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter'
import { Module } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import * as path from 'path'
import { BullModule } from '@nestjs/bull'
import { EmailProcessor } from 'core/email/email.processor'
import { EmailProducer } from 'core/email/email.producer'
import { EmailService } from 'core/email/email.service'

@Module({
  imports: [
    MailerModule.forRootAsync({
      useFactory: (config: ConfigService) => ({
        transport: {
          // -------------- Preivew Email (for development) --------------
          // host: 'localhost',
          // port: 1025,
          // secure: false

          // -------------- Real Email (for production) --------------
          host: config.get('EMAIL_HOST'),
          port: config.get('EMAIL_PORT'),
          secure: config.get('EMAIL_SECURE') === 'true',
          auth: {
            user: config.get('EMAIL_SENDER'),
            pass: config.get('EMAIL_APP_PASSWORD')
          },
          logger: true,
          debug: true
        },
        defaults: {
          from: 'No Reply" <' + config.get('EMAIL_SENDER') + '>'
        },
        template: {
          dir: path.join(__dirname, 'templates'),
          adapter: new HandlebarsAdapter(),
          options: {
            strict: true
          }
        }
      }),
      inject: [ConfigService]
    }),
    BullModule.registerQueue({
      name: 'email',
      defaultJobOptions: {
        attempts: 3,
        backoff: { type: 'exponential', delay: 2000 }, // Start with 2 seconds delay, then 4 seconds, 8 seconds, etc.
        removeOnComplete: true,
        removeOnFail: false
      }
    })
  ],
  providers: [EmailService, EmailProcessor, EmailProducer],
  exports: [EmailService, EmailProducer]
})
export class EmailModule {}
