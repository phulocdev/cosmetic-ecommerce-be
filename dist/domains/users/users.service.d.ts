import { PrismaService } from 'database/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { OffsetPaginatedResponseDto } from 'core';
export declare class UsersService {
    private prismaService;
    private readonly logger;
    constructor(prismaService: PrismaService);
    create(createUserDto: CreateUserDto): string;
    findAll(): Promise<OffsetPaginatedResponseDto<{
        createdAt: Date;
        id: string;
        email: string;
        password: string;
        code: string | null;
        fullName: string | null;
        phoneNumber: string | null;
        isActive: boolean | null;
        avatarUrl: string | null;
        role: import(".prisma/client").$Enums.UserRole | null;
        updatedAt: Date | null;
    }>>;
    findOne(id: string): Promise<{
        createdAt: Date;
        id: string;
        email: string;
        password: string;
        code: string | null;
        fullName: string | null;
        phoneNumber: string | null;
        isActive: boolean | null;
        avatarUrl: string | null;
        role: import(".prisma/client").$Enums.UserRole | null;
        updatedAt: Date | null;
    }>;
    findByEmail(email: string): Promise<{
        createdAt: Date;
        id: string;
        email: string;
        password: string;
        code: string | null;
        fullName: string | null;
        phoneNumber: string | null;
        isActive: boolean | null;
        avatarUrl: string | null;
        role: import(".prisma/client").$Enums.UserRole | null;
        updatedAt: Date | null;
    }>;
    update(id: string, updateUserDto: UpdateUserDto): string;
    remove(id: string): string;
}
