import { PaginationQueryDto } from 'core';
import { CategorySortBy, CategoryTreeFormat } from 'enums';
export declare class GetCategoriesQueryDto extends PaginationQueryDto {
    search?: string;
    parentId?: string;
    isDeleted?: boolean;
    isActive?: boolean;
    depth?: number;
    sortBy?: CategorySortBy;
    includeChildren?: boolean;
    includeParent?: boolean;
    includeProductCount?: boolean;
    includeAttributes?: boolean;
}
export declare class GetCategoryTreeQueryDto {
    rootId?: string;
    maxDepth?: number;
    isDeleted?: boolean;
    activeOnly?: boolean;
    format?: CategoryTreeFormat;
    includeProductCount?: boolean;
}
export declare class MoveCategoryDto {
    newParentId: string | null;
}
