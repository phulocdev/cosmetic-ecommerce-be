export declare enum UserRole {
    CUSTOMER = "CUSTOMER",
    ADMIN = "ADMIN",
    STAFF = "STAFF"
}
export declare enum CategoryTreeFormat {
    NESTED = "nested",
    FLAT = "flat"
}
export declare enum SortOrder {
    ASC = "asc",
    DESC = "desc"
}
export declare enum ProductSortBy {
    CREATED_AT = "createdAt",
    NAME = "name",
    PRICE = "basePrice",
    VIEWS = "views"
}
export declare enum CategorySortBy {
    NAME = "name",
    SLUG = "slug",
    CREATED_AT = "createdAt",
    PARENT_CATEGORY_NAME = "parentCategoryName",
    PRODUCT_COUNT = "productCount",
    DEPTH = "depth"
}
export declare enum PaginationType {
    OFFSET = "offset",
    CURSOR = "cursor"
}
export declare enum ProductStatus {
    PUBLISHED = "PUBLISHED",
    DRAFT = "DRAFT",
    ARCHIVED = "ARCHIVED"
}
