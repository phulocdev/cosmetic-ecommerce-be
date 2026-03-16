export declare class CategoryAttributeBaseDto {
    attributeId?: string;
    displayName?: string;
    displayOrder?: number;
    isFilterable?: boolean;
    isRequired?: boolean;
    inheritToChildren?: boolean;
}
export declare class AddAttributeToCategoryDto extends CategoryAttributeBaseDto {
    attributeId: string;
}
