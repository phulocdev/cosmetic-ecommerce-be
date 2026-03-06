import { Injectable, NotFoundException } from '@nestjs/common'
import { Prisma, Product } from '@prisma/client'
import { PrismaService } from 'database/prisma/prisma.service'
import { CreateProductDto } from 'domains/products/dto'
import {
  CursorPaginatedProductListResponse,
  OffsetPaginatedProductListResponse,
  ProductQueryDto
} from 'domains/products/dto/find-all-product.dto'
import { UpdateProductDto } from 'domains/products/dto/update-product.dto'
import { FindAllProductService } from 'domains/products/find-all-product.service'
import { InvalidateFilterCacheService } from 'domains/products/invalidate-filter-cache.service'
import { UpdateProductService } from 'domains/products/update-product.service'
import { ValidateDtoService } from 'domains/products/validate-dto.service'
import { PaginationType } from 'enums'
import { slugifyString, UtcDateRange } from 'utils'

@Injectable()
export class ProductsService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly validateDtoService: ValidateDtoService,
    private readonly invalidateFilterCacheService: InvalidateFilterCacheService,
    private readonly updateProductService: UpdateProductService,
    private readonly findAllProductService: FindAllProductService
  ) {}

  /**
   * Create a new product with all related entities
   * - Validates all foreign key relationships
   * - Creates product with categories, images, variants, and attributes
   * - Uses transaction for data consistency
   * - Invalidates filter cache for affected categories
   */
  async create(createProductDto: CreateProductDto) {
    // Step 1: Validate foreign key references
    await this.validateDtoService.validateReferencesForCreate(createProductDto)

    // Step 2: Validate business rules
    await this.validateDtoService.validateBusinessRulesForCreate(createProductDto)

    // Step 3: Create product with all relations in a transaction
    const product = await this.prismaService.$transaction(async (tx) => {
      // Create the main product
      const createdProduct = await tx.product.create({
        data: {
          code: createProductDto.code,
          name: createProductDto.name,
          slug: createProductDto.slug || slugifyString(createProductDto.name),
          description: createProductDto.description,
          status: createProductDto.status,
          basePrice: new Prisma.Decimal(createProductDto.basePrice),
          brandId: createProductDto.brandId,
          countryOriginId: createProductDto.countryOriginId,
          views: 0
        }
      })

      // Create product categories (many-to-many)
      if (createProductDto.categories && createProductDto.categories.length > 0) {
        await tx.productCategory.createMany({
          data: createProductDto.categories.map((cat) => ({
            productId: createdProduct.id,
            categoryId: cat.categoryId,
            isPrimary: cat.isPrimary
          }))
        })
      }

      // Create product images
      if (createProductDto.images && createProductDto.images.length > 0) {
        await tx.productImage.createMany({
          data: createProductDto.images.map((img) => ({
            productId: createdProduct.id,
            url: img.url,
            altText: img.altText || null
          }))
        })
      }

      // Create product attributes
      // if (createProductDto.attributes && createProductDto.attributes.length > 0) {
      //   await tx.productAttribute.createMany({
      //     data: createProductDto.attributes.map((attr) => ({
      //       productId: createdProduct.id,
      //       attributeId: attr.attributeId,
      //       isRequired: attr.isRequired ?? true
      //     }))
      //   })
      // }

      // Create product variants with their attribute values and images
      if (createProductDto.variants && createProductDto.variants.length > 0) {
        for (const variant of createProductDto.variants) {
          const createdVariant = await tx.productVariant.create({
            data: {
              productId: createdProduct.id,
              sku: variant.sku,
              name: variant.name,
              barcode: variant.barcode,
              costPrice: new Prisma.Decimal(variant.costPrice),
              sellingPrice: new Prisma.Decimal(variant.sellingPrice),
              stockOnHand: variant.stockOnHand,
              imageUrl: variant.imageUrl,
              lowStockThreshold: variant.lowStockThreshold || 0,
              maxStockThreshold: variant.maxStockThreshold || 0,
              isActive: variant.isActive ?? true
            }
          })

          // Create variant attribute values
          if (variant.attributeValues && variant.attributeValues.length > 0) {
            await tx.variantAttributeValue.createMany({
              data: variant.attributeValues.map((attrVal) => ({
                variantId: createdVariant.id,
                attributeValueId: attrVal.attributeValueId
              }))
            })
          }

          // // Create variant images
          // await tx.variantImage.create({
          //   data: {
          //     variantId: createdVariant.id,
          //     url: variant.imageUrl,
          //     altText: variant.name
          //   }
          // })

          // if (variant.images && variant.images.length > 0) {
          //   await tx.variantImage.createMany({
          //     data: variant.images.map((img) => ({
          //       variantId: createdVariant.id,
          //       url: img.url,
          //       altText: img.altText || null
          //     }))
          //   })
          // }
        }
      }

      return createdProduct
    })

    // Step 4: Invalidate filter cache for affected categories
    await this.invalidateFilterCacheService.invalidateFilterCacheForCreate(createProductDto)

    // Step 5: Return the created product with all relations
    return this.findById(product.id)
  }

  /**
   * Find product by ID with all relations
   */
  async findById(id: string) {
    const product = await this.prismaService.product.findUnique({
      where: { id },
      include: {
        brand: true,
        countryOfOrigin: true,
        categories: {
          include: {
            category: true
          }
        },
        images: true,
        // attributes: {
        //   include: {
        //     attribute: {
        //       include: {
        //         values: true
        //       }
        //     }
        //   }
        // },
        variants: {
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
        }
      }
    })

    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`)
    }

    return product
  }

  /**
   * Update an existing product with all related entities
   * Supports partial updates, additions, and deletions
   */
  async update(id: string, updateProductDto: UpdateProductDto) {
    // Step 1: Check if product exists
    const existingProduct = await this.prismaService.product.findUnique({
      where: { id },
      include: {
        categories: true,
        images: true,
        // attributes: true,
        variants: {
          include: {
            attributeValues: true
          }
        }
      }
    })

    if (!existingProduct) {
      throw new NotFoundException(`Product with ID ${id} not found`)
    }

    // Step 2: Validate references and business rules
    await this.validateDtoService.validateReferencesForUpdate(id, updateProductDto)
    await this.validateDtoService.validateBusinessRulesForUpdate(
      id,
      updateProductDto,
      existingProduct
    )

    // Step 3: Get old categories for cache invalidation
    const oldCategoryIds = existingProduct.categories.map((c) => c.categoryId)

    // Step 4: Update product with all relations in a transaction
    await this.prismaService.$transaction(async (tx) => {
      // Update the main product fields
      // We must need the updatedData variable because the createProductDto can contains other fields that are not exist in Product model
      // Such as: categories, images, variants, attributes
      // So we need to separate them before updating the product
      const updateData: Partial<Product> = {}
      if (updateProductDto.code !== undefined) updateData.code = updateProductDto.code
      if (updateProductDto.name !== undefined) updateData.name = updateProductDto.name
      if (updateProductDto.slug !== undefined) updateData.slug = updateProductDto.slug
      if (updateProductDto.description !== undefined)
        updateData.description = updateProductDto.description
      if (updateProductDto.status !== undefined) updateData.status = updateProductDto.status
      if (updateProductDto.basePrice !== undefined) {
        updateData.basePrice = new Prisma.Decimal(updateProductDto.basePrice)
      }
      if (updateProductDto.brandId !== undefined) updateData.brandId = updateProductDto.brandId
      if (updateProductDto.countryOriginId !== undefined) {
        updateData.countryOriginId = updateProductDto.countryOriginId
      }

      // Update base product model with its own fields such as: name, description, brandId, etc.
      // Other fields with complex logic (categories, images, variants, attributes) are separately handled below
      if (Object.keys(updateData).length > 0) {
        await tx.product.update({
          where: { id },
          data: updateData
        })
      }

      // Handle product categories
      if (updateProductDto.categories) {
        await this.updateProductService.updateProductCategories(tx, id, updateProductDto.categories)
      }

      // Handle product images
      if (updateProductDto.images) {
        await this.updateProductService.updateProductImages(tx, id, updateProductDto.images)
      }

      // Handle product attributes
      // if (updateProductDto.attributes) {
      //   await this.updateProductService.updateProductAttributes(tx, id, updateProductDto.attributes)
      // }

      // Handle product variants
      if (updateProductDto.variants) {
        await this.updateProductService.updateProductVariants(tx, id, updateProductDto.variants)
      }
    })

    // Step 5: Invalidate filter cache for old and new categories
    await this.invalidateFilterCacheService.invalidateFilterCacheForUpdate(
      oldCategoryIds,
      updateProductDto
    )

    // Step 6: Return the updated product with all relations
    return this.findById(id)
  }

  /**
   * Find all products with flexible filtering and pagination
   */
  async findAll(
    query: ProductQueryDto,
    utcDateRange?: UtcDateRange
  ): Promise<OffsetPaginatedProductListResponse | CursorPaginatedProductListResponse> {
    // Determine pagination type
    const paginationType = query.paginationType || PaginationType.OFFSET

    if (paginationType === PaginationType.CURSOR) {
      return this.findAllProductService.findAllWithCursorPagination(query, utcDateRange)
    } else {
      return this.findAllProductService.findAllWithOffsetPagination(query, utcDateRange)
    }
  }
}
