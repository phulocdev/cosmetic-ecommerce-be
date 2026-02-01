import { Injectable } from '@nestjs/common'
import { InjectQueue } from '@nestjs/bull'
import { Queue } from 'bull'

@Injectable()
export class EmailProducer {
  constructor(@InjectQueue('email') private emailQueue: Queue) {}

  async sendWelcomeEmail(email: string, name: string) {
    await this.emailQueue.add('welcome', {
      email,
      name
    })
  }

  async sendPasswordResetEmail(email: string, resetToken: string) {
    await this.emailQueue.add('password-reset', {
      email,
      resetToken
    })
  }
}
