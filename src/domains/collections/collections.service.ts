import { ConflictException, Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from 'database/prisma/prisma.service'
import { CreateCollectionDto } from './dto/create-collection.dto'
import { UpdateCollectionDto } from './dto/update-collection.dto'
import { slugifyString } from 'utils'

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
    const attributeIds = (dto.attributes ?? []).map((a) => a.attributeId)
    const categoryIds = (dto.categories ?? []).map((c) => c.categoryId)

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
                data: (dto.attributes ?? []).map((a) => ({
                  attributeId: a.attributeId,
                  displayOrder: a.displayOrder ?? 0
                })),
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

  findAll() {
    return `This action returns all collections`
  }

  findOne(id: number) {
    return `This action returns a #${id} collection`
  }

  update(id: number, updateCollectionDto: UpdateCollectionDto) {
    return `This action updates a #${id} collection`
  }

  remove(id: number) {
    return `This action removes a #${id} collection`
  }

  // ─── Helpers ──────────────────────────────────────────────────────────────

  private async findOrThrow(id: string) {
    const collection = await this.prismaService.collection.findFirst({
      where: { id, isDeleted: false }
    })
    if (!collection) throw new NotFoundException(`Collection ${id} not found`)
    return collection
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
      select: { id: true, name: true, slug: true, displayName: true },
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
