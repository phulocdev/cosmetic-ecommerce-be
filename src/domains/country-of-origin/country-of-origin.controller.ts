import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CountryOfOriginService } from './country-of-origin.service';
import { CreateCountryOfOriginDto } from './dto/create-country-of-origin.dto';
import { UpdateCountryOfOriginDto } from './dto/update-country-of-origin.dto';

@Controller('country-of-origin')
export class CountryOfOriginController {
  constructor(private readonly countryOfOriginService: CountryOfOriginService) {}

  @Post()
  create(@Body() createCountryOfOriginDto: CreateCountryOfOriginDto) {
    return this.countryOfOriginService.create(createCountryOfOriginDto);
  }

  @Get()
  findAll() {
    return this.countryOfOriginService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.countryOfOriginService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCountryOfOriginDto: UpdateCountryOfOriginDto) {
    return this.countryOfOriginService.update(+id, updateCountryOfOriginDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.countryOfOriginService.remove(+id);
  }
}
