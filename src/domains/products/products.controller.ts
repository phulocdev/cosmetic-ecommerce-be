import { Body, Controller, Get, HttpCode, HttpStatus, Param, ParseUUIDPipe, Patch, Post } from '@nestjs/common'
import { ApiBody, ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger'
import { ProductsService } from 'domains/products/products.service'
import { CreateProductDto } from './dto/create-product.dto'
import { UpdateProductDto } from './dto/update-product.dto'
import { Public } from 'core/decorators/public.decorator'

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

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
    return this.productsService.seed()
  }

  @Public()
  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.productsService.findById(id)
  }

  // @Get()
  // findAll() {
  //   return this.productsService.findAll()
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.productsService.remove(+id)
  // }
}
