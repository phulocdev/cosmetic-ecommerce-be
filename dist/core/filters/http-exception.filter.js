"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var HttpExceptionFilter_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.HttpExceptionFilter = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
let HttpExceptionFilter = HttpExceptionFilter_1 = class HttpExceptionFilter {
    configService;
    logger = new common_1.Logger(HttpExceptionFilter_1.name);
    isProduction;
    sentryEnabled;
    constructor(configService) {
        this.configService = configService;
        this.isProduction = configService.get('app.nodeEnv') === 'production';
        this.sentryEnabled = configService.get('SENTRY_ENABLED') === 'true';
    }
    catch(exception, host) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const request = ctx.getRequest();
        const status = exception instanceof common_1.HttpException ? exception.getStatus() : common_1.HttpStatus.INTERNAL_SERVER_ERROR;
        const errorResponse = this.getErrorResponse(exception);
        const responseBody = {
            success: false,
            statusCode: status,
            message: errorResponse.message,
            error: errorResponse.error,
            details: this.isProduction ? undefined : errorResponse.details,
            path: request.url,
            timestamp: new Date().toISOString(),
            requestId: request.headers['x-request-id']
        };
        this.logError(exception, request, status);
        if (status >= 500 && this.sentryEnabled) {
            this.reportToSentry(exception, request);
        }
        response.status(status).json(responseBody);
    }
    getErrorResponse(exception) {
        if (exception instanceof common_1.HttpException) {
            const response = exception.getResponse();
            if (typeof response === 'object') {
                const responseObj = response;
                return {
                    message: responseObj.message || exception.message,
                    error: responseObj.error || exception.name,
                    details: responseObj.details
                };
            }
            return {
                message: response,
                error: exception.name
            };
        }
        if (exception instanceof Error) {
            return {
                message: this.isProduction ? 'Internal server error' : exception.message,
                error: exception.name,
                details: this.isProduction ? undefined : exception.stack
            };
        }
        return {
            message: 'Internal server error',
            error: 'UnknownError'
        };
    }
    logError(exception, request, status) {
        const logContext = {
            method: request.method,
            url: request.url,
            body: request.body,
            user: request.user?.id,
            ip: request.ip,
            userAgent: request.headers['user-agent']
        };
        if (status >= 500) {
            this.logger.error(`${request.method} ${request.url} - ${status}`, exception instanceof Error ? exception.stack : 'Unknown error', logContext);
        }
        else if (status >= 400) {
            this.logger.warn(`${request.method} ${request.url} - ${status}`, logContext);
        }
    }
    reportToSentry(exception, request) {
    }
};
exports.HttpExceptionFilter = HttpExceptionFilter;
exports.HttpExceptionFilter = HttpExceptionFilter = HttpExceptionFilter_1 = __decorate([
    (0, common_1.Catch)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], HttpExceptionFilter);
//# sourceMappingURL=http-exception.filter.js.map