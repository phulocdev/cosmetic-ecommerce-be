"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateProductService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const prisma_service_1 = require("../../database/prisma/prisma.service");
const utils_1 = require("../../utils");
let UpdateProductService = class UpdateProductService {
    prismaService;
    constructor(prismaService) {
        this.prismaService = prismaService;
    }
    async updateProductCategories(tx, productId, categories) {
        for (const category of categories) {
            if (category._delete && category.categoryId) {
                await tx.productCategory.deleteMany({
                    where: {
                        productId,
                        categoryId: category.categoryId
                    }
                });
            }
            else if (category.categoryId) {
                const existing = await tx.productCategory.findUnique({
                    where: {
                        productId_categoryId: {
                            productId,
                            categoryId: category.categoryId
                        }
                    }
                });
                if (existing) {
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
                    });
                }
                else {
                    await tx.productCategory.create({
                        data: {
                            productId,
                            categoryId: category.categoryId,
                            isPrimary: category.isPrimary ?? false
                        }
                    });
                }
            }
        }
    }
    async updateProductImages(tx, productId, images) {
        for (const image of images) {
            if (image._delete && image.id) {
                await tx.productImage.delete({
                    where: { id: image.id }
                });
            }
            else if (image.id) {
                const updateData = {};
                if (image.url !== undefined)
                    updateData.url = image.url;
                if (image.altText !== undefined)
                    updateData.altText = image.altText;
                if (image.displayOrder !== undefined)
                    updateData.displayOrder = image.displayOrder;
                if (Object.keys(updateData).length > 0) {
                    await tx.productImage.update({
                        where: { id: image.id },
                        data: updateData
                    });
                }
            }
            else if (image.url) {
                await tx.productImage.create({
                    data: {
                        productId,
                        url: image.url,
                        displayOrder: image.displayOrder || 1,
                        altText: image.altText || null
                    }
                });
            }
        }
    }
    async updateProductVariants(tx, productId, productCode, variants) {
        for (const variant of variants) {
            if (variant._delete && variant.id) {
                await tx.productVariant.delete({
                    where: { id: variant.id }
                });
            }
            else if (variant.id) {
                const updateData = {};
                if (variant.name !== undefined)
                    updateData.name = variant.name;
                if (variant.barcode !== undefined)
                    updateData.barcode = variant.barcode;
                if (variant.costPrice !== undefined) {
                    updateData.costPrice = new client_1.Prisma.Decimal(variant.costPrice);
                }
                if (variant.sellingPrice !== undefined) {
                    updateData.sellingPrice = new client_1.Prisma.Decimal(variant.sellingPrice);
                }
                if (variant.stockOnHand !== undefined)
                    updateData.stockOnHand = variant.stockOnHand;
                if (variant.imageUrl !== undefined)
                    updateData.imageUrl = variant.imageUrl;
                if (variant.lowStockThreshold !== undefined) {
                    updateData.lowStockThreshold = variant.lowStockThreshold;
                }
                if (variant.maxStockThreshold !== undefined) {
                    updateData.maxStockThreshold = variant.maxStockThreshold;
                }
                if (variant.isActive !== undefined)
                    updateData.isActive = variant.isActive;
                if (Object.keys(updateData).length > 0) {
                    await tx.productVariant.update({
                        where: { id: variant.id },
                        data: updateData
                    });
                }
                if (variant.attributeValues) {
                    await this.updateVariantAttributeValues(tx, variant.id, variant.attributeValues);
                }
            }
            else {
                const createdVariant = await tx.productVariant.create({
                    data: {
                        productId,
                        sku: (0, utils_1.generateVariantSku)(productCode, variant.attributeValues?.map((v) => ({
                            attributeValueId: v.attributeValueId,
                            value: v.value
                        })) || []),
                        name: variant.name,
                        barcode: variant.barcode,
                        costPrice: new client_1.Prisma.Decimal(variant.costPrice),
                        sellingPrice: new client_1.Prisma.Decimal(variant.sellingPrice),
                        stockOnHand: variant.stockOnHand,
                        imageUrl: variant.imageUrl || '',
                        lowStockThreshold: variant.lowStockThreshold || 0,
                        maxStockThreshold: variant.maxStockThreshold || 0,
                        isActive: variant.isActive ?? true
                    }
                });
                if (variant.attributeValues) {
                    for (const attrVal of variant.attributeValues) {
                        if (attrVal.attributeValueId && !attrVal._delete) {
                            await tx.variantAttributeValue.create({
                                data: {
                                    variantId: createdVariant.id,
                                    attributeValueId: attrVal.attributeValueId
                                }
                            });
                        }
                    }
                }
            }
        }
    }
    async updateVariantAttributeValues(tx, variantId, attributeValues) {
        for (const attrVal of attributeValues) {
            if (attrVal._delete && attrVal.id) {
                await tx.variantAttributeValue.delete({
                    where: { id: attrVal.id }
                });
            }
            else if (attrVal._delete && attrVal.attributeValueId) {
                await tx.variantAttributeValue.deleteMany({
                    where: {
                        variantId,
                        attributeValueId: attrVal.attributeValueId
                    }
                });
            }
            else if (attrVal.attributeValueId) {
                const existing = await tx.variantAttributeValue.findFirst({
                    where: {
                        variantId,
                        attributeValueId: attrVal.attributeValueId
                    }
                });
                if (!existing) {
                    await tx.variantAttributeValue.create({
                        data: {
                            variantId,
                            attributeValueId: attrVal.attributeValueId
                        }
                    });
                }
                else {
                }
            }
        }
    }
};
exports.UpdateProductService = UpdateProductService;
exports.UpdateProductService = UpdateProductService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], UpdateProductService);
//# sourceMappingURL=update-product.service.js.map