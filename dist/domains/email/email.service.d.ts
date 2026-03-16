import { MailerService as MailerPackageService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';
export declare class EmailService {
    private mailerService;
    private configService;
    constructor(mailerService: MailerPackageService, configService: ConfigService);
    renderWelcomeEmail(name: string, confirmationUrl: string): Promise<string>;
    renderPasswordResetEmail(name: string, resetToken: string): Promise<string>;
    sendPasswordResetEmail(email: string, resetToken: string): Promise<void>;
    sendWelcomeEmail(email: string, name: string): Promise<void>;
}
