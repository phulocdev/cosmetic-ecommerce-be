import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common'
import { AttributesService } from './attributes.service'
import { CreateAttributeDto } from './dto/create-attribute.dto'
import { UpdateAttributeDto } from './dto/update-attribute.dto'
import { FindAllAttributeDto } from 'domains/attributes/dto/find-all-attribute.dto'
import { Attribute } from 'domains/attributes/entities/attribute.entity'
import { OffsetPaginatedResponseDto } from 'core'

@Controller('attributes')
export class AttributesController {
  constructor(private readonly attributesService: AttributesService) {}

  @Post()
  create(@Body() createAttributeDto: CreateAttributeDto) {
    return this.attributesService.create(createAttributeDto)
  }

  @Get()
  findAll(@Query() query: FindAllAttributeDto): Promise<OffsetPaginatedResponseDto<Attribute>> {
    return this.attributesService.findAll(query)
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.attributesService.findOne(+id)
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAttributeDto: UpdateAttributeDto) {
    return this.attributesService.update(+id, updateAttributeDto)
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.attributesService.remove(+id)
  }
}
