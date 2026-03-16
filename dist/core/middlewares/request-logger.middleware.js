"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var RequestLoggerMiddleware_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.RequestLoggerMiddleware = void 0;
const common_1 = require("@nestjs/common");
const uuid_1 = require("uuid");
let RequestLoggerMiddleware = RequestLoggerMiddleware_1 = class RequestLoggerMiddleware {
    logger = new common_1.Logger(RequestLoggerMiddleware_1.name);
    use(req, res, next) {
        const requestId = req.headers['x-request-id'] || (0, uuid_1.v4)();
        req.headers['x-request-id'] = requestId;
        res.setHeader('X-Request-ID', requestId);
        const startTime = Date.now();
        const { method, originalUrl, ip } = req;
        res.on('finish', () => {
            const duration = Date.now() - startTime;
            const { statusCode } = res;
            const contentLength = res.get('content-length') || 0;
            const logMessage = `${method} ${originalUrl} ${statusCode} ${contentLength}B - ${duration}ms`;
            const context = `RequestID: ${requestId} | IP: ${ip}`;
            if (statusCode >= 500) {
                this.logger.error(logMessage, context);
            }
            else if (statusCode >= 400) {
                this.logger.warn(logMessage, context);
            }
            else {
                this.logger.log(logMessage, context);
            }
        });
        next();
    }
};
exports.RequestLoggerMiddleware = RequestLoggerMiddleware;
exports.RequestLoggerMiddleware = RequestLoggerMiddleware = RequestLoggerMiddleware_1 = __decorate([
    (0, common_1.Injectable)()
], RequestLoggerMiddleware);
//# sourceMappingURL=request-logger.middleware.js.map