import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'
import { AttributeType, Prisma, Product } from '@prisma/client'
import { PrismaService } from 'database/prisma/prisma.service'
import { CreateProductDto } from './dto/create-product.dto'
import slugify from 'slugify'
import { UpdateProductDto } from 'domains/products/dto/update-product.dto'
import fs from 'fs'
import path from 'path'

@Injectable()
export class ProductsService {
  constructor(private readonly prismaService: PrismaService) {}

  /**
   * Create a new product with all related entities
   * - Validates all foreign key relationships
   * - Creates product with categories, images, variants, and attributes
   * - Uses transaction for data consistency
   * - Invalidates filter cache for affected categories
   */
  async create(createProductDto: CreateProductDto) {
    // Step 1: Validate foreign key references
    await this.validateReferencesForCreate(createProductDto)

    // Step 2: Validate business rules
    await this.validateBusinessRulesForCreate(createProductDto)

    // Step 3: Create product with all relations in a transaction
    const product = await this.prismaService.$transaction(async (tx) => {
      // Create the main product
      const createdProduct = await tx.product.create({
        data: {
          code: createProductDto.code,
          name: createProductDto.name,
          slug: createProductDto.slug || slugify(createProductDto.name, { lower: true, strict: true }),
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
      if (createProductDto.attributes && createProductDto.attributes.length > 0) {
        await tx.productAttribute.createMany({
          data: createProductDto.attributes.map((attr) => ({
            productId: createdProduct.id,
            attributeId: attr.attributeId,
            isRequired: attr.isRequired ?? true
          }))
        })
      }

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

          // Create variant images
          if (variant.images && variant.images.length > 0) {
            await tx.variantImage.createMany({
              data: variant.images.map((img) => ({
                variantId: createdVariant.id,
                url: img.url,
                altText: img.altText || null
              }))
            })
          }
        }
      }

      return createdProduct
    })

    // Step 4: Invalidate filter cache for affected categories
    await this.invalidateFilterCache(createProductDto)

    // Step 5: Return the created product with all relations
    return this.findById(product.id)
  }

  /**
   * Validate that all referenced entities exist
   */
  private async validateReferencesForCreate(dto: CreateProductDto): Promise<void> {
    const errors: string[] = []

    // Validate brand
    const brand = await this.prismaService.brand.findUnique({
      where: { id: dto.brandId }
    })
    if (!brand) {
      errors.push(`Brand with ID ${dto.brandId} not found`)
    }

    // Validate country of origin
    const country = await this.prismaService.countryOfOrigin.findUnique({
      where: { id: dto.countryOriginId }
    })
    if (!country) {
      errors.push(`Country of Origin with ID ${dto.countryOriginId} not found`)
    }

    // Validate all categories in the categories array
    if (dto.categories && dto.categories.length > 0) {
      const categoryIds = dto.categories.map((c) => c.categoryId)
      const categories = await this.prismaService.category.findMany({
        where: { id: { in: categoryIds } }
      })

      const foundIds = categories.map((c) => c.id)
      const missingIds = categoryIds.filter((id) => !foundIds.includes(id))
      if (missingIds.length > 0) {
        errors.push(`Categories not found: ${missingIds.join(', ')}`)
      }
    }

    // Validate all attributes
    if (dto.attributes && dto.attributes.length > 0) {
      const attributeIds = dto.attributes.map((a) => a.attributeId)
      const attributes = await this.prismaService.attribute.findMany({
        where: { id: { in: attributeIds } }
      })

      const foundIds = attributes.map((a) => a.id)
      const missingIds = attributeIds.filter((id) => !foundIds.includes(id))
      if (missingIds.length > 0) {
        errors.push(`Attributes not found: ${missingIds.join(', ')}`)
      }
    }

    // Validate all attribute values in variants
    if (dto.variants && dto.variants.length > 0) {
      const allAttributeValueIds = dto.variants.flatMap((v) => v.attributeValues.map((av) => av.attributeValueId))

      if (allAttributeValueIds.length > 0) {
        const attributeValues = await this.prismaService.attributeValue.findMany({
          where: { id: { in: allAttributeValueIds } }
        })

        const foundIds = attributeValues.map((av) => av.id)
        const missingIds = allAttributeValueIds.filter((id) => !foundIds.includes(id))
        if (missingIds.length > 0) {
          errors.push(`Attribute values not found: ${missingIds.join(', ')}`)
        }
      }
    }

    if (errors.length > 0) {
      throw new NotFoundException(errors.join('; '))
    }
  }

  /**
   * Validate business rules
   */
  private async validateBusinessRulesForCreate(dto: CreateProductDto): Promise<void> {
    const errors: string[] = []

    // Check for unique product code
    const existingProduct = await this.prismaService.product.findUnique({
      where: { code: dto.code }
    })
    if (existingProduct) {
      errors.push(`Product with code ${dto.code} already exists`)
    }

    // Check for unique product slug
    if (dto.slug) {
      const existingSlug = await this.prismaService.product.findUnique({
        where: { slug: dto.slug }
      })
      if (existingSlug) {
        errors.push(`Product with slug ${dto.slug} already exists`)
      }
    }
    // Validate that only one category is marked as primary
    const primaryCount = dto.categories.filter((cat) => cat.isPrimary).length
    if (primaryCount === 0) {
      errors.push('At least one category must be marked as primary')
    } else if (primaryCount > 1) {
      errors.push('Only one category can be marked as primary')
    }

    // Check for duplicate SKUs across all variants
    const skus = dto.variants.map((v) => v.sku)
    const uniqueSkus = new Set(skus)
    if (skus.length !== uniqueSkus.size) {
      errors.push('Duplicate SKUs found in variants')
    }

    // Check for duplicate barcodes across all variants
    const barcodes = dto.variants.map((v) => v.barcode)
    const uniqueBarcodes = new Set(barcodes)
    if (barcodes.length !== uniqueBarcodes.size) {
      errors.push('Duplicate barcodes found in variants')
    }

    // Check if SKUs already exist in database
    const existingVariants = await this.prismaService.productVariant.findMany({
      where: {
        OR: [{ sku: { in: skus } }, { barcode: { in: barcodes } }]
      }
    })

    if (existingVariants.length > 0) {
      const existingSkus = existingVariants.map((v) => v.sku)
      const existingBarcodes = existingVariants.map((v) => v.barcode)
      errors.push(`SKUs or barcodes already exist: ${[...existingSkus, ...existingBarcodes].join(', ')}`)
    }

    // Validate that variant attribute values match product attributes
    const productAttributeIds = dto.attributes.map((a) => a.attributeId)

    for (const variant of dto.variants) {
      const variantAttributeValueIds = variant.attributeValues.map((av) => av.attributeValueId)

      // Get the attribute IDs for the variant's attribute values
      const attributeValues = await this.prismaService.attributeValue.findMany({
        where: { id: { in: variantAttributeValueIds } },
        select: { attributeId: true }
      })

      const variantAttributeIds = attributeValues.map((av) => av.attributeId)

      // Check if all variant attributes are in product attributes
      const invalidAttributes = variantAttributeIds.filter((id) => !productAttributeIds.includes(id))

      if (invalidAttributes.length > 0) {
        errors.push(`Variant "${variant.name}" has attribute values that don't match product attributes`)
      }
    }

    // Validate price logic
    for (const variant of dto.variants) {
      if (variant.sellingPrice < variant.costPrice) {
        errors.push(`Variant "${variant.name}" has selling price lower than cost price`)
      }
    }

    if (errors.length > 0) {
      throw new BadRequestException(errors.join('; '))
    }
  }

  /**
   * Invalidate filter cache for all affected categories
   */
  private async invalidateFilterCache(dto: CreateProductDto): Promise<void> {
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
        attributes: {
          include: {
            attribute: {
              include: {
                values: true
              }
            }
          }
        },
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
            },
            images: true
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
        attributes: true,
        variants: {
          include: {
            attributeValues: true,
            images: true
          }
        }
      }
    })

    if (!existingProduct) {
      throw new NotFoundException(`Product with ID ${id} not found`)
    }

    // Step 2: Validate references and business rules
    await this.validateReferencesForUpdate(id, updateProductDto)
    await this.validateBusinessRulesForUpdate(id, updateProductDto, existingProduct)

    // Step 3: Get old categories for cache invalidation
    const oldCategoryIds = existingProduct.categories.map((c) => c.categoryId)

    // Step 4: Update product with all relations in a transaction
    await this.prismaService.$transaction(async (tx) => {
      // Update the main product fields
      // We must need the updatedData variable because the createProductDto can contains other fields that are not exist in Product model
      // Such as: categories, images, variants, attributes
      // So we need to separate them before updating the product
      const updateData: any = {}
      if (updateProductDto.code !== undefined) updateData.code = updateProductDto.code
      if (updateProductDto.name !== undefined) updateData.name = updateProductDto.name
      if (updateProductDto.slug !== undefined) updateData.slug = updateProductDto.slug
      if (updateProductDto.description !== undefined) updateData.description = updateProductDto.description
      if (updateProductDto.status !== undefined) updateData.status = updateProductDto.status
      if (updateProductDto.basePrice !== undefined) {
        updateData.basePrice = new Prisma.Decimal(updateProductDto.basePrice)
      }
      if (updateProductDto.brandId !== undefined) updateData.brandId = updateProductDto.brandId
      if (updateProductDto.countryOriginId !== undefined) {
        updateData.countryOriginId = updateProductDto.countryOriginId
      }

      // Update base product model with its own fields such as: name, description, brandId, etc.
      // Other fields with complex logic (categories, images, variants, attributes) are handled below separately
      if (Object.keys(updateData).length > 0) {
        await tx.product.update({
          where: { id },
          data: updateData
        })
      }

      // Handle product categories
      if (updateProductDto.categories) {
        await this.updateProductCategories(tx, id, updateProductDto.categories)
      }

      // Handle product images
      if (updateProductDto.images) {
        await this.updateProductImages(tx, id, updateProductDto.images)
      }

      // Handle product attributes
      if (updateProductDto.attributes) {
        await this.updateProductAttributes(tx, id, updateProductDto.attributes)
      }

      // Handle product variants
      if (updateProductDto.variants) {
        await this.updateProductVariants(tx, id, updateProductDto.variants)
      }
    })

    // Step 5: Invalidate filter cache for old and new categories
    await this.invalidateFilterCacheForUpdate(oldCategoryIds, updateProductDto)

    // Step 6: Return the updated product with all relations
    return this.findById(id)
  }

  /**
   * Invalidate filter cache for affected categories (update)
   */
  private async invalidateFilterCacheForUpdate(oldCategoryIds: string[], dto: UpdateProductDto): Promise<void> {
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

  /**
   * Update product categories
   */
  private async updateProductCategories(tx: any, productId: string, categories: any[]) {
    for (const category of categories) {
      if (category._delete && category.categoryId) {
        // Delete specific category association
        await tx.productCategory.deleteMany({
          where: {
            productId,
            categoryId: category.categoryId
          }
        })
      } else if (category.categoryId) {
        // Check if association exists between product and category
        const existing = await tx.productCategory.findUnique({
          where: {
            productId_categoryId: {
              productId,
              categoryId: category.categoryId
            }
          }
        })

        if (existing) {
          // Update existing association
          await tx.productCategory.update({
            where: {
              productId_categoryId: {
                productId,
                categoryId: category.categoryId
              }
            },
            data: {
              isPrimary: category.isPrimary ?? existing.isPrimary
            }
          })
        } else {
          // Create new association
          await tx.productCategory.create({
            data: {
              productId,
              categoryId: category.categoryId,
              isPrimary: category.isPrimary ?? false
            }
          })
        }
      }
    }
  }

  /**
   * Update product images
   */
  private async updateProductImages(tx: any, productId: string, images: any[]) {
    for (const image of images) {
      if (image._delete && image.id) {
        // Delete specific image
        await tx.productImage.delete({
          where: { id: image.id }
        })
      } else if (image.id) {
        // Update existing image
        const updateData: any = {}
        if (image.url !== undefined) updateData.url = image.url
        if (image.altText !== undefined) updateData.altText = image.altText

        if (Object.keys(updateData).length > 0) {
          await tx.productImage.update({
            where: { id: image.id },
            data: updateData
          })
        }
      } else if (image.url) {
        // Create new image
        await tx.productImage.create({
          data: {
            productId,
            url: image.url,
            altText: image.altText || null
          }
        })
      }
    }
  }

  /**
   * Update product attributes
   */
  private async updateProductAttributes(tx: any, productId: string, attributes: any[]) {
    for (const attribute of attributes) {
      if (attribute._delete && attribute.attributeId) {
        // Delete specific attribute
        await tx.productAttribute.deleteMany({
          where: {
            productId,
            attributeId: attribute.attributeId
          }
        })
      } else if (attribute.attributeId) {
        // Check if association exists
        const existing = await tx.productAttribute.findUnique({
          where: {
            productId_attributeId: {
              productId,
              attributeId: attribute.attributeId
            }
          }
        })

        if (existing) {
          // Update existing association
          await tx.productAttribute.update({
            where: {
              productId_attributeId: {
                productId,
                attributeId: attribute.attributeId
              }
            },
            data: {
              isRequired: attribute.isRequired ?? existing.isRequired
            }
          })
        } else {
          // Create new association
          await tx.productAttribute.create({
            data: {
              productId,
              attributeId: attribute.attributeId,
              isRequired: attribute.isRequired ?? true
            }
          })
        }
      }
    }
  }

  /**
   * Update product variants
   */
  private async updateProductVariants(tx: any, productId: string, variants: any[]) {
    for (const variant of variants) {
      if (variant._delete && variant.id) {
        // Delete variant (cascade will handle attribute - VariantAttribute model values and images -  VariantImage model)
        await tx.productVariant.delete({
          where: { id: variant.id }
        })
      } else if (variant.id) {
        // Update existing variant
        const updateData: any = {}
        if (variant.sku !== undefined) updateData.sku = variant.sku
        if (variant.name !== undefined) updateData.name = variant.name
        if (variant.barcode !== undefined) updateData.barcode = variant.barcode
        if (variant.costPrice !== undefined) {
          updateData.costPrice = new Prisma.Decimal(variant.costPrice)
        }
        if (variant.sellingPrice !== undefined) {
          updateData.sellingPrice = new Prisma.Decimal(variant.sellingPrice)
        }
        if (variant.stockOnHand !== undefined) updateData.stockOnHand = variant.stockOnHand
        if (variant.imageUrl !== undefined) updateData.imageUrl = variant.imageUrl
        if (variant.lowStockThreshold !== undefined) {
          updateData.lowStockThreshold = variant.lowStockThreshold
        }
        if (variant.maxStockThreshold !== undefined) {
          updateData.maxStockThreshold = variant.maxStockThreshold
        }
        if (variant.isActive !== undefined) updateData.isActive = variant.isActive

        if (Object.keys(updateData).length > 0) {
          await tx.productVariant.update({
            where: { id: variant.id },
            data: updateData
          })
        }

        // Handle variant attribute values
        if (variant.attributeValues) {
          await this.updateVariantAttributeValues(tx, variant.id, variant.attributeValues)
        }

        // Handle variant images
        if (variant.images) {
          await this.updateVariantImages(tx, variant.id, variant.images)
        }
      } else {
        // Create new variant
        const createdVariant = await tx.productVariant.create({
          data: {
            productId,
            sku: variant.sku,
            name: variant.name,
            barcode: variant.barcode,
            costPrice: new Prisma.Decimal(variant.costPrice),
            sellingPrice: new Prisma.Decimal(variant.sellingPrice),
            stockOnHand: variant.stockOnHand,
            imageUrl: variant.imageUrl || '',
            lowStockThreshold: variant.lowStockThreshold || 0,
            maxStockThreshold: variant.maxStockThreshold || 0,
            isActive: variant.isActive ?? true
          }
        })

        // Create variant attribute values
        if (variant.attributeValues) {
          for (const attrVal of variant.attributeValues) {
            if (attrVal.attributeValueId && !attrVal._delete) {
              await tx.variantAttributeValue.create({
                data: {
                  variantId: createdVariant.id,
                  attributeValueId: attrVal.attributeValueId
                }
              })
            }
          }
        }

        // Create variant images
        if (variant.images) {
          for (const img of variant.images) {
            if (img.url && !img._delete) {
              await tx.variantImage.create({
                data: {
                  variantId: createdVariant.id,
                  url: img.url,
                  altText: img.altText || null
                }
              })
            }
          }
        }
      }
    }
  }

  /**
   * Update variant attribute values
   */
  private async updateVariantAttributeValues(tx: any, variantId: string, attributeValues: any[]) {
    for (const attrVal of attributeValues) {
      if (attrVal._delete && attrVal.id) {
        // Delete specific attribute value
        await tx.variantAttributeValue.delete({
          where: { id: attrVal.id }
        })
      } else if (attrVal._delete && attrVal.attributeValueId) {
        // Delete by attributeValueId
        await tx.variantAttributeValue.deleteMany({
          where: {
            variantId,
            attributeValueId: attrVal.attributeValueId
          }
        })
      } else if (attrVal.attributeValueId) {
        // Check if association exists
        const existing = await tx.variantAttributeValue.findFirst({
          where: {
            variantId,
            attributeValueId: attrVal.attributeValueId
          }
        })

        if (!existing) {
          // Create new association
          await tx.variantAttributeValue.create({
            data: {
              variantId,
              attributeValueId: attrVal.attributeValueId
            }
          })
        }
        // Note: VariantAttributeValue doesn't have updateable fields beyond the relation
      }
    }
  }

  /**
   * Update variant images
   */
  private async updateVariantImages(tx: any, variantId: string, images: any[]) {
    for (const image of images) {
      if (image._delete && image.id) {
        // Delete specific image
        await tx.variantImage.delete({
          where: { id: image.id }
        })
      } else if (image.id) {
        // Update existing image
        const updateData: any = {}
        if (image.url !== undefined) updateData.url = image.url
        if (image.altText !== undefined) updateData.altText = image.altText

        if (Object.keys(updateData).length > 0) {
          await tx.variantImage.update({
            where: { id: image.id },
            data: updateData
          })
        }
      } else if (image.url) {
        // Create new image
        await tx.variantImage.create({
          data: {
            variantId,
            url: image.url,
            altText: image.altText || null
          }
        })
      }
    }
  }

  /**
   * Validate references for update
   */
  private async validateReferencesForUpdate(productId: string, dto: UpdateProductDto): Promise<void> {
    const errors: string[] = []

    // Validate brand if provided
    if (dto.brandId) {
      const brand = await this.prismaService.brand.findUnique({
        where: { id: dto.brandId }
      })
      if (!brand) {
        errors.push(`Brand with ID ${dto.brandId} not found`)
      }
    }

    // Validate country of origin if provided
    if (dto.countryOriginId) {
      const country = await this.prismaService.countryOfOrigin.findUnique({
        where: { id: dto.countryOriginId }
      })
      if (!country) {
        errors.push(`Country of Origin with ID ${dto.countryOriginId} not found`)
      }
    }

    // Validate categories if provided. This operation will ensure referenced categories exist in the DB
    if (dto.categories && dto.categories.length > 0) {
      const categoryIds = dto.categories.filter((c) => c.categoryId && !c._delete).map((c) => c.categoryId)

      if (categoryIds.length > 0) {
        // NOTE: We only check categories being added/updated, not deleted ones
        const categories = await this.prismaService.category.findMany({
          where: { id: { in: categoryIds } }
        })

        const foundIds = categories.map((c) => c.id)
        const missingIds = categoryIds.filter((id) => !foundIds.includes(id))

        // Missing in DB, but referenced in DTO
        if (missingIds.length > 0) {
          errors.push(`Categories not found: ${missingIds.join(', ')}`)
        }
      }
    }

    // Validate attributes if provided
    if (dto.attributes && dto.attributes.length > 0) {
      const attributeIds = dto.attributes.filter((a) => a.attributeId && !a._delete).map((a) => a.attributeId)

      if (attributeIds.length > 0) {
        const attributes = await this.prismaService.attribute.findMany({
          where: { id: { in: attributeIds } }
        })

        const foundIds = attributes.map((a) => a.id)
        const missingIds = attributeIds.filter((id) => !foundIds.includes(id))
        if (missingIds.length > 0) {
          errors.push(`Attributes not found: ${missingIds.join(', ')}`)
        }
      }
    }

    // Validate attribute values in variants if provided
    if (dto.variants && dto.variants.length > 0) {
      const allAttributeValueIds = dto.variants
        .filter((v) => !v._delete && v.attributeValues)
        .flatMap((v) =>
          v.attributeValues.filter((av) => av.attributeValueId && !av._delete).map((av) => av.attributeValueId)
        )

      if (allAttributeValueIds.length > 0) {
        const attributeValues = await this.prismaService.attributeValue.findMany({
          where: { id: { in: allAttributeValueIds } }
        })

        const foundIds = attributeValues.map((av) => av.id)
        const missingIds = allAttributeValueIds.filter((id) => !foundIds.includes(id))
        if (missingIds.length > 0) {
          errors.push(`Attribute values not found: ${missingIds.join(', ')}`)
        }
      }
    }

    if (errors.length > 0) {
      throw new NotFoundException(errors.join('; '))
    }
  }

  /**
   * Validate business rules for update
   */
  private async validateBusinessRulesForUpdate(
    productId: string,
    dto: UpdateProductDto,
    existingProduct: any // TODO: Define proper type
  ): Promise<void> {
    const errors: string[] = []

    // Check for unique product code if being updated
    if (dto.code && dto.code !== existingProduct.code) {
      const existingProductWithCode = await this.prismaService.product.findUnique({
        where: { code: dto.code }
      })
      if (existingProductWithCode) {
        errors.push(`Product with code ${dto.code} already exists`)
      }
    }

    // Check for unique product slug if being updated
    if (dto.slug && dto.slug !== existingProduct.slug) {
      const existingProductWithSlug = await this.prismaService.product.findUnique({
        where: { slug: dto.slug }
      })
      if (existingProductWithSlug) {
        errors.push(`Product with slug ${dto.slug} already exists`)
      }
    }

    // Validate primary category if categories are being updated
    if (dto.categories) {
      // Get current categories after update simulation
      const currentCategoryIds = existingProduct.categories.map((c) => c.categoryId)
      const remainingCategories = dto.categories
        .filter((c) => !c._delete)
        .map((c) => c.categoryId || currentCategoryIds)

      const primaryCategories = dto.categories.filter((c) => c.isPrimary && !c._delete)

      // Must have at least one primary category after update
      if (remainingCategories.length > 0) {
        const existingPrimaryCount = existingProduct.categories.filter((c) => c.isPrimary).length
        const newPrimaryCount = primaryCategories.length

        // If removing all categories with isPrimary=true, need to ensure at least one remains
        if (existingPrimaryCount > 0 || newPrimaryCount > 0) {
          if (newPrimaryCount > 1) {
            errors.push('Only one category can be marked as primary')
          }
        }
      }
    }

    // Check for duplicate SKUs in variants being added/updated
    if (dto.variants) {
      const newSkus = dto.variants.filter((v) => !v._delete && v.sku).map((v) => v.sku)

      const uniqueNewSkus = new Set(newSkus)
      if (newSkus.length !== uniqueNewSkus.size) {
        errors.push('Duplicate SKUs found in variant updates')
      }

      // Check for duplicate barcodes
      const newBarcodes = dto.variants.filter((v) => !v._delete && v.barcode).map((v) => v.barcode)

      const uniqueNewBarcodes = new Set(newBarcodes)
      if (newBarcodes.length !== uniqueNewBarcodes.size) {
        errors.push('Duplicate barcodes found in variant updates')
      }

      // Check if new SKUs/barcodes already exist in database (excluding current product variants)
      if (newSkus.length > 0 || newBarcodes.length > 0) {
        const existingVariants = await this.prismaService.productVariant.findMany({
          where: {
            productId: { not: productId },
            OR: [{ sku: { in: newSkus } }, { barcode: { in: newBarcodes } }]
          }
        })

        if (existingVariants.length > 0) {
          const conflictingSkus = existingVariants.filter((v) => newSkus.includes(v.sku)).map((v) => v.sku)
          const conflictingBarcodes = existingVariants
            .filter((v) => newBarcodes.includes(v.barcode))
            .map((v) => v.barcode)

          if (conflictingSkus.length > 0 || conflictingBarcodes.length > 0) {
            errors.push(
              `SKUs or barcodes already exist in other products: ${[...conflictingSkus, ...conflictingBarcodes].join(
                ', '
              )}`
            )
          }
        }
      }

      // Validate price logic for new and updated variants
      for (const variant of dto.variants) {
        if (!variant._delete && variant.sellingPrice && variant.costPrice) {
          if (variant.sellingPrice < variant.costPrice) {
            errors.push(`Variant "${variant.name || variant.id}" has selling price lower than cost price`)
          }
        }
      }
    }

    if (errors.length > 0) {
      throw new BadRequestException(errors.join('; '))
    }
  }

  async seed() {
    console.log('🧹 Cleaning existing data...')

    // Order matters because of relations
    await this.prismaService.attributeValue.deleteMany()
    await this.prismaService.attribute.deleteMany()

    await this.prismaService.category.deleteMany()

    await this.prismaService.brand.deleteMany()
    await this.prismaService.countryOfOrigin.deleteMany()

    console.log('🧼 Database cleaned')

    const electronics = await this.prismaService.category.create({
      data: {
        name: 'Electronics',
        slug: 'electronics',
        description: 'Electronic devices and accessories',
        path: '/electronics',
        depth: 0,
        metaTitle: 'Electronics',
        metaDescription: 'Shop electronics online'
      }
    })

    const phones = await this.prismaService.category.create({
      data: {
        name: 'Mobile Phones',
        slug: 'mobile-phones',
        description: 'Smartphones and mobile devices',
        parentId: electronics.id,
        path: `${electronics.path}/mobile-phones`,
        depth: 1
      }
    })

    const laptops = await this.prismaService.category.create({
      data: {
        name: 'Laptops',
        slug: 'laptops',
        description: 'Personal and professional laptops',
        parentId: electronics.id,
        path: `${electronics.path}/laptops`,
        depth: 1
      }
    })

    const fashion = await this.prismaService.category.create({
      data: {
        name: 'Fashion',
        slug: 'fashion',
        description: 'Clothing and accessories',
        path: '/fashion',
        depth: 0
      }
    })

    const mensFashion = await this.prismaService.category.create({
      data: {
        name: "Men's Fashion",
        slug: 'mens-fashion',
        parentId: fashion.id,
        path: `${fashion.path}/mens-fashion`,
        depth: 1
      }
    })

    /*
   ======
   Brands
   ======
  */

    await this.prismaService.brand.createMany({
      data: [
        { name: 'Apple', imageUrl: 'https://example.com/brands/apple.png' },
        { name: 'Samsung', imageUrl: 'https://example.com/brands/samsung.png' },
        { name: 'Nike', imageUrl: 'https://example.com/brands/nike.png' }
      ]
    })

    /*
   =================
   Country of Origin
   =================
  */

    await this.prismaService.countryOfOrigin.createMany({
      data: [{ name: 'United States' }, { name: 'South Korea' }, { name: 'China' }, { name: 'Vietnam' }]
    })

    /*
   ==========
   Attributes
   ==========
  */

    const colorAttribute = await this.prismaService.attribute.create({
      data: {
        name: 'Color',
        slug: 'color',
        type: AttributeType.COLOR,
        isGlobalFilter: true,
        filterGroup: 'Appearance'
      }
    })

    const sizeAttribute = await this.prismaService.attribute.create({
      data: {
        name: 'Size',
        slug: 'size',
        type: AttributeType.SIZE,
        isGlobalFilter: true,
        filterGroup: 'Dimensions'
      }
    })

    const storageAttribute = await this.prismaService.attribute.create({
      data: {
        name: 'Storage',
        slug: 'storage',
        type: AttributeType.NUMBER,
        unit: 'GB',
        isGlobalFilter: true,
        filterGroup: 'Specifications'
      }
    })

    const materialAttribute = await this.prismaService.attribute.create({
      data: {
        name: 'Material',
        slug: 'material',
        type: AttributeType.TEXT,
        isGlobalFilter: false,
        filterGroup: 'Features'
      }
    })

    /*
   ==================
   Attribute Values
   ==================
  */

    await this.prismaService.attributeValue.createMany({
      data: [
        // Colors
        {
          attributeId: colorAttribute.id,
          value: 'Black',
          hexColor: '#000000'
        },
        {
          attributeId: colorAttribute.id,
          value: 'White',
          hexColor: '#FFFFFF'
        },
        {
          attributeId: colorAttribute.id,
          value: 'Red',
          hexColor: '#FF0000'
        },

        // Sizes
        { attributeId: sizeAttribute.id, value: 'Small' },
        { attributeId: sizeAttribute.id, value: 'Medium' },
        { attributeId: sizeAttribute.id, value: 'Large' },

        // Storage
        { attributeId: storageAttribute.id, value: '128' },
        { attributeId: storageAttribute.id, value: '256' },
        { attributeId: storageAttribute.id, value: '512' },

        // Materials
        { attributeId: materialAttribute.id, value: 'Cotton' },
        { attributeId: materialAttribute.id, value: 'Polyester' },
        { attributeId: materialAttribute.id, value: 'Aluminum' }
      ]
    })

    console.log('✅ Database seeded successfully')
  }
}
