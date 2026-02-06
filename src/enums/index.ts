export enum UserRole {
  CUSTOMER = 'CUSTOMER',
  ADMIN = 'ADMIN',
  STAFF = 'STAFF'
}

export enum SortOrder {
  ASC = 'asc',
  DESC = 'desc'
}

export enum ProductSortBy {
  CREATED_AT = 'createdAt',
  UPDATED_AT = 'updatedAt',
  NAME = 'name',
  PRICE = 'basePrice',
  VIEWS = 'views',
  POPULARITY = 'popularity'
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

export enum AttributeType {
  COLOR = 'COLOR',
  SIZE = 'SIZE',
  TEXT = 'TEXT',
  NUMBER = 'NUMBER',
  BOOLEAN = 'BOOLEAN'
}

export enum FilterDisplayType {
  CHECKBOX = 'CHECKBOX',
  RADIO = 'RADIO',
  SLIDER = 'SLIDER',
  SWATCH = 'SWATCH',
  DROPDOWN = 'DROPDOWN',
  TOGGLE = 'TOGGLE'
}
