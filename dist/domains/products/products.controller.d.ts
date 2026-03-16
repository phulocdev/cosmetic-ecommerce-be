import { ParsedDateRange } from 'core/pipes/date-range.pipe';
import { CursorPaginatedProductListResponse, OffsetPaginatedProductListResponse, ProductQueryDto } from 'domains/products/dto/find-all-product.dto';
import { ProductsService } from 'domains/products/products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
export declare class ProductsController {
    private readonly productsService;
    private readonly logger;
    constructor(productsService: ProductsService);
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
            costPrice: import("@prisma/client-runtime-utils").Decimal;
            sellingPrice: import("@prisma/client-runtime-utils").Decimal;
            stockOnHand: number | null;
            imageUrl: string;
            lowStockThreshold: number;
            maxStockThreshold: number;
            productId: string;
        })[];
    } & {
        createdAt: Date;
        name: string;
        basePrice: import("@prisma/client-runtime-utils").Decimal;
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
            costPrice: import("@prisma/client-runtime-utils").Decimal;
            sellingPrice: import("@prisma/client-runtime-utils").Decimal;
            stockOnHand: number | null;
            imageUrl: string;
            lowStockThreshold: number;
            maxStockThreshold: number;
            productId: string;
        })[];
    } & {
        createdAt: Date;
        name: string;
        basePrice: import("@prisma/client-runtime-utils").Decimal;
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
            costPrice: import("@prisma/client-runtime-utils").Decimal;
            sellingPrice: import("@prisma/client-runtime-utils").Decimal;
            stockOnHand: number | null;
            imageUrl: string;
            lowStockThreshold: number;
            maxStockThreshold: number;
            productId: string;
        })[];
    } & {
        createdAt: Date;
        name: string;
        basePrice: import("@prisma/client-runtime-utils").Decimal;
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
    findOne(id: string): Promise<{
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
            costPrice: import("@prisma/client-runtime-utils").Decimal;
            sellingPrice: import("@prisma/client-runtime-utils").Decimal;
            stockOnHand: number | null;
            imageUrl: string;
            lowStockThreshold: number;
            maxStockThreshold: number;
            productId: string;
        })[];
    } & {
        createdAt: Date;
        name: string;
        basePrice: import("@prisma/client-runtime-utils").Decimal;
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
    findAll(query: ProductQueryDto, { dateRange }: ParsedDateRange): Promise<OffsetPaginatedProductListResponse | CursorPaginatedProductListResponse>;
}
