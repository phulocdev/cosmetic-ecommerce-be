"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const jwt_1 = require("@nestjs/jwt");
const bcrypt = __importStar(require("bcrypt"));
const crypto_1 = __importDefault(require("crypto"));
const prisma_service_1 = require("../../database/prisma/prisma.service");
const redis_module_1 = require("../../database/redis/redis.module");
const email_producer_1 = require("../email/email.producer");
const users_service_1 = require("../users/users.service");
const ioredis_1 = __importDefault(require("ioredis"));
const ms_1 = __importDefault(require("ms"));
const utils_1 = require("../../utils");
const uuid_1 = require("uuid");
let AuthService = class AuthService {
    prismaService;
    jwtService;
    configService;
    usersService;
    redis;
    emailProducer;
    LOGIN_ATTEMPTS_PREFIX = 'login_attempts:';
    ACCESS_TOKEN_BLACKLIST_PREFIX = 'blacklist:access:';
    constructor(prismaService, jwtService, configService, usersService, redis, emailProducer) {
        this.prismaService = prismaService;
        this.jwtService = jwtService;
        this.configService = configService;
        this.usersService = usersService;
        this.redis = redis;
        this.emailProducer = emailProducer;
    }
    async register(registerDto) {
        const existingUser = await this.prismaService.user.findFirst({
            where: { email: registerDto.email }
        });
        if (existingUser) {
            throw new common_1.BadRequestException('Email already exists');
        }
        if (registerDto.phoneNumber) {
            const existingPhoneUser = await this.prismaService.user.findFirst({
                where: { phoneNumber: registerDto.phoneNumber }
            });
            if (existingPhoneUser) {
                throw new common_1.BadRequestException('Phone number already exists');
            }
        }
        const hashedPassword = await this.hashPassword(registerDto.password);
        const user = await this.prismaService.user.create({
            data: {
                email: registerDto.email,
                password: hashedPassword,
                fullName: registerDto.fullName,
                phoneNumber: registerDto.phoneNumber
            }
        });
        const tokenVersion = Number(await this.getTokenVersion(user.id)) + 0;
        const accessTokenJti = (0, uuid_1.v4)();
        const refreshTokenJti = (0, uuid_1.v4)();
        const accessTokenPayload = {
            userId: user.id,
            jti: accessTokenJti,
            email: user.email,
            role: user.role,
            version: tokenVersion
        };
        const refreshTokenPayload = {
            userId: user.id,
            jti: refreshTokenJti,
            email: user.email,
            role: user.role
        };
        const [accessToken, refreshToken] = await Promise.all([
            this.signAccessToken(accessTokenPayload),
            this.signRefreshToken(refreshTokenPayload)
        ]);
        await this.createRefreshTokenRecord(refreshTokenJti, user.id, (0, utils_1.hashToken)(refreshToken));
        return {
            user: this.sanitizeUser(user),
            accessToken,
            refreshToken
        };
    }
    async login(loginDto, ipAddress) {
        if (ipAddress) {
            const attempts = await this.checkLoginAttempts(loginDto.email, ipAddress);
            if (attempts >= this.configService.get('MAX_LOGIN_ATTEMPTS')) {
                throw new common_1.BadRequestException('Too many failed login attempts. Try again in 15 minutes');
            }
        }
        const user = await this.prismaService.user.findFirst({
            where: { email: loginDto.email }
        });
        const isPasswordValid = await bcrypt.compare(loginDto.password, user.password);
        if (!user || !isPasswordValid) {
            if (ipAddress) {
                await this.recordFailedLogin(loginDto.email, ipAddress);
            }
            throw new common_1.BadRequestException('Invalid credentials');
        }
        if (!user.isActive) {
            throw new common_1.BadRequestException('User is not active');
        }
        if (ipAddress) {
            await this.clearLoginAttempts(loginDto.email, ipAddress);
        }
        const tokenVersion = Number(await this.getTokenVersion(user.id)) || 0;
        const accessTokenJti = (0, uuid_1.v4)();
        const refreshTokenJti = (0, uuid_1.v4)();
        const accessTokenPayload = {
            userId: user.id,
            jti: accessTokenJti,
            email: user.email,
            role: user.role,
            version: +tokenVersion
        };
        const refreshTokenPayload = {
            userId: user.id,
            jti: refreshTokenJti,
            email: user.email,
            role: user.role
        };
        const [accessToken, refreshToken] = await Promise.all([
            this.signAccessToken(accessTokenPayload),
            this.signRefreshToken(refreshTokenPayload)
        ]);
        await this.createRefreshTokenRecord(refreshTokenJti, user.id, (0, utils_1.hashToken)(refreshToken));
        return {
            user: this.sanitizeUser(user),
            accessToken,
            refreshToken
        };
    }
    async refreshTokens(refreshToken) {
        let decodedRefreshToken;
        try {
            decodedRefreshToken = await this.jwtService.verifyAsync(refreshToken, {
                secret: this.configService.get('JWT_REFRESH_SECRET')
            });
        }
        catch (error) {
            if (error instanceof jwt_1.TokenExpiredError) {
                await this.cleanUserRefreshToken(decodedRefreshToken?.jti);
                throw new common_1.UnauthorizedException('Refresh token has expired');
            }
            throw new common_1.UnauthorizedException('Invalid refresh token');
        }
        const { jti, userId } = decodedRefreshToken;
        if (!jti || !userId) {
            throw new common_1.UnauthorizedException('Malformed refresh token');
        }
        const hashedRefreshToken = (0, utils_1.hashToken)(refreshToken);
        const existingRefreshToken = await this.prismaService.refreshToken.findUnique({
            where: { id: jti },
            include: { user: true }
        });
        if (!existingRefreshToken) {
            throw new common_1.UnauthorizedException('Refresh token not found');
        }
        if (existingRefreshToken.hashedToken !== hashedRefreshToken) {
            throw new common_1.UnauthorizedException('Refresh token mismatch');
        }
        if (existingRefreshToken.userId !== userId || existingRefreshToken.user.id !== userId) {
            throw new common_1.UnauthorizedException('Refresh token does not belong to the user');
        }
        if (!existingRefreshToken.user.isActive) {
            throw new common_1.UnauthorizedException('User is inactive');
        }
        if (existingRefreshToken.isRevoked) {
            await Promise.all([this.cleanAllUserTokens(userId), this.increaseTokenVersion(userId)]);
            throw new common_1.UnauthorizedException('Refresh token has been reused or revoked');
        }
        const updateRTResult = await this.prismaService.refreshToken.updateMany({
            where: { id: jti, isUsed: false },
            data: { isUsed: true }
        });
        if (updateRTResult.count === 0) {
            await Promise.all([this.cleanAllUserTokens(userId), this.increaseTokenVersion(userId)]);
            throw new common_1.UnauthorizedException('Refresh token has been reused or revoked');
        }
        let tokenVersion = +(await this.getTokenVersion(userId));
        const accessTokenJti = (0, uuid_1.v4)();
        const refreshTokenJti = (0, uuid_1.v4)();
        if (tokenVersion === null) {
            tokenVersion = 0;
            await this.saveTokenVersion(tokenVersion, userId);
        }
        const accessTokenPayload = {
            userId,
            jti: accessTokenJti,
            email: existingRefreshToken.user.email,
            role: existingRefreshToken.user.role,
            version: tokenVersion
        };
        const refreshTokenPayload = {
            userId,
            jti: refreshTokenJti,
            email: existingRefreshToken.user.email,
            role: existingRefreshToken.user.role
        };
        const [accessToken, newRefreshToken] = await Promise.all([
            this.signAccessToken(accessTokenPayload),
            this.signRefreshToken(refreshTokenPayload, decodedRefreshToken.exp)
        ]);
        await this.createRefreshTokenRecord(refreshTokenJti, userId, (0, utils_1.hashToken)(newRefreshToken), existingRefreshToken.expiresAt);
        await this.revokeRefreshToken(jti);
        return {
            user: this.sanitizeUser(existingRefreshToken.user),
            accessToken,
            refreshToken: newRefreshToken
        };
    }
    async logout(accessTokenPayload, refreshToken) {
        let decodedRefreshToken;
        try {
            decodedRefreshToken = await this.jwtService.verifyAsync(refreshToken, {
                secret: this.configService.get('JWT_REFRESH_SECRET'),
                ignoreExpiration: true
            });
        }
        catch (error) {
            throw new common_1.UnauthorizedException('Invalid refresh token');
        }
        await Promise.all([
            this.cleanUserRefreshToken(decodedRefreshToken.jti),
            this.blacklistAccessToken(accessTokenPayload)
        ]);
    }
    async changePassword(accessTokenPayload, changePasswordDto) {
        const user = await this.usersService.findOne(accessTokenPayload.userId);
        const isCurrentPasswordValid = await bcrypt.compare(changePasswordDto.currentPassword, user.password);
        if (!isCurrentPasswordValid) {
            throw new common_1.BadRequestException('Current password is incorrect');
        }
        if (changePasswordDto.currentPassword === changePasswordDto.newPassword) {
            throw new common_1.BadRequestException('New password must be different from the current password');
        }
        const hashedNewPassword = await this.hashPassword(changePasswordDto.newPassword);
        await this.prismaService.$transaction(async (prisma) => {
            await prisma.user.update({
                where: { id: accessTokenPayload.userId },
                data: { password: hashedNewPassword }
            });
            await this.cleanAllUserTokens(accessTokenPayload.userId, prisma);
        });
        const newTokenVersion = await this.increaseTokenVersion(accessTokenPayload.userId);
        const accessTokenJti = (0, uuid_1.v4)();
        const refreshTokenJti = (0, uuid_1.v4)();
        const newAccessTokenPayload = {
            userId: user.id,
            jti: accessTokenJti,
            email: user.email,
            role: user.role,
            version: newTokenVersion
        };
        const refreshTokenPayload = {
            userId: user.id,
            jti: refreshTokenJti,
            email: user.email,
            role: user.role
        };
        const [accessToken, refreshToken] = await Promise.all([
            this.signAccessToken(newAccessTokenPayload),
            this.signRefreshToken(refreshTokenPayload)
        ]);
        await this.createRefreshTokenRecord(refreshTokenJti, user.id, (0, utils_1.hashToken)(refreshToken));
        return { accessToken, refreshToken };
    }
    async forgotPassword(forgotPasswordDto) {
        const user = await this.usersService.findByEmail(forgotPasswordDto.email);
        const resetPasswordToken = await this.generateSecureToken();
        await this.prismaService.passwordResetToken.upsert({
            where: { userId: user.id },
            create: {
                userId: user.id,
                token: resetPasswordToken
            },
            update: {
                token: resetPasswordToken
            }
        });
        await this.emailProducer.sendPasswordResetEmail(user.email, resetPasswordToken);
    }
    async resetPassword(resetPasswordDto) {
        const tokenRecord = await this.prismaService.passwordResetToken.findFirst({
            where: { token: resetPasswordDto.resetToken },
            include: { user: true }
        });
        if (!tokenRecord) {
            throw new common_1.BadRequestException('Invalid password reset token');
        }
        const hashedNewPassword = await this.hashPassword(resetPasswordDto.newPassword);
        await this.prismaService.$transaction(async (prisma) => {
            await prisma.user.update({
                where: { id: tokenRecord.userId },
                data: { password: hashedNewPassword }
            });
            await prisma.passwordResetToken.delete({
                where: { userId: tokenRecord.userId }
            });
            await this.cleanAllUserTokens(tokenRecord.userId, prisma);
        });
        await this.increaseTokenVersion(tokenRecord.userId);
    }
    async hashPassword(password, saltRounds = 10) {
        return bcrypt.hash(password, saltRounds);
    }
    signAccessToken(payload) {
        return this.jwtService.signAsync(payload, {
            secret: this.configService.get('JWT_ACCESS_SECRET'),
            expiresIn: this.configService.get('JWT_ACCESS_EXPIRATION')
        });
    }
    signRefreshToken(payload, expiresAt) {
        if (expiresAt) {
            return this.jwtService.signAsync({ ...payload, exp: expiresAt }, {
                secret: this.configService.get('JWT_REFRESH_SECRET')
            });
        }
        return this.jwtService.signAsync(payload, {
            secret: this.configService.get('JWT_REFRESH_SECRET'),
            expiresIn: this.configService.get('JWT_REFRESH_EXPIRATION')
        });
    }
    createRefreshTokenRecord(jti, userId, hashedToken, expiresAt) {
        if (expiresAt) {
            return this.prismaService.refreshToken.create({
                data: {
                    id: jti,
                    userId,
                    hashedToken,
                    expiresAt
                }
            });
        }
        const standardRTExpiration = new Date();
        const refreshTokenTTL = (0, ms_1.default)(this.configService.get('JWT_REFRESH_EXPIRATION'));
        standardRTExpiration.setTime(standardRTExpiration.getTime() + Number(refreshTokenTTL));
        return this.prismaService.refreshToken.create({
            data: {
                id: jti,
                userId,
                hashedToken,
                expiresAt: standardRTExpiration
            }
        });
    }
    revokeRefreshToken(jti) {
        return this.prismaService.refreshToken.update({
            where: { id: jti, isRevoked: false },
            data: { isRevoked: true }
        });
    }
    cleanUserRefreshToken(jti) {
        return this.prismaService.refreshToken.delete({
            where: { id: jti }
        });
    }
    cleanAllUserTokens(userId, tx) {
        if (tx) {
            return tx.refreshToken.deleteMany({
                where: { userId }
            });
        }
        return this.prismaService.refreshToken.deleteMany({
            where: { userId }
        });
    }
    sanitizeUser(user) {
        const { password, ...result } = user;
        return result;
    }
    async checkLoginAttempts(email, ipAddress) {
        const key = `${this.LOGIN_ATTEMPTS_PREFIX}${email}:${ipAddress}`;
        const attempts = await this.redis.get(key);
        return attempts ? parseInt(attempts, 10) : 0;
    }
    async recordFailedLogin(email, ipAddress) {
        const key = `${this.LOGIN_ATTEMPTS_PREFIX}${email}:${ipAddress}`;
        const attempts = await this.redis.incr(key);
        if (attempts === 1) {
            await this.redis.expire(key, this.configService.get('LOGIN_ATTEMPTS_WINDOW_SECONDS'));
        }
    }
    async clearLoginAttempts(email, ipAddress) {
        const key = `${this.LOGIN_ATTEMPTS_PREFIX}${email}:${ipAddress}`;
        await this.redis.del(key);
    }
    async saveTokenVersion(tokenVersion, userId) {
        await this.redis.set(`user:${userId}:access_token_version`, tokenVersion);
        await this.redis.expire(`user:${userId}:access_token_version`, (+(0, ms_1.default)(this.configService.get('JWT_ACCESS_EXPIRATION')) + 5 * 60 * 1000) /
            1000);
    }
    async increaseTokenVersion(userId) {
        const newTokenVersion = await this.redis.incr(`user:${userId}:access_token_version`);
        await this.redis.expire(`user:${userId}:access_token_version`, (+(0, ms_1.default)(this.configService.get('JWT_ACCESS_EXPIRATION')) + 5 * 60 * 1000) /
            1000);
        return newTokenVersion;
    }
    getTokenVersion(userId) {
        return this.redis.get(`user:${userId}:access_token_version`);
    }
    generateSecureToken(bytes = 32) {
        return new Promise((resolve, reject) => {
            crypto_1.default.randomBytes(bytes, (err, buffer) => {
                if (err) {
                    return reject(err);
                }
                resolve(buffer.toString('hex'));
            });
        });
    }
    async blacklistAccessToken(accessTokenPayload) {
        const now = Math.floor(Date.now() / 1000);
        const { exp, jti, userId } = accessTokenPayload;
        const ttl = exp - now;
        if (ttl > 0 && jti) {
            await this.redis.setex(`${this.ACCESS_TOKEN_BLACKLIST_PREFIX}${jti}`, ttl, userId);
        }
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)()),
    __param(1, (0, common_1.Inject)()),
    __param(2, (0, common_1.Inject)()),
    __param(3, (0, common_1.Inject)()),
    __param(4, (0, common_1.Inject)(redis_module_1.REDIS_CLIENT)),
    __param(4, (0, common_1.Inject)()),
    __param(5, (0, common_1.Inject)()),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        jwt_1.JwtService,
        config_1.ConfigService,
        users_service_1.UsersService,
        ioredis_1.default,
        email_producer_1.EmailProducer])
], AuthService);
//# sourceMappingURL=auth.service.js.map