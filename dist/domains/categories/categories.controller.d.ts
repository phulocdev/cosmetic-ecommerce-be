import { CursorPaginatedResponseDto, OffsetPaginatedResponseDto } from 'core';
import { ParsedDateRange } from 'core/pipes/date-range.pipe';
import { GetCategoriesQueryDto, GetCategoryTreeQueryDto, MoveCategoryDto } from 'domains/categories/dto/query-category.dto';
import { BreadcrumbItem, Category, CategoryTreeNode } from 'domains/categories/entities/category.entity';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
export declare class CategoriesController {
    private readonly categoriesService;
    constructor(categoriesService: CategoriesService);
    create(createCategoryDto: CreateCategoryDto): Promise<Category>;
    getTree(query: GetCategoryTreeQueryDto): Promise<CategoryTreeNode[]>;
    getBreadcrumbs(id: string): Promise<BreadcrumbItem[]>;
    findAll(query: GetCategoriesQueryDto, { dateRange }: ParsedDateRange): Promise<OffsetPaginatedResponseDto<Category> | CursorPaginatedResponseDto<Category>>;
    findOne(id: string): Promise<Category>;
    findBySlug(slug: string, includeChildren: boolean, includeProductCount: boolean): Promise<Category>;
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
