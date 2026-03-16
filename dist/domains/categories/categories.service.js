"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoriesService = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("../../core");
const prisma_service_1 = require("../../database/prisma/prisma.service");
const category_entity_1 = require("./entities/category.entity");
const enums_1 = require("../../enums");
const business_util_1 = require("../../utils/business.util");
let CategoriesService = class CategoriesService {
    prismaService;
    constructor(prismaService) {
        this.prismaService = prismaService;
    }
    async getCategoryTree(query) {
        const { rootId, maxDepth, activeOnly, format, includeProductCount, isDeleted } = query;
        const where = {};
        if (activeOnly) {
            where.isActive = true;
        }
        if (isDeleted !== undefined) {
            where.isDeleted = isDeleted;
        }
        if (rootId) {
            const root = await this.prismaService.category.findUnique({
                where: { id: rootId }
            });
            if (!root) {
                throw new common_1.NotFoundException(`Root category with ID "${rootId}" not found`);
            }
            where.OR = [{ id: rootId }, { path: { startsWith: `${root.path}${root.id}/` } }];
            if (maxDepth !== undefined) {
                where.depth = { lte: root.depth + maxDepth };
            }
        }
        else {
            if (maxDepth !== undefined) {
                where.depth = { lte: maxDepth };
            }
        }
        const include = {};
        if (includeProductCount) {
            include._count = {
                select: { products: true }
            };
        }
        const categories = await this.prismaService.category.findMany({
            where,
            include,
            orderBy: [{ depth: 'asc' }, { name: 'asc' }]
        });
        if (format === enums_1.CategoryTreeFormat.FLAT) {
            return categories.map((cat) => ({
                id: cat.id,
                name: cat.name,
                slug: cat.slug,
                path: cat.path,
                depth: cat.depth,
                isActive: cat.isActive,
                productCount: includeProductCount ? cat._count?.products : undefined
            }));
        }
        return this.buildTree(categories, rootId, includeProductCount);
    }
    async getBreadcrumbs(id) {
        const category = await this.prismaService.category.findUnique({
            where: { id }
        });
        if (!category) {
            throw new common_1.NotFoundException(`Category with ID "${id}" not found`);
        }
        if (category.depth === 0) {
            return [
                new category_entity_1.BreadcrumbItem({
                    id: category.id,
                    name: category.name,
                    slug: category.slug,
                    path: category.path
                })
            ];
        }
        const parentIds = category.path.split('/').filter((id) => id !== '');
        const parents = await this.prismaService.category.findMany({
            where: {
                id: { in: parentIds }
            },
            orderBy: { depth: 'asc' }
        });
        const breadcrumbs = parents.map((cat) => new category_entity_1.BreadcrumbItem({
            id: cat.id,
            name: cat.name,
            slug: cat.slug,
            path: cat.path
        }));
        breadcrumbs.push(new category_entity_1.BreadcrumbItem({
            id: category.id,
            name: category.name,
            slug: category.slug,
            path: category.path
        }));
        return breadcrumbs;
    }
    buildTree(categories, rootId, includeProductCount = false) {
        const categoryMap = new Map();
        const rootCategories = [];
        categories.forEach((cat) => {
            categoryMap.set(cat.id, {
                id: cat.id,
                name: cat.name,
                slug: cat.slug,
                path: cat.path,
                depth: cat.depth,
                isActive: cat.isActive,
                productCount: includeProductCount ? cat._count?.products : undefined,
                children: []
            });
        });
        categories.forEach((cat) => {
            const node = categoryMap.get(cat.id);
            if (cat.parentId && categoryMap.has(cat.parentId)) {
                const parent = categoryMap.get(cat.parentId);
                if (!parent.children) {
                    parent.children = [];
                }
                parent.children.push(node);
            }
            else if (!rootId ||
                cat.id === rootId ||
                cat.parentId === null) {
                rootCategories.push(node);
            }
        });
        return rootCategories;
    }
    async findBySlug(slug, includeChildren, includeProductCount) {
        const include = {};
        if (includeChildren) {
            include.children = {
                where: { isActive: true },
                orderBy: { name: 'asc' }
            };
        }
        if (includeProductCount) {
            include._count = {
                select: { products: true }
            };
        }
        const category = await this.prismaService.category.findUnique({
            where: { slug },
            include
        });
        if (!category) {
            throw new common_1.NotFoundException(`Category with slug "${slug}" not found`);
        }
        return new category_entity_1.Category({
            ...category,
            productCount: includeProductCount ? category._count?.products : undefined
        });
    }
    async create(createCategoryDto) {
        const { name, slug, parentId, attributeIds, ...rest } = createCategoryDto;
        const finalSlug = slug || (0, business_util_1.slugifyString)(name);
        const existingSlug = await this.prismaService.category.findUnique({
            where: { slug: finalSlug }
        });
        if (existingSlug) {
            throw new common_1.ConflictException(`Category with slug "${finalSlug}" already exists`);
        }
        let path = '/';
        let depth = 0;
        if (parentId) {
            const parent = await this.prismaService.category.findUnique({
                where: { id: parentId }
            });
            if (!parent) {
                throw new common_1.NotFoundException(`Parent category with ID "${parentId}" not found`);
            }
            if (!parent.isActive) {
                throw new common_1.BadRequestException('Cannot create category under inactive parent');
            }
            path = `${parent.path}${parent.id}/`;
            depth = parent.depth + 1;
        }
        const category = await this.prismaService.category.create({
            data: {
                name,
                slug: finalSlug,
                parentId,
                path,
                depth,
                ...rest,
                categoryAttributes: {
                    create: (attributeIds || []).map((attributeId) => ({
                        attributeId
                    }))
                }
            }
        });
        return new category_entity_1.Category(category);
    }
    async findAll(query, dateRange) {
        if (query.paginationType === enums_1.PaginationType.CURSOR) {
            return this.findAllWithCursorPagination(query, dateRange);
        }
        return this.findAllWithOffsetPagination(query, dateRange);
    }
    async findAllWithOffsetPagination(query, dateRange) {
        const { page = 1, limit = 20, sortBy, sortOrder, includeProductCount } = query;
        const skip = (page - 1) * limit;
        const where = this.buildCategoryWhereClause(query);
        if (dateRange) {
            where.createdAt = {
                gte: dateRange.from,
                lte: dateRange.to
            };
        }
        const include = this.buildCategoryIncludeClause(query);
        const orderByList = this.buildCategoryOrderByClause(sortBy, sortOrder);
        const [categories, totalItems] = await Promise.all([
            this.prismaService.category.findMany({
                where,
                include,
                skip,
                take: limit,
                orderBy: orderByList
            }),
            this.prismaService.category.count({ where })
        ]);
        let categoryItems = categories.map((cat) => ({
            ...cat,
            productCount: includeProductCount ? cat._count?.products : undefined,
            _count: undefined
        }));
        if (sortBy === enums_1.CategorySortBy.PRODUCT_COUNT && includeProductCount) {
            categoryItems.sort((a, b) => {
                const countA = a.productCount || 0;
                const countB = b.productCount || 0;
                return sortOrder === 'asc' ? countA - countB : countB - countA;
            });
        }
        return new core_1.OffsetPaginatedResponseDto({
            items: categoryItems,
            limit,
            page,
            total: totalItems
        });
    }
    async findAllWithCursorPagination(query, dateRange) {
        const { limit = 20, cursor, sortBy = enums_1.CategorySortBy.CREATED_AT, sortOrder = enums_1.SortOrder.DESC } = query;
        if (sortBy === enums_1.CategorySortBy.PRODUCT_COUNT) {
            throw new common_1.BadRequestException('Cursor-based pagination is not supported for PRODUCT_COUNT sort. Use offset pagination instead.');
        }
        let cursorData = null;
        if (cursor) {
            try {
                cursorData = JSON.parse(Buffer.from(cursor, 'base64').toString('utf-8'));
            }
            catch {
                throw new common_1.BadRequestException('Invalid cursor format');
            }
        }
        const baseWhere = this.buildCategoryWhereClause(query);
        const where = this.buildCategoryCursorWhereClause(baseWhere, cursorData, sortBy, sortOrder);
        const include = this.buildCategoryIncludeClause(query);
        const orderByList = this.buildCategoryOrderByClause(sortBy, sortOrder);
        if (dateRange) {
            where.createdAt = {
                gte: dateRange.from,
                lte: dateRange.to
            };
        }
        const categories = await this.prismaService.category.findMany({
            where,
            include,
            orderBy: orderByList,
            take: limit + 1
        });
        const hasNextPage = categories.length > limit;
        if (hasNextPage) {
            categories.pop();
        }
        const categoryItems = categories.map((cat) => ({
            ...cat,
            productCount: query.includeProductCount ? cat._count?.products : undefined,
            _count: undefined
        }));
        let nextCursor = null;
        if (hasNextPage && categoryItems.length > 0) {
            const lastItem = categoryItems[categoryItems.length - 1];
            nextCursor = this.encodeCategoryCursor(lastItem, sortBy);
        }
        let previousCursor = null;
        if (categoryItems.length > 0 && cursor) {
            const firstItem = categoryItems[0];
            previousCursor = this.encodeCategoryCursor(firstItem, sortBy);
        }
        return new core_1.CursorPaginatedResponseDto({
            items: categoryItems,
            nextCursor,
            previousCursor,
            hasNextPage,
            hasPreviousPage: !!cursor
        });
    }
    buildCategoryWhereClause(query) {
        const { search, parentId, isActive, depth, isDeleted } = query;
        const where = {};
        if (search) {
            where.OR = [
                { name: { contains: search, mode: 'insensitive' } },
                { slug: { contains: search, mode: 'insensitive' } }
            ];
        }
        if (parentId !== undefined) {
            where.parentId = parentId === 'null' ? null : parentId;
        }
        if (isActive !== undefined) {
            where.isActive = isActive;
        }
        if (isDeleted !== undefined) {
            where.isDeleted = isDeleted;
        }
        if (depth !== undefined) {
            where.depth = depth;
        }
        return where;
    }
    buildCategoryIncludeClause(query) {
        const { includeChildren, includeProductCount, includeParent, isActive, includeAttributes } = query;
        const include = {};
        if (includeChildren) {
            include.children = {
                where: isActive !== undefined ? { isActive } : undefined,
                orderBy: { name: 'asc' }
            };
        }
        if (includeProductCount) {
            include._count = {
                select: { products: true }
            };
        }
        if (includeParent) {
            include.parent = true;
        }
        if (includeAttributes) {
            include.categoryAttributes = {
                include: {
                    attribute: {
                        include: {
                            values: true
                        }
                    }
                }
            };
        }
        return include;
    }
    buildCategoryOrderByClause(sortBy, sortOrder) {
        const sort = sortBy || enums_1.CategorySortBy.CREATED_AT;
        const order = sortOrder || enums_1.SortOrder.DESC;
        const orderByList = [];
        switch (sort) {
            case enums_1.CategorySortBy.CREATED_AT:
                orderByList.push({ createdAt: order });
                break;
            case enums_1.CategorySortBy.NAME:
                orderByList.push({ name: order });
                break;
            case enums_1.CategorySortBy.DEPTH:
                orderByList.push({ depth: order });
                break;
            case enums_1.CategorySortBy.SLUG:
                orderByList.push({ slug: order });
                break;
            case enums_1.CategorySortBy.PARENT_CATEGORY_NAME:
                orderByList.push({ parent: { name: order } });
            case enums_1.CategorySortBy.PRODUCT_COUNT:
                break;
        }
        orderByList.push({ id: order });
        return orderByList;
    }
    buildCategoryCursorWhereClause(baseWhere, cursorData, sortBy, sortOrder) {
        if (!cursorData) {
            return baseWhere;
        }
        const where = { ...baseWhere };
        const isAscending = sortOrder === enums_1.SortOrder.ASC;
        const operator = isAscending ? 'gt' : 'lt';
        const cursorConditions = [];
        switch (sortBy) {
            case enums_1.CategorySortBy.CREATED_AT:
                if (cursorData.createdAt) {
                    cursorConditions.push({
                        OR: [
                            { createdAt: { [operator]: cursorData.createdAt } },
                            {
                                AND: [
                                    { createdAt: { equals: cursorData.createdAt } },
                                    { id: { [operator]: cursorData.id } }
                                ]
                            }
                        ]
                    });
                }
                break;
            case enums_1.CategorySortBy.NAME:
                if (cursorData.name) {
                    cursorConditions.push({
                        OR: [
                            { name: { [operator]: cursorData.name } },
                            {
                                AND: [{ name: { equals: cursorData.name } }, { id: { [operator]: cursorData.id } }]
                            }
                        ]
                    });
                }
                break;
            case enums_1.CategorySortBy.DEPTH:
                if (cursorData.depth !== undefined) {
                    cursorConditions.push({
                        OR: [
                            { depth: { [operator]: cursorData.depth } },
                            {
                                AND: [
                                    { depth: { equals: cursorData.depth } },
                                    { id: { [operator]: cursorData.id } }
                                ]
                            }
                        ]
                    });
                }
                break;
        }
        if (cursorConditions.length > 0) {
            if (where.AND) {
                ;
                where.AND.push(...cursorConditions);
            }
            else {
                where.AND = cursorConditions;
            }
        }
        return where;
    }
    encodeCategoryCursor(category, sortBy) {
        const cursorData = { id: category.id };
        switch (sortBy) {
            case enums_1.CategorySortBy.CREATED_AT:
                cursorData.createdAt = category.createdAt;
                break;
            case enums_1.CategorySortBy.NAME:
                cursorData.name = category.name;
                break;
            case enums_1.CategorySortBy.DEPTH:
                cursorData.depth = category.depth;
                break;
        }
        return Buffer.from(JSON.stringify(cursorData)).toString('base64');
    }
    async findOne(id) {
        const category = await this.prismaService.category.findUnique({
            where: { id },
            include: {
                categoryAttributes: {
                    include: {
                        attribute: {
                            include: {
                                values: true
                            }
                        }
                    }
                }
            }
        });
        if (!category) {
            throw new common_1.NotFoundException(`Category with ID "${id}" not found`);
        }
        return category;
    }
    async getStats(id) {
        const category = await this.prismaService.category.findUnique({
            where: { id }
        });
        if (!category) {
            throw new common_1.NotFoundException(`Category with ID "${id}" not found`);
        }
        const descendants = await this.prismaService.category.findMany({
            where: {
                OR: [{ id }, { path: { startsWith: `${category.path}${id}/` } }]
            },
            include: {
                _count: {
                    select: { products: true }
                }
            }
        });
        const totalProducts = descendants.reduce((sum, cat) => sum + cat._count.products, 0);
        const totalSubcategories = descendants.length - 1;
        const activeSubcategories = descendants.filter((cat) => cat.isActive && cat.id !== id).length;
        return {
            categoryId: id,
            categoryName: category.name,
            totalProducts,
            totalSubcategories,
            activeSubcategories,
            depth: category.depth,
            isActive: category.isActive
        };
    }
    async update(id, updateCategoryDto) {
        const category = await this.prismaService.category.findUnique({
            where: { id }
        });
        if (!category) {
            throw new common_1.NotFoundException(`Category with ID "${id}" not found`);
        }
        if (updateCategoryDto.slug && updateCategoryDto.slug !== category.slug) {
            const existingSlug = await this.prismaService.category.findUnique({
                where: { slug: updateCategoryDto.slug }
            });
            if (existingSlug) {
                throw new common_1.ConflictException(`Category with slug "${updateCategoryDto.slug}" already exists`);
            }
        }
        if (updateCategoryDto.parentId === id) {
            throw new common_1.BadRequestException('Danh mục cha phải khác với chính nó');
        }
        if (updateCategoryDto.attributeIds) {
            await this.prismaService.categoryAttribute.deleteMany({
                where: { categoryId: id }
            });
            await this.prismaService.categoryAttribute.createMany({
                data: updateCategoryDto.attributeIds.map((attributeId) => ({
                    categoryId: id,
                    attributeId
                }))
            });
        }
        delete updateCategoryDto.attributeIds;
        let finalUpdateData = updateCategoryDto;
        if (updateCategoryDto.parentId !== undefined &&
            updateCategoryDto.parentId !== category.parentId) {
            await this.moveCategory(id, { newParentId: updateCategoryDto.parentId });
            const { parentId, ...rest } = updateCategoryDto;
            finalUpdateData = rest;
        }
        return this.prismaService.category.update({
            where: { id },
            data: finalUpdateData
        });
    }
    async moveCategory(id, moveDto) {
        const category = await this.prismaService.category.findUnique({
            where: { id }
        });
        if (!category) {
            throw new common_1.NotFoundException(`Category with ID "${id}" not found`);
        }
        const { newParentId } = moveDto;
        if (newParentId === id) {
            throw new common_1.BadRequestException('Danh mục cha phải khác với chính nó');
        }
        let newPath = '/';
        let newDepth = 0;
        if (newParentId) {
            const newParent = await this.prismaService.category.findUnique({
                where: { id: newParentId }
            });
            if (!newParent) {
                throw new common_1.NotFoundException(`Parent category with ID "${newParentId}" not found`);
            }
            if (newParent.path.includes(`/${id}/`)) {
                throw new common_1.BadRequestException('Không thể di chuyển danh mục này vào một trong các danh mục con của nó');
            }
            newPath = `${newParent.path}${newParent.id}/`;
            newDepth = newParent.depth + 1;
        }
        const descendants = await this.prismaService.category.findMany({
            where: {
                path: { startsWith: `${category.path}${id}/` }
            }
        });
        await this.prismaService.$transaction(async (tx) => {
            await tx.category.update({
                where: { id },
                data: {
                    parentId: newParentId,
                    path: newPath,
                    depth: newDepth
                }
            });
            const depthDiff = newDepth - category.depth;
            const oldPath = `${category.path}${id}/`;
            const newBasePath = `${newPath}${id}/`;
            for (const descendant of descendants) {
                const updatedPath = descendant.path.replace(oldPath, newBasePath);
                await tx.category.update({
                    where: { id: descendant.id },
                    data: {
                        path: updatedPath,
                        depth: descendant.depth + depthDiff
                    }
                });
            }
        });
        return this.findOne(id);
    }
    async softDelete(id) {
        const category = await this.prismaService.category.findUnique({
            where: { id },
            include: {
                children: true,
                products: true
            }
        });
        if (!category) {
            throw new common_1.NotFoundException(`Category with ID "${id}" not found`);
        }
        if (category.children.length > 0 &&
            category.children.some((child) => !child.isDeleted)) {
            throw new common_1.BadRequestException('Cannot delete category with children. Delete or move children first.');
        }
        if (category.products.length > 0) {
            throw new common_1.BadRequestException('Cannot delete category with products. Move products to another category first.');
        }
        if (category.isDeleted) {
            throw new common_1.BadRequestException('Category is already deleted');
        }
        return this.prismaService.category.update({
            where: { id },
            data: { isDeleted: true, deletedAt: new Date() }
        });
    }
    async remove(id) {
        const category = await this.prismaService.category.findUnique({
            where: { id },
            include: {
                children: true,
                products: true
            }
        });
        if (!category) {
            throw new common_1.NotFoundException(`Category with ID "${id}" not found`);
        }
        if (category.children.length > 0) {
            throw new common_1.BadRequestException('Cannot delete category with children. Delete or move children first.');
        }
        if (category.products.length > 0) {
            throw new common_1.BadRequestException('Cannot delete category with products. Move products to another category first.');
        }
        return this.prismaService.category.delete({
            where: { id }
        });
    }
    async rebuildPaths() {
        const categories = await this.prismaService.category.findMany({
            orderBy: { depth: 'asc' }
        });
        let updated = 0;
        await this.prismaService.$transaction(async (tx) => {
            for (const category of categories) {
                let correctPath = '/';
                let correctDepth = 0;
                if (category.parentId) {
                    const parent = categories.find((c) => c.id === category.parentId);
                    if (parent) {
                        correctPath = `${parent.path}${parent.id}/`;
                        correctDepth = parent.depth + 1;
                    }
                }
                if (category.path !== correctPath || category.depth !== correctDepth) {
                    await tx.category.update({
                        where: { id: category.id },
                        data: {
                            path: correctPath,
                            depth: correctDepth
                        }
                    });
                    updated++;
                }
            }
        });
        return { updated };
    }
};
exports.CategoriesService = CategoriesService;
exports.CategoriesService = CategoriesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], CategoriesService);
//# sourceMappingURL=categories.service.js.map