import { Injectable, NotFoundException, ConflictException } from '@nestjs/common'
import { PrismaService } from 'database/prisma/prisma.service'
import { AddAttributeToCategoryDto } from 'domains/categories/dto/add-attribute-to-category.dto'
import { UpdateCategoryAttributeDto } from 'domains/categories/dto/update-category-attribute.dto'

@Injectable()
export class CategoryAttributeService {
  constructor(private prismaService: PrismaService) {}

  /**
   * Add attribute to category
   */
  async addAttributeToCategory(categoryId: string, dto: AddAttributeToCategoryDto) {
    // Verify category exists
    const category = await this.prismaService.category.findUnique({
      where: { id: categoryId }
    })

    if (!category) {
      throw new NotFoundException(`Category with ID "${categoryId}" not found`)
    }

    // Verify attribute exists
    const attribute = await this.prismaService.attribute.findUnique({
      where: { id: dto.attributeId }
    })

    if (!attribute) {
      throw new NotFoundException(`Attribute with ID "${dto.attributeId}" not found`)
    }

    // Check if attribute already assigned to category
    const existing = await this.prismaService.categoryAttribute.findUnique({
      where: {
        categoryId_attributeId: {
          categoryId,
          attributeId: dto.attributeId
        }
      }
    })

    if (existing) {
      throw new ConflictException('Attribute already assigned to this category')
    }

    const categoryAttribute = await this.prismaService.categoryAttribute.create({
      data: {
        categoryId,
        attributeId: dto.attributeId,
        displayName: dto.displayName,
        displayOrder: dto.displayOrder ?? 0,
        filterType: dto.filterType ?? 'CHECKBOX',
        isFilterable: dto.isFilterable ?? true,
        isRequired: dto.isRequired ?? false,
        inheritToChildren: dto.inheritToChildren ?? true,
        filterGroup: dto.filterGroup
      },
      include: {
        attribute: true,
        category: true
      }
    })

    return categoryAttribute
  }

  /**
   * Get all attributes for a category (including inherited)
   */
  async getCategoryAttributes(categoryId: string, includeInherited = true) {
    const category = await this.prismaService.category.findUnique({
      where: { id: categoryId }
    })

    if (!category) {
      throw new NotFoundException(`Category with ID "${categoryId}" not found`)
    }

    if (!includeInherited) {
      // Only direct attributes
      return this.prismaService.categoryAttribute.findMany({
        where: { categoryId },
        include: {
          attribute: {
            include: {
              values: true
            }
          }
        },
        orderBy: { displayOrder: 'asc' }
      })
    }

    // Get all parent category IDs from path
    const parentIds = category.path.split('/').filter((id) => id !== '')

    // Get attributes from current category and all parents
    const allCategoryIds = [...parentIds, categoryId]

    const attributes = await this.prismaService.categoryAttribute.findMany({
      where: {
        categoryId: { in: allCategoryIds },
        inheritToChildren: true
      },
      include: {
        attribute: {
          include: {
            values: true
          }
        },
        category: true
      },
      orderBy: [{ category: { depth: 'asc' } }, { displayOrder: 'asc' }]
    })

    return attributes
  }

  /**
   * Get filterable attributes for a category
   */
  async getFilterableAttributes(categoryId: string) {
    const attributes = await this.getCategoryAttributes(categoryId, true)
    return attributes.filter((attr) => attr.isFilterable)
  }

  /**
   * Update category attribute configuration
   */
  async updateCategoryAttribute(categoryId: string, attributeId: string, dto: UpdateCategoryAttributeDto) {
    const categoryAttribute = await this.prismaService.categoryAttribute.findUnique({
      where: {
        categoryId_attributeId: {
          categoryId,
          attributeId
        }
      }
    })

    if (!categoryAttribute) {
      throw new NotFoundException(`Attribute not found for this category`)
    }

    return this.prismaService.categoryAttribute.update({
      where: {
        categoryId_attributeId: {
          categoryId,
          attributeId
        }
      },
      data: dto,
      include: {
        attribute: true
      }
    })
  }

  /**
   * Remove attribute from category
   */
  async removeAttributeFromCategory(categoryId: string, attributeId: string) {
    const categoryAttribute = await this.prismaService.categoryAttribute.findUnique({
      where: {
        categoryId_attributeId: {
          categoryId,
          attributeId
        }
      }
    })

    if (!categoryAttribute) {
      throw new NotFoundException(`Attribute not found for this category`)
    }

    await this.prismaService.categoryAttribute.delete({
      where: {
        categoryId_attributeId: {
          categoryId,
          attributeId
        }
      }
    })

    return { message: 'Attribute removed successfully' }
  }

  /**
   * Bulk assign attributes to category
   */
  async bulkAddAttributes(categoryId: string, attributeIds: string[]) {
    const category = await this.prismaService.category.findUnique({
      where: { id: categoryId }
    })

    if (!category) {
      throw new NotFoundException(`Category with ID "${categoryId}" not found`)
    }

    const attributes = await this.prismaService.attribute.findMany({
      where: { id: { in: attributeIds } }
    })

    if (attributes.length !== attributeIds.length) {
      throw new NotFoundException('Some attributes were not found')
    }

    const operations = attributeIds.map((attributeId, index) =>
      this.prismaService.categoryAttribute.upsert({
        where: {
          categoryId_attributeId: {
            categoryId,
            attributeId
          }
        },
        create: {
          categoryId,
          attributeId,
          displayOrder: index
        },
        update: {}
      })
    )

    await this.prismaService.$transaction(operations)

    return { message: `${attributeIds.length} attributes assigned successfully` }
  }

  /**
   * Reorder category attributes
   */
  async reorderAttributes(categoryId: string, orderedAttributeIds: string[]) {
    const category = await this.prismaService.category.findUnique({
      where: { id: categoryId }
    })

    if (!category) {
      throw new NotFoundException(`Category with ID "${categoryId}" not found`)
    }

    const operations = orderedAttributeIds.map((attributeId, index) =>
      this.prismaService.categoryAttribute.update({
        where: {
          categoryId_attributeId: {
            categoryId,
            attributeId
          }
        },
        data: {
          displayOrder: index
        }
      })
    )

    await this.prismaService.$transaction(operations)

    return { message: 'Attributes reordered successfully' }
  }
}
