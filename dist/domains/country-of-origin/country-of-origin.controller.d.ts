import { OffsetPaginatedResponseDto } from 'core';
import { CountryOfOrigin } from 'domains/country-of-origin/entities/country-of-origin.entity';
import { CountryOfOriginService } from './country-of-origin.service';
import { CreateCountryOfOriginDto } from './dto/create-country-of-origin.dto';
import { FindAllCountryOfOriginDto } from './dto/find-all-country-of-origin.dto';
import { UpdateCountryOfOriginDto } from './dto/update-country-of-origin.dto';
export declare class CountryOfOriginController {
    private readonly countryOfOriginService;
    constructor(countryOfOriginService: CountryOfOriginService);
    create(createCountryOfOriginDto: CreateCountryOfOriginDto): Promise<CountryOfOrigin>;
    findAll(query: FindAllCountryOfOriginDto): Promise<OffsetPaginatedResponseDto<CountryOfOrigin>>;
    findOne(id: string): Promise<CountryOfOrigin>;
    update(id: string, updateCountryOfOriginDto: UpdateCountryOfOriginDto): Promise<CountryOfOrigin>;
    softDelete(id: string): Promise<CountryOfOrigin>;
    remove(id: string): Promise<CountryOfOrigin>;
}
