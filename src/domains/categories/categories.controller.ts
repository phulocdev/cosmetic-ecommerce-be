import {
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseBoolPipe,
  ParseUUIDPipe,
  Patch,
  Post,
  Query
} from '@nestjs/common'
import { ApiOperation, ApiParam, ApiQuery, ApiResponse } from '@nestjs/swagger'
import { CursorPaginatedResponseDto, OffsetPaginatedResponseDto, Public } from 'core'
import { ResponseMessage } from 'core/decorators/response-message.decorator'
import { DateRangePipe, ParsedDateRange } from 'core/pipes/date-range.pipe'
import {
  GetCategoriesQueryDto,
  GetCategoryTreeQueryDto,
  MoveCategoryDto
} from 'domains/categories/dto/query-category.dto'
import {
  BreadcrumbItem,
  Category,
  CategoryTreeNode
} from 'domains/categories/entities/category.entity'
import { CategoriesService } from './categories.service'
import { CreateCategoryDto } from './dto/create-category.dto'
import { UpdateCategoryDto } from './dto/update-category.dto'

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new category' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Category created successfully',
    type: Category
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'Category with this slug already exists'
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Parent category not found'
  })
  async create(@Body() createCategoryDto: CreateCategoryDto): Promise<Category> {
    return this.categoriesService.create(createCategoryDto)
  }

  @Get('tree')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get category tree (hierarchical structure)' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Category tree retrieved successfully',
    type: [CategoryTreeNode]
  })
  async getTree(@Query() query: GetCategoryTreeQueryDto): Promise<CategoryTreeNode[]> {
    return this.categoriesService.getCategoryTree(query)
  }

  @Get(':id/breadcrumbs')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get breadcrumb trail for a category' })
  @ApiParam({ name: 'id', description: 'Category UUID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Breadcrumbs retrieved successfully',
    type: [BreadcrumbItem]
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Category not found'
  })
  async getBreadcrumbs(@Param('id', ParseUUIDPipe) id: string): Promise<BreadcrumbItem[]> {
    return this.categoriesService.getBreadcrumbs(id)
  }

  // The /getTree endpoint can be used to get all descendant IDs as well,
  // but for convenience, we provide a dedicated endpoint.
  // @Get('descendants/:id')
  // @HttpCode(HttpStatus.OK)
  // getDescendantIds(@Param('id') id: string) {
  //   return this.categoriesService.getDescendantIds(id)
  // }

  @Get()
  @Public()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get paginated list of categories with filters' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Categories retrieved successfully',
    type: OffsetPaginatedResponseDto<Category>
  })
  @ResponseMessage('Categories fetched successfully')
  async findAll(
    @Query() query: GetCategoriesQueryDto,
    @Query(DateRangePipe) { dateRange }: ParsedDateRange
  ): Promise<OffsetPaginatedResponseDto<Category> | CursorPaginatedResponseDto<Category>> {
    return this.categoriesService.findAll(query, dateRange)
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get category by ID' })
  @ApiParam({ name: 'id', description: 'Category UUID' })
  @ApiQuery({
    name: 'includeChildren',
    required: false,
    type: Boolean,
    description: 'Include child categories'
  })
  @ApiQuery({
    name: 'includeProductCount',
    required: false,
    type: Boolean,
    description: 'Include product count'
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Category found',
    type: Category
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Category not found'
  })
  async findOne(
    @Param('id', ParseUUIDPipe) id: string
    // @Query('includeChildren', new DefaultValuePipe(false), ParseBoolPipe)
    // includeChildren: boolean,
    // @Query('includeProductCount', new DefaultValuePipe(false), ParseBoolPipe)
    // includeProductCount: boolean
  ): Promise<Category> {
    return this.categoriesService.findOne(
      id
      // , includeChildren, includeProductCount
    )
  }

  @Get('slug/:slug')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get category by slug' })
  @ApiParam({ name: 'slug', description: 'Category slug', example: 'laptops' })
  @ApiQuery({
    name: 'includeChildren',
    required: false,
    type: Boolean,
    description: 'Include child categories'
  })
  @ApiQuery({
    name: 'includeProductCount',
    required: false,
    type: Boolean,
    description: 'Include product count'
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Category found',
    type: Category
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Category not found'
  })
  async findBySlug(
    @Param('slug') slug: string,
    @Query('includeChildren', new DefaultValuePipe(false), ParseBoolPipe)
    includeChildren: boolean,
    @Query('includeProductCount', new DefaultValuePipe(false), ParseBoolPipe)
    includeProductCount: boolean
  ): Promise<Category> {
    return this.categoriesService.findBySlug(slug, includeChildren, includeProductCount)
  }

  @Get(':id/stats')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get category statistics (products count, subcategories, etc.)'
  })
  @ApiParam({ name: 'id', description: 'Category UUID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Statistics retrieved successfully'
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Category not found'
  })
  async getStats(@Param('id', ParseUUIDPipe) id: string) {
    return this.categoriesService.getStats(id)
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update category' })
  @ApiParam({ name: 'id', description: 'Category UUID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Category updated successfully',
    type: Category
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Category not found'
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'Category with this slug already exists'
  })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateCategoryDto: UpdateCategoryDto
  ): Promise<Category> {
    return this.categoriesService.update(id, updateCategoryDto)
  }

  @Patch(':id/move')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Move category to a new parent' })
  @ApiParam({ name: 'id', description: 'Category UUID to move' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Category moved successfully',
    type: Category
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Category or parent not found'
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid move operation (circular reference, etc.)'
  })
  async moveCategory(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() moveDto: MoveCategoryDto
  ): Promise<Category> {
    return this.categoriesService.moveCategory(id, moveDto)
  }

  @Delete(':id/soft')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Soft delete category (mark as inactive)' })
  @ApiParam({ name: 'id', description: 'Category UUID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Category deactivated successfully',
    type: Category
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Category not found'
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Cannot delete category with children or products'
  })
  async softDelete(@Param('id', ParseUUIDPipe) id: string): Promise<Category> {
    return this.categoriesService.softDelete(id)
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Permanently delete category' })
  @ApiParam({ name: 'id', description: 'Category UUID' })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Category deleted successfully'
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Category not found'
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Cannot delete category with children or products'
  })
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.categoriesService.remove(id)
  }

  @Post('rebuild-paths')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Rebuild category paths (maintenance operation)',
    description:
      'Recalculates all category paths and depths. Use this if data becomes inconsistent.'
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Paths rebuilt successfully',
    schema: {
      type: 'object',
      properties: {
        updated: { type: 'number', example: 15 }
      }
    }
  })
  async rebuildPaths(): Promise<{ updated: number }> {
    return this.categoriesService.rebuildPaths()
  }
}
