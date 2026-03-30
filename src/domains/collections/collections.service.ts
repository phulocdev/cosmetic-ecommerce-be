import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException
} from '@nestjs/common'
import { Prisma } from '@prisma/client'
import { CursorPaginatedResponseDto, OffsetPaginatedResponseDto } from 'core'
import { PrismaService } from 'database/prisma/prisma.service'
import { CreateCollectionDto } from './dto/create-collection.dto'
import { GetCollectionsQueryDto } from './dto/get-collections-query.dto'
import { UpdateCollectionDto } from './dto/update-collection.dto'
import { Collection } from './entities/collection.entity'
import { CollectionSortBy, PaginationType, SortOrder } from 'enums'
import { UtcDateRange } from 'utils'
import { slugifyString } from 'utils'
import { CollectionCursorData } from 'types'

@Injectable()
export class CollectionsService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(dto: CreateCollectionDto) {
    const existingCollection = await this.prismaService.collection.findFirst({
      where: { slug: dto.slug, isDeleted: false }
    })

    if (existingCollection) {
      throw new ConflictException(`Collection with slug '${dto.slug}' already exists`)
    }

    const productIds = (dto.products ?? []).map((p) => p.productId)

    // Derive attributes and categories from products
    let attributeIds: string[] = []
    let categoryIds: string[] = []

    if (productIds.length) {
      const derivedData = await this.deriveFromProducts(productIds)
      attributeIds = derivedData.attributes.map((a) => a.id)
      categoryIds = derivedData.categories.map((c) => c.id)
    }

    return this.prismaService.collection.create({
      data: {
        title: dto.title,
        slug: dto.slug || slugifyString(dto.title),
        description: dto.description,
        imageUrl: dto.imageUrl,
        isActive: dto.isActive ?? true,
        metaTitle: dto.metaTitle,
        metaDescription: dto.metaDescription,

        products: productIds.length
          ? {
              createMany: {
                data: (dto.products ?? []).map((p) => ({
                  productId: p.productId,
                  displayOrder: p.displayOrder ?? 0
                })),
                skipDuplicates: true
              }
            }
          : undefined,

        attributes: attributeIds.length
          ? {
              createMany: {
                data: attributeIds.map((attributeId) => ({ attributeId })),
                skipDuplicates: true
              }
            }
          : undefined,

        categories: categoryIds.length
          ? {
              createMany: {
                data: categoryIds.map((categoryId) => ({ categoryId })),
                skipDuplicates: true
              }
            }
          : undefined
      }
      // include: collectionFullInclude
    })
  }

  async findAll(
    query: GetCollectionsQueryDto,
    dateRange?: UtcDateRange
  ): Promise<OffsetPaginatedResponseDto<Collection> | CursorPaginatedResponseDto<Collection>> {
    if (query.paginationType === PaginationType.CURSOR) {
      return this.findAllWithCursorPagination(query, dateRange)
    }
    return this.findAllWithOffsetPagination(query, dateRange)
  }

  private async findAllWithOffsetPagination(
    query: GetCollectionsQueryDto,
    dateRange?: UtcDateRange
  ): Promise<OffsetPaginatedResponseDto<Collection>> {
    const { page = 1, limit = 20, sortBy, sortOrder, includeProductCount } = query
    const skip = (page - 1) * limit

    const where = this.buildCollectionWhereClause(query)

    // Apply date range filter if provided (assuming we want to filter by createdAt)
    if (dateRange) {
      where.createdAt = {
        gte: dateRange.from,
        lte: dateRange.to
      }
    }

    const include = this.buildCollectionIncludeClause(query)
    const orderByList = this.buildCollectionOrderByClause(sortBy, sortOrder)

    const [collections, totalItems] = await Promise.all([
      this.prismaService.collection.findMany({
        where,
        include,
        skip,
        take: limit,
        orderBy: orderByList
      }),
      this.prismaService.collection.count({ where })
    ])

    let collectionItems = collections.map((col) => ({
      ...col,
      productCount: includeProductCount ? (col as any)._count?.products : undefined,
      _count: undefined
    }))

    // Sort by product count in application code after fetching (computed field)
    if (sortBy === CollectionSortBy.PRODUCT_COUNT && includeProductCount) {
      collectionItems.sort((a, b) => {
        const countA = a.productCount || 0
        const countB = b.productCount || 0
        return sortOrder === 'asc' ? countA - countB : countB - countA
      })
    }

    return new OffsetPaginatedResponseDto<Collection>({
      items: collectionItems,
      limit,
      page,
      total: totalItems
    })
  }

  private async findAllWithCursorPagination(
    query: GetCollectionsQueryDto,
    dateRange?: UtcDateRange
  ): Promise<CursorPaginatedResponseDto<Collection>> {
    const {
      limit = 20,
      cursor,
      sortBy = CollectionSortBy.CREATED_AT,
      sortOrder = SortOrder.DESC
    } = query

    if (sortBy === CollectionSortBy.PRODUCT_COUNT) {
      throw new BadRequestException(
        'Cursor-based pagination is not supported for PRODUCT_COUNT sort. Use offset pagination instead.'
      )
    }

    // Decode cursor if provided
    let cursorData: CollectionCursorData | null = null
    if (cursor) {
      try {
        cursorData = JSON.parse(Buffer.from(cursor, 'base64').toString('utf-8'))
      } catch {
        throw new BadRequestException('Invalid cursor format')
      }
    }

    const baseWhere = this.buildCollectionWhereClause(query)
    const where = this.buildCollectionCursorWhereClause(baseWhere, cursorData, sortBy, sortOrder)
    const include = this.buildCollectionIncludeClause(query)
    const orderByList = this.buildCollectionOrderByClause(sortBy, sortOrder)

    // Apply date range filter if provided (assuming we want to filter by createdAt)
    if (dateRange) {
      where.createdAt = {
        gte: dateRange.from,
        lte: dateRange.to
      }
    }

    // Fetch limit + 1 to check if there's a next page
    const [collections, totalItems] = await Promise.all([
      this.prismaService.collection.findMany({
        where,
        include,
        orderBy: orderByList,
        take: limit + 1
      }),
      this.prismaService.collection.count({ where })
    ])

    const hasNextPage = collections.length > limit
    if (hasNextPage) {
      collections.pop()
    }

    const collectionItems = collections.map((col) => ({
      ...col,
      productCount: query.includeProductCount ? (col as any)._count?.products : undefined,
      _count: undefined
    }))

    let nextCursor: string | null = null
    if (hasNextPage && collectionItems.length > 0) {
      const lastItem = collectionItems[collectionItems.length - 1] as Collection
      nextCursor = this.encodeCollectionCursor(lastItem, sortBy)
    }

    let previousCursor: string | null = null
    if (collectionItems.length > 0 && cursor) {
      const firstItem = collectionItems[0] as Collection
      previousCursor = this.encodeCollectionCursor(firstItem, sortBy)
    }

    return new CursorPaginatedResponseDto<Collection>({
      items: collectionItems,
      nextCursor,
      total: totalItems,
      previousCursor,
      hasNextPage,
      hasPreviousPage: !!cursor
    })
  }

  async findOne(id: string): Promise<Collection> {
    const collection = await this.prismaService.collection.findFirst({
      where: { id, isDeleted: false },
      include: {
        products: {
          orderBy: { displayOrder: 'asc' as const },
          include: {
            product: {
              select: {
                id: true,
                name: true,
                slug: true,
                basePrice: true,
                status: true,
                images: {
                  where: { isDeleted: false },
                  select: { url: true, altText: true },
                  orderBy: { displayOrder: 'asc' as const },
                  take: 1
                }
              }
            }
          }
        },
        categories: {
          include: {
            category: false
          }
        }
      }
    })

    if (!collection) {
      throw new NotFoundException(`Collection with ID ${id} not found`)
    }

    return collection
  }

  async findBySlug(slug: string) {
    if (!slug) {
      throw new BadRequestException('Slug is required')
    }

    const collection = await this.prismaService.collection.findFirst({
      where: { slug, isDeleted: false, isActive: true },
      include: {
        products: {
          orderBy: { displayOrder: 'asc' as const },
          include: {
            product: false // Just need productId for the FE to fetch product list separately with its own pagination and filters (in the product endpoint)
          }
        },
        attributes: {
          include: {
            attribute: {
              select: {
                id: true,
                name: true,
                values: {
                  where: { isDeleted: false },
                  select: { id: true, value: true },
                  orderBy: { value: 'asc' as const }
                }
              }
            }
          }
        },
        categories: {
          include: {
            category: {
              select: {
                id: true,
                name: true
              }
            }
          }
        }
      }
    })
    if (!collection) throw new NotFoundException(`Collection "${slug}" not found`)
    return collection
  }

  async update(id: string, updateCollectionDto: UpdateCollectionDto): Promise<Collection> {
    await this.findOrThrow(id)

    if (updateCollectionDto.slug) {
      const existingCollection = await this.prismaService.collection.findFirst({
        where: {
          slug: updateCollectionDto.slug,
          isDeleted: false,
          id: { not: id }
        }
      })

      if (existingCollection) {
        throw new ConflictException(
          `Collection with slug '${updateCollectionDto.slug}' already exists`
        )
      }
    }

    // Sync sub-resources if provided (full replacement strategy)
    return this.prismaService.$transaction(async (tx) => {
      if (updateCollectionDto.products !== undefined) {
        await tx.collectionProduct.deleteMany({ where: { collectionId: id } })

        if (updateCollectionDto.products.length) {
          await tx.collectionProduct.createMany({
            data: updateCollectionDto.products.map((p) => ({
              collectionId: id,
              productId: p.productId,
              displayOrder: p.displayOrder ?? 0
            })),
            skipDuplicates: true
          })

          // Derive attributes and categories from products if products are being updated

          const productIds = updateCollectionDto.products.map((p) => p.productId)
          const { attributes, categories } = await this.deriveFromProducts(productIds)

          // Sync attributes
          await tx.collectionAttribute.deleteMany({ where: { collectionId: id } })
          if (attributes.length) {
            await tx.collectionAttribute.createMany({
              data: attributes.map((a) => ({
                collectionId: id,
                attributeId: a.id
              })),
              skipDuplicates: true
            })
          }

          // Sync categories
          await tx.collectionCategory.deleteMany({ where: { collectionId: id } })
          if (categories.length) {
            await tx.collectionCategory.createMany({
              data: categories.map((c) => ({
                collectionId: id,
                categoryId: c.id
              })),
              skipDuplicates: true
            })
          }

          const { products, ...remainingFields } = updateCollectionDto
          return tx.collection.update({
            where: { id },
            data: remainingFields
          })
        }
      }
    })
  }

  async remove(id: string) {
    await this.findOrThrow(id)
    return this.prismaService.collection.update({
      where: { id },
      data: { isDeleted: true, deletedAt: new Date() }
    })
  }

  async softDelete(id: string): Promise<Collection> {
    // Check if collection exists
    await this.findOrThrow(id)

    return this.prismaService.collection.update({
      where: { id },
      data: { isDeleted: true }
    })
  }

  // ─── Helper Methods ───────────────────────────────────────────────────────

  private buildCollectionWhereClause(query: GetCollectionsQueryDto): Prisma.CollectionWhereInput {
    const { search, isActive, isDeleted } = query
    const where: Prisma.CollectionWhereInput = {}

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { slug: { contains: search, mode: 'insensitive' } }
      ]
    }

    if (isActive !== undefined) {
      where.isActive = isActive
    }

    if (isDeleted !== undefined) {
      where.isDeleted = isDeleted
    }

    return where
  }

  private buildCollectionIncludeClause(query: GetCollectionsQueryDto): Prisma.CollectionInclude {
    const { includeProductCount, includeProducts, includeAttributes, includeCategories } = query
    const include: Prisma.CollectionInclude = {}

    if (includeProductCount) {
      include._count = { select: { products: true } }
    }

    if (includeProducts) {
      include.products = {
        include: {
          product: true
        },
        orderBy: { displayOrder: 'asc' }
      }
    }

    if (includeAttributes) {
      include.attributes = {
        include: {
          attribute: true
        }
      }
    }

    if (includeCategories) {
      include.categories = {
        include: {
          category: true
        }
      }
    }

    return include
  }

  private buildCollectionOrderByClause(
    sortBy: CollectionSortBy = CollectionSortBy.CREATED_AT,
    sortOrder: SortOrder = SortOrder.DESC
  ): Prisma.CollectionOrderByWithRelationInput[] {
    const orderBy: Prisma.CollectionOrderByWithRelationInput[] = []

    switch (sortBy) {
      case CollectionSortBy.TITLE:
        orderBy.push({ title: sortOrder })
        break
      case CollectionSortBy.SLUG:
        orderBy.push({ slug: sortOrder })
        break
      case CollectionSortBy.CREATED_AT:
        orderBy.push({ createdAt: sortOrder })
        break
      case CollectionSortBy.PRODUCT_COUNT:
        // Product count is computed, so we don't add it to orderBy here
        // It will be sorted in application code after fetching
        break
      default:
        orderBy.push({ createdAt: sortOrder })
    }

    // Always add ID as secondary sort for consistent ordering
    if (sortBy !== CollectionSortBy.CREATED_AT) {
      orderBy.push({ id: 'asc' })
    }

    return orderBy
  }

  private buildCollectionCursorWhereClause(
    baseWhere: Prisma.CollectionWhereInput,
    cursorData: CollectionCursorData | null,
    sortBy: CollectionSortBy,
    sortOrder: SortOrder
  ): Prisma.CollectionWhereInput {
    if (!cursorData) return baseWhere

    const where: Prisma.CollectionWhereInput = { ...baseWhere }
    const isAscending = sortOrder === SortOrder.ASC
    const operator = isAscending ? 'gt' : 'lt'

    const cursorConditions: any[] = []

    switch (sortBy) {
      case CollectionSortBy.CREATED_AT:
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
          })
        }
        break

      case CollectionSortBy.TITLE:
        if (cursorData.title) {
          cursorConditions.push({
            OR: [
              { title: { [operator]: cursorData.title } },
              {
                AND: [
                  { title: { equals: cursorData.title } },
                  { id: { [operator]: cursorData.id } }
                ]
              }
            ]
          })
        }
        break

      case CollectionSortBy.SLUG:
        if (cursorData.slug) {
          cursorConditions.push({
            OR: [
              { slug: { [operator]: cursorData.slug } },
              {
                AND: [{ slug: { equals: cursorData.slug } }, { id: { [operator]: cursorData.id } }]
              }
            ]
          })
        }
        break
    }

    if (cursorConditions.length > 0) {
      where.AND = cursorConditions
    }

    return where
  }

  private encodeCollectionCursor(collection: Collection, sortBy: CollectionSortBy): string {
    const cursorData: CollectionCursorData = { id: collection.id }

    switch (sortBy) {
      case CollectionSortBy.CREATED_AT:
        cursorData.createdAt = collection.createdAt
        break
      case CollectionSortBy.TITLE:
        cursorData.title = collection.title
        break
      case CollectionSortBy.SLUG:
        cursorData.slug = collection.slug
        break
    }

    return Buffer.from(JSON.stringify(cursorData)).toString('base64')
  }

  // ─── Existing Helpers ─────────────────────────────────────────────────────

  private async findOrThrow(id: string) {
    const collection = await this.prismaService.collection.findFirst({
      where: { id, isDeleted: false }
    })
    if (!collection) throw new NotFoundException(`Collection ${id} not found`)
    return collection
  }

  // ─── Derive suggestions for the admin UI ──────────────────────────────────

  /**
   * When the admin selects a set of products, the FE calls this endpoint to
   * get suggested attributes + categories derived from those products so the
   * admin can confirm / tweak the filter panel.
   */
  async deriveFromProducts(productIds: string[]): Promise<{
    attributes: { id: string; name: string; slug: string }[]
    categories: { id: string; name: string; slug: string; parentId: string | null; depth: number }[]
  }> {
    if (!productIds?.length) {
      throw new BadRequestException('productIds must not be empty')
    }

    const [attributes, categories] = await Promise.all([
      this.deriveAttributesFromProducts(productIds),
      this.deriveCategoriesFromProducts(productIds)
    ])

    return { attributes, categories }
  }

  /**
   * Derives the set of attribute IDs that are actually used by the products in
   * this collection (via variant → attributeValue → attribute).  Returns a
   * de-duplicated list sorted by attribute name.
   */
  async deriveAttributesFromProducts(productIds: string[]) {
    if (!productIds.length) return []

    const attributes = await this.prismaService.attribute.findMany({
      where: {
        isDeleted: false,
        values: {
          some: {
            isDeleted: false,
            variants: {
              some: {
                isDeleted: false,
                variant: {
                  isActive: true,
                  product: { id: { in: productIds } }
                }
              }
            }
          }
        }
      },
      select: { id: true, name: true, slug: true },
      orderBy: { name: 'asc' }
    })

    return attributes
  }

  /**
   * Derives the set of category IDs that are associated with the given products
   * (via ProductCategory).  Returns a de-duplicated list.
   */
  async deriveCategoriesFromProducts(productIds: string[]) {
    if (!productIds.length) return []

    const categories = await this.prismaService.category.findMany({
      where: {
        isDeleted: false,
        isActive: true,
        products: { some: { productId: { in: productIds } } }
      },
      select: {
        id: true,
        name: true,
        slug: true,
        parentId: true,
        path: true,
        depth: true
      },
      orderBy: { name: 'asc' }
    })

    return categories
  }
}
