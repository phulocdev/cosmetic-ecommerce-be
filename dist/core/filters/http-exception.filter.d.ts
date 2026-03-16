import { ExceptionFilter, ArgumentsHost } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
export declare class HttpExceptionFilter implements ExceptionFilter {
    private readonly configService;
    private readonly logger;
    private readonly isProduction;
    private readonly sentryEnabled;
    constructor(configService: ConfigService);
    catch(exception: unknown, host: ArgumentsHost): void;
    private getErrorResponse;
    private logError;
    private reportToSentry;
}
