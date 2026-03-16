import { PaginationQueryDto } from 'core';
import { UserRole } from 'enums';
export declare class UserQueryDto extends PaginationQueryDto {
    search?: string;
    email?: string;
    code?: string;
    fullName?: string;
    phoneNumber?: string;
    isActive?: boolean;
    role?: UserRole;
}
