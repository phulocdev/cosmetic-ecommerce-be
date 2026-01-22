export enum Role {
  CUSTOMER,
  ADMIN
}

export enum UserStatus {
  INACTIVE,
  ACTIVE
}

export enum Gender {
  MALE,
  FEMALE,
  OTHER,
  UNSET
}

export enum EmailVerificationStatus {
  UNVERIFIED,
  VERIFIED,
  PENDING
}

export enum BanStatus {
  BANNED,
  ACTIVE
}

export enum RefreshTokenStatus {
  REVOKED,
  ACTIVE
}

export enum AddressStatus {
  NORMAL,
  DEFAULT
}

export enum ProductStatus {
  HIDDEN,
  PUBLISHED,
  DRAFT,
  ARCHIVED
}

export enum DiscountType {
  NONE,
  PERCENTAGE,
  FIXED_AMOUNT
}

export enum OrderStatus {
  PROCESSING, // Chờ xác nhận
  PENDING_PAYMENT, // Đã xác nhận
  PACKED, // Đang chuẩn bị
  SHIPPED, // Đang giao hàng
  DELIVERED, // Đã giao hàng
  COMPLETED, // Hoàn thành
  RETURNED, // Đang hoàn trả
  CANCELED // Đã hủy
}

export enum PaymentMethod {
  COD,
  BANKING
}
