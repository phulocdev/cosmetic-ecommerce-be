import { UserRole } from '@prisma/client'

declare global {
  export interface Product {
    id: string
    categoryId: string
    brandId: string
    countryOriginId: string
    code: string
    name: string
    description: string
    imageUrl: string
    status: ProductStatus
    basePrice: number
    minStockLevel: number
    maxStockLevel: number
    views: number
    createdAt: Date
    updatedAt?: Date
  }

  export interface ProductAttribute {
    id: string
    productId: string
    name: string
    createdAt: Date
    updatedAt?: Date
  }

  export interface ProductAttributeSku {
    id: string
    productAttributeId: string
    skuId: string
    value: string
    createdAt: Date
    updatedAt?: Date
  }

  export interface Sku {
    id: string
    productId: string
    name: string
    code: string
    barcode: string
    costPrice: number
    sellingPrice: number
    stockOnHand: number
    imageUrl: string
    createdAt: Date
    updatedAt?: Date
  }

  export interface Category {
    id: string
    parentCategoryId?: string
    name: string
    slug: string
    imageUrl: string
    createdAt: Date
    updatedAt?: Date
  }

  export interface Brand {
    id: string
    name: string
    imageUrl: string
    createdAt: Date
    updatedAt?: Date
  }

  export interface CountryOfOrigin {
    id: string
    name: string
    createdAt: Date
    updatedAt?: Date
  }

  export interface StockBatch {
    id: string
    code: string
    expirationDate: Date
    importingQuantity: number
    createdAt: Date
    updatedAt?: Date
  }

  export interface InboundTransaction {
    id: string
    supplierId: string
    createById: string
    code: string
    status: InventoryTransactionStatus
    totalImportingPrice: number
    receivedDate: Date
    note: string
    createdAt: Date
    updatedAt?: Date
  }

  export interface InboundTransactionDetail {
    id: string
    skuId: string
    stockBatchId: string
    inboundTransactionId: string
    importingPrice: number
    sellingPrice: number
    importingQuantity: number
    totalImportingPrice: number
    discountType: DiscountType
    discountValue: number
    note: string
    createdAt: Date
    updatedAt?: Date
  }

  // export interface User {
  //   id: string
  //   email: string
  //   password: string
  //   code: string
  //   fullName: string
  //   phoneNumber: string
  //   avatarUrl: string
  //   role: UserRole
  //   createdAt: Date
  //   updatedAt?: Date
  // }

  export interface Cart {
    id: string
    userId: string
    createdAt: Date
    updatedAt?: Date
  }

  export interface CartItem {
    id: string
    skuId: string
    cartId: string
    quantity: number
    createdAt: Date
    updatedAt?: Date
  }

  export interface Order {
    id: string
    userId: string
    code: string
    status: OrderStatus
    totalPrice: number
    paymentMethod: PaymentMethod
    paidAt?: Date
    deliveredAt?: Date
    cancelledAt?: Date
    createdAt: Date
    updatedAt?: Date
  }

  export interface ShippingInfo {
    id: string
    orderId: string
    fullName: string
    email: string
    phoneNumber: string
    province: string
    district: string
    ward: string
    streetAddress: string
    note: string
    createdAt: Date
    updatedAt?: Date
  }

  export interface Supplier {
    id: string
    code: string
    name: string
    email: string
    phoneNumber: string
    address: string
    note: string
    companyName: string
    taxCode: string
    createdAt: Date
    updatedAt?: Date
  }

  export interface OutboundTransaction {
    id: string
    createById: string
    code: string
    status: InventoryTransactionStatus
    totalImportingPrice: number
    exportedDate: Date
    note: string
    createdAt: Date
    updatedAt?: Date
  }

  export interface OutboundTransactionDetail {
    id: string
    skuId: string
    stockBatchId: string
    outboundTransactionId: string
    exportingQuantity: number
    totalImportingPrice: number
    note: string
    createdAt: Date
    updatedAt?: Date
  }

  export interface OrderDetail {
    id: string
    orderId: string
    skuId: string
    quantity: number
    productPrice: number
    createdAt: Date
    updatedAt?: Date
  }

  export interface Address {
    id: string
    userId: string
    province: string
    district: string
    ward: string
    streetAddress: string
    isDefault: boolean
    createdAt: Date
    updatedAt?: Date
  }

  export interface RefreshToken {
    id: string
    userId: string
    token: string
    expireIn: number
    createdAt: Date
    updatedAt?: Date
  }

  export interface JwtPayload {
    userId: string
    email: string
    role: UserRole

    // jit: string
    iat?: number
    exp?: number
  }
}
export {}
