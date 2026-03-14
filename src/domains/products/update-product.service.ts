import { Injectable } from '@nestjs/common'
import { Prisma, ProductImage, ProductVariant } from '@prisma/client'
import { PrismaService } from 'database/prisma/prisma.service'
import {
  UpdateProductAttributeDto,
  UpdateProductCategoryDto,
  UpdateProductImageDto,
  UpdateProductVariantDto,
  UpdateVariantAttributeValueDto,
  UpdateVariantImageDto
} from 'domains/products/dto'
import { generateVariantSku } from 'utils'

@Injectable()
export class UpdateProductService {
  constructor(private readonly prismaService: PrismaService) {}

  /**
   * Update product categories
   */
  async updateProductCategories(
    tx: Prisma.TransactionClient,
    productId: string,
    categories: UpdateProductCategoryDto[]
  ) {
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
  async updateProductImages(
    tx: Prisma.TransactionClient,
    productId: string,
    images: UpdateProductImageDto[]
  ) {
    for (const image of images) {
      if (image._delete && image.id) {
        // Delete specific image
        await tx.productImage.delete({
          where: { id: image.id }
        })
      } else if (image.id) {
        // Update existing image
        const updateData: Partial<ProductImage> = {}
        if (image.url !== undefined) updateData.url = image.url
        if (image.altText !== undefined) updateData.altText = image.altText
        if (image.displayOrder !== undefined) updateData.displayOrder = image.displayOrder

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
            displayOrder: image.displayOrder || 1,
            altText: image.altText || null
          }
        })
      }
    }
  }

  /**
   * Update product variants
   */
  async updateProductVariants(
    tx: Prisma.TransactionClient,
    productId: string,
    productCode: string,
    variants: UpdateProductVariantDto[]
  ) {
    for (const variant of variants) {
      if (variant._delete && variant.id) {
        // Delete variant (cascade will handle attribute - VariantAttributeValue and VariantImage model)
        await tx.productVariant.delete({
          where: { id: variant.id }
        })
      } else if (variant.id) {
        // Update existing variant
        const updateData: Partial<ProductVariant> = {}
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

        // Handle Update instances in VariantAttributeValue Table
        if (variant.attributeValues) {
          await this.updateVariantAttributeValues(tx, variant.id, variant.attributeValues)
        }

        // Handle variant images
        // if (variant.images) {
        //   await this.updateVariantImages(tx, variant.id, variant.images)
        // }
      } else {
        // Create new variant
        const createdVariant = await tx.productVariant.create({
          data: {
            productId,
            sku: generateVariantSku(
              productCode,
              variant.attributeValues?.map((v) => ({
                attributeValueId: v.attributeValueId,
                value: v.value
              })) || []
            ),
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

        // // Create variant images
        // if (variant.images) {
        //   for (const img of variant.images) {
        //     if (img.url && !img._delete) {
        //       await tx.variantImage.create({
        //         data: {
        //           variantId: createdVariant.id,
        //           url: img.url,
        //           altText: img.altText || null
        //         }
        //       })
        //     }
        //   }
        // }
      }
    }
  }

  /**
   * Update variant attribute values
   */
  async updateVariantAttributeValues(
    tx: Prisma.TransactionClient,
    variantId: string,
    attributeValues: UpdateVariantAttributeValueDto[]
  ) {
    for (const attrVal of attributeValues) {
      if (attrVal._delete && attrVal.id) {
        // Delete specific variant attribute value instances by its ID
        await tx.variantAttributeValue.delete({
          where: { id: attrVal.id }
        })
      } else if (attrVal._delete && attrVal.attributeValueId) {
        // Also delete by variantId and attributeValueId if ID is not provided but _delete is true
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
        } else {
          // Note: VariantAttributeValue doesn't have updateable fields beyond the relation
          // No updateable fields in VariantAttributeValue, so nothing to update
          // If there were updateable fields, we would handle them here
          // Keep the current association as is since there's nothing to update -> It's right
        }
      }
    }
  }
}
