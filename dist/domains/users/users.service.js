"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var UsersService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../database/prisma/prisma.service");
const core_1 = require("../../core");
let UsersService = UsersService_1 = class UsersService {
    prismaService;
    logger = new common_1.Logger(UsersService_1.name);
    constructor(prismaService) {
        this.prismaService = prismaService;
    }
    create(createUserDto) {
        return 'This action adds a new user';
    }
    async findAll() {
        const users = await this.prismaService.user.findMany();
        return new core_1.OffsetPaginatedResponseDto({
            items: users,
            limit: users.length,
            page: 1,
            total: users.length
        });
    }
    async findOne(id) {
        const foundUser = await this.prismaService.user.findUnique({
            where: { id }
        });
        if (!foundUser) {
            throw new core_1.EntityNotFoundException('User', id);
        }
        return foundUser;
    }
    async findByEmail(email) {
        const foundUser = await this.prismaService.user.findUnique({
            where: { email }
        });
        if (!foundUser) {
            throw new core_1.EntityNotFoundException('User', email);
        }
        return foundUser;
    }
    update(id, updateUserDto) {
        return `This action updates a #${id} user`;
    }
    remove(id) {
        return `This action removes a #${id} user`;
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = UsersService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], UsersService);
//# sourceMappingURL=users.service.js.map