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
exports.CountryOfOriginService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../database/prisma/prisma.service");
const core_1 = require("../../core");
let CountryOfOriginService = class CountryOfOriginService {
    prismaService;
    constructor(prismaService) {
        this.prismaService = prismaService;
    }
    async create(createCountryOfOriginDto) {
        const existing = await this.prismaService.countryOfOrigin.findFirst({
            where: { name: createCountryOfOriginDto.name }
        });
        if (existing) {
            throw new common_1.BadRequestException('A country of origin with the same name already exists');
        }
        return this.prismaService.countryOfOrigin.create({
            data: { name: createCountryOfOriginDto.name }
        });
    }
    async findAll(query) {
        const page = query.page || 1;
        const limit = query.getAll ? undefined : query.limit || 10;
        const skip = query.getAll ? undefined : (page - 1) * limit;
        const [countries, total] = await Promise.all([
            this.prismaService.countryOfOrigin.findMany({ skip, take: limit }),
            this.prismaService.countryOfOrigin.count()
        ]);
        return new core_1.OffsetPaginatedResponseDto({ items: countries, limit, page, total });
    }
    async findOne(id) {
        const country = await this.prismaService.countryOfOrigin.findUnique({ where: { id } });
        if (!country)
            throw new common_1.BadRequestException('Country of origin not found');
        return country;
    }
    async update(id, updateCountryOfOriginDto) {
        const existing = await this.prismaService.countryOfOrigin.findUnique({ where: { id } });
        if (!existing)
            throw new common_1.BadRequestException('Country of origin not found');
        if (updateCountryOfOriginDto.name && updateCountryOfOriginDto.name !== existing.name) {
            const conflict = await this.prismaService.countryOfOrigin.findFirst({
                where: { name: updateCountryOfOriginDto.name, id: { not: id } }
            });
            if (conflict)
                throw new common_1.BadRequestException('A country of origin with the same name already exists');
        }
        return this.prismaService.countryOfOrigin.update({
            where: { id },
            data: {
                ...(updateCountryOfOriginDto.name !== undefined && { name: updateCountryOfOriginDto.name })
            }
        });
    }
    async softDelete(id) {
        const existing = await this.prismaService.countryOfOrigin.findUnique({ where: { id } });
        if (!existing)
            throw new common_1.BadRequestException('Country of origin not found');
        if (existing.isDeleted) {
            throw new common_1.BadRequestException('Country of origin is already deleted');
        }
        return this.prismaService.countryOfOrigin.update({
            where: { id },
            data: { isDeleted: true, deletedAt: new Date() }
        });
    }
    async remove(id) {
        const existing = await this.prismaService.countryOfOrigin.findUnique({ where: { id } });
        if (!existing)
            throw new common_1.BadRequestException('Country of origin not found');
        return this.prismaService.countryOfOrigin.delete({ where: { id } });
    }
};
exports.CountryOfOriginService = CountryOfOriginService;
exports.CountryOfOriginService = CountryOfOriginService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], CountryOfOriginService);
//# sourceMappingURL=country-of-origin.service.js.map