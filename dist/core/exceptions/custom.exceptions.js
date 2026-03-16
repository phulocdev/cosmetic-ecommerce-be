"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccountNotVerifiedException = exports.AccountLockedException = exports.InvalidTokenException = exports.TokenExpiredException = exports.RateLimitException = exports.AuthorizationException = exports.AuthenticationException = exports.ValidationException = exports.DuplicateEntityException = exports.EntityNotFoundException = exports.BusinessException = exports.BaseException = void 0;
const common_1 = require("@nestjs/common");
class BaseException extends common_1.HttpException {
    errorCode;
    details;
    constructor(message, statusCode, errorCode, details) {
        super({
            message,
            error: errorCode || 'Error',
            statusCode,
            details
        }, statusCode);
        this.errorCode = errorCode;
        this.details = details;
    }
}
exports.BaseException = BaseException;
class BusinessException extends BaseException {
    constructor(message, details) {
        super(message, common_1.HttpStatus.BAD_REQUEST, 'BUSINESS_ERROR', details);
    }
}
exports.BusinessException = BusinessException;
class EntityNotFoundException extends BaseException {
    constructor(entity, identifier) {
        const message = identifier ? `${entity} with identifier "${identifier}" not found` : `${entity} not found`;
        super(message, common_1.HttpStatus.NOT_FOUND, 'ENTITY_NOT_FOUND');
    }
}
exports.EntityNotFoundException = EntityNotFoundException;
class DuplicateEntityException extends BaseException {
    constructor(entity, field) {
        super(`${entity} with this ${field} already exists`, common_1.HttpStatus.CONFLICT, 'DUPLICATE_ENTITY');
    }
}
exports.DuplicateEntityException = DuplicateEntityException;
class ValidationException extends BaseException {
    constructor(details) {
        super('Validation failed', common_1.HttpStatus.BAD_REQUEST, 'VALIDATION_ERROR', details);
    }
}
exports.ValidationException = ValidationException;
class AuthenticationException extends BaseException {
    constructor(message = 'Authentication failed') {
        super(message, common_1.HttpStatus.UNAUTHORIZED, 'AUTHENTICATION_ERROR');
    }
}
exports.AuthenticationException = AuthenticationException;
class AuthorizationException extends BaseException {
    constructor(message = 'Access denied') {
        super(message, common_1.HttpStatus.FORBIDDEN, 'AUTHORIZATION_ERROR');
    }
}
exports.AuthorizationException = AuthorizationException;
class RateLimitException extends BaseException {
    constructor(retryAfter) {
        super('Too many requests', common_1.HttpStatus.TOO_MANY_REQUESTS, 'RATE_LIMIT_ERROR', {
            retryAfter
        });
    }
}
exports.RateLimitException = RateLimitException;
class TokenExpiredException extends BaseException {
    constructor(tokenType = 'Token') {
        super(`${tokenType} has expired`, common_1.HttpStatus.UNAUTHORIZED, 'TOKEN_EXPIRED');
    }
}
exports.TokenExpiredException = TokenExpiredException;
class InvalidTokenException extends BaseException {
    constructor(tokenType = 'Token') {
        super(`${tokenType} is invalid`, common_1.HttpStatus.UNAUTHORIZED, 'INVALID_TOKEN');
    }
}
exports.InvalidTokenException = InvalidTokenException;
class AccountLockedException extends BaseException {
    constructor(unlockTime) {
        super('Account is locked due to too many failed login attempts', common_1.HttpStatus.FORBIDDEN, 'ACCOUNT_LOCKED', {
            unlockTime
        });
    }
}
exports.AccountLockedException = AccountLockedException;
class AccountNotVerifiedException extends BaseException {
    constructor() {
        super('Please verify your email address before logging in', common_1.HttpStatus.FORBIDDEN, 'ACCOUNT_NOT_VERIFIED');
    }
}
exports.AccountNotVerifiedException = AccountNotVerifiedException;
//# sourceMappingURL=custom.exceptions.js.map