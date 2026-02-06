import { Body, Controller, Get, HttpCode, HttpStatus, Param, ParseUUIDPipe, Patch, Post, Query } from '@nestjs/common'
import { ApiBody, ApiOperation, ApiParam, ApiQuery, ApiResponse } from '@nestjs/swagger'
import { ProductsService } from 'domains/products/products.service'
import { CreateProductDto } from './dto/create-product.dto'
import { UpdateProductDto } from './dto/update-product.dto'
import { Public } from 'core/decorators/public.decorator'
import { ProductSeedService } from 'domains/products/product-seed.service'
import { ProductListResponseDto, ProductQueryDto } from 'domains/products/dto/find-all-product.dto'
import { PaginationType, ProductSortBy, ProductStatus, SortOrder } from 'enums'

@Controller('products')
export class ProductsController {
  constructor(
    private readonly productsService: ProductsService,
    private readonly productSeedService: ProductSeedService
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Create a new product'
  })
  @ApiBody({ type: CreateProductDto })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Product created successfully'
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Validation error or business rule violation',
    schema: {
      example: {
        statusCode: 400,
        message: 'Duplicate SKUs found in variants; Product with code PROD-001 already exists',
        error: 'Bad Request'
      }
    }
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Referenced entity not found',
    schema: {
      example: {
        statusCode: 404,
        message: 'Category with ID xyz not found; Brand with ID abc not found',
        error: 'Not Found'
      }
    }
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'Duplicate unique constraint violation',
    schema: {
      example: {
        statusCode: 409,
        message: 'Product with slug premium-cotton-t-shirt already exists',
        error: 'Conflict'
      }
    }
  })
  create(@Body() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto)
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Update an existing product'
  })
  @ApiParam({
    name: 'id',
    description: 'Product UUID',
    example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890'
  })
  @ApiBody({ type: UpdateProductDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Product updated successfully'
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Validation error or business rule violation',
    schema: {
      example: {
        statusCode: 400,
        message: 'Product with code PROD-002 already exists; Duplicate SKUs found in variant updates',
        error: 'Bad Request'
      }
    }
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Product or referenced entity not found',
    schema: {
      example: {
        statusCode: 404,
        message: 'Product with ID xyz not found',
        error: 'Not Found'
      }
    }
  })
  update(@Param('id', ParseUUIDPipe) id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productsService.update(id, updateProductDto)
  }

  @Get('seed')
  @Public()
  seed() {
    return this.productSeedService.seedProducts()
  }

  @Public()
  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.productsService.findById(id)
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get all products with filtering and pagination'
  })
  @ApiQuery({ name: 'paginationType', enum: PaginationType, required: false })
  @ApiQuery({ name: 'page', type: Number, required: false, example: 1 })
  @ApiQuery({ name: 'limit', type: Number, required: false, example: 20 })
  @ApiQuery({ name: 'cursor', type: String, required: false })
  @ApiQuery({ name: 'search', type: String, required: false })
  @ApiQuery({ name: 'status', enum: ProductStatus, required: false })
  @ApiQuery({ name: 'categoryIds', type: [String], required: false })
  @ApiQuery({ name: 'categorySlug', type: String, required: false })
  @ApiQuery({ name: 'categoryPath', type: String, required: false })
  @ApiQuery({ name: 'brandIds', type: [String], required: false })
  @ApiQuery({ name: 'countryIds', type: [String], required: false })
  @ApiQuery({ name: 'minPrice', type: Number, required: false })
  @ApiQuery({ name: 'maxPrice', type: Number, required: false })
  @ApiQuery({ name: 'inStock', type: Boolean, required: false })
  @ApiQuery({ name: 'minStock', type: Number, required: false })
  @ApiQuery({ name: 'maxStock', type: Number, required: false })
  @ApiQuery({ name: 'hasActiveVariants', type: Boolean, required: false })
  @ApiQuery({ name: 'minVariantPrice', type: Number, required: false })
  @ApiQuery({ name: 'maxVariantPrice', type: Number, required: false })
  @ApiQuery({ name: 'sku', type: String, required: false })
  @ApiQuery({ name: 'createdAfter', type: Date, required: false })
  @ApiQuery({ name: 'createdBefore', type: Date, required: false })
  @ApiQuery({ name: 'sortBy', enum: ProductSortBy, required: false })
  @ApiQuery({ name: 'sortOrder', enum: SortOrder, required: false })
  @ApiQuery({ name: 'includeImages', type: Boolean, required: false })
  @ApiQuery({ name: 'includeVariants', type: Boolean, required: false })
  @ApiQuery({ name: 'includeAttributes', type: Boolean, required: false })
  @ApiQuery({ name: 'includeBrandAndCountry', type: Boolean, required: false })
  @ApiQuery({ name: 'includeCategories', type: Boolean, required: false })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Products retrieved successfully'
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid query parameters',
    schema: {
      example: {
        statusCode: 400,
        message: 'Invalid cursor format',
        error: 'Bad Request'
      }
    }
  })
  findAll(@Query() query: ProductQueryDto): Promise<ProductListResponseDto> {
    return this.productsService.findAll(query)
  }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.productsService.remove(+id)
  // }
}
