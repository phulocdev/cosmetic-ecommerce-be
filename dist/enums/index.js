"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductStatus = exports.PaginationType = exports.CategorySortBy = exports.ProductSortBy = exports.SortOrder = exports.CategoryTreeFormat = exports.UserRole = void 0;
var UserRole;
(function (UserRole) {
    UserRole["CUSTOMER"] = "CUSTOMER";
    UserRole["ADMIN"] = "ADMIN";
    UserRole["STAFF"] = "STAFF";
})(UserRole || (exports.UserRole = UserRole = {}));
var CategoryTreeFormat;
(function (CategoryTreeFormat) {
    CategoryTreeFormat["NESTED"] = "nested";
    CategoryTreeFormat["FLAT"] = "flat";
})(CategoryTreeFormat || (exports.CategoryTreeFormat = CategoryTreeFormat = {}));
var SortOrder;
(function (SortOrder) {
    SortOrder["ASC"] = "asc";
    SortOrder["DESC"] = "desc";
})(SortOrder || (exports.SortOrder = SortOrder = {}));
var ProductSortBy;
(function (ProductSortBy) {
    ProductSortBy["CREATED_AT"] = "createdAt";
    ProductSortBy["NAME"] = "name";
    ProductSortBy["PRICE"] = "basePrice";
    ProductSortBy["VIEWS"] = "views";
})(ProductSortBy || (exports.ProductSortBy = ProductSortBy = {}));
var CategorySortBy;
(function (CategorySortBy) {
    CategorySortBy["NAME"] = "name";
    CategorySortBy["SLUG"] = "slug";
    CategorySortBy["CREATED_AT"] = "createdAt";
    CategorySortBy["PARENT_CATEGORY_NAME"] = "parentCategoryName";
    CategorySortBy["PRODUCT_COUNT"] = "productCount";
    CategorySortBy["DEPTH"] = "depth";
})(CategorySortBy || (exports.CategorySortBy = CategorySortBy = {}));
var PaginationType;
(function (PaginationType) {
    PaginationType["OFFSET"] = "offset";
    PaginationType["CURSOR"] = "cursor";
})(PaginationType || (exports.PaginationType = PaginationType = {}));
var ProductStatus;
(function (ProductStatus) {
    ProductStatus["PUBLISHED"] = "PUBLISHED";
    ProductStatus["DRAFT"] = "DRAFT";
    ProductStatus["ARCHIVED"] = "ARCHIVED";
})(ProductStatus || (exports.ProductStatus = ProductStatus = {}));
//# sourceMappingURL=index.js.map