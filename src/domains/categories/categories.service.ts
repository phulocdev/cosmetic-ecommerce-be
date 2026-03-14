import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException
} from '@nestjs/common'
import { Prisma } from '@prisma/client'
import { CursorPaginatedResponseDto, OffsetPaginatedResponseDto } from 'core'
import { PrismaService } from 'database/prisma/prisma.service'
import {
  GetCategoriesQueryDto,
  GetCategoryTreeQueryDto,
  MoveCategoryDto
} from 'domains/categories/dto/query-category.dto'
import {
  BreadcrumbItem,
  Category,
  CategoryTreeNode
} from 'domains/categories/entities/category.entity'
import { CategorySortBy, CategoryTreeFormat, PaginationType, SortOrder } from 'enums'
import { CategoryCursorData } from 'types'
import { CreateCategoryDto } from './dto/create-category.dto'
import { UpdateCategoryDto } from './dto/update-category.dto'
import { UtcDateRange } from 'utils'
import { slugifyString } from 'utils/business.util'

@Injectable()
export class CategoriesService {
  constructor(private readonly prismaService: PrismaService) {}

  /**
   * Get category tree (hierarchical structure)
   */
  async getCategoryTree(query: GetCategoryTreeQueryDto): Promise<CategoryTreeNode[]> {
    const { rootId, maxDepth, activeOnly, format, includeProductCount, isDeleted } = query

    const where: Prisma.CategoryWhereInput = {}

    if (activeOnly) {
      where.isActive = true
    }

    if (isDeleted !== undefined) {
      where.isDeleted = isDeleted
    }

    if (rootId) {
      // Get categories under specific root
      const root = await this.prismaService.category.findUnique({
        where: { id: rootId }
      })

      if (!root) {
        throw new NotFoundException(`Root category with ID "${rootId}" not found`)
      }

      // Just need either the root OR its descendants
      where.OR = [{ id: rootId }, { path: { startsWith: `${root.path}${root.id}/` } }]

      if (maxDepth !== undefined) {
        where.depth = { lte: root.depth + maxDepth }
      }
    } else {
      // Get all categories
      if (maxDepth !== undefined) {
        where.depth = { lte: maxDepth }
      }
    }

    const include: Prisma.CategoryInclude = {}
    if (includeProductCount) {
      include._count = {
        select: { products: true }
      }
    }

    const categories = await this.prismaService.category.findMany({
      where,
      include,
      orderBy: [{ depth: 'asc' }, { name: 'asc' }]
    })

    if (format === CategoryTreeFormat.FLAT) {
      return categories.map((cat) => ({
        id: cat.id,
        name: cat.name,
        slug: cat.slug,
        path: cat.path,
        depth: cat.depth,
        isActive: cat.isActive,
        productCount: includeProductCount ? cat._count?.products : undefined
      }))
    }

    // Build nested tree - CategoryTreeFormat.NESTED
    return this.buildTree(categories, rootId, includeProductCount)
  }

  /**
   * Get breadcrumb trail for a category
   */
  async getBreadcrumbs(id: string): Promise<BreadcrumbItem[]> {
    const category = await this.prismaService.category.findUnique({
      where: { id }
    })

    if (!category) {
      throw new NotFoundException(`Category with ID "${id}" not found`)
    }

    if (category.depth === 0) {
      return [
        new BreadcrumbItem({
          id: category.id,
          name: category.name,
          slug: category.slug,
          path: category.path
        })
      ]
    }

    // Extract parent IDs from path
    const parentIds = category.path.split('/').filter((id) => id !== '')

    const parents = await this.prismaService.category.findMany({
      where: {
        id: { in: parentIds }
      },
      orderBy: { depth: 'asc' }
    })

    const breadcrumbs: BreadcrumbItem[] = parents.map(
      (cat) =>
        new BreadcrumbItem({
          id: cat.id,
          name: cat.name,
          slug: cat.slug,
          path: cat.path
        })
    )

    // Add current category
    breadcrumbs.push(
      new BreadcrumbItem({
        id: category.id,
        name: category.name,
        slug: category.slug,
        path: category.path
      })
    )

    return breadcrumbs
  }

  // Build nested tree structure from flat array
  private buildTree(
    categories: Category[],
    rootId?: string,
    includeProductCount = false
  ): CategoryTreeNode[] {
    const categoryMap = new Map<string, CategoryTreeNode>()
    const rootCategories: CategoryTreeNode[] = []

    // First pass: create nodes
    categories.forEach((cat) => {
      categoryMap.set(cat.id, {
        id: cat.id,
        name: cat.name,
        slug: cat.slug,
        path: cat.path,
        depth: cat.depth,
        isActive: cat.isActive,
        productCount: includeProductCount ? (cat as any)._count?.products : undefined,
        children: []
      })
    })

    // Second pass: build tree
    categories.forEach((cat) => {
      const node = categoryMap.get(cat.id)!

      if (cat.parentId && categoryMap.has(cat.parentId)) {
        const parent = categoryMap.get(cat.parentId)!
        if (!parent.children) {
          parent.children = []
        }
        parent.children.push(node)
      } else if (
        !rootId ||
        cat.id === rootId ||
        cat.parentId === null //  The root level - No parent - Top level categories
      ) {
        rootCategories.push(node)
      }
    })

    return rootCategories
  }

  /**
   * Get category by slug
   */
  async findBySlug(slug: string, includeChildren, includeProductCount): Promise<Category> {
    const include: Prisma.CategoryInclude = {}

    if (includeChildren) {
      include.children = {
        where: { isActive: true },
        orderBy: { name: 'asc' }
      }
    }

    if (includeProductCount) {
      include._count = {
        select: { products: true }
      }
    }

    const category = await this.prismaService.category.findUnique({
      where: { slug },
      include
    })

    if (!category) {
      throw new NotFoundException(`Category with slug "${slug}" not found`)
    }

    return new Category({
      ...category,
      productCount: includeProductCount ? (category as any)._count?.products : undefined
    })
  }

  /**
   * Create a new category
   */
  async create(createCategoryDto: CreateCategoryDto): Promise<Category> {
    const { name, slug, parentId, attributeIds, ...rest } = createCategoryDto

    // Generate slug if not provided
    const finalSlug = slug || slugifyString(name)

    // Check if slug already exists
    const existingSlug = await this.prismaService.category.findUnique({
      where: { slug: finalSlug }
    })

    if (existingSlug) {
      throw new ConflictException(`Category with slug "${finalSlug}" already exists`)
    }

    // Calculate path and depth
    let path = '/'
    let depth = 0

    if (parentId) {
      const parent = await this.prismaService.category.findUnique({
        where: { id: parentId }
      })

      if (!parent) {
        throw new NotFoundException(`Parent category with ID "${parentId}" not found`)
      }

      if (!parent.isActive) {
        throw new BadRequestException('Cannot create category under inactive parent')
      }

      path = `${parent.path}${parent.id}/`
      depth = parent.depth + 1
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
    })

    return new Category(category)
  }

  /**
   * Get paginated categories with filters (supports both offset and cursor pagination)
   */
  async findAll(
    query: GetCategoriesQueryDto,
    dateRange?: UtcDateRange
  ): Promise<OffsetPaginatedResponseDto<Category> | CursorPaginatedResponseDto<Category>> {
    if (query.paginationType === PaginationType.CURSOR) {
      return this.findAllWithCursorPagination(query, dateRange)
    }
    return this.findAllWithOffsetPagination(query, dateRange)
  }

  private async findAllWithOffsetPagination(
    query: GetCategoriesQueryDto,
    dateRange?: UtcDateRange
  ): Promise<OffsetPaginatedResponseDto<Category>> {
    const { page = 1, limit = 20, sortBy, sortOrder, includeProductCount } = query
    const skip = (page - 1) * limit

    const where = this.buildCategoryWhereClause(query)

    // Apply date range filter if provided (assuming we want to filter by createdAt)
    if (dateRange) {
      where.createdAt = {
        gte: dateRange.from,
        lte: dateRange.to
      }
    }

    const include = this.buildCategoryIncludeClause(query)
    const orderByList = this.buildCategoryOrderByClause(sortBy, sortOrder)

    const [categories, totalItems] = await Promise.all([
      this.prismaService.category.findMany({
        where,
        include,
        skip,
        take: limit,
        orderBy: orderByList
      }),
      this.prismaService.category.count({ where })
    ])

    let categoryItems = categories.map((cat) => ({
      ...cat,
      productCount: includeProductCount ? (cat as any)._count?.products : undefined,
      _count: undefined
    }))

    // Sort by product count in application code after fetching (computed field)
    if (sortBy === CategorySortBy.PRODUCT_COUNT && includeProductCount) {
      categoryItems.sort((a, b) => {
        const countA = a.productCount || 0
        const countB = b.productCount || 0
        return sortOrder === 'asc' ? countA - countB : countB - countA
      })
    }

    return new OffsetPaginatedResponseDto<Category>({
      items: categoryItems,
      limit,
      page,
      total: totalItems
    })
  }

  private async findAllWithCursorPagination(
    query: GetCategoriesQueryDto,
    dateRange?: UtcDateRange
  ): Promise<CursorPaginatedResponseDto<Category>> {
    const {
      limit = 20,
      cursor,
      sortBy = CategorySortBy.CREATED_AT,
      sortOrder = SortOrder.DESC
    } = query

    if (sortBy === CategorySortBy.PRODUCT_COUNT) {
      throw new BadRequestException(
        'Cursor-based pagination is not supported for PRODUCT_COUNT sort. Use offset pagination instead.'
      )
    }

    // Decode cursor if provided
    let cursorData: CategoryCursorData | null = null
    if (cursor) {
      try {
        cursorData = JSON.parse(Buffer.from(cursor, 'base64').toString('utf-8'))
      } catch {
        throw new BadRequestException('Invalid cursor format')
      }
    }

    const baseWhere = this.buildCategoryWhereClause(query)
    const where = this.buildCategoryCursorWhereClause(baseWhere, cursorData, sortBy, sortOrder)
    const include = this.buildCategoryIncludeClause(query)
    const orderByList = this.buildCategoryOrderByClause(sortBy, sortOrder)

    // Apply date range filter if provided (assuming we want to filter by createdAt)
    if (dateRange) {
      where.createdAt = {
        gte: dateRange.from,
        lte: dateRange.to
      }
    }

    // Fetch limit + 1 to check if there's a next page
    const categories = await this.prismaService.category.findMany({
      where,
      include,
      orderBy: orderByList,
      take: limit + 1
    })

    const hasNextPage = categories.length > limit
    if (hasNextPage) {
      categories.pop()
    }

    const categoryItems = categories.map((cat) => ({
      ...cat,
      productCount: query.includeProductCount ? (cat as any)._count?.products : undefined,
      _count: undefined
    }))

    let nextCursor: string | null = null
    if (hasNextPage && categoryItems.length > 0) {
      const lastItem = categoryItems[categoryItems.length - 1] as Category
      nextCursor = this.encodeCategoryCursor(lastItem, sortBy)
    }

    let previousCursor: string | null = null
    if (categoryItems.length > 0 && cursor) {
      const firstItem = categoryItems[0] as Category
      previousCursor = this.encodeCategoryCursor(firstItem, sortBy)
    }

    return new CursorPaginatedResponseDto<Category>({
      items: categoryItems,
      nextCursor,
      previousCursor,
      hasNextPage,
      hasPreviousPage: !!cursor
    })
  }

  private buildCategoryWhereClause(query: GetCategoriesQueryDto): Prisma.CategoryWhereInput {
    const { search, parentId, isActive, depth, isDeleted } = query
    const where: Prisma.CategoryWhereInput = {}

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { slug: { contains: search, mode: 'insensitive' } }
      ]
    }

    if (parentId !== undefined) {
      where.parentId = parentId === 'null' ? null : parentId
    }

    if (isActive !== undefined) {
      where.isActive = isActive
    }

    if (isDeleted !== undefined) {
      where.isDeleted = isDeleted
    }

    if (depth !== undefined) {
      where.depth = depth
    }

    return where
  }

  private buildCategoryIncludeClause(query: GetCategoriesQueryDto): Prisma.CategoryInclude {
    const { includeChildren, includeProductCount, includeParent, isActive, includeAttributes } =
      query
    const include: Prisma.CategoryInclude = {}

    if (includeChildren) {
      include.children = {
        where: isActive !== undefined ? { isActive } : undefined,
        orderBy: { name: 'asc' }
      }
    }

    if (includeProductCount) {
      include._count = {
        select: { products: true }
      }
    }

    if (includeParent) {
      include.parent = true
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
      }
    }

    return include
  }

  private buildCategoryOrderByClause(
    sortBy?: CategorySortBy,
    sortOrder?: SortOrder
  ): Prisma.CategoryOrderByWithRelationInput[] {
    const sort = sortBy || CategorySortBy.CREATED_AT
    const order = sortOrder || SortOrder.DESC
    const orderByList: Prisma.CategoryOrderByWithRelationInput[] = []

    switch (sort) {
      case CategorySortBy.CREATED_AT:
        orderByList.push({ createdAt: order })
        break
      case CategorySortBy.NAME:
        orderByList.push({ name: order })
        break
      case CategorySortBy.DEPTH:
        orderByList.push({ depth: order })
        break
      case CategorySortBy.SLUG:
        orderByList.push({ slug: order })
        break
      case CategorySortBy.PARENT_CATEGORY_NAME:
        orderByList.push({ parent: { name: order } })
      case CategorySortBy.PRODUCT_COUNT:
        // Product count sorting is handled in application code after fetching (for offset)
        // Not supported for cursor pagination
        break
    }

    // Always add ID as tiebreaker for stable sorting
    // If you are still vaguely wondering why we need this sorting by ID as "tiebreaker"
    // Read this: https://chatgpt.com/share/6983007e-f300-8001-865b-67ade9d65f66
    orderByList.push({ id: order })

    return orderByList
  }

  private buildCategoryCursorWhereClause(
    baseWhere: Prisma.CategoryWhereInput,
    cursorData: CategoryCursorData | null,
    sortBy: CategorySortBy,
    sortOrder: SortOrder
  ): Prisma.CategoryWhereInput {
    if (!cursorData) {
      return baseWhere
    }

    const where: Prisma.CategoryWhereInput = { ...baseWhere }
    const isAscending = sortOrder === SortOrder.ASC
    const operator = isAscending ? 'gt' : 'lt'

    const cursorConditions: any[] = []

    switch (sortBy) {
      case CategorySortBy.CREATED_AT:
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

      case CategorySortBy.NAME:
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

      case CategorySortBy.DEPTH:
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

  private encodeCategoryCursor(category: Category, sortBy: CategorySortBy): string {
    const cursorData: CategoryCursorData = { id: category.id }

    switch (sortBy) {
      case CategorySortBy.CREATED_AT:
        cursorData.createdAt = category.createdAt
        break
      case CategorySortBy.NAME:
        cursorData.name = category.name
        break
      case CategorySortBy.DEPTH:
        cursorData.depth = category.depth
        break
    }

    return Buffer.from(JSON.stringify(cursorData)).toString('base64')
  }

  /**
   * Get single category by ID
   */
  async findOne(id: string): Promise<Category> {
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
    })

    if (!category) {
      throw new NotFoundException(`Category with ID "${id}" not found`)
    }

    return category
  }

  /**
   * Get category statistics
   */
  async getStats(id: string) {
    const category = await this.prismaService.category.findUnique({
      where: { id }
    })

    if (!category) {
      throw new NotFoundException(`Category with ID "${id}" not found`)
    }

    // Get all descendants
    const descendants = await this.prismaService.category.findMany({
      where: {
        OR: [{ id }, { path: { startsWith: `${category.path}${id}/` } }]
      },
      include: {
        _count: {
          select: { products: true }
        }
      }
    })

    const totalProducts = descendants.reduce((sum, cat) => sum + (cat as any)._count.products, 0)
    const totalSubcategories = descendants.length - 1 // Exclude self

    const activeSubcategories = descendants.filter((cat) => cat.isActive && cat.id !== id).length

    return {
      categoryId: id,
      categoryName: category.name,
      totalProducts,
      totalSubcategories,
      activeSubcategories,
      depth: category.depth,
      isActive: category.isActive
    }
  }

  // The getTree function already covers getting all categories, so we can use it to get descendant IDs
  // Get all descendant category IDs (for product filtering)
  // async getDescendantIds(categoryId: string) {
  //   const category = await this.prismaService.category.findUnique({
  //     where: { id: categoryId },
  //     select: { path: true, id: true }
  //   })

  //   if (!category) return []

  //   // Find all categories whose path starts with this category's path
  //   const descendants = await this.prismaService.category.findMany({
  //     where: {
  //       path: { startsWith: category.path },
  //       isActive: true
  //     },
  //     select: { id: true }
  //   })

  //   return descendants
  // }

  // Move category (updates path for all descend  ants) - We can update this cateogry to the root level or under a new parent
  // newParent = null -> move to root level
  // newParent = someId -> move under that category
  // async moveCategory(categoryId: string, newParentId: string | null) {
  //   const category = await this.prismaService.category.findUnique({
  //     where: { id: categoryId }
  //   })

  //   let newPath = '/'
  //   let newDepth = 0

  //   if (newParentId) {
  //     const newParent = await this.prismaService.category.findUnique({
  //       where: { id: newParentId }
  //     })
  //     if (!newParent) throw new Error('New parent category not found')

  //     newPath = `${newParent.path}${newParentId}/`
  //     newDepth = newParent.depth + 1
  //   }

  //   // Update category and all descendants
  //   const oldPath = category.path
  //   const depthDiff = newDepth - category.depth

  //   return this.prismaService
  //     .$transaction([
  //       // Update the category itself
  //       this.prismaService.category.update({
  //         where: { id: categoryId },
  //         data: {
  //           parentId: newParentId,
  //           path: newPath,
  //           depth: newDepth
  //         }
  //       }),
  //       // Update all descendants in the category table: @@map("Category")
  //       // || is the concatenation operator in PostgreSQL. Example: 'new/path/' || substring('old/path/1/2/3/' from 10) = 'new/path/1/2/3/'
  //       this.prismaService.$executeRaw`
  //       UPDATE "Category"
  //       SET path = ${newPath} || substring(path from ${oldPath.length + 1}),
  //           depth = depth + ${depthDiff}
  //       WHERE path LIKE ${oldPath + categoryId + '/%'}
  //     `
  //     ])
  //     .catch((error) => {
  //       throw new Error('Failed to move category: ' + error.message)
  //     })
  // }

  /**
   * Update category
   */
  async update(id: string, updateCategoryDto: UpdateCategoryDto): Promise<Category> {
    const category = await this.prismaService.category.findUnique({
      where: { id }
    })

    if (!category) {
      throw new NotFoundException(`Category with ID "${id}" not found`)
    }

    // Check slug uniqueness if updating slug
    if (updateCategoryDto.slug && updateCategoryDto.slug !== category.slug) {
      const existingSlug = await this.prismaService.category.findUnique({
        where: { slug: updateCategoryDto.slug }
      })

      if (existingSlug) {
        throw new ConflictException(`Category with slug "${updateCategoryDto.slug}" already exists`)
      }
    }

    // Prevent setting self as parent
    if (updateCategoryDto.parentId === id) {
      throw new BadRequestException('Danh mục cha phải khác với chính nó')
    }

    if (updateCategoryDto.attributeIds) {
      // Update category attributes - simple approach: delete old and create new
      await this.prismaService.categoryAttribute.deleteMany({
        where: { categoryId: id }
      })
      await this.prismaService.categoryAttribute.createMany({
        data: updateCategoryDto.attributeIds.map((attributeId) => ({
          categoryId: id,
          attributeId
        }))
      })
    }

    delete updateCategoryDto.attributeIds
    // Handle parent change
    let finalUpdateData = updateCategoryDto
    if (
      updateCategoryDto.parentId !== undefined && // if updateCategoryDto.parentId is null -> move to root
      updateCategoryDto.parentId !== category.parentId
    ) {
      await this.moveCategory(id, { newParentId: updateCategoryDto.parentId })
      // Remove parentId from the final update since it's already handled
      const { parentId, ...rest } = updateCategoryDto
      finalUpdateData = rest
    }

    return this.prismaService.category.update({
      where: { id },
      data: finalUpdateData as any
    })
  }

  /**
   * Move category to new parent (updates path and depth for entire subtree)
   */
  async moveCategory(id: string, moveDto: MoveCategoryDto): Promise<Category> {
    const category = await this.prismaService.category.findUnique({
      where: { id }
    })

    if (!category) {
      throw new NotFoundException(`Category with ID "${id}" not found`)
    }

    const { newParentId } = moveDto

    // Prevent setting self as parent
    if (newParentId === id) {
      throw new BadRequestException('Danh mục cha phải khác với chính nó')
    }

    // Validate new parent
    let newPath = '/'
    let newDepth = 0

    if (newParentId) {
      const newParent = await this.prismaService.category.findUnique({
        where: { id: newParentId }
      })

      if (!newParent) {
        throw new NotFoundException(`Parent category with ID "${newParentId}" not found`)
      }

      // Prevent circular reference
      if (newParent.path.includes(`/${id}/`)) {
        throw new BadRequestException(
          'Không thể di chuyển danh mục này vào một trong các danh mục con của nó'
        )
      }

      newPath = `${newParent.path}${newParent.id}/`
      newDepth = newParent.depth + 1
    }

    // Get all descendants
    const descendants = await this.prismaService.category.findMany({
      where: {
        path: { startsWith: `${category.path}${id}/` }
      }
    })

    // Use transaction to update category and all descendants
    await this.prismaService.$transaction(async (tx) => {
      // Update the category itself
      await tx.category.update({
        where: { id },
        data: {
          parentId: newParentId,
          path: newPath,
          depth: newDepth
        }
      })

      // Update all descendants
      const depthDiff = newDepth - category.depth
      const oldPath = `${category.path}${id}/`
      const newBasePath = `${newPath}${id}/`

      for (const descendant of descendants) {
        const updatedPath = descendant.path.replace(oldPath, newBasePath)
        await tx.category.update({
          where: { id: descendant.id },
          data: {
            path: updatedPath,
            depth: descendant.depth + depthDiff
          }
        })
      }
    })

    return this.findOne(id)
  }

  /**
   * Soft delete category (mark as inactive)
   */
  async softDelete(id: string): Promise<Category> {
    const category = await this.prismaService.category.findUnique({
      where: { id },
      include: {
        children: true,
        products: true
      }
    })

    if (!category) {
      throw new NotFoundException(`Category with ID "${id}" not found`)
    }

    if (
      category.children.length > 0 &&
      // If exists one children category is not soft-deleted, we cannot soft-delete this category
      category.children.some((child) => !child.isDeleted)
    ) {
      throw new BadRequestException(
        'Cannot delete category with children. Delete or move children first.'
      )
    }

    if (category.products.length > 0) {
      throw new BadRequestException(
        'Cannot delete category with products. Move products to another category first.'
      )
    }

    // Check if already deleted
    if (category.isDeleted) {
      throw new BadRequestException('Category is already deleted')
    }

    return this.prismaService.category.update({
      where: { id },
      data: { isDeleted: true, deletedAt: new Date() }
    })
  }

  /**
   * Hard delete category (permanent)
   */
  async remove(id: string) {
    const category = await this.prismaService.category.findUnique({
      where: { id },
      include: {
        children: true,
        products: true
      }
    })

    if (!category) {
      throw new NotFoundException(`Category with ID "${id}" not found`)
    }

    if (category.children.length > 0) {
      throw new BadRequestException(
        'Cannot delete category with children. Delete or move children first.'
      )
    }

    if (category.products.length > 0) {
      throw new BadRequestException(
        'Cannot delete category with products. Move products to another category first.'
      )
    }

    return this.prismaService.category.delete({
      where: { id }
    })
  }

  /**
   * Rebuild category paths (maintenance operation)
   * Cannot rebuild category depths because it cannot sort categories properly without knowing parent-child relationships
   */
  async rebuildPaths(): Promise<{ updated: number }> {
    const categories = await this.prismaService.category.findMany({
      orderBy: { depth: 'asc' } // Ensure parents are processed before children
    })

    let updated = 0

    await this.prismaService.$transaction(async (tx) => {
      for (const category of categories) {
        let correctPath = '/'
        let correctDepth = 0

        if (category.parentId) {
          const parent = categories.find((c) => c.id === category.parentId)
          if (parent) {
            correctPath = `${parent.path}${parent.id}/`
            correctDepth = parent.depth + 1
          }
        }

        if (category.path !== correctPath || category.depth !== correctDepth) {
          await tx.category.update({
            where: { id: category.id },
            data: {
              path: correctPath,
              depth: correctDepth
            }
          })
          updated++
        }
      }
    })

    return { updated }
  }
}
