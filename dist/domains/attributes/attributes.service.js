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
exports.AttributesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../database/prisma/prisma.service");
const core_1 = require("../../core");
const business_util_1 = require("../../utils/business.util");
let AttributesService = class AttributesService {
    prismaService;
    constructor(prismaService) {
        this.prismaService = prismaService;
    }
    async create(createAttributeDto) {
        const existingAttribute = await this.prismaService.attribute.findFirst({
            where: {
                OR: [
                    { name: createAttributeDto.name },
                    { slug: createAttributeDto.slug || (0, business_util_1.slugifyString)(createAttributeDto.name) }
                ]
            }
        });
        if (existingAttribute) {
            throw new common_1.BadRequestException('An attribute with the same name or slug already exists');
        }
        return this.prismaService.attribute.create({
            data: {
                name: createAttributeDto.name,
                slug: createAttributeDto.slug || (0, business_util_1.slugifyString)(createAttributeDto.name),
                isGlobalFilter: createAttributeDto.isGlobalFilter ?? false,
                values: {
                    create: createAttributeDto.values.map((value) => ({ value }))
                }
            },
            include: {
                values: true
            }
        });
    }
    async findAll(query) {
        const page = query.page || 1;
        const limit = query.getAll ? undefined : query.limit || 10;
        const skip = query.getAll ? undefined : (page - 1) * limit;
        const { categoryId } = query;
        const whereClause = {};
        if (categoryId) {
            whereClause.categoryAttributes = {
                some: {
                    categoryId
                }
            };
        }
        const [attributes, total] = await Promise.all([
            this.prismaService.attribute.findMany({
                skip,
                where: whereClause,
                take: limit,
                include: {
                    values: {
                        select: {
                            id: true,
                            attributeId: true,
                            value: true
                        }
                    }
                }
            }),
            this.prismaService.attribute.count()
        ]);
        return new core_1.OffsetPaginatedResponseDto({
            items: attributes,
            limit,
            page,
            total
        });
    }
    findOne(id) {
        return this.prismaService.attribute.findUnique({
            where: { id },
            include: {
                values: {
                    select: {
                        id: true,
                        attributeId: true,
                        value: true
                    }
                }
            }
        });
    }
    async update(id, updateAttributeDto) {
        const existingAttribute = await this.prismaService.attribute.findUnique({
            where: { id },
            include: { values: true }
        });
        if (!existingAttribute) {
            throw new common_1.BadRequestException('Attribute not found');
        }
        if (updateAttributeDto.name || updateAttributeDto.slug) {
            const conflictingAttribute = await this.prismaService.attribute.findFirst({
                where: {
                    AND: [
                        { id: { not: id } },
                        {
                            OR: [
                                updateAttributeDto.name ? { name: updateAttributeDto.name } : {},
                                updateAttributeDto.slug
                                    ? {
                                        slug: updateAttributeDto.slug ||
                                            (0, business_util_1.slugifyString)(updateAttributeDto.name || existingAttribute.name)
                                    }
                                    : {}
                            ].filter((obj) => Object.keys(obj).length > 0)
                        }
                    ]
                }
            });
            if (conflictingAttribute) {
                throw new common_1.BadRequestException('An attribute with the same name or slug already exists');
            }
        }
        const updateData = {};
        if (updateAttributeDto.name !== undefined) {
            updateData.name = updateAttributeDto.name;
        }
        if (updateAttributeDto.slug !== undefined) {
            updateData.slug =
                updateAttributeDto.slug || (0, business_util_1.slugifyString)(updateAttributeDto.name || existingAttribute.name);
        }
        if (updateAttributeDto.isGlobalFilter !== undefined) {
            updateData.isGlobalFilter = updateAttributeDto.isGlobalFilter;
        }
        if (updateAttributeDto.values !== undefined) {
            await this.prismaService.attributeValue.deleteMany({
                where: { attributeId: id }
            });
            updateData.values = {
                create: updateAttributeDto.values.map((value) => ({ value }))
            };
        }
        return this.prismaService.attribute.update({
            where: { id },
            data: updateData,
            include: {
                values: {
                    select: {
                        id: true,
                        attributeId: true,
                        value: true
                    }
                }
            }
        });
    }
    async softDelete(id) {
        const existingAttribute = await this.prismaService.attribute.findUnique({
            where: { id }
        });
        if (!existingAttribute) {
            throw new common_1.BadRequestException('Attribute not found');
        }
        if (!existingAttribute.isDeleted) {
            throw new common_1.BadRequestException('Attribute is not marked as deleted');
        }
        return this.prismaService.attribute.update({
            where: { id },
            data: { isDeleted: false, deletedAt: new Date() }
        });
    }
    remove(id) {
        return this.prismaService.attribute.delete({
            where: { id }
        });
    }
};
exports.AttributesService = AttributesService;
exports.AttributesService = AttributesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AttributesService);
//# sourceMappingURL=attributes.service.js.map