import { ProductStatus } from 'enums';
export declare class CreateProductImageDto {
    url: string;
    displayOrder?: number;
    altText?: string;
}
export declare class CreateVariantAttributeValueDto {
    attributeValueId: string;
    value: string;
}
export declare class CreateProductVariantDto {
    sku?: string;
    name: string;
    barcode?: string | undefined;
    costPrice: number;
    sellingPrice: number;
    stockOnHand?: number;
    imageUrl?: string;
    lowStockThreshold?: number;
    maxStockThreshold?: number;
    isActive?: boolean;
    attributeValues: CreateVariantAttributeValueDto[];
}
export declare class CreateProductCategoryDto {
    categoryId: string;
    isPrimary: boolean;
}
export declare class CreateProductAttributeDto {
    attributeId: string;
    isRequired?: boolean;
}
export declare class CreateProductDto {
    code?: string;
    name: string;
    slug?: string;
    description?: string;
    status?: ProductStatus;
    basePrice: number;
    brandId: string;
    countryOriginId: string;
    categories: CreateProductCategoryDto[];
    images?: CreateProductImageDto[];
    variants: CreateProductVariantDto[];
}
