import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'database/prisma/prisma.service';
import { ChangePasswordDto, ForgotPasswordDto, LoginDto, RegisterDto, ResetPasswordDto } from 'domains/auth/dtos/auth.dto';
import { EmailProducer } from 'domains/email/email.producer';
import { UsersService } from 'domains/users/users.service';
import Redis from 'ioredis';
import { AccessTokenPayload } from 'types';
export declare class AuthService {
    private prismaService;
    private jwtService;
    private configService;
    private usersService;
    private readonly redis;
    private emailProducer;
    private readonly LOGIN_ATTEMPTS_PREFIX;
    private readonly ACCESS_TOKEN_BLACKLIST_PREFIX;
    constructor(prismaService: PrismaService, jwtService: JwtService, configService: ConfigService, usersService: UsersService, redis: Redis, emailProducer: EmailProducer);
    register(registerDto: RegisterDto): Promise<{
        user: {
            email: string;
            code: string;
            fullName: string;
            phoneNumber: string;
            isActive: boolean;
            avatarUrl: string;
            role: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            deletedAt?: Date | null;
            isDeleted?: boolean;
        };
        accessToken: string;
        refreshToken: string;
    }>;
    login(loginDto: LoginDto, ipAddress?: string): Promise<{
        user: {
            email: string;
            code: string;
            fullName: string;
            phoneNumber: string;
            isActive: boolean;
            avatarUrl: string;
            role: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            deletedAt?: Date | null;
            isDeleted?: boolean;
        };
        accessToken: string;
        refreshToken: string;
    }>;
    refreshTokens(refreshToken: string): Promise<{
        user: {
            email: string;
            code: string;
            fullName: string;
            phoneNumber: string;
            isActive: boolean;
            avatarUrl: string;
            role: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            deletedAt?: Date | null;
            isDeleted?: boolean;
        };
        accessToken: string;
        refreshToken: string;
    }>;
    logout(accessTokenPayload: AccessTokenPayload, refreshToken: string): Promise<void>;
    changePassword(accessTokenPayload: AccessTokenPayload, changePasswordDto: ChangePasswordDto): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
    forgotPassword(forgotPasswordDto: ForgotPasswordDto): Promise<void>;
    resetPassword(resetPasswordDto: ResetPasswordDto): Promise<void>;
    private hashPassword;
    private signAccessToken;
    private signRefreshToken;
    private createRefreshTokenRecord;
    private revokeRefreshToken;
    private cleanUserRefreshToken;
    private cleanAllUserTokens;
    private sanitizeUser;
    private checkLoginAttempts;
    private recordFailedLogin;
    private clearLoginAttempts;
    private saveTokenVersion;
    private increaseTokenVersion;
    private getTokenVersion;
    private generateSecureToken;
    private blacklistAccessToken;
}
