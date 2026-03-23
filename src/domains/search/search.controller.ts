import { Controller, Get, Query } from '@nestjs/common'
import { SearchProductsDto } from 'domains/search/dto/search-product.dto'
import { SearchService } from 'domains/search/search.service'

@Controller('search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Get('products')
  async search(@Query() query: SearchProductsDto) {
    return this.searchService.searchProducts(query)
  }
}
