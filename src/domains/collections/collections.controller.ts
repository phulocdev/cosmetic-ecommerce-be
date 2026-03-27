import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  Query,
  ParseUUIDPipe
} from '@nestjs/common'
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiResponse
} from '@nestjs/swagger'
import { CursorPaginatedResponseDto, OffsetPaginatedResponseDto, Public } from 'core'
import { ResponseMessage } from 'core/decorators/response-message.decorator'
import { DateRangePipe, ParsedDateRange } from 'core/pipes/date-range.pipe'
import { CollectionsService } from './collections.service'
import { CreateCollectionDto } from './dto/create-collection.dto'
import { DeriveFromProductsDto, GetCollectionsQueryDto } from './dto/get-collections-query.dto'
import { UpdateCollectionDto } from './dto/update-collection.dto'
import { Collection } from './entities/collection.entity'

@Controller('collections')
export class CollectionsController {
  constructor(private readonly collectionsService: CollectionsService) {}

  /**
   * POST /collections
   * Create a new collection with optional products, attributes and categories.
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new collection (admin)' })
  @ApiCreatedResponse({ description: 'Collection created successfully', type: Collection })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'Collection with this slug already exists'
  })
  async create(@Body() dto: CreateCollectionDto): Promise<Collection> {
    return this.collectionsService.create(dto)
  }

  /**
   * GET /collections
   * List all non-deleted collections (admin overview).
   */
  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get paginated list of collections with filters' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Collections retrieved successfully',
    type: OffsetPaginatedResponseDto<Collection>
  })
  @ResponseMessage('Collections fetched successfully')
  async findAll(
    @Query() query: GetCollectionsQueryDto,
    @Query(DateRangePipe) { dateRange }: ParsedDateRange
  ): Promise<OffsetPaginatedResponseDto<Collection> | CursorPaginatedResponseDto<Collection>> {
    return this.collectionsService.findAll(query, dateRange)
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get collection by ID' })
  @ApiParam({ name: 'id', description: 'Collection UUID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Collection found',
    type: Collection
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Collection not found'
  })
  async findOne(@Param('id', ParseUUIDPipe) id: string): Promise<Collection> {
    return this.collectionsService.findOne(id)
  }

  /**
   * GET /collections/slug/:slug
   * Fetch a collection's metadata + products by slug (public storefront).
   */
  @Public()
  @Get('slug/:slug')
  @ApiOperation({ summary: 'Get collection by slug (public)' })
  @ApiParam({ name: 'slug', type: String, example: 'shoes' })
  findBySlug(@Param('slug') slug: string) {
    return this.collectionsService.findBySlug(slug)
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update collection' })
  @ApiParam({ name: 'id', description: 'Collection UUID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Collection updated successfully',
    type: Collection
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Collection not found'
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'Collection with this slug already exists'
  })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateCollectionDto: UpdateCollectionDto
  ): Promise<Collection> {
    return this.collectionsService.update(id, updateCollectionDto)
  }

  @Delete(':id/soft')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Soft delete collection (mark as inactive)' })
  @ApiParam({ name: 'id', description: 'Collection UUID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Collection deactivated successfully',
    type: Collection
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Collection not found'
  })
  async softDelete(@Param('id', ParseUUIDPipe) id: string): Promise<Collection> {
    return this.collectionsService.softDelete(id)
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Permanently delete collection' })
  @ApiParam({ name: 'id', description: 'Collection UUID' })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Collection deleted successfully'
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Collection not found'
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Cannot delete collection with products'
  })
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.collectionsService.remove(id)
  }

  // /**
  //  * POST /collections/derive-from-products
  //  * Admin helper: given a list of product IDs, returns the suggested
  //  * attributes and categories to pre-populate the filter panel.
  //  *
  //  * The admin can then add / remove items before saving.
  //  */
  // @Post('derive-from-products')
  // @ApiOperation({
  //   summary: 'Derive suggested filters from a list of products (admin UI helper)',
  //   description:
  //     'Call this after the admin selects products for a collection. ' +
  //     'Returns the attributes and categories inferred from those products ' +
  //     'so the admin can confirm or tweak the filter panel.'
  // })
  // @ApiOkResponse({
  //   description: 'Suggested attributes and categories',
  //   schema: {
  //     example: {
  //       attributes: [{ id: 'uuid', name: 'Color', slug: 'color', displayName: null }],
  //       categories: [{ id: 'uuid', name: 'Shoes', slug: 'shoes', depth: 1, parentId: null }]
  //     }
  //   }
  // })
  // deriveFromProducts(@Body() dto: DeriveFromProductsDto) {
  //   return this.collectionsService.deriveFromProducts(dto.productIds)
  // }
}
