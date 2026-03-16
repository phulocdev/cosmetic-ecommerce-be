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
exports.ValidateDtoService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../database/prisma/prisma.service");
let ValidateDtoService = class ValidateDtoService {
    prismaService;
    constructor(prismaService) {
        this.prismaService = prismaService;
    }
    async validateReferencesForCreate(dto) {
        const errors = [];
        const brand = await this.prismaService.brand.findUnique({
            where: { id: dto.brandId }
        });
        if (!brand) {
            errors.push(`Brand with ID ${dto.brandId} not found`);
        }
        const country = await this.prismaService.countryOfOrigin.findUnique({
            where: { id: dto.countryOriginId }
        });
        if (!country) {
            errors.push(`Country of Origin with ID ${dto.countryOriginId} not found`);
        }
        if (dto.categories && dto.categories.length > 0) {
            const categoryIds = dto.categories.map((c) => c.categoryId);
            const categories = await this.prismaService.category.findMany({
                where: { id: { in: categoryIds } }
            });
            const foundIds = categories.map((c) => c.id);
            const missingIds = categoryIds.filter((id) => !foundIds.includes(id));
            if (missingIds.length > 0) {
                errors.push(`Categories not found: ${missingIds.join(', ')}`);
            }
        }
        if (dto.variants && dto.variants.length > 0) {
            const allAttributeValueIds = dto.variants.flatMap((v) => v.attributeValues.map((av) => av.attributeValueId));
            if (allAttributeValueIds.length > 0) {
                const attributeValues = await this.prismaService.attributeValue.findMany({
                    where: { id: { in: allAttributeValueIds } }
                });
                const foundIds = attributeValues.map((av) => av.id);
                const missingIds = allAttributeValueIds.filter((id) => !foundIds.includes(id));
                if (missingIds.length > 0) {
                    errors.push(`Attribute values not found: ${missingIds.join(', ')}`);
                }
            }
        }
        if (errors.length > 0) {
            throw new common_1.NotFoundException(errors.join('; '));
        }
    }
    async validateBusinessRulesForCreate(dto) {
        const errors = [];
        if (dto.slug) {
            const existingSlug = await this.prismaService.product.findUnique({
                where: { slug: dto.slug }
            });
            if (existingSlug) {
                errors.push(`Product with slug ${dto.slug} already exists`);
            }
        }
        const primaryCount = dto.categories.filter((cat) => cat.isPrimary).length;
        if (primaryCount === 0) {
            errors.push('At least one category must be marked as primary');
        }
        else if (primaryCount > 1) {
            errors.push('Only one category can be marked as primary');
        }
        const skus = dto.variants.map((v) => v.sku);
        const uniqueSkus = new Set(skus);
        if (skus.length !== uniqueSkus.size) {
            errors.push('Duplicate SKUs found in variants');
        }
        const barcodes = dto.variants
            .map((v) => v.barcode)
            .filter(Boolean);
        const uniqueBarcodes = new Set(barcodes);
        if (barcodes.length !== uniqueBarcodes.size) {
            errors.push('Duplicate barcodes found in variants');
        }
        const existingVariants = await this.prismaService.productVariant.findMany({
            where: {
                OR: [{ sku: { in: skus } }, { barcode: { in: barcodes } }]
            }
        });
        if (existingVariants.length > 0) {
            const existingSkus = existingVariants.map((v) => v.sku);
            const existingBarcodes = existingVariants.map((v) => v.barcode);
            errors.push(`SKUs or barcodes already exist: ${[...existingSkus, ...existingBarcodes].join(', ')}`);
        }
        for (const variant of dto.variants) {
            if (variant.sellingPrice < variant.costPrice) {
                errors.push(`Variant "${variant.name}" has selling price lower than cost price`);
            }
        }
        if (errors.length > 0) {
            throw new common_1.BadRequestException(errors.join('; '));
        }
    }
    async validateReferencesForUpdate(productId, dto) {
        const errors = [];
        if (dto.brandId) {
            const brand = await this.prismaService.brand.findUnique({
                where: { id: dto.brandId }
            });
            if (!brand) {
                errors.push(`Brand with ID ${dto.brandId} not found`);
            }
        }
        if (dto.countryOriginId) {
            const country = await this.prismaService.countryOfOrigin.findUnique({
                where: { id: dto.countryOriginId }
            });
            if (!country) {
                errors.push(`Country of Origin with ID ${dto.countryOriginId} not found`);
            }
        }
        if (dto.categories && dto.categories.length > 0) {
            const categoryIds = dto.categories
                .filter((c) => c.categoryId && !c._delete)
                .map((c) => c.categoryId);
            if (categoryIds.length > 0) {
                const categories = await this.prismaService.category.findMany({
                    where: { id: { in: categoryIds } }
                });
                const foundIds = categories.map((c) => c.id);
                const missingIds = categoryIds.filter((id) => !foundIds.includes(id));
                if (missingIds.length > 0) {
                    errors.push(`Categories not found: ${missingIds.join(', ')}`);
                }
            }
        }
        if (dto.attributes && dto.attributes.length > 0) {
            const attributeIds = dto.attributes
                .filter((a) => a.attributeId && !a._delete)
                .map((a) => a.attributeId);
            if (attributeIds.length > 0) {
                const attributes = await this.prismaService.attribute.findMany({
                    where: { id: { in: attributeIds } }
                });
                const foundIds = attributes.map((a) => a.id);
                const missingIds = attributeIds.filter((id) => !foundIds.includes(id));
                if (missingIds.length > 0) {
                    errors.push(`Attributes not found: ${missingIds.join(', ')}`);
                }
            }
        }
        if (dto.variants && dto.variants.length > 0) {
            const allAttributeValueIds = dto.variants
                .filter((v) => !v._delete && v.attributeValues)
                .flatMap((v) => v.attributeValues
                .filter((av) => av.attributeValueId && !av._delete)
                .map((av) => av.attributeValueId));
            if (allAttributeValueIds.length > 0) {
                const attributeValues = await this.prismaService.attributeValue.findMany({
                    where: { id: { in: allAttributeValueIds } }
                });
                const foundIds = attributeValues.map((av) => av.id);
                const missingIds = allAttributeValueIds.filter((id) => !foundIds.includes(id));
                if (missingIds.length > 0) {
                    errors.push(`Attribute values not found: ${missingIds.join(', ')}`);
                }
            }
        }
        if (errors.length > 0) {
            throw new common_1.NotFoundException(errors.join('; '));
        }
    }
    async validateBusinessRulesForUpdate(productId, dto, existingProduct) {
        const errors = [];
        if (dto.code && dto.code !== existingProduct.code) {
            const existingProductWithCode = await this.prismaService.product.findUnique({
                where: { code: dto.code }
            });
            if (existingProductWithCode) {
                errors.push(`Product with code ${dto.code} already exists`);
            }
        }
        if (dto.slug && dto.slug !== existingProduct.slug) {
            const existingProductWithSlug = await this.prismaService.product.findUnique({
                where: { slug: dto.slug }
            });
            if (existingProductWithSlug) {
                errors.push(`Product with slug ${dto.slug} already exists`);
            }
        }
        if (dto.categories) {
            const currentCategoryIds = existingProduct.categories.map((c) => c.categoryId);
            const remainingCategories = dto.categories
                .filter((c) => !c._delete)
                .map((c) => c.categoryId || currentCategoryIds);
            const primaryCategories = dto.categories.filter((c) => c.isPrimary && !c._delete);
            if (remainingCategories.length > 0) {
                const existingPrimaryCount = existingProduct.categories.filter((c) => c.isPrimary).length;
                const newPrimaryCount = primaryCategories.length;
                if (existingPrimaryCount > 0 || newPrimaryCount > 0) {
                    if (newPrimaryCount > 1) {
                        errors.push('Only one category can be marked as primary');
                    }
                }
            }
        }
        if (dto.variants) {
            const newBarcodes = dto.variants.filter((v) => !v._delete && v.barcode).map((v) => v.barcode);
            const uniqueNewBarcodes = new Set(newBarcodes);
            if (newBarcodes.length !== uniqueNewBarcodes.size) {
                errors.push('Duplicate barcodes found in variant updates');
            }
            if (newBarcodes.length > 0) {
                const existingVariants = await this.prismaService.productVariant.findMany({
                    where: {
                        productId: { not: productId },
                        OR: [
                            { barcode: { in: newBarcodes } }
                        ]
                    }
                });
                if (existingVariants.length > 0) {
                    const conflictingBarcodes = existingVariants
                        .filter((v) => newBarcodes.includes(v.barcode))
                        .map((v) => v.barcode);
                    if (conflictingBarcodes.length > 0) {
                        errors.push(`SKUs or barcodes already exist in other products: ${[
                            ...conflictingBarcodes
                        ].join(', ')}`);
                    }
                }
            }
            for (const variant of dto.variants) {
                if (!variant._delete && variant.sellingPrice && variant.costPrice) {
                    if (variant.sellingPrice < variant.costPrice) {
                        errors.push(`Variant "${variant.name || variant.id}" has selling price lower than cost price`);
                    }
                }
            }
        }
        if (errors.length > 0) {
            throw new common_1.BadRequestException(errors.join('; '));
        }
    }
};
exports.ValidateDtoService = ValidateDtoService;
exports.ValidateDtoService = ValidateDtoService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ValidateDtoService);
//# sourceMappingURL=validate-dto.service.js.map