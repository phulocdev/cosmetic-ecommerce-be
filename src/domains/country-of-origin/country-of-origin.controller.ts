import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common'
import { OffsetPaginatedResponseDto, ParseUUIDPipe } from 'core'
import { CountryOfOrigin } from 'domains/country-of-origin/entities/country-of-origin.entity'
import { CountryOfOriginService } from './country-of-origin.service'
import { CreateCountryOfOriginDto } from './dto/create-country-of-origin.dto'
import { FindAllCountryOfOriginDto } from './dto/find-all-country-of-origin.dto'
import { UpdateCountryOfOriginDto } from './dto/update-country-of-origin.dto'

@Controller('country-of-origin')
export class CountryOfOriginController {
  constructor(private readonly countryOfOriginService: CountryOfOriginService) {}

  @Post()
  create(@Body() createCountryOfOriginDto: CreateCountryOfOriginDto): Promise<CountryOfOrigin> {
    return this.countryOfOriginService.create(createCountryOfOriginDto)
  }

  @Get()
  findAll(
    @Query() query: FindAllCountryOfOriginDto
  ): Promise<OffsetPaginatedResponseDto<CountryOfOrigin>> {
    return this.countryOfOriginService.findAll(query)
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string): Promise<CountryOfOrigin> {
    return this.countryOfOriginService.findOne(id)
  }

  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateCountryOfOriginDto: UpdateCountryOfOriginDto
  ): Promise<CountryOfOrigin> {
    return this.countryOfOriginService.update(id, updateCountryOfOriginDto)
  }

  @Delete(':id/soft')
  async softDelete(@Param('id', ParseUUIDPipe) id: string): Promise<CountryOfOrigin> {
    return this.countryOfOriginService.softDelete(id)
  }

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string): Promise<CountryOfOrigin> {
    return this.countryOfOriginService.remove(id)
  }
}
