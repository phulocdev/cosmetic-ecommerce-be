export declare class BaseEntity {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date | null;
    isDeleted?: boolean;
    constructor(partial: Partial<BaseEntity>);
}
