import { Injectable } from '@nestjs/common';
import { CreateCountryOfOriginDto } from './dto/create-country-of-origin.dto';
import { UpdateCountryOfOriginDto } from './dto/update-country-of-origin.dto';

@Injectable()
export class CountryOfOriginService {
  create(createCountryOfOriginDto: CreateCountryOfOriginDto) {
    return 'This action adds a new countryOfOrigin';
  }

  findAll() {
    return `This action returns all countryOfOrigin`;
  }

  findOne(id: number) {
    return `This action returns a #${id} countryOfOrigin`;
  }

  update(id: number, updateCountryOfOriginDto: UpdateCountryOfOriginDto) {
    return `This action updates a #${id} countryOfOrigin`;
  }

  remove(id: number) {
    return `This action removes a #${id} countryOfOrigin`;
  }
}
