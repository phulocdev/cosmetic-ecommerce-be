import { PaginationQueryDto } from 'core';
import { PrismaService } from 'database/prisma/prisma.service';
import { CursorPaginatedProductListResponse, OffsetPaginatedProductListResponse, ProductQueryDto } from 'domains/products/dto/find-all-product.dto';
import { UtcDateRange } from 'utils';
export declare class FindAllProductService {
    private readonly prismaService;
    constructor(prismaService: PrismaService);
    findAllWithOffsetPagination(query: ProductQueryDto, utcDateRange?: UtcDateRange): Promise<OffsetPaginatedProductListResponse>;
    findAllWithCursorPagination(query: ProductQueryDto & PaginationQueryDto, utcDateRange?: UtcDateRange): Promise<CursorPaginatedProductListResponse>;
    private buildWhereClause;
    private buildCursorWhereClause;
    private buildOrderByClause;
    private buildIncludeClause;
    private encodeCursor;
    private getAppliedFilters;
}
