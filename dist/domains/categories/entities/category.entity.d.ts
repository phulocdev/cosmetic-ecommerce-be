export declare class Category {
    id: string;
    name: string;
    slug: string;
    description?: string;
    parentId?: string;
    path: string;
    depth: number;
    isActive: boolean;
    metaTitle?: string;
    metaDescription?: string;
    createdAt: Date;
    updatedAt: Date;
    children?: Category[];
    productCount?: number;
    parent?: Category;
    constructor(partial: Partial<Category>);
}
export declare class CategoryTreeNode {
    id: string;
    name: string;
    slug: string;
    path: string;
    depth: number;
    isActive: boolean;
    productCount?: number;
    children?: CategoryTreeNode[];
    constructor(partial: Partial<CategoryTreeNode>);
}
export declare class BreadcrumbItem {
    id: string;
    name: string;
    slug: string;
    path: string;
    constructor(partial: Partial<BreadcrumbItem>);
}
