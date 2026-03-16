import { Queue } from 'bull';
export declare class EmailProducer {
    private emailQueue;
    constructor(emailQueue: Queue);
    sendWelcomeEmail(email: string, name: string): Promise<void>;
    sendPasswordResetEmail(email: string, resetToken: string): Promise<void>;
}
