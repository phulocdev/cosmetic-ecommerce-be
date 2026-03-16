import { CreateProductAttributeDto, CreateProductCategoryDto, CreateProductDto, CreateProductImageDto, CreateProductVariantDto, CreateVariantAttributeValueDto } from './create-product.dto';
declare const UpdateProductImageDto_base: import("@nestjs/common").Type<Partial<CreateProductImageDto>>;
export declare class UpdateProductImageDto extends UpdateProductImageDto_base {
    id?: string;
    _delete?: boolean;
}
declare const UpdateVariantAttributeValueDto_base: import("@nestjs/common").Type<Partial<CreateVariantAttributeValueDto>>;
export declare class UpdateVariantAttributeValueDto extends UpdateVariantAttributeValueDto_base {
    id?: string;
    _delete?: boolean;
}
export declare class UpdateVariantImageDto {
    id?: string;
    url?: string;
    altText?: string;
    _delete?: boolean;
}
declare const UpdateProductVariantDto_base: import("@nestjs/common").Type<Partial<Omit<CreateProductVariantDto, "sku" | "attributeValues">>>;
export declare class UpdateProductVariantDto extends UpdateProductVariantDto_base {
    id?: string;
    attributeValues?: UpdateVariantAttributeValueDto[];
    _delete?: boolean;
}
declare const UpdateProductCategoryDto_base: import("@nestjs/common").Type<Partial<CreateProductCategoryDto>>;
export declare class UpdateProductCategoryDto extends UpdateProductCategoryDto_base {
    id?: string;
    _delete?: boolean;
}
declare const UpdateProductAttributeDto_base: import("@nestjs/common").Type<Partial<CreateProductAttributeDto>>;
export declare class UpdateProductAttributeDto extends UpdateProductAttributeDto_base {
    id?: string;
    _delete?: boolean;
}
declare const UpdateProductDto_base: import("@nestjs/common").Type<Partial<Omit<CreateProductDto, "categories" | "images" | "variants">>>;
export declare class UpdateProductDto extends UpdateProductDto_base {
    code?: string;
    categories?: UpdateProductCategoryDto[];
    images?: UpdateProductImageDto[];
    variants?: UpdateProductVariantDto[];
    attributes?: UpdateProductAttributeDto[];
}
export {};
