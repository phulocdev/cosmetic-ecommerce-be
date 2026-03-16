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
exports.ProductsService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const prisma_service_1 = require("../../database/prisma/prisma.service");
const find_all_product_service_1 = require("./find-all-product.service");
const update_product_service_1 = require("./update-product.service");
const validate_dto_service_1 = require("./validate-dto.service");
const enums_1 = require("../../enums");
const utils_1 = require("../../utils");
let ProductsService = class ProductsService {
    prismaService;
    validateDtoService;
    updateProductService;
    findAllProductService;
    constructor(prismaService, validateDtoService, updateProductService, findAllProductService) {
        this.prismaService = prismaService;
        this.validateDtoService = validateDtoService;
        this.updateProductService = updateProductService;
        this.findAllProductService = findAllProductService;
    }
    async create(createProductDto) {
        await this.validateDtoService.validateReferencesForCreate(createProductDto);
        await this.validateDtoService.validateBusinessRulesForCreate(createProductDto);
        const product = await this.prismaService.$transaction(async (tx) => {
            const productCode = createProductDto.code || (0, utils_1.generateProductCode)(createProductDto.name);
            const createdProduct = await tx.product.create({
                data: {
                    code: productCode,
                    name: createProductDto.name,
                    slug: createProductDto.slug || (0, utils_1.slugifyString)(createProductDto.name),
                    description: createProductDto.description,
                    status: createProductDto.status,
                    basePrice: new client_1.Prisma.Decimal(createProductDto.basePrice),
                    brandId: createProductDto.brandId,
                    countryOriginId: createProductDto.countryOriginId,
                    views: 0
                }
            });
            if (createProductDto.categories && createProductDto.categories.length > 0) {
                await tx.productCategory.createMany({
                    data: createProductDto.categories.map((cat) => ({
                        productId: createdProduct.id,
                        categoryId: cat.categoryId,
                        isPrimary: cat.isPrimary
                    }))
                });
            }
            if (createProductDto.images && createProductDto.images.length > 0) {
                await tx.productImage.createMany({
                    data: createProductDto.images.map((img) => ({
                        productId: createdProduct.id,
                        url: img.url,
                        altText: img.altText || null,
                        displayOrder: img.displayOrder || 1
                    }))
                });
            }
            if (createProductDto.variants && createProductDto.variants.length > 0) {
                for (const variant of createProductDto.variants) {
                    const createdVariant = await tx.productVariant.create({
                        data: {
                            productId: createdProduct.id,
                            sku: (0, utils_1.generateVariantSku)(productCode, variant.attributeValues || []),
                            name: variant.name,
                            barcode: variant.barcode,
                            costPrice: new client_1.Prisma.Decimal(variant.costPrice),
                            sellingPrice: new client_1.Prisma.Decimal(variant.sellingPrice),
                            stockOnHand: variant.stockOnHand,
                            imageUrl: variant.imageUrl,
                            lowStockThreshold: variant.lowStockThreshold || 0,
                            maxStockThreshold: variant.maxStockThreshold || 0,
                            isActive: variant.isActive ?? true
                        }
                    });
                    if (variant.attributeValues && variant.attributeValues.length > 0) {
                        await tx.variantAttributeValue.createMany({
                            data: variant.attributeValues.map((attrVal) => ({
                                variantId: createdVariant.id,
                                attributeValueId: attrVal.attributeValueId
                            }))
                        });
                    }
                }
            }
            return createdProduct;
        });
        return this.findById(product.id);
    }
    async findById(id) {
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
        });
        if (!product) {
            throw new common_1.NotFoundException(`Product with ID ${id} not found`);
        }
        return product;
    }
    async findBySlug(slug) {
        const product = await this.prismaService.product.findUnique({
            where: { slug },
            include: {
                brand: true,
                countryOfOrigin: true,
                categories: {
                    include: {
                        category: true
                    }
                },
                images: true,
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
        });
        if (!product) {
            throw new common_1.NotFoundException(`Product with ID ${slug} not found`);
        }
        return product;
    }
    async update(id, updateProductDto) {
        const existingProduct = await this.prismaService.product.findUnique({
            where: { id },
            include: {
                categories: true,
                images: true,
                variants: {
                    include: {
                        attributeValues: true
                    }
                }
            }
        });
        if (!existingProduct) {
            throw new common_1.NotFoundException(`Product with ID ${id} not found`);
        }
        await this.validateDtoService.validateReferencesForUpdate(id, updateProductDto);
        await this.validateDtoService.validateBusinessRulesForUpdate(id, updateProductDto, existingProduct);
        await this.prismaService.$transaction(async (tx) => {
            const updateData = {};
            if (updateProductDto.code !== undefined)
                updateData.code = updateProductDto.code;
            if (updateProductDto.name !== undefined)
                updateData.name = updateProductDto.name;
            if (updateProductDto.slug !== undefined)
                updateData.slug = updateProductDto.slug;
            if (updateProductDto.description !== undefined)
                updateData.description = updateProductDto.description;
            if (updateProductDto.status !== undefined)
                updateData.status = updateProductDto.status;
            if (updateProductDto.basePrice !== undefined) {
                updateData.basePrice = new client_1.Prisma.Decimal(updateProductDto.basePrice);
            }
            if (updateProductDto.brandId !== undefined)
                updateData.brandId = updateProductDto.brandId;
            if (updateProductDto.countryOriginId !== undefined) {
                updateData.countryOriginId = updateProductDto.countryOriginId;
            }
            if (Object.keys(updateData).length > 0) {
                await tx.product.update({
                    where: { id },
                    data: updateData
                });
            }
            if (updateProductDto.categories) {
                await this.updateProductService.updateProductCategories(tx, id, updateProductDto.categories);
            }
            if (updateProductDto.images) {
                await this.updateProductService.updateProductImages(tx, id, updateProductDto.images);
            }
            if (updateProductDto.variants) {
                await this.updateProductService.updateProductVariants(tx, id, existingProduct.code, updateProductDto.variants);
            }
        });
        return this.findById(id);
    }
    async findAll(query, utcDateRange) {
        const paginationType = query.paginationType || enums_1.PaginationType.OFFSET;
        if (paginationType === enums_1.PaginationType.CURSOR) {
            return this.findAllProductService.findAllWithCursorPagination(query, utcDateRange);
        }
        else {
            return this.findAllProductService.findAllWithOffsetPagination(query, utcDateRange);
        }
    }
};
exports.ProductsService = ProductsService;
exports.ProductsService = ProductsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        validate_dto_service_1.ValidateDtoService,
        update_product_service_1.UpdateProductService,
        find_all_product_service_1.FindAllProductService])
], ProductsService);
//# sourceMappingURL=products.service.js.map