import { Module } from '@nestjs/common'
import { ProductsController } from './products.controller'
import { ProductsService } from 'domains/products/products.service'
import { ProductSeedService } from 'domains/products/product-seed.service'
import { ValidateDtoService } from 'domains/products/validate-dto.service'
import { InvalidateFilterCacheService } from 'domains/products/invalidate-filter-cache.service'
import { UpdateProductService } from 'domains/products/update-product.service'
import { FindAllProductService } from 'domains/products/find-all-product.service'

@Module({
  controllers: [ProductsController],
  providers: [
    ProductsService,
    ProductSeedService,
    ValidateDtoService,
    InvalidateFilterCacheService,
    UpdateProductService,
    FindAllProductService
  ],
  exports: [ProductsService]
})
export class ProductsModule {}
