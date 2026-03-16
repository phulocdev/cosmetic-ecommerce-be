import { UserRole, User } from '@prisma/client';
export interface AuthenticatedUser extends Partial<User> {
    id: string;
    email: string;
    role: UserRole;
}
export declare const CurrentUser: (...dataOrPipes: (keyof AuthenticatedUser | import("@nestjs/common").PipeTransform<any, any> | import("@nestjs/common").Type<import("@nestjs/common").PipeTransform<any, any>>)[]) => ParameterDecorator;
