import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common'
import { OffsetPaginatedResponseDto, ParseUUIDPipe, Public } from 'core'
import { FindAllAttributeDto } from 'domains/attributes/dto/find-all-attribute.dto'
import { Attribute } from 'domains/attributes/entities/attribute.entity'
import { AttributesService } from './attributes.service'
import { CreateAttributeDto } from './dto/create-attribute.dto'
import { UpdateAttributeDto } from './dto/update-attribute.dto'

@Controller('attributes')
export class AttributesController {
  constructor(private readonly attributesService: AttributesService) {}

  @Post()
  create(@Body() createAttributeDto: CreateAttributeDto) {
    return this.attributesService.create(createAttributeDto)
  }

  @Public()
  @Get()
  findAll(@Query() query: FindAllAttributeDto): Promise<OffsetPaginatedResponseDto<Attribute>> {
    return this.attributesService.findAll(query)
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.attributesService.findOne(id)
  }

  @Patch(':id')
  update(@Param('id', ParseUUIDPipe) id: string, @Body() updateAttributeDto: UpdateAttributeDto) {
    return this.attributesService.update(id, updateAttributeDto)
  }

  @Delete(':id/soft')
  async softDelete(@Param('id', ParseUUIDPipe) id: string): Promise<Attribute> {
    return this.attributesService.softDelete(id)
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.attributesService.remove(id)
  }
}
