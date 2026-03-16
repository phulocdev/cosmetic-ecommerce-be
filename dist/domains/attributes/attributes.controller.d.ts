import { OffsetPaginatedResponseDto } from 'core';
import { FindAllAttributeDto } from 'domains/attributes/dto/find-all-attribute.dto';
import { Attribute } from 'domains/attributes/entities/attribute.entity';
import { AttributesService } from './attributes.service';
import { CreateAttributeDto } from './dto/create-attribute.dto';
import { UpdateAttributeDto } from './dto/update-attribute.dto';
export declare class AttributesController {
    private readonly attributesService;
    constructor(attributesService: AttributesService);
    create(createAttributeDto: CreateAttributeDto): Promise<{
        values: {
            createdAt: Date;
            id: string;
            updatedAt: Date;
            value: string;
            deletedAt: Date | null;
            isDeleted: boolean;
            attributeId: string;
        }[];
    } & {
        createdAt: Date;
        name: string;
        slug: string;
        id: string;
        updatedAt: Date;
        deletedAt: Date | null;
        isDeleted: boolean;
        displayName: string | null;
        isGlobalFilter: boolean;
    }>;
    findAll(query: FindAllAttributeDto): Promise<OffsetPaginatedResponseDto<Attribute>>;
    findOne(id: string): import(".prisma/client").Prisma.Prisma__AttributeClient<{
        values: {
            id: string;
            value: string;
            attributeId: string;
        }[];
    } & {
        createdAt: Date;
        name: string;
        slug: string;
        id: string;
        updatedAt: Date;
        deletedAt: Date | null;
        isDeleted: boolean;
        displayName: string | null;
        isGlobalFilter: boolean;
    }, null, import("@prisma/client/runtime/client").DefaultArgs, import(".prisma/client").Prisma.PrismaClientOptions>;
    update(id: string, updateAttributeDto: UpdateAttributeDto): Promise<{
        values: {
            id: string;
            value: string;
            attributeId: string;
        }[];
    } & {
        createdAt: Date;
        name: string;
        slug: string;
        id: string;
        updatedAt: Date;
        deletedAt: Date | null;
        isDeleted: boolean;
        displayName: string | null;
        isGlobalFilter: boolean;
    }>;
    softDelete(id: string): Promise<Attribute>;
    remove(id: string): import(".prisma/client").Prisma.Prisma__AttributeClient<{
        createdAt: Date;
        name: string;
        slug: string;
        id: string;
        updatedAt: Date;
        deletedAt: Date | null;
        isDeleted: boolean;
        displayName: string | null;
        isGlobalFilter: boolean;
    }, never, import("@prisma/client/runtime/client").DefaultArgs, import(".prisma/client").Prisma.PrismaClientOptions>;
}
