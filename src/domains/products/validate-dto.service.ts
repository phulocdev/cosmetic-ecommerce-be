import { Injectable } from '@nestjs/common'
import { BadRequestError, NotFoundError } from 'core/exceptions/errors.exception'
import { PrismaService } from 'database/prisma/prisma.service'
import { CreateProductDto } from 'domains/products/dto/create-product.dto'
import { UpdateProductDto } from 'domains/products/dto/update-product.dto'

@Injectable()
export class ValidateDtoService {
  constructor(private readonly prismaService: PrismaService) {}

  /**
   * Validate that all referenced entities exist
   */
  async validateReferencesForCreate(dto: CreateProductDto): Promise<void> {
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
      throw new NotFoundError(errors.join('; '))
    }
  }

  /**
   * Validate business rules
   */
  async validateBusinessRulesForCreate(dto: CreateProductDto): Promise<void> {
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
      throw new BadRequestError(errors.join('; '))
    }
  }

  /**
   * Validate references for update
   */
  async validateReferencesForUpdate(productId: string, dto: UpdateProductDto): Promise<void> {
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
      throw new NotFoundError(errors.join('; '))
    }
  }

  /**
   * Validate business rules for update
   */
  async validateBusinessRulesForUpdate(
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
      throw new BadRequestError(errors.join('; '))
    }
  }
}
