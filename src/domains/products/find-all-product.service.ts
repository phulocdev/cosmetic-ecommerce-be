import { BadRequestException, Injectable } from '@nestjs/common'
import { Prisma } from '@prisma/client'
import { PaginationQueryDto } from 'core'
import { PrismaService } from 'database/prisma/prisma.service'
import {
  CursorPaginatedProductListResponse,
  OffsetPaginatedProductListResponse,
  ProductQueryDto
} from 'domains/products/dto/find-all-product.dto'
import { ProductSortBy, SortOrder } from 'enums'
import { CursorData } from 'types'

@Injectable()
export class FindAllProductService {
  constructor(private readonly prismaService: PrismaService) {}

  /**
   * Find all products with OFFSET-based pagination
   *
   * Pros:
   * - Simple to implement
   * - Easy to jump to any / arbitrary page
   * - Total count available
   *
   * Cons:
   * - Performance degrades with high offsets
   * - Inconsistent results if data changes between requests, example: new items added or removed
   *    => items may be skipped or duplicated when paginating / move between pages
   * - Not suitable for real-time feeds
   */
  async findAllWithOffsetPagination(query: ProductQueryDto): Promise<OffsetPaginatedProductListResponse> {
    const page = query.page || 1
    const limit = query.limit || 20
    const skip = (page - 1) * limit

    // Build WHERE clause
    const where = this.buildWhereClause(query)

    // Build ORDER BY clause
    const orderBy = this.buildOrderByClause(query.sortBy, query.sortOrder)

    // Build include clause
    const include = this.buildIncludeClause(query)

    // Execute query with pagination
    const [products, total] = await Promise.all([
      this.prismaService.product.findMany({
        where,
        include,
        orderBy,
        skip,
        take: limit
      }),
      this.prismaService.product.count({ where })
    ])

    return new OffsetPaginatedProductListResponse({
      items: products,
      limit,
      page,
      total,
      filters: { applied: this.getAppliedFilters(query) }
    })
  }

  /**
   * Find all products with CURSOR-based (keyset) pagination
   *
   * Pros:
   * - Consistent performance regardless of dataset size
   * - Stable results even when data changes
   * - Efficient for real-time feeds
   * - No duplicate/missing items when paginating
   *
   * Cons:
   * - Can't jump to arbitrary pages
   * - No total count (expensive to compute)
   * - More complex to implement
   * - Requires indexed sort columns
   */
  async findAllWithCursorPagination(
    query: ProductQueryDto & PaginationQueryDto
  ): Promise<CursorPaginatedProductListResponse> {
    const limit = query.limit || 20
    const cursor = query.cursor
    const sortBy = query.sortBy || ProductSortBy.CREATED_AT
    const sortOrder = query.sortOrder || SortOrder.DESC

    // Decode cursor if provided
    let cursorData: CursorData | null = null
    if (cursor) {
      try {
        cursorData = JSON.parse(Buffer.from(cursor, 'base64').toString('utf-8'))
      } catch (error) {
        throw new BadRequestException('Invalid cursor format')
      }
    }

    // Build WHERE clause
    const baseWhere = this.buildWhereClause(query)
    const where = this.buildCursorWhereClause(baseWhere, cursorData, sortBy, sortOrder)

    // Build ORDER BY clause
    const orderBy = this.buildOrderByClause(sortBy, sortOrder)

    // Build include clause
    const include = this.buildIncludeClause(query)

    // Fetch limit + 1 to check if there's a next page
    const products = await this.prismaService.product.findMany({
      where,
      include,
      orderBy,
      take: limit + 1
    })

    // Check if there's a next page
    const hasNextPage = products.length > limit
    if (hasNextPage) {
      products.pop() // Remove the extra item
    }

    // Generate next cursor
    let nextCursor: string | null = null
    if (hasNextPage && products.length > 0) {
      const lastItem = products[products.length - 1]
      nextCursor = this.encodeCursor(lastItem, sortBy)
    }

    // Generate previous cursor (simplified - based on first item)
    let previousCursor: string | null = null
    if (products.length > 0 && cursor) {
      const firstItem = products[0]
      previousCursor = this.encodeCursor(firstItem, sortBy)
    }

    return new CursorPaginatedProductListResponse({
      items: products,
      nextCursor,
      previousCursor,
      hasNextPage,
      hasPreviousPage: !!cursor,
      filters: { applied: this.getAppliedFilters(query) }
    })
  }

  /**
   * Build WHERE clause from filters
   */
  private buildWhereClause(query: ProductQueryDto): Prisma.ProductWhereInput {
    const where: Prisma.ProductWhereInput = {
      AND: []
    }

    // Text search (name, description, code)
    if (query.search) {
      ;(where.AND as any[]).push({
        OR: [
          { name: { contains: query.search, mode: 'insensitive' } },
          { description: { contains: query.search, mode: 'insensitive' } },
          { code: { contains: query.search, mode: 'insensitive' } }
        ]
      })
    }

    // Status filter
    if (query.status) {
      ;(where.AND as any[]).push({ status: query.status })
    }

    // Category filters
    if (query.categoryIds && query.categoryIds.length > 0) {
      ;(where.AND as any[]).push({
        categories: {
          some: {
            category: {
              id: { in: query.categoryIds }
            }
          }
        }
      })
    }

    if (query.categorySlug) {
      ;(where.AND as any[]).push({
        categories: {
          some: {
            category: {
              slug: query.categorySlug
            }
          }
        }
      })
    }

    if (query.categoryPath) {
      ;(where.AND as any[]).push({
        categories: {
          some: {
            category: {
              path: { startsWith: query.categoryPath }
            }
          }
        }
      })
    }

    // Brand filter
    if (query.brandIds && query.brandIds.length > 0) {
      ;(where.AND as any[]).push({
        brandId: { in: query.brandIds }
      })
    }

    // Country filter
    if (query.countryIds && query.countryIds.length > 0) {
      ;(where.AND as any[]).push({
        countryOriginId: { in: query.countryIds }
      })
    }

    // Price range (base price)
    if (query.minPrice !== undefined || query.maxPrice !== undefined) {
      const priceCondition: any = {}
      if (query.minPrice !== undefined) {
        priceCondition.gte = new Prisma.Decimal(query.minPrice)
      }
      if (query.maxPrice !== undefined) {
        priceCondition.lte = new Prisma.Decimal(query.maxPrice)
      }
      ;(where.AND as any[]).push({ basePrice: priceCondition })
    }

    // Variant-based filters
    if (query.inStock !== undefined && query.inStock) {
      ;(where.AND as any[]).push({
        variants: {
          some: {
            stockOnHand: { gt: 0 },
            isActive: true
          }
        }
      })
    }

    if (query.minStock !== undefined || query.maxStock !== undefined) {
      const stockCondition: any = {}
      if (query.minStock !== undefined) {
        stockCondition.gte = query.minStock
      }
      if (query.maxStock !== undefined) {
        stockCondition.lte = query.maxStock
      }
      ;(where.AND as any[]).push({
        variants: {
          some: {
            stockOnHand: stockCondition
          }
        }
      })
    }

    if (query.hasActiveVariants !== undefined && query.hasActiveVariants) {
      ;(where.AND as any[]).push({
        variants: {
          some: {
            isActive: true
          }
        }
      })
    }

    // Variant price range - selling price
    if (query.minVariantPrice !== undefined || query.maxVariantPrice !== undefined) {
      const variantPriceCondition: any = {}
      if (query.minVariantPrice !== undefined) {
        variantPriceCondition.gte = new Prisma.Decimal(query.minVariantPrice)
      }
      if (query.maxVariantPrice !== undefined) {
        variantPriceCondition.lte = new Prisma.Decimal(query.maxVariantPrice)
      }
      ;(where.AND as any[]).push({
        variants: {
          some: {
            sellingPrice: variantPriceCondition
          }
        }
      })
    }

    // SKU filter
    if (query.sku) {
      ;(where.AND as any[]).push({
        variants: {
          some: {
            sku: { contains: query.sku, mode: 'insensitive' }
          }
        }
      })
    }

    // Attribute filters (dynamic)
    if (query.attributes && Object.keys(query.attributes).length > 0) {
      for (const [attributeSlug, values] of Object.entries(query.attributes)) {
        const valueArray = values.split(',').map((v) => v.trim())

        ;(where.AND as any[]).push({
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
        })
      }
    }

    // Date range filters
    if (query.createdAfter || query.createdBefore) {
      const dateCondition: Prisma.DateTimeFilter = {}
      if (query.createdAfter) {
        dateCondition.gte = query.createdAfter
      }
      if (query.createdBefore) {
        dateCondition.lte = query.createdBefore
      }
      ;(where.AND as any[]).push({ createdAt: dateCondition })
    }

    // Clean up empty AND array
    if ((where.AND as any[]).length === 0) {
      delete where.AND
    }

    return where
  }

  /**
   * Build WHERE clause with cursor conditions for keyset pagination
   */
  private buildCursorWhereClause(
    baseWhere: Prisma.ProductWhereInput,
    cursorData: CursorData | null,
    sortBy: ProductSortBy,
    sortOrder: SortOrder
  ): Prisma.ProductWhereInput {
    if (!cursorData) {
      return baseWhere
    }

    const where: Prisma.ProductWhereInput = { ...baseWhere }
    const cursorConditions: any[] = []

    // Build cursor condition based on sort field
    const isAscending = sortOrder === SortOrder.ASC
    const operator = isAscending ? 'gt' : 'lt'

    switch (sortBy) {
      case ProductSortBy.CREATED_AT:
        if (cursorData.createdAt) {
          cursorConditions.push({
            OR: [
              { createdAt: { [operator]: cursorData.createdAt } },
              // The below condition ensures stable sorting by using ID as tiebreaker
              // When multiple items have the same createdAt timestamp, we compare their IDs to decide order
              //  => Consistently paginate without skipping or duplicating items. Additionaly, assure the cosistency of results between many users' requests
              {
                AND: [{ createdAt: { equals: cursorData.createdAt } }, { id: { [operator]: cursorData.id } }]
              }
            ]
          })
        }
        break

      case ProductSortBy.UPDATED_AT:
        if (cursorData.updatedAt) {
          cursorConditions.push({
            OR: [
              { updatedAt: { [operator]: cursorData.updatedAt } },
              {
                AND: [{ updatedAt: { equals: cursorData.updatedAt } }, { id: { [operator]: cursorData.id } }]
              }
            ]
          })
        }
        break

      case ProductSortBy.PRICE:
        if (cursorData.basePrice !== undefined) {
          cursorConditions.push({
            OR: [
              { basePrice: { [operator]: new Prisma.Decimal(cursorData.basePrice) } },
              {
                AND: [
                  { basePrice: { equals: new Prisma.Decimal(cursorData.basePrice) } },
                  { id: { [operator]: cursorData.id } }
                ]
              }
            ]
          })
        }
        break

      case ProductSortBy.NAME:
        if (cursorData.name) {
          cursorConditions.push({
            OR: [
              { name: { [operator]: cursorData.name } },
              {
                AND: [{ name: { equals: cursorData.name } }, { id: { [operator]: cursorData.id } }]
              }
            ]
          })
        }
        break

      case ProductSortBy.VIEWS:
        if (cursorData.views !== undefined) {
          cursorConditions.push({
            OR: [
              { views: { [operator]: cursorData.views } },
              {
                AND: [{ views: { equals: cursorData.views } }, { id: { [operator]: cursorData.id } }]
              }
            ]
          })
        }
        break
    }

    if (cursorConditions.length > 0) {
      if (where.AND) {
        ;(where.AND as any[]).push(...cursorConditions)
      } else {
        where.AND = cursorConditions
      }
    }

    return where
  }

  /**
   * Build ORDER BY clause
   */
  private buildOrderByClause(sortBy?: ProductSortBy, sortOrder?: SortOrder): Prisma.ProductOrderByWithRelationInput[] {
    const sort = sortBy || ProductSortBy.CREATED_AT
    const order = sortOrder || SortOrder.DESC

    const orderByList: Prisma.ProductOrderByWithRelationInput[] = []

    switch (sort) {
      case ProductSortBy.CREATED_AT:
        orderByList.push({ createdAt: order })
        break
      case ProductSortBy.UPDATED_AT:
        orderByList.push({ updatedAt: order })
        break
      case ProductSortBy.PRICE:
        orderByList.push({ basePrice: order })
        break
      case ProductSortBy.NAME:
        orderByList.push({ name: order })
        break
      case ProductSortBy.VIEWS:
        orderByList.push({ views: order })
        break
      case ProductSortBy.POPULARITY:
        // Popularity could be a computed field or based on views
        orderByList.push({ views: order })
        break
    }

    // Always add ID as tiebreaker for stable sorting
    // If you are still vaguely wondering why we need this sorting by ID as "tiebreaker"
    // Read this: https://chatgpt.com/share/6983007e-f300-8001-865b-67ade9d65f66
    orderByList.push({ id: order })

    return orderByList
  }

  /**
   * Build include clause based on query options
   */
  private buildIncludeClause(query: ProductQueryDto): Prisma.ProductInclude {
    const include: Prisma.ProductInclude = {}

    if (query.includeBrandAndCountry) {
      include.brand = true
      include.countryOfOrigin = true
    }

    if (query.includeCategories) {
      include.categories = {
        include: {
          category: true
        }
      }
    }

    if (query.includeImages) {
      include.images = true
    }

    if (query.includeAttributes) {
      include.attributes = {
        include: {
          attribute: {
            include: {
              values: true
            }
          }
        }
      }
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
          },
          images: true
        }
      }
    }

    return include
  }

  /**
   * Encode cursor for pagination
   */
  private encodeCursor(productItem: any, sortBy: ProductSortBy): string {
    const cursorData: CursorData = {
      id: productItem.id // Product ID is always included for tiebreaking
    }

    switch (sortBy) {
      case ProductSortBy.CREATED_AT:
        cursorData.createdAt = productItem.createdAt
        break
      case ProductSortBy.UPDATED_AT:
        cursorData.updatedAt = productItem.updatedAt
        break
      case ProductSortBy.PRICE:
        cursorData.basePrice = parseFloat(productItem.basePrice)
        break
      case ProductSortBy.NAME:
        cursorData.name = productItem.name
        break
      case ProductSortBy.VIEWS:
        cursorData.views = productItem.views
        break
    }

    return Buffer.from(JSON.stringify(cursorData)).toString('base64')
  }

  /**
   * Get applied filters for response metadata
   */
  private getAppliedFilters(query: ProductQueryDto): Record<string, any> {
    const applied: Record<string, any> = {}

    if (query.search) applied.search = query.search
    if (query.status) applied.status = query.status
    if (query.categoryIds) applied.categoryIds = query.categoryIds
    if (query.categorySlug) applied.categorySlug = query.categorySlug
    if (query.categoryPath) applied.categoryPath = query.categoryPath
    if (query.brandIds) applied.brandIds = query.brandIds
    if (query.countryIds) applied.countryIds = query.countryIds
    if (query.minPrice !== undefined) applied.minPrice = query.minPrice
    if (query.maxPrice !== undefined) applied.maxPrice = query.maxPrice
    if (query.inStock !== undefined) applied.inStock = query.inStock
    if (query.minStock !== undefined) applied.minStock = query.minStock
    if (query.maxStock !== undefined) applied.maxStock = query.maxStock
    if (query.hasActiveVariants !== undefined) applied.hasActiveVariants = query.hasActiveVariants
    if (query.minVariantPrice !== undefined) applied.minVariantPrice = query.minVariantPrice
    if (query.maxVariantPrice !== undefined) applied.maxVariantPrice = query.maxVariantPrice
    if (query.sku) applied.sku = query.sku
    if (query.attributes) applied.attributes = query.attributes
    if (query.createdAfter) applied.createdAfter = query.createdAfter
    if (query.createdBefore) applied.createdBefore = query.createdBefore
    if (query.sortBy) applied.sortBy = query.sortBy
    if (query.sortOrder) applied.sortOrder = query.sortOrder

    return applied
  }
}
