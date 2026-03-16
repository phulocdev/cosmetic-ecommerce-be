import { PrismaService } from 'database/prisma/prisma.service';
import { CreateProductDto } from 'domains/products/dto/create-product.dto';
import { UpdateProductDto } from 'domains/products/dto/update-product.dto';
export declare class ValidateDtoService {
    private readonly prismaService;
    constructor(prismaService: PrismaService);
    validateReferencesForCreate(dto: CreateProductDto): Promise<void>;
    validateBusinessRulesForCreate(dto: CreateProductDto): Promise<void>;
    validateReferencesForUpdate(productId: string, dto: UpdateProductDto): Promise<void>;
    validateBusinessRulesForUpdate(productId: string, dto: UpdateProductDto, existingProduct: any): Promise<void>;
}
