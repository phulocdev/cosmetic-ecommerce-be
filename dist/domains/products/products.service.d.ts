import { Prisma } from '@prisma/client';
import { PrismaService } from 'database/prisma/prisma.service';
import { CreateProductDto } from 'domains/products/dto';
import { CursorPaginatedProductListResponse, OffsetPaginatedProductListResponse, ProductQueryDto } from 'domains/products/dto/find-all-product.dto';
import { UpdateProductDto } from 'domains/products/dto/update-product.dto';
import { FindAllProductService } from 'domains/products/find-all-product.service';
import { UpdateProductService } from 'domains/products/update-product.service';
import { ValidateDtoService } from 'domains/products/validate-dto.service';
import { UtcDateRange } from 'utils';
export declare class ProductsService {
    private readonly prismaService;
    private readonly validateDtoService;
    private readonly updateProductService;
    private readonly findAllProductService;
    constructor(prismaService: PrismaService, validateDtoService: ValidateDtoService, updateProductService: UpdateProductService, findAllProductService: FindAllProductService);
    create(createProductDto: CreateProductDto): Promise<{
        brand: {
            createdAt: Date;
            name: string;
            id: string;
            updatedAt: Date | null;
            deletedAt: Date | null;
            isDeleted: boolean;
            imageUrl: string;
        };
        countryOfOrigin: {
            createdAt: Date;
            name: string;
            id: string;
            updatedAt: Date | null;
            deletedAt: Date | null;
            isDeleted: boolean;
        };
        categories: ({
            category: {
                createdAt: Date;
                name: string;
                slug: string;
                depth: number;
                description: string | null;
                id: string;
                isActive: boolean;
                updatedAt: Date;
                path: string;
                deletedAt: Date | null;
                isDeleted: boolean;
                parentId: string | null;
                metaTitle: string | null;
                metaDescription: string | null;
            };
        } & {
            createdAt: Date;
            categoryId: string;
            isPrimary: boolean;
            productId: string;
        })[];
        images: {
            createdAt: Date;
            id: string;
            url: string;
            deletedAt: Date | null;
            isDeleted: boolean;
            displayOrder: number | null;
            altText: string | null;
            productId: string;
        }[];
        variants: ({
            attributeValues: ({
                attributeValue: {
                    attribute: {
                        createdAt: Date;
                        name: string;
                        slug: string;
                        id: string;
                        updatedAt: Date;
                        deletedAt: Date | null;
                        isDeleted: boolean;
                        displayName: string | null;
                        isGlobalFilter: boolean;
                    };
                } & {
                    createdAt: Date;
                    id: string;
                    updatedAt: Date;
                    value: string;
                    deletedAt: Date | null;
                    isDeleted: boolean;
                    attributeId: string;
                };
            } & {
                id: string;
                deletedAt: Date | null;
                isDeleted: boolean;
                attributeValueId: string;
                variantId: string;
            })[];
        } & {
            createdAt: Date;
            name: string;
            id: string;
            isActive: boolean;
            updatedAt: Date | null;
            sku: string;
            barcode: string | null;
            costPrice: Prisma.Decimal;
            sellingPrice: Prisma.Decimal;
            stockOnHand: number | null;
            imageUrl: string;
            lowStockThreshold: number;
            maxStockThreshold: number;
            productId: string;
        })[];
    } & {
        createdAt: Date;
        name: string;
        basePrice: Prisma.Decimal;
        views: number | null;
        slug: string;
        description: string | null;
        id: string;
        code: string;
        updatedAt: Date | null;
        status: import(".prisma/client").$Enums.ProductStatus | null;
        brandId: string;
        countryOriginId: string;
    }>;
    findById(id: string): Promise<{
        brand: {
            createdAt: Date;
            name: string;
            id: string;
            updatedAt: Date | null;
            deletedAt: Date | null;
            isDeleted: boolean;
            imageUrl: string;
        };
        countryOfOrigin: {
            createdAt: Date;
            name: string;
            id: string;
            updatedAt: Date | null;
            deletedAt: Date | null;
            isDeleted: boolean;
        };
        categories: ({
            category: {
                createdAt: Date;
                name: string;
                slug: string;
                depth: number;
                description: string | null;
                id: string;
                isActive: boolean;
                updatedAt: Date;
                path: string;
                deletedAt: Date | null;
                isDeleted: boolean;
                parentId: string | null;
                metaTitle: string | null;
                metaDescription: string | null;
            };
        } & {
            createdAt: Date;
            categoryId: string;
            isPrimary: boolean;
            productId: string;
        })[];
        images: {
            createdAt: Date;
            id: string;
            url: string;
            deletedAt: Date | null;
            isDeleted: boolean;
            displayOrder: number | null;
            altText: string | null;
            productId: string;
        }[];
        variants: ({
            attributeValues: ({
                attributeValue: {
                    attribute: {
                        createdAt: Date;
                        name: string;
                        slug: string;
                        id: string;
                        updatedAt: Date;
                        deletedAt: Date | null;
                        isDeleted: boolean;
                        displayName: string | null;
                        isGlobalFilter: boolean;
                    };
                } & {
                    createdAt: Date;
                    id: string;
                    updatedAt: Date;
                    value: string;
                    deletedAt: Date | null;
                    isDeleted: boolean;
                    attributeId: string;
                };
            } & {
                id: string;
                deletedAt: Date | null;
                isDeleted: boolean;
                attributeValueId: string;
                variantId: string;
            })[];
        } & {
            createdAt: Date;
            name: string;
            id: string;
            isActive: boolean;
            updatedAt: Date | null;
            sku: string;
            barcode: string | null;
            costPrice: Prisma.Decimal;
            sellingPrice: Prisma.Decimal;
            stockOnHand: number | null;
            imageUrl: string;
            lowStockThreshold: number;
            maxStockThreshold: number;
            productId: string;
        })[];
    } & {
        createdAt: Date;
        name: string;
        basePrice: Prisma.Decimal;
        views: number | null;
        slug: string;
        description: string | null;
        id: string;
        code: string;
        updatedAt: Date | null;
        status: import(".prisma/client").$Enums.ProductStatus | null;
        brandId: string;
        countryOriginId: string;
    }>;
    findBySlug(slug: string): Promise<{
        brand: {
            createdAt: Date;
            name: string;
            id: string;
            updatedAt: Date | null;
            deletedAt: Date | null;
            isDeleted: boolean;
            imageUrl: string;
        };
        countryOfOrigin: {
            createdAt: Date;
            name: string;
            id: string;
            updatedAt: Date | null;
            deletedAt: Date | null;
            isDeleted: boolean;
        };
        categories: ({
            category: {
                createdAt: Date;
                name: string;
                slug: string;
                depth: number;
                description: string | null;
                id: string;
                isActive: boolean;
                updatedAt: Date;
                path: string;
                deletedAt: Date | null;
                isDeleted: boolean;
                parentId: string | null;
                metaTitle: string | null;
                metaDescription: string | null;
            };
        } & {
            createdAt: Date;
            categoryId: string;
            isPrimary: boolean;
            productId: string;
        })[];
        images: {
            createdAt: Date;
            id: string;
            url: string;
            deletedAt: Date | null;
            isDeleted: boolean;
            displayOrder: number | null;
            altText: string | null;
            productId: string;
        }[];
        variants: ({
            attributeValues: ({
                attributeValue: {
                    attribute: {
                        createdAt: Date;
                        name: string;
                        slug: string;
                        id: string;
                        updatedAt: Date;
                        deletedAt: Date | null;
                        isDeleted: boolean;
                        displayName: string | null;
                        isGlobalFilter: boolean;
                    };
                } & {
                    createdAt: Date;
                    id: string;
                    updatedAt: Date;
                    value: string;
                    deletedAt: Date | null;
                    isDeleted: boolean;
                    attributeId: string;
                };
            } & {
                id: string;
                deletedAt: Date | null;
                isDeleted: boolean;
                attributeValueId: string;
                variantId: string;
            })[];
        } & {
            createdAt: Date;
            name: string;
            id: string;
            isActive: boolean;
            updatedAt: Date | null;
            sku: string;
            barcode: string | null;
            costPrice: Prisma.Decimal;
            sellingPrice: Prisma.Decimal;
            stockOnHand: number | null;
            imageUrl: string;
            lowStockThreshold: number;
            maxStockThreshold: number;
            productId: string;
        })[];
    } & {
        createdAt: Date;
        name: string;
        basePrice: Prisma.Decimal;
        views: number | null;
        slug: string;
        description: string | null;
        id: string;
        code: string;
        updatedAt: Date | null;
        status: import(".prisma/client").$Enums.ProductStatus | null;
        brandId: string;
        countryOriginId: string;
    }>;
    update(id: string, updateProductDto: UpdateProductDto): Promise<{
        brand: {
            createdAt: Date;
            name: string;
            id: string;
            updatedAt: Date | null;
            deletedAt: Date | null;
            isDeleted: boolean;
            imageUrl: string;
        };
        countryOfOrigin: {
            createdAt: Date;
            name: string;
            id: string;
            updatedAt: Date | null;
            deletedAt: Date | null;
            isDeleted: boolean;
        };
        categories: ({
            category: {
                createdAt: Date;
                name: string;
                slug: string;
                depth: number;
                description: string | null;
                id: string;
                isActive: boolean;
                updatedAt: Date;
                path: string;
                deletedAt: Date | null;
                isDeleted: boolean;
                parentId: string | null;
                metaTitle: string | null;
                metaDescription: string | null;
            };
        } & {
            createdAt: Date;
            categoryId: string;
            isPrimary: boolean;
            productId: string;
        })[];
        images: {
            createdAt: Date;
            id: string;
            url: string;
            deletedAt: Date | null;
            isDeleted: boolean;
            displayOrder: number | null;
            altText: string | null;
            productId: string;
        }[];
        variants: ({
            attributeValues: ({
                attributeValue: {
                    attribute: {
                        createdAt: Date;
                        name: string;
                        slug: string;
                        id: string;
                        updatedAt: Date;
                        deletedAt: Date | null;
                        isDeleted: boolean;
                        displayName: string | null;
                        isGlobalFilter: boolean;
                    };
                } & {
                    createdAt: Date;
                    id: string;
                    updatedAt: Date;
                    value: string;
                    deletedAt: Date | null;
                    isDeleted: boolean;
                    attributeId: string;
                };
            } & {
                id: string;
                deletedAt: Date | null;
                isDeleted: boolean;
                attributeValueId: string;
                variantId: string;
            })[];
        } & {
            createdAt: Date;
            name: string;
            id: string;
            isActive: boolean;
            updatedAt: Date | null;
            sku: string;
            barcode: string | null;
            costPrice: Prisma.Decimal;
            sellingPrice: Prisma.Decimal;
            stockOnHand: number | null;
            imageUrl: string;
            lowStockThreshold: number;
            maxStockThreshold: number;
            productId: string;
        })[];
    } & {
        createdAt: Date;
        name: string;
        basePrice: Prisma.Decimal;
        views: number | null;
        slug: string;
        description: string | null;
        id: string;
        code: string;
        updatedAt: Date | null;
        status: import(".prisma/client").$Enums.ProductStatus | null;
        brandId: string;
        countryOriginId: string;
    }>;
    findAll(query: ProductQueryDto, utcDateRange?: UtcDateRange): Promise<OffsetPaginatedProductListResponse | CursorPaginatedProductListResponse>;
}
