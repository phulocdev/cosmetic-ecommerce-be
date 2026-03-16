export declare function generateProductCode(productName: string): string;
export declare function generateVariantSku(productCode: string, attributeValues: {
    attributeValueId: string;
    value: string;
}[]): string;
export declare function slugifyString(str: string): string;
