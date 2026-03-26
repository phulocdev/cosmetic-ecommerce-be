import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common'
import { CollectionsService } from './collections.service'
import { CreateCollectionDto } from './dto/create-collection.dto'
import { UpdateCollectionDto } from './dto/update-collection.dto'
import { ApiCreatedResponse, ApiOperation } from '@nestjs/swagger'

@Controller('collections')
export class CollectionsController {
  constructor(private readonly collectionsService: CollectionsService) {}

  /**
   * POST /collections
   * Create a new collection with optional products, attributes and categories.
   */
  @Post()
  @ApiOperation({ summary: 'Create a new collection (admin)' })
  @ApiCreatedResponse({ description: 'Collection created successfully' })
  create(@Body() dto: CreateCollectionDto) {
    return this.collectionsService.create(dto)
  }

  @Get()
  findAll() {
    return this.collectionsService.findAll()
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.collectionsService.findOne(+id)
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCollectionDto: UpdateCollectionDto) {
    return this.collectionsService.update(+id, updateCollectionDto)
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.collectionsService.remove(+id)
  }
}
