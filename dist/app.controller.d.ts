import { AppService } from 'app.service';
import { User } from 'types';
export declare class AppController {
    private readonly appService;
    private readonly logger;
    constructor(appService: AppService);
    getHello(): string;
    verifyUser(user: User): User;
    testEmail(): Promise<void>;
}
