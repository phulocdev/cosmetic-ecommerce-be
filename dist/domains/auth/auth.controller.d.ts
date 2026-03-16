import { AuthService } from 'domains/auth/auth.service';
import { ChangePasswordDto, ForgotPasswordDto, LoginDto, RefreshTokenDto, RegisterDto, ResetPasswordDto } from 'domains/auth/dtos/auth.dto';
import { AccessTokenPayload } from 'types';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
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
    login(loginDto: LoginDto, ip: string): Promise<{
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
    refresh(refreshTokenDto: RefreshTokenDto): Promise<{
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
    logout(accessTokenPayload: AccessTokenPayload, refreshTokenDto: RefreshTokenDto): Promise<void>;
    changePassword(accessTokenPayload: AccessTokenPayload, changePasswordDto: ChangePasswordDto): Promise<void>;
    forgotPassword(forgotPasswordDto: ForgotPasswordDto): Promise<void>;
    resetPassword(resetPasswordDto: ResetPasswordDto): Promise<void>;
}
