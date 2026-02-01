import { Injectable } from '@nestjs/common'
import { MailerService as MailerPackageService } from '@nestjs-modules/mailer'
import { render } from '@react-email/render'
import { ConfigService } from '@nestjs/config'
import WelcomeEmail from '../../../emails/welcome'
import ResetPasswordTemplate from '../../../emails/reset-password-template'

@Injectable()
export class EmailService {
  constructor(
    private mailerService: MailerPackageService,
    private configService: ConfigService
  ) {}

  async renderWelcomeEmail(name: string, confirmationUrl: string): Promise<string> {
    return render(WelcomeEmail({ name, confirmationUrl }), {
      pretty: this.configService.get('NODE_ENV') !== 'production' // Makes HTML readable (disable in production)
    })
  }

  async renderPasswordResetEmail(name: string, resetToken: string): Promise<string> {
    return render(
      ResetPasswordTemplate({ name, resetToken, clientBaseUrl: this.configService.get('CLIENT_BASE_URL') }),
      {
        pretty: this.configService.get('NODE_ENV') !== 'production' // Makes HTML readable (disable in production)
      }
    )
  }

  async sendPasswordResetEmail(email: string, resetToken: string) {
    await this.mailerService
      .sendMail({
        to: email,
        subject: 'Password Reset Request',
        // React Email usage
        html: await this.renderPasswordResetEmail(email, resetToken)
      })
      .catch((err) => {
        console.error('Error sending password reset email:', err)
        throw err
      })
  }

  async sendWelcomeEmail(email: string, name: string) {
    await this.mailerService
      .sendMail({
        to: email,
        subject: 'Welcome to Our App',
        // Reat Email usage
        html: await this.renderWelcomeEmail(
          name,
          'http://facebook.com/phamphulocc' // example confirmation URL -
        )

        // Handlebars template usage
        // template: 'welcome', // references welcome.hbs
        // context: {
        //   name: name,
        //   confirmationUrl: 'http://facebook.com/phamphulocc' // example context variable
        // }
      })
      .catch((err) => {
        console.error('Error sending welcome email:', err)
        throw err
      })
  }
}
