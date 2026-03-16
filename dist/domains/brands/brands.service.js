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
Object.defineProperty(exports, "__esModule", { value: true });
exports.BrandsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../database/prisma/prisma.service");
const core_1 = require("../../core");
let BrandsService = class BrandsService {
    prismaService;
    constructor(prismaService) {
        this.prismaService = prismaService;
    }
    async create(createBrandDto) {
        const existing = await this.prismaService.brand.findFirst({
            where: { name: createBrandDto.name }
        });
        if (existing) {
            throw new common_1.BadRequestException('A brand with the same name already exists');
        }
        return this.prismaService.brand.create({
            data: {
                name: createBrandDto.name,
                imageUrl: createBrandDto.imageUrl ?? ''
            }
        });
    }
    async findAll(query) {
        const page = query.page || 1;
        const limit = query.getAll ? undefined : query.limit || 10;
        const skip = query.getAll ? undefined : (page - 1) * limit;
        const [brands, total] = await Promise.all([
            this.prismaService.brand.findMany({ skip, take: limit }),
            this.prismaService.brand.count()
        ]);
        return new core_1.OffsetPaginatedResponseDto({ items: brands, limit, page, total });
    }
    async findOne(id) {
        const brand = await this.prismaService.brand.findUnique({ where: { id } });
        if (!brand)
            throw new common_1.BadRequestException('Brand not found');
        return brand;
    }
    async update(id, updateBrandDto) {
        const existing = await this.prismaService.brand.findUnique({ where: { id } });
        if (!existing)
            throw new common_1.BadRequestException('Brand not found');
        if (updateBrandDto.name && updateBrandDto.name !== existing.name) {
            const conflict = await this.prismaService.brand.findFirst({
                where: { name: updateBrandDto.name, id: { not: id } }
            });
            if (conflict)
                throw new common_1.BadRequestException('A brand with the same name already exists');
        }
        return this.prismaService.brand.update({
            where: { id },
            data: {
                name: updateBrandDto.name,
                imageUrl: updateBrandDto.imageUrl
            }
        });
    }
    async softDelete(id) {
        const existing = await this.prismaService.brand.findUnique({ where: { id } });
        if (!existing) {
            throw new common_1.BadRequestException('Brand not found');
        }
        if (existing.deletedAt) {
            throw new common_1.BadRequestException('Brand is already soft deleted');
        }
        return this.prismaService.brand.update({
            where: { id },
            data: { isDeleted: true, deletedAt: new Date() }
        });
    }
    async remove(id) {
        const existing = await this.prismaService.brand.findUnique({ where: { id } });
        if (!existing)
            throw new common_1.BadRequestException('Brand not found');
        return this.prismaService.brand.delete({ where: { id } });
    }
};
exports.BrandsService = BrandsService;
exports.BrandsService = BrandsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], BrandsService);
//# sourceMappingURL=brands.service.js.map