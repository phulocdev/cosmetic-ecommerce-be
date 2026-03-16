import { Attribute } from 'domains/attributes/entities/attribute.entity';
import { Brand } from 'domains/brands/entities/brand.entity';
import { Category } from 'domains/categories/entities/category.entity';
import { CountryOfOrigin } from 'domains/country-of-origin/entities/country-of-origin.entity';
export declare class Product {
    id: string;
    code: string;
    name: string;
    slug: string;
    description: string;
    status: string;
    basePrice: number;
    views: number;
    brandId: string;
    countryOriginId: string;
    createdAt: Date;
    updatedAt: Date;
    brand: Brand;
    countryOfOrigin: CountryOfOrigin;
    categories: ProductCategory[];
    variants: ProductVariant[];
    images: ProductImage[];
    constructor(data: Product);
}
export declare class ProductCategory {
    categoryId: string;
    isPrimary: boolean;
    category?: Category;
    constructor(data: ProductCategory);
}
export declare class ProductAttribute {
    attributeId: string;
    isRequired: boolean;
    attribute?: Attribute;
    constructor(data: ProductAttribute);
}
export declare class ProductVariant {
    id: string;
    sku: string;
    name: string;
    barcode: string;
    costPrice: number;
    sellingPrice: number;
    stockOnHand: number;
    imageUrl: string;
    lowStockThreshold: number;
    maxStockThreshold: number;
    isActive: boolean;
    attributeValues: VariantAttributeValue[];
    images: VariantImage[];
    constructor(data: ProductVariant);
}
export declare class VariantAttributeValue {
    attributeValueId: string;
    attributeValue?: AttributeValue;
    constructor(data: VariantAttributeValue);
}
export declare class AttributeValue {
    id: string;
    value: string;
    hexColor?: string;
    constructor(data: AttributeValue);
}
export declare class VariantImage {
    url: string;
    altText?: string;
    constructor(data: VariantImage);
}
export declare class ProductImage {
    url: string;
    altText?: string;
    constructor(data: ProductImage);
}
