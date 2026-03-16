import { Job } from 'bull';
import { EmailService } from 'domains/email/email.service';
export declare class EmailProcessor {
    private emailService;
    constructor(emailService: EmailService);
    handleWelcomeEmail(job: Job): Promise<void>;
    handlePasswordResetEmail(job: Job): Promise<void>;
    onFailed(job: Job, error: Error): Promise<void>;
}
