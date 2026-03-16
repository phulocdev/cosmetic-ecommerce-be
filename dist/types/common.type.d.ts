import { UserRole } from 'enums';
export interface ApiResponse<T = any> {
    success: boolean;
    statusCode: number;
    message: string;
    data: T;
    meta?: Record<string, any>;
    timestamp: string;
}
export interface ErrorResponse {
    success: false;
    statusCode: number;
    message: string;
    error: string;
    path: string;
    details?: any;
    timestamp: string;
    requestId?: string;
}
export interface JwtPayload {
    userId: string;
    email: string;
    role: UserRole;
    jti: string;
    iat?: number;
    exp?: number;
    iss?: string;
    aud?: string;
}
export interface AccessTokenPayload extends JwtPayload {
    version: number;
}
export interface RefreshTokenPayload extends JwtPayload {
}
export interface BaseEntity {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date | null;
    isDeleted?: boolean;
}
export interface User extends BaseEntity {
    email: string;
    password: string;
    code: string;
    fullName: string;
    phoneNumber: string;
    isActive: boolean;
    avatarUrl: string;
    role: string;
}
export declare class ProductCursorData {
    id: string;
    createdAt?: Date;
    updatedAt?: Date;
    basePrice?: number;
    views?: number;
    name?: string;
}
export declare class CategoryCursorData {
    id: string;
    createdAt?: Date;
    name?: string;
    depth?: number;
}
export interface TransactionManager {
    runInTransaction<T>(work: () => Promise<T>): Promise<T>;
}
