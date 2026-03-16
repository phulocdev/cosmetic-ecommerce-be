import { PaginationType, SortOrder } from 'enums';
export declare class PaginationQueryDto {
    paginationType?: PaginationType;
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: SortOrder;
    cursor?: string;
}
export declare class PaginationMetaDto {
    limit: number;
    hasPreviousPage: boolean;
    hasNextPage: boolean;
}
export declare class OffsetPaginationMetaDto extends PaginationMetaDto {
    total: number;
    page: number;
    totalPages: number;
}
export declare class CursorPaginationMetaDto extends PaginationMetaDto {
    nextCursor: string | null;
    previousCursor: string | null;
}
export declare class OffsetPaginatedResponseDto<T> {
    items: T[];
    meta: OffsetPaginationMetaDto;
    constructor({ items, total, page, limit }: {
        items: T[];
        total: number;
        page: number;
        limit: number;
    });
}
export declare class CursorPaginatedResponseDto<T> {
    items: T[];
    meta: CursorPaginationMetaDto;
    constructor({ items, nextCursor, previousCursor, hasNextPage, hasPreviousPage }: {
        items: T[];
        nextCursor: string | null;
        previousCursor: string | null;
        hasNextPage: boolean;
        hasPreviousPage: boolean;
    });
}
