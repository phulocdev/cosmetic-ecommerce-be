import { Injectable } from '@nestjs/common'
import { Prisma } from '@prisma/client'
import { PrismaService } from 'database/prisma/prisma.service'

@Injectable()
export class UpdateProductService {
  constructor(private readonly prismaService: PrismaService) {}

  /**
   * Update product categories
   */
  async updateProductCategories(tx: any, productId: string, categories: any[]) {
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
  async updateProductImages(tx: any, productId: string, images: any[]) {
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
  async updateProductAttributes(tx: any, productId: string, attributes: any[]) {
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
  async updateProductVariants(tx: any, productId: string, variants: any[]) {
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
  async updateVariantAttributeValues(tx: any, variantId: string, attributeValues: any[]) {
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
  async updateVariantImages(tx: any, variantId: string, images: any[]) {
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
}
