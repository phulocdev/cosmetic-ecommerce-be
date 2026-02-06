import { Injectable } from '@nestjs/common'
import { PrismaService } from 'database/prisma/prisma.service'
import { CreateProductDto } from 'domains/products/dto/create-product.dto'
import { UpdateProductDto } from 'domains/products/dto/update-product.dto'

@Injectable()
export class InvalidateFilterCacheService {
  constructor(private readonly prismaService: PrismaService) {}

  /**
   * Invalidate filter cache for all affected categories
   */
  async invalidateFilterCacheForCreate(dto: CreateProductDto): Promise<void> {
    try {
      // Get all category paths that need cache invalidation
      const categoryIds = dto.categories.map((c) => c.categoryId)

      const categories = await this.prismaService.category.findMany({
        where: { id: { in: categoryIds } },
        select: { path: true }
      })

      const paths = categories.map((c) => c.path)

      // Delete all filter cache entries for these paths
      if (paths.length > 0) {
        await this.prismaService.filterCache.deleteMany({
          where: {
            categoryPath: { in: paths }
          }
        })
      }

      // Also invalidate the root cache ("/") as it includes all products
      await this.prismaService.filterCache.deleteMany({
        where: { categoryPath: '/' }
      })
    } catch (error) {
      // Log error but don't fail the product creation
      console.error('Failed to invalidate filter cache:', error)
    }
  }

  /**
   * Invalidate filter cache for affected categories (update)
   */
  async invalidateFilterCacheForUpdate(oldCategoryIds: string[], dto: UpdateProductDto): Promise<void> {
    try {
      const affectedCategoryIds = [...oldCategoryIds]

      // Add new categories
      if (dto.categories) {
        const newCategoryIds = dto.categories.filter((c) => c.categoryId && !c._delete).map((c) => c.categoryId)
        affectedCategoryIds.push(...newCategoryIds)
      }

      // Get unique category paths
      const uniqueCategoryIds = [...new Set(affectedCategoryIds)]
      const categories = await this.prismaService.category.findMany({
        where: { id: { in: uniqueCategoryIds } },
        select: { path: true }
      })

      const paths = categories.map((c) => c.path)

      if (paths.length > 0) {
        await this.prismaService.filterCache.deleteMany({
          where: {
            categoryPath: { in: paths }
          }
        })
      }

      await this.prismaService.filterCache.deleteMany({
        where: { categoryPath: '/' }
      })
    } catch (error) {
      console.error('Failed to invalidate filter cache:', error)
    }
  }
}
