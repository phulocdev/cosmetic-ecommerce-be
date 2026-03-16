import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    create(createUserDto: CreateUserDto): string;
    findAll(): Promise<import("../../core").OffsetPaginatedResponseDto<{
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
    update(id: string, updateUserDto: UpdateUserDto): string;
    remove(id: string): string;
}
