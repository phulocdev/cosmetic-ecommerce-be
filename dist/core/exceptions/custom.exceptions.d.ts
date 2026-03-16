import { HttpException, HttpStatus } from '@nestjs/common';
export declare class BaseException extends HttpException {
    readonly errorCode?: string;
    readonly details?: any;
    constructor(message: string, statusCode: HttpStatus, errorCode?: string, details?: any);
}
export declare class BusinessException extends BaseException {
    constructor(message: string, details?: any);
}
export declare class EntityNotFoundException extends BaseException {
    constructor(entity: string, identifier?: string | number);
}
export declare class DuplicateEntityException extends BaseException {
    constructor(entity: string, field: string);
}
export declare class ValidationException extends BaseException {
    constructor(details: Record<string, string[]>);
}
export declare class AuthenticationException extends BaseException {
    constructor(message?: string);
}
export declare class AuthorizationException extends BaseException {
    constructor(message?: string);
}
export declare class RateLimitException extends BaseException {
    constructor(retryAfter?: number);
}
export declare class TokenExpiredException extends BaseException {
    constructor(tokenType?: string);
}
export declare class InvalidTokenException extends BaseException {
    constructor(tokenType?: string);
}
export declare class AccountLockedException extends BaseException {
    constructor(unlockTime?: Date);
}
export declare class AccountNotVerifiedException extends BaseException {
    constructor();
}
