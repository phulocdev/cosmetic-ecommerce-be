import { Prisma } from '@prisma/client';
import { PrismaService } from 'database/prisma/prisma.service';
import { UpdateProductCategoryDto, UpdateProductImageDto, UpdateProductVariantDto, UpdateVariantAttributeValueDto } from 'domains/products/dto';
export declare class UpdateProductService {
    private readonly prismaService;
    constructor(prismaService: PrismaService);
    updateProductCategories(tx: Prisma.TransactionClient, productId: string, categories: UpdateProductCategoryDto[]): Promise<void>;
    updateProductImages(tx: Prisma.TransactionClient, productId: string, images: UpdateProductImageDto[]): Promise<void>;
    updateProductVariants(tx: Prisma.TransactionClient, productId: string, productCode: string, variants: UpdateProductVariantDto[]): Promise<void>;
    updateVariantAttributeValues(tx: Prisma.TransactionClient, variantId: string, attributeValues: UpdateVariantAttributeValueDto[]): Promise<void>;
}
