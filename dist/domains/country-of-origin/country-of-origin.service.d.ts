import { PrismaService } from 'database/prisma/prisma.service';
import { OffsetPaginatedResponseDto } from 'core';
import { CountryOfOrigin } from 'domains/country-of-origin/entities/country-of-origin.entity';
import { CreateCountryOfOriginDto } from './dto/create-country-of-origin.dto';
import { UpdateCountryOfOriginDto } from './dto/update-country-of-origin.dto';
import { FindAllCountryOfOriginDto } from './dto/find-all-country-of-origin.dto';
export declare class CountryOfOriginService {
    private readonly prismaService;
    constructor(prismaService: PrismaService);
    create(createCountryOfOriginDto: CreateCountryOfOriginDto): Promise<CountryOfOrigin>;
    findAll(query: FindAllCountryOfOriginDto): Promise<OffsetPaginatedResponseDto<CountryOfOrigin>>;
    findOne(id: string): Promise<CountryOfOrigin>;
    update(id: string, updateCountryOfOriginDto: UpdateCountryOfOriginDto): Promise<CountryOfOrigin>;
    softDelete(id: string): Promise<CountryOfOrigin>;
    remove(id: string): Promise<CountryOfOrigin>;
}
