import { ConfigService } from '@nestjs/config/dist/config.service';
export declare class TempFileCleanupService {
    private readonly configService;
    private readonly logger;
    constructor(configService: ConfigService);
    sweepOrphanedTempFiles(): Promise<void>;
}
