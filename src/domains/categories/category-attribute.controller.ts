import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseUUIDPipe,
  ParseBoolPipe,
  DefaultValuePipe,
  HttpCode,
  HttpStatus
} from '@nestjs/common'
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger'
import { CategoryAttributeService } from './category-attribute.service'
import { AddAttributeToCategoryDto } from 'domains/categories/dto/add-attribute-to-category.dto'
import { UpdateCategoryAttributeDto } from 'domains/categories/dto/update-category-attribute.dto'

@ApiTags('Category Attributes')
@Controller('categories/:categoryId/attributes')
export class CategoryAttributeController {
  constructor(private readonly categoryAttributeService: CategoryAttributeService) {}

  @Post()
  @ApiOperation({ summary: 'Add attribute to category' })
  @ApiParam({ name: 'categoryId', description: 'Category UUID' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Attribute added to category successfully'
  })
  async addAttribute(@Param('categoryId', ParseUUIDPipe) categoryId: string, @Body() dto: AddAttributeToCategoryDto) {
    return this.categoryAttributeService.addAttributeToCategory(categoryId, dto)
  }

  @Get()
  @ApiOperation({ summary: 'Get all attributes for a category' })
  @ApiParam({ name: 'categoryId', description: 'Category UUID' })
  @ApiQuery({
    name: 'includeInherited',
    required: false,
    type: Boolean,
    description: 'Include attributes inherited from parent categories'
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Attributes retrieved successfully'
  })
  async getAttributes(
    @Param('categoryId', ParseUUIDPipe) categoryId: string,
    @Query('includeInherited', new DefaultValuePipe(true), ParseBoolPipe)
    includeInherited: boolean
  ) {
    return this.categoryAttributeService.getCategoryAttributes(categoryId, includeInherited)
  }

  @Get('filterable')
  @ApiOperation({ summary: 'Get filterable attributes for a category' })
  @ApiParam({ name: 'categoryId', description: 'Category UUID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Filterable attributes retrieved successfully'
  })
  async getFilterableAttributes(@Param('categoryId', ParseUUIDPipe) categoryId: string) {
    return this.categoryAttributeService.getFilterableAttributes(categoryId)
  }

  @Patch(':attributeId')
  @ApiOperation({ summary: 'Update category attribute configuration' })
  @ApiParam({ name: 'categoryId', description: 'Category UUID' })
  @ApiParam({ name: 'attributeId', description: 'Attribute UUID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Category attribute updated successfully'
  })
  async updateAttribute(
    @Param('categoryId', ParseUUIDPipe) categoryId: string,
    @Param('attributeId', ParseUUIDPipe) attributeId: string,
    @Body() dto: UpdateCategoryAttributeDto
  ) {
    return this.categoryAttributeService.updateCategoryAttribute(categoryId, attributeId, dto)
  }

  @Delete(':attributeId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Remove attribute from category' })
  @ApiParam({ name: 'categoryId', description: 'Category UUID' })
  @ApiParam({ name: 'attributeId', description: 'Attribute UUID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Attribute removed successfully'
  })
  async removeAttribute(
    @Param('categoryId', ParseUUIDPipe) categoryId: string,
    @Param('attributeId', ParseUUIDPipe) attributeId: string
  ) {
    return this.categoryAttributeService.removeAttributeFromCategory(categoryId, attributeId)
  }

  @Post('bulk')
  @ApiOperation({ summary: 'Bulk assign attributes to category' })
  @ApiParam({ name: 'categoryId', description: 'Category UUID' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Attributes assigned successfully'
  })
  async bulkAddAttributes(
    @Param('categoryId', ParseUUIDPipe) categoryId: string,
    @Body() body: { attributeIds: string[] }
  ) {
    return this.categoryAttributeService.bulkAddAttributes(categoryId, body.attributeIds)
  }

  @Patch('reorder')
  @ApiOperation({ summary: 'Reorder category attributes' })
  @ApiParam({ name: 'categoryId', description: 'Category UUID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Attributes reordered successfully'
  })
  async reorderAttributes(
    @Param('categoryId', ParseUUIDPipe) categoryId: string,
    @Body() body: { orderedAttributeIds: string[] }
  ) {
    return this.categoryAttributeService.reorderAttributes(categoryId, body.orderedAttributeIds)
  }
}
