import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common'
import { OffsetPaginatedResponseDto, ParseUUIDPipe, Public } from 'core'
import { Brand } from 'domains/brands/entities/brand.entity'
import { BrandsService } from './brands.service'
import { CreateBrandDto } from './dto/create-brand.dto'
import { FindAllBrandDto } from './dto/find-all-brand.dto'
import { UpdateBrandDto } from './dto/update-brand.dto'

@Controller('brands')
export class BrandsController {
  constructor(private readonly brandsService: BrandsService) {}

  @Post()
  create(@Body() createBrandDto: CreateBrandDto): Promise<Brand> {
    return this.brandsService.create(createBrandDto)
  }

  @Public()
  @Get()
  findAll(@Query() query: FindAllBrandDto): Promise<OffsetPaginatedResponseDto<Brand>> {
    return this.brandsService.findAll(query)
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string): Promise<Brand> {
    return this.brandsService.findOne(id)
  }

  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateBrandDto: UpdateBrandDto
  ): Promise<Brand> {
    return this.brandsService.update(id, updateBrandDto)
  }

  @Delete(':id/soft')
  async softDelete(@Param('id', ParseUUIDPipe) id: string): Promise<Brand> {
    return this.brandsService.softDelete(id)
  }

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string): Promise<Brand> {
    return this.brandsService.remove(id)
  }
}
