import { OffsetPaginatedResponseDto } from 'core';
import { Brand } from 'domains/brands/entities/brand.entity';
import { BrandsService } from './brands.service';
import { CreateBrandDto } from './dto/create-brand.dto';
import { FindAllBrandDto } from './dto/find-all-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
export declare class BrandsController {
    private readonly brandsService;
    constructor(brandsService: BrandsService);
    create(createBrandDto: CreateBrandDto): Promise<Brand>;
    findAll(query: FindAllBrandDto): Promise<OffsetPaginatedResponseDto<Brand>>;
    findOne(id: string): Promise<Brand>;
    update(id: string, updateBrandDto: UpdateBrandDto): Promise<Brand>;
    softDelete(id: string): Promise<Brand>;
    remove(id: string): Promise<Brand>;
}
