import { Module, Search } from '@nestjs/common'
import { ProductsController } from './products.controller'
import { ProductsService } from 'domains/products/products.service'
import { ValidateDtoService } from 'domains/products/validate-dto.service'
import { UpdateProductService } from 'domains/products/update-product.service'
import { FindAllProductService } from 'domains/products/find-all-product.service'
import { SearchModule } from 'domains/search/search.module'

@Module({
  imports: [SearchModule],
  controllers: [ProductsController],
  providers: [ProductsService, ValidateDtoService, UpdateProductService, FindAllProductService],
  exports: [ProductsService]
})
export class ProductsModule {}
