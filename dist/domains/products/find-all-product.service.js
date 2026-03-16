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
exports.FindAllProductService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const prisma_service_1 = require("../../database/prisma/prisma.service");
const find_all_product_dto_1 = require("./dto/find-all-product.dto");
const enums_1 = require("../../enums");
let FindAllProductService = class FindAllProductService {
    prismaService;
    constructor(prismaService) {
        this.prismaService = prismaService;
    }
    async findAllWithOffsetPagination(query, utcDateRange) {
        const page = query.page || 1;
        const limit = query.limit || 20;
        const skip = (page - 1) * limit;
        let where = this.buildWhereClause(query);
        if (utcDateRange) {
            where = {
                ...where,
                createdAt: {
                    gte: utcDateRange.from,
                    lte: utcDateRange.to
                }
            };
        }
        const orderBy = this.buildOrderByClause(query.sortBy, query.sortOrder);
        const include = this.buildIncludeClause(query);
        const [products, total] = await Promise.all([
            this.prismaService.product.findMany({
                where,
                include,
                orderBy,
                skip,
                take: limit
            }),
            this.prismaService.product.count({ where })
        ]);
        return new find_all_product_dto_1.OffsetPaginatedProductListResponse({
            items: products,
            limit,
            page,
            total,
            filters: { applied: this.getAppliedFilters(query) }
        });
    }
    async findAllWithCursorPagination(query, utcDateRange) {
        const limit = query.limit || 20;
        const cursor = query.cursor;
        const sortBy = query.sortBy || enums_1.ProductSortBy.CREATED_AT;
        const sortOrder = query.sortOrder || enums_1.SortOrder.DESC;
        let cursorData = null;
        if (cursor) {
            try {
                cursorData = JSON.parse(Buffer.from(cursor, 'base64').toString('utf-8'));
            }
            catch (error) {
                throw new common_1.BadRequestException('Invalid cursor format');
            }
        }
        const baseWhere = this.buildWhereClause(query);
        let where = this.buildCursorWhereClause(baseWhere, cursorData, sortBy, sortOrder);
        if (utcDateRange) {
            where = {
                ...where,
                createdAt: {
                    gte: utcDateRange.from,
                    lte: utcDateRange.to
                }
            };
        }
        const orderBy = this.buildOrderByClause(sortBy, sortOrder);
        const include = this.buildIncludeClause(query);
        const products = await this.prismaService.product.findMany({
            where,
            include,
            orderBy,
            take: limit + 1
        });
        const hasNextPage = products.length > limit;
        if (hasNextPage) {
            products.pop();
        }
        let nextCursor = null;
        if (hasNextPage && products.length > 0) {
            const lastItem = products[products.length - 1];
            nextCursor = this.encodeCursor(lastItem, sortBy);
        }
        let previousCursor = null;
        if (products.length > 0 && cursor) {
            const firstItem = products[0];
            previousCursor = this.encodeCursor(firstItem, sortBy);
        }
        return new find_all_product_dto_1.CursorPaginatedProductListResponse({
            items: products,
            nextCursor,
            previousCursor,
            hasNextPage,
            hasPreviousPage: !!cursor,
            filters: { applied: this.getAppliedFilters(query) }
        });
    }
    buildWhereClause(query) {
        const where = {
            AND: []
        };
        if (query.search) {
            ;
            where.AND.push({
                OR: [
                    { name: { contains: query.search, mode: 'insensitive' } },
                    { description: { contains: query.search, mode: 'insensitive' } },
                    { code: { contains: query.search, mode: 'insensitive' } }
                ]
            });
        }
        if (query.status) {
            ;
            where.AND.push({ status: { in: query.status } });
        }
        if (query.categoryIds && query.categoryIds.length > 0) {
            ;
            where.AND.push({
                categories: {
                    some: {
                        category: {
                            id: { in: query.categoryIds }
                        }
                    }
                }
            });
        }
        if (query.categorySlug) {
            ;
            where.AND.push({
                categories: {
                    some: {
                        category: {
                            slug: query.categorySlug
                        }
                    }
                }
            });
        }
        if (query.categoryPath) {
            ;
            where.AND.push({
                categories: {
                    some: {
                        category: {
                            path: { startsWith: query.categoryPath }
                        }
                    }
                }
            });
        }
        if (query.brandIds && query.brandIds.length > 0) {
            ;
            where.AND.push({
                brandId: { in: query.brandIds }
            });
        }
        if (query.countryIds && query.countryIds.length > 0) {
            ;
            where.AND.push({
                countryOriginId: { in: query.countryIds }
            });
        }
        if (query.minPrice !== undefined || query.maxPrice !== undefined) {
            const priceCondition = {};
            if (query.minPrice !== undefined) {
                priceCondition.gte = new client_1.Prisma.Decimal(query.minPrice);
            }
            if (query.maxPrice !== undefined) {
                priceCondition.lte = new client_1.Prisma.Decimal(query.maxPrice);
            }
            ;
            where.AND.push({ basePrice: priceCondition });
        }
        if (query.inStock !== undefined && query.inStock) {
            ;
            where.AND.push({
                variants: {
                    some: {
                        stockOnHand: { gt: 0 },
                        isActive: true
                    }
                }
            });
        }
        if (query.minStock !== undefined || query.maxStock !== undefined) {
            const stockCondition = {};
            if (query.minStock !== undefined) {
                stockCondition.gte = query.minStock;
            }
            if (query.maxStock !== undefined) {
                stockCondition.lte = query.maxStock;
            }
            ;
            where.AND.push({
                variants: {
                    some: {
                        stockOnHand: stockCondition
                    }
                }
            });
        }
        if (query.hasActiveVariants !== undefined && query.hasActiveVariants) {
            ;
            where.AND.push({
                variants: {
                    some: {
                        isActive: true
                    }
                }
            });
        }
        if (query.minVariantPrice !== undefined || query.maxVariantPrice !== undefined) {
            const variantPriceCondition = {};
            if (query.minVariantPrice !== undefined) {
                variantPriceCondition.gte = new client_1.Prisma.Decimal(query.minVariantPrice);
            }
            if (query.maxVariantPrice !== undefined) {
                variantPriceCondition.lte = new client_1.Prisma.Decimal(query.maxVariantPrice);
            }
            ;
            where.AND.push({
                variants: {
                    some: {
                        sellingPrice: variantPriceCondition
                    }
                }
            });
        }
        if (query.sku) {
            ;
            where.AND.push({
                variants: {
                    some: {
                        sku: { contains: query.sku, mode: 'insensitive' }
                    }
                }
            });
        }
        if (query.attributes && Object.keys(query.attributes).length > 0) {
            for (const [attributeSlug, values] of Object.entries(query.attributes)) {
                const valueArray = values.split(',').map((v) => v.trim());
                where.AND.push({
                    attributes: {
                        some: {
                            attribute: {
                                slug: attributeSlug,
                                values: {
                                    some: {
                                        value: { in: valueArray, mode: 'insensitive' }
                                    }
                                }
                            }
                        }
                    }
                });
            }
        }
        if (where.AND.length === 0) {
            delete where.AND;
        }
        return where;
    }
    buildCursorWhereClause(baseWhere, cursorData, sortBy, sortOrder) {
        if (!cursorData) {
            return baseWhere;
        }
        const where = { ...baseWhere };
        const cursorConditions = [];
        const isAscending = sortOrder === enums_1.SortOrder.ASC;
        const operator = isAscending ? 'gt' : 'lt';
        switch (sortBy) {
            case enums_1.ProductSortBy.CREATED_AT:
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
            case enums_1.ProductSortBy.PRICE:
                if (cursorData.basePrice !== undefined) {
                    cursorConditions.push({
                        OR: [
                            { basePrice: { [operator]: new client_1.Prisma.Decimal(cursorData.basePrice) } },
                            {
                                AND: [
                                    { basePrice: { equals: new client_1.Prisma.Decimal(cursorData.basePrice) } },
                                    { id: { [operator]: cursorData.id } }
                                ]
                            }
                        ]
                    });
                }
                break;
            case enums_1.ProductSortBy.NAME:
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
            case enums_1.ProductSortBy.VIEWS:
                if (cursorData.views !== undefined) {
                    cursorConditions.push({
                        OR: [
                            { views: { [operator]: cursorData.views } },
                            {
                                AND: [
                                    { views: { equals: cursorData.views } },
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
    buildOrderByClause(sortBy, sortOrder) {
        const sort = sortBy || enums_1.ProductSortBy.CREATED_AT;
        const order = sortOrder || enums_1.SortOrder.DESC;
        const orderByList = [];
        switch (sort) {
            case enums_1.ProductSortBy.CREATED_AT:
                orderByList.push({ createdAt: order });
                break;
            case enums_1.ProductSortBy.PRICE:
                orderByList.push({ basePrice: order });
                break;
            case enums_1.ProductSortBy.NAME:
                orderByList.push({ name: order });
                break;
            case enums_1.ProductSortBy.VIEWS:
                orderByList.push({ views: order });
                break;
        }
        orderByList.push({ id: order });
        return orderByList;
    }
    buildIncludeClause(query) {
        const include = {};
        if (query.includeBrandAndCountry) {
            include.brand = true;
            include.countryOfOrigin = true;
        }
        if (query.includeCategories) {
            include.categories = {
                include: {
                    category: true
                }
            };
        }
        if (query.includeImages) {
            include.images = true;
        }
        if (query.includeVariants) {
            include.variants = {
                include: {
                    attributeValues: {
                        include: {
                            attributeValue: {
                                include: {
                                    attribute: true
                                }
                            }
                        }
                    }
                }
            };
        }
        return include;
    }
    encodeCursor(productItem, sortBy) {
        const cursorData = {
            id: productItem.id
        };
        switch (sortBy) {
            case enums_1.ProductSortBy.CREATED_AT:
                cursorData.createdAt = productItem.createdAt;
                break;
            case enums_1.ProductSortBy.PRICE:
                cursorData.basePrice = productItem.basePrice;
                break;
            case enums_1.ProductSortBy.NAME:
                cursorData.name = productItem.name;
                break;
            case enums_1.ProductSortBy.VIEWS:
                cursorData.views = productItem.views;
                break;
        }
        return Buffer.from(JSON.stringify(cursorData)).toString('base64');
    }
    getAppliedFilters(query) {
        const applied = {};
        if (query.search)
            applied.search = query.search;
        if (query.status)
            applied.status = query.status;
        if (query.categoryIds)
            applied.categoryIds = query.categoryIds;
        if (query.categorySlug)
            applied.categorySlug = query.categorySlug;
        if (query.categoryPath)
            applied.categoryPath = query.categoryPath;
        if (query.brandIds)
            applied.brandIds = query.brandIds;
        if (query.countryIds)
            applied.countryIds = query.countryIds;
        if (query.minPrice !== undefined)
            applied.minPrice = query.minPrice;
        if (query.maxPrice !== undefined)
            applied.maxPrice = query.maxPrice;
        if (query.inStock !== undefined)
            applied.inStock = query.inStock;
        if (query.minStock !== undefined)
            applied.minStock = query.minStock;
        if (query.maxStock !== undefined)
            applied.maxStock = query.maxStock;
        if (query.hasActiveVariants !== undefined)
            applied.hasActiveVariants = query.hasActiveVariants;
        if (query.minVariantPrice !== undefined)
            applied.minVariantPrice = query.minVariantPrice;
        if (query.maxVariantPrice !== undefined)
            applied.maxVariantPrice = query.maxVariantPrice;
        if (query.sku)
            applied.sku = query.sku;
        if (query.attributes)
            applied.attributes = query.attributes;
        if (query.sortBy)
            applied.sortBy = query.sortBy;
        if (query.sortOrder)
            applied.sortOrder = query.sortOrder;
        return applied;
    }
};
exports.FindAllProductService = FindAllProductService;
exports.FindAllProductService = FindAllProductService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], FindAllProductService);
//# sourceMappingURL=find-all-product.service.js.map