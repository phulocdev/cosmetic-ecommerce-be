export enum UserRole {
  CUSTOMER = 'CUSTOMER',
  ADMIN = 'ADMIN',
  STAFF = 'STAFF'
}

export enum CategoryTreeFormat {
  NESTED = 'nested',
  FLAT = 'flat'
}

export enum SortOrder {
  ASC = 'asc',
  DESC = 'desc'
}

export enum ProductSortBy {
  CREATED_AT = 'createdAt',
  NAME = 'name',
  PRICE = 'basePrice',
  VIEWS = 'views'
}

export enum CategorySortBy {
  NAME = 'name',
  SLUG = 'slug',
  CREATED_AT = 'createdAt',
  PARENT_CATEGORY_NAME = 'parentCategoryName',
  PRODUCT_COUNT = 'productCount',
  DEPTH = 'depth'
}

export enum PaginationType {
  OFFSET = 'offset',
  CURSOR = 'cursor'
}

export enum ProductStatus {
  PUBLISHED = 'PUBLISHED',
  DRAFT = 'DRAFT',
  ARCHIVED = 'ARCHIVED'
}
