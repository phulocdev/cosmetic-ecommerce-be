import { UserRole } from '@prisma/client';
import { BaseEntity } from 'core';
export declare class UserEntity extends BaseEntity {
    email: string;
    password: string;
    code?: string | null;
    fullName: string;
    phoneNumber: string;
    isActive: boolean;
    avatarUrl: string;
    role: UserRole;
    constructor(partial: Partial<UserEntity & BaseEntity>);
}
