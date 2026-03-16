import { CursorPaginatedResponseDto, OffsetPaginatedResponseDto } from 'core';
import { PrismaService } from 'database/prisma/prisma.service';
import { GetCategoriesQueryDto, GetCategoryTreeQueryDto, MoveCategoryDto } from 'domains/categories/dto/query-category.dto';
import { BreadcrumbItem, Category, CategoryTreeNode } from 'domains/categories/entities/category.entity';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { UtcDateRange } from 'utils';
export declare class CategoriesService {
    private readonly prismaService;
    constructor(prismaService: PrismaService);
    getCategoryTree(query: GetCategoryTreeQueryDto): Promise<CategoryTreeNode[]>;
    getBreadcrumbs(id: string): Promise<BreadcrumbItem[]>;
    private buildTree;
    findBySlug(slug: string, includeChildren: any, includeProductCount: any): Promise<Category>;
    create(createCategoryDto: CreateCategoryDto): Promise<Category>;
    findAll(query: GetCategoriesQueryDto, dateRange?: UtcDateRange): Promise<OffsetPaginatedResponseDto<Category> | CursorPaginatedResponseDto<Category>>;
    private findAllWithOffsetPagination;
    private findAllWithCursorPagination;
    private buildCategoryWhereClause;
    private buildCategoryIncludeClause;
    private buildCategoryOrderByClause;
    private buildCategoryCursorWhereClause;
    private encodeCategoryCursor;
    findOne(id: string): Promise<Category>;
    getStats(id: string): Promise<{
        categoryId: string;
        categoryName: string;
        totalProducts: number;
        totalSubcategories: number;
        activeSubcategories: number;
        depth: number;
        isActive: boolean;
    }>;
    update(id: string, updateCategoryDto: UpdateCategoryDto): Promise<Category>;
    moveCategory(id: string, moveDto: MoveCategoryDto): Promise<Category>;
    softDelete(id: string): Promise<Category>;
    remove(id: string): Promise<{
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
    }>;
    rebuildPaths(): Promise<{
        updated: number;
    }>;
}
