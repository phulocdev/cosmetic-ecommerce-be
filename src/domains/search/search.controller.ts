import { Body, Controller, Get, Post, Query } from '@nestjs/common'
import { ApiOperation, ApiTags } from '@nestjs/swagger'
import { Public } from 'core'
import { SearchProductsDto } from 'domains/search/dto/search-product.dto'
import { SearchService, SearchProductsResult } from 'domains/search/search.service'

@ApiTags('Search')
@Controller('search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  /**
   * Unified search endpoint for both:
   * - AdvancedSearchBar (keyword search: `q=...&limit=8`)
   * - Collection Page (filters + sort + cursor pagination)
   *
   * Returns ProductDocument[] directly from ElasticSearch.
   * The TransformInterceptor will detect `items + meta` and wrap them
   * into the standard ApiResponse format automatically.
   */
  @Public()
  @Post('products')
  @ApiOperation({ summary: 'Search products using ElasticSearch' })
  async searchProducts(@Body() body: SearchProductsDto): Promise<SearchProductsResult> {
    return this.searchService.searchProducts(body)
  }

  /**
   * Trigger a full reindex of all products from PostgreSQL → ElasticSearch.
   * Admin-only in production; no auth guard here for development convenience.
   */
  @Post('reindex')
  @ApiOperation({ summary: 'Reindex all products from PostgreSQL to ElasticSearch' })
  async reindexAll(): Promise<{ indexed: number }> {
    return this.searchService.reindexAll()
  }
}
