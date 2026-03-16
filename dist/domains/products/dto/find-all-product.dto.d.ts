import { CursorPaginatedResponseDto, OffsetPaginatedResponseDto, PaginationQueryDto } from 'core/dto/pagination.dto';
import { ProductSortBy, ProductStatus } from 'enums';
import { Product } from '@prisma/client';
export declare class PriceRangeDto {
    min?: number;
    max?: number;
}
export declare class StockRangeDto {
    min?: number;
    max?: number;
}
export declare class ProductQueryDto extends PaginationQueryDto {
    search?: string;
    status?: ProductStatus[];
    categoryIds?: string[];
    categorySlug?: string;
    categoryPath?: string;
    brandIds?: string[];
    countryIds?: string[];
    minPrice?: number;
    maxPrice?: number;
    attributes?: Record<string, string>;
    inStock?: boolean;
    minStock?: number;
    maxStock?: number;
    hasActiveVariants?: boolean;
    minVariantPrice?: number;
    maxVariantPrice?: number;
    sku?: string;
    sortBy?: ProductSortBy;
    includeImages?: boolean;
    includeVariants?: boolean;
    includeAttributes?: boolean;
    includeBrandAndCountry?: boolean;
    includeCategories?: boolean;
}
export declare class ProductFiltersAppliedDto {
    applied: Record<string, any>;
    available?: Record<string, any>;
}
export declare class OffsetPaginatedProductListResponse extends OffsetPaginatedResponseDto<Product> {
    filters?: ProductFiltersAppliedDto;
    constructor({ items, total, page, limit, filters }: {
        items: Product[];
        total: number;
        page: number;
        limit: number;
        filters?: ProductFiltersAppliedDto;
    });
}
export declare class CursorPaginatedProductListResponse extends CursorPaginatedResponseDto<Product> {
    filters?: ProductFiltersAppliedDto;
    constructor({ items, nextCursor, previousCursor, hasNextPage, hasPreviousPage, filters }: {
        items: Product[];
        nextCursor: string | null;
        previousCursor: string | null;
        hasNextPage: boolean;
        hasPreviousPage: boolean;
        filters?: ProductFiltersAppliedDto;
    });
}
