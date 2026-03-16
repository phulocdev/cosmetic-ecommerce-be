import { PaginationQueryDto } from 'core';
export declare class FindAllAttributeDto extends PaginationQueryDto {
    getAll?: boolean;
    categoryId?: string;
}
