"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductImage = exports.VariantImage = exports.AttributeValue = exports.VariantAttributeValue = exports.ProductVariant = exports.ProductAttribute = exports.ProductCategory = exports.Product = void 0;
class Product {
    id;
    code;
    name;
    slug;
    description;
    status;
    basePrice;
    views;
    brandId;
    countryOriginId;
    createdAt;
    updatedAt;
    brand;
    countryOfOrigin;
    categories;
    variants;
    images;
    constructor(data) {
        Object.assign(this, data);
    }
}
exports.Product = Product;
class ProductCategory {
    categoryId;
    isPrimary;
    category;
    constructor(data) {
        Object.assign(this, data);
    }
}
exports.ProductCategory = ProductCategory;
class ProductAttribute {
    attributeId;
    isRequired;
    attribute;
    constructor(data) {
        Object.assign(this, data);
    }
}
exports.ProductAttribute = ProductAttribute;
class ProductVariant {
    id;
    sku;
    name;
    barcode;
    costPrice;
    sellingPrice;
    stockOnHand;
    imageUrl;
    lowStockThreshold;
    maxStockThreshold;
    isActive;
    attributeValues;
    images;
    constructor(data) {
        Object.assign(this, data);
    }
}
exports.ProductVariant = ProductVariant;
class VariantAttributeValue {
    attributeValueId;
    attributeValue;
    constructor(data) {
        Object.assign(this, data);
    }
}
exports.VariantAttributeValue = VariantAttributeValue;
class AttributeValue {
    id;
    value;
    hexColor;
    constructor(data) {
        Object.assign(this, data);
    }
}
exports.AttributeValue = AttributeValue;
class VariantImage {
    url;
    altText;
    constructor(data) {
        Object.assign(this, data);
    }
}
exports.VariantImage = VariantImage;
class ProductImage {
    url;
    altText;
    constructor(data) {
        Object.assign(this, data);
    }
}
exports.ProductImage = ProductImage;
//# sourceMappingURL=product.entity.js.map