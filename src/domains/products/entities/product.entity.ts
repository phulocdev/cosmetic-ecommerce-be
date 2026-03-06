import { Attribute } from 'domains/attributes/entities/attribute.entity'
import { Brand } from 'domains/brands/entities/brand.entity'
import { Category } from 'domains/categories/entities/category.entity'
import { CountryOfOrigin } from 'domains/country-of-origin/entities/country-of-origin.entity'
import { ProductStatus } from 'enums'

export class Product {
  id: string
  code: string
  name: string
  slug: string
  description: string
  status: ProductStatus
  basePrice: number
  views: number
  brandId: string
  countryOriginId: string
  createdAt: Date
  updatedAt: Date

  // Relations
  brand: Brand
  countryOfOrigin: CountryOfOrigin
  categories: ProductCategory[]
  variants: ProductVariant[]
  attributes: ProductAttribute[]
  images: ProductImage[]

  constructor(data: Product) {
    Object.assign(this, data)
  }
}

export class ProductCategory {
  categoryId: string
  isPrimary: boolean
  category?: Category

  constructor(data: ProductCategory) {
    Object.assign(this, data)
  }
}

export class ProductAttribute {
  attributeId: string
  isRequired: boolean
  attribute?: Attribute

  constructor(data: ProductAttribute) {
    Object.assign(this, data)
  }
}

export class ProductVariant {
  id: string
  sku: string
  name: string
  barcode: string
  costPrice: number
  sellingPrice: number
  stockOnHand: number
  imageUrl: string
  lowStockThreshold: number
  maxStockThreshold: number
  isActive: boolean
  attributeValues: VariantAttributeValue[]
  images: VariantImage[]

  constructor(data: ProductVariant) {
    Object.assign(this, data)
  }
}

export class VariantAttributeValue {
  attributeValueId: string
  attributeValue?: AttributeValue

  constructor(data: VariantAttributeValue) {
    Object.assign(this, data)
  }
}

export class AttributeValue {
  id: string
  value: string
  hexColor?: string

  constructor(data: AttributeValue) {
    Object.assign(this, data)
  }
}

export class VariantImage {
  url: string
  altText?: string

  constructor(data: VariantImage) {
    Object.assign(this, data)
  }
}

export class ProductImage {
  url: string
  altText?: string

  constructor(data: ProductImage) {
    Object.assign(this, data)
  }
}
