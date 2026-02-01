import { OnQueueFailed, Process, Processor } from '@nestjs/bull'
import { Job } from 'bull'
import { EmailService } from 'core/email/email.service'

@Processor('email')
export class EmailProcessor {
  constructor(private emailService: EmailService) {}

  @Process('welcome')
  async handleWelcomeEmail(job: Job) {
    // throw new Error('Throw error from email processor') // For testing global exception filter

    const { email, name } = job.data

    await this.emailService.sendWelcomeEmail(email, name)
  }

  @Process('password-reset')
  async handlePasswordResetEmail(job: Job) {
    const { email, resetToken } = job.data
    await this.emailService.sendPasswordResetEmail(email, resetToken)
  }

  @OnQueueFailed()
  async onFailed(job: Job, error: Error) {
    console.error(`Job ${job.id} failed with error: ${error.message}`)
  }
}
