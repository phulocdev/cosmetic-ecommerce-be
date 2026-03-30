import { Injectable, Logger, OnModuleInit } from '@nestjs/common'
import { ElasticsearchService } from '@nestjs/elasticsearch'
import { PrismaService } from 'database/prisma/prisma.service'
import { Product } from 'domains/products'
import { SearchProductsDto } from 'domains/search/dto/search-product.dto'
import { ProductSortBy, SortOrder } from 'enums'

// ─── Types ──────────────────────────────────────────────────────────────────

/** Denormalized product document stored in ElasticSearch */
export interface ProductDocument {
  id: string
  code: string
  name: string
  slug: string
  description: string | null
  status: string
  basePrice: number
  views: number
  brand: { id: string; name: string } | null
  countryOfOrigin: { id: string; name: string } | null
  categories: Array<{ id: string; name: string; slug: string; isPrimary: boolean }>
  images: Array<{ url: string; altText: string | null; displayOrder: number }>
  variants: Array<{
    id: string
    sku: string
    name: string
    sellingPrice: number
    costPrice: number
    stockOnHand: number
    imageUrl: string | null
    isActive: boolean
    attributeValues: Array<{
      attributeId: string
      attributeName: string
      valueId: string
      value: string
    }>
  }>
  /** Flattened attributes for faceted filtering */
  attributes: Array<{
    attributeId: string
    attributeName: string
    valueId: string
    value: string
  }>
  minSellingPrice: number | null
  maxSellingPrice: number | null
  createdAt: string
  updatedAt: string | null
}

/** Cursor data encoded/decoded for search_after pagination */
interface SearchCursorData {
  sortValues: Array<string | number>
}

/** Facet bucket from ES aggregation */
interface FacetBucket {
  key: string
  doc_count: number
  name?: { buckets: Array<{ key: string }> }
}

/** Aggregation facets returned to the client */
export interface SearchFacets {
  brands?: Array<{ id: string; name: string; count: number }>
  countries?: Array<{ id: string; name: string; count: number }>
  categories?: Array<{ id: string; name: string; count: number }>
  priceRange?: { min: number; max: number }
}

/** Full search result returned by searchProducts() */
export interface SearchProductsResult {
  items: ProductDocument[]
  meta: {
    limit: number
    hasNextPage: boolean
    hasPreviousPage: boolean
    nextCursor: string | null
    previousCursor: string | null
    /** Offset pagination fields — only present when `page` param is used */
    totalItems?: number
    page?: number
    totalPages?: number
  }
  facets?: SearchFacets
}

// ─── Constants ──────────────────────────────────────────────────────────────

const PRODUCTS_INDEX = 'products'

const PRODUCTS_INDEX_MAPPING = {
  properties: {
    id: { type: 'keyword' as const },
    code: { type: 'keyword' as const },
    name: {
      type: 'text' as const,
      fields: {
        keyword: { type: 'keyword' as const },
        search: { type: 'text' as const, analyzer: 'standard' }
      }
    },
    slug: { type: 'keyword' as const },
    description: { type: 'text' as const },
    status: { type: 'keyword' as const },
    basePrice: { type: 'scaled_float' as const, scaling_factor: 100 },
    views: { type: 'integer' as const },
    brand: {
      properties: {
        id: { type: 'keyword' as const },
        name: {
          type: 'text' as const,
          fields: { keyword: { type: 'keyword' as const } }
        }
      }
    },
    countryOfOrigin: {
      properties: {
        id: { type: 'keyword' as const },
        name: {
          type: 'text' as const,
          fields: { keyword: { type: 'keyword' as const } }
        }
      }
    },
    categories: {
      type: 'nested' as const,
      properties: {
        id: { type: 'keyword' as const },
        name: { type: 'text' as const, fields: { keyword: { type: 'keyword' as const } } },
        slug: { type: 'keyword' as const },
        isPrimary: { type: 'boolean' as const }
      }
    },
    images: {
      type: 'nested' as const,
      properties: {
        url: { type: 'keyword' as const },
        altText: { type: 'keyword' as const },
        displayOrder: { type: 'integer' as const }
      }
    },
    variants: {
      type: 'nested' as const,
      properties: {
        id: { type: 'keyword' as const },
        sku: { type: 'keyword' as const },
        name: { type: 'text' as const, fields: { keyword: { type: 'keyword' as const } } },
        sellingPrice: { type: 'scaled_float' as const, scaling_factor: 100 },
        costPrice: { type: 'scaled_float' as const, scaling_factor: 100 },
        stockOnHand: { type: 'integer' as const },
        imageUrl: { type: 'keyword' as const },
        isActive: { type: 'boolean' as const },
        attributeValues: {
          type: 'nested' as const,
          properties: {
            attributeId: { type: 'keyword' as const },
            attributeName: { type: 'keyword' as const },
            valueId: { type: 'keyword' as const },
            value: { type: 'keyword' as const }
          }
        }
      }
    },
    attributes: {
      type: 'nested' as const,
      properties: {
        attributeId: { type: 'keyword' as const },
        attributeName: { type: 'keyword' as const },
        valueId: { type: 'keyword' as const },
        value: { type: 'keyword' as const }
      }
    },
    minSellingPrice: { type: 'scaled_float' as const, scaling_factor: 100 },
    maxSellingPrice: { type: 'scaled_float' as const, scaling_factor: 100 },
    createdAt: { type: 'date' as const },
    updatedAt: { type: 'date' as const }
  }
}

// ─── Service ────────────────────────────────────────────────────────────────

@Injectable()
export class SearchService implements OnModuleInit {
  private readonly logger = new Logger(SearchService.name)

  constructor(
    private readonly esService: ElasticsearchService,
    private readonly prismaService: PrismaService
  ) {}

  async onModuleInit() {
    await this.createIndexIfNotExists()
  }

  // ─── Index Management ───────────────────────────────────────────────

  /**
   * Create the products index with mapping if it doesn't already exist.
   */
  private async createIndexIfNotExists(): Promise<void> {
    try {
      const indexExists = await this.esService.indices.exists({ index: PRODUCTS_INDEX })
      if (!indexExists) {
        await this.esService.indices.create({
          index: PRODUCTS_INDEX,
          body: {
            settings: {
              number_of_shards: 1,
              number_of_replicas: 0,
              max_result_window: 50000
            },
            mappings: PRODUCTS_INDEX_MAPPING
          }
        })
        this.logger.log(`Created ElasticSearch index "${PRODUCTS_INDEX}"`)
      } else {
        this.logger.log(`ElasticSearch index "${PRODUCTS_INDEX}" already exists`)
      }
    } catch (error) {
      this.logger.error(`Failed to create ES index: ${error}`)
    }
  }

  // ─── Index Operations ───────────────────────────────────────────────

  /**
   * Index a single product document into ES.
   * Call this after product create/update in PostgreSQL.
   */
  async indexProduct(product: ProductDocument): Promise<void> {
    try {
      await this.esService.index({
        index: PRODUCTS_INDEX,
        id: product.id,
        body: product,
        refresh: 'wait_for'
      })
      this.logger.debug(`Indexed product ${product.id} (${product.name})`)
    } catch (error) {
      this.logger.error(`Failed to index product ${product.id}: ${error}`)
    }
  }

  /**
   * Remove a product from the ES index.
   */
  async removeProduct(productId: string): Promise<void> {
    try {
      await this.esService.delete({
        index: PRODUCTS_INDEX,
        id: productId,
        refresh: 'wait_for'
      })
      this.logger.debug(`Removed product ${productId} from index`)
    } catch (error) {
      this.logger.error(`Failed to remove product ${productId}: ${error}`)
    }
  }

  /**
   * Bulk index multiple product documents (used by reindexAll).
   */
  private async bulkIndexProducts(documents: ProductDocument[]): Promise<void> {
    if (documents.length === 0) return

    const body = documents.flatMap((doc) => [
      { index: { _index: PRODUCTS_INDEX, _id: doc.id } },
      doc
    ])

    const result = await this.esService.bulk({ body, refresh: 'wait_for' })
    if (result.errors) {
      const errorItems = result.items.filter((item) => item.index?.error)
      this.logger.error(`Bulk indexing errors: ${JSON.stringify(errorItems.slice(0, 5))}`)
    }
  }

  // ─── Transform Prisma Product → ES Document ────────────────────────

  /**
   * Transform a fully-loaded Prisma product (with all relations) into a
   * flat ProductDocument suitable for ES indexing.
   */
  transformToDocument(product: Product): ProductDocument {
    // Flatten all variant attribute values for faceted filtering
    const flatAttributes: ProductDocument['attributes'] = []
    const sellingPrices: number[] = []

    if (product.variants) {
      for (const variant of product.variants) {
        if (variant.sellingPrice != null) {
          sellingPrices.push(Number(variant.sellingPrice))
        }
        if (variant.attributeValues) {
          for (const vav of variant.attributeValues) {
            const av = vav.attributeValue
            if (av) {
              // Avoid duplicates
              const exists = flatAttributes.some(
                (a) => a.attributeId === av.attribute?.id && a.valueId === av.id
              )
              if (!exists) {
                flatAttributes.push({
                  attributeId: av.attribute?.id ?? '',
                  attributeName: av.attribute?.name ?? '',
                  valueId: av.id,
                  value: av.value
                })
              }
            }
          }
        }
      }
    }

    return {
      id: product.id,
      code: product.code,
      name: product.name,
      slug: product.slug,
      description: product.description ?? null,
      status: product.status,
      basePrice: Number(product.basePrice),
      views: product.views ?? 0,
      brand: product.brand ? { id: product.brand.id, name: product.brand.name } : null,
      countryOfOrigin: product.countryOfOrigin
        ? { id: product.countryOfOrigin.id, name: product.countryOfOrigin.name }
        : null,
      categories: (product.categories ?? []).map((pc: Record<string, any>) => ({
        id: pc.category?.id ?? pc.categoryId,
        name: pc.category?.name ?? '',
        slug: pc.category?.slug ?? '',
        isPrimary: pc.isPrimary ?? false
      })),
      images: (product.images ?? []).map((img: Record<string, any>) => ({
        url: img.url,
        altText: img.altText ?? null,
        displayOrder: img.displayOrder ?? 0
      })),
      variants: (product.variants ?? []).map((v: Record<string, any>) => ({
        id: v.id,
        sku: v.sku,
        name: v.name,
        sellingPrice: Number(v.sellingPrice),
        costPrice: Number(v.costPrice),
        stockOnHand: v.stockOnHand ?? 0,
        imageUrl: v.imageUrl ?? null,
        isActive: v.isActive ?? true,
        attributeValues: (v.attributeValues ?? []).map((vav: Record<string, any>) => ({
          attributeId: vav.attributeValue?.attribute?.id ?? '',
          attributeName: vav.attributeValue?.attribute?.name ?? '',
          valueId: vav.attributeValue?.id ?? vav.attributeValueId ?? '',
          value: vav.attributeValue?.value ?? ''
        }))
      })),
      attributes: flatAttributes,
      minSellingPrice: sellingPrices.length > 0 ? Math.min(...sellingPrices) : null,
      maxSellingPrice: sellingPrices.length > 0 ? Math.max(...sellingPrices) : null,
      createdAt:
        product.createdAt instanceof Date ? product.createdAt.toISOString() : product.createdAt,
      updatedAt:
        product.updatedAt instanceof Date
          ? product.updatedAt.toISOString()
          : product.updatedAt ?? null
    }
  }

  // ─── Search ─────────────────────────────────────────────────────────

  /**
   * Main search method. Builds an ES query from the DTO and returns
   * ProductDocument[], pagination meta, and optional facets.
   */
  async searchProducts(dto: SearchProductsDto): Promise<SearchProductsResult> {
    const limit = dto.limit ?? 20
    const sortBy = dto.sortBy ?? ProductSortBy.CREATED_AT
    const sortOrder = dto.sortOrder ?? SortOrder.DESC

    // ── Build the bool query ──────────────────────────────────────────

    const must: Record<string, unknown>[] = []
    const filter: Record<string, unknown>[] = []

    // Text search
    if (dto.searchQuery && dto.searchQuery.trim()) {
      must.push({
        multi_match: {
          query: dto.searchQuery.trim(),
          fields: ['name^3', 'name.search^2', 'description', 'code^2', 'brand.name'],
          type: 'best_fields',
          fuzziness: 'AUTO'
        }
      })
    }

    // Product IDs filter
    if (dto.productIds && dto.productIds.length > 0) {
      filter.push({ terms: { id: dto.productIds } })
    }

    // Status filter
    if (dto.status && dto.status.length > 0) {
      filter.push({ terms: { status: dto.status } })
    }

    // Brand filter
    if (dto.brandIds && dto.brandIds.length > 0) {
      filter.push({ terms: { 'brand.id': dto.brandIds } })
    }

    // Country filter
    if (dto.countryIds && dto.countryIds.length > 0) {
      filter.push({ terms: { 'countryOfOrigin.id': dto.countryIds } })
    }

    // Category filter (nested)
    if (dto.categoryIds && dto.categoryIds.length > 0) {
      filter.push({
        nested: {
          path: 'categories',
          query: { terms: { 'categories.id': dto.categoryIds } }
        }
      })
    }

    // Category slug filter (nested)
    if (dto.categorySlug) {
      filter.push({
        nested: {
          path: 'categories',
          query: { term: { 'categories.slug': dto.categorySlug } }
        }
      })
    }

    // Price range
    if (dto.minPrice !== undefined || dto.maxPrice !== undefined) {
      const range: Record<string, number> = {}
      if (dto.minPrice !== undefined) range.gte = dto.minPrice
      if (dto.maxPrice !== undefined) range.lte = dto.maxPrice
      filter.push({ range: { basePrice: range } })
    }

    // Attribute filters (nested)
    if (dto.attributes && dto.attributes.length > 0) {
      for (const attrFilter of dto.attributes) {
        filter.push({
          nested: {
            path: 'attributes',
            query: {
              bool: {
                must: [
                  { term: { 'attributes.attributeId': attrFilter.attributeId } },
                  { terms: { 'attributes.valueId': attrFilter.valueIds } }
                ]
              }
            }
          }
        })
      }
    }

    // In-stock filter (nested on variants)
    if (dto.inStock) {
      filter.push({
        nested: {
          path: 'variants',
          query: {
            bool: {
              must: [
                { range: { 'variants.stockOnHand': { gt: 0 } } },
                { term: { 'variants.isActive': true } }
              ]
            }
          }
        }
      })
    }

    // Active variants filter
    if (dto.hasActiveVariants) {
      filter.push({
        nested: {
          path: 'variants',
          query: { term: { 'variants.isActive': true } }
        }
      })
    }

    // ── Build the query body ──────────────────────────────────────────

    const boolQuery: Record<string, unknown> = {}
    if (must.length > 0) {
      boolQuery.must = must
    } else {
      boolQuery.must = [{ match_all: {} }]
    }
    if (filter.length > 0) {
      boolQuery.filter = filter
    }

    // ── Sorting ───────────────────────────────────────────────────────

    const sort = this.buildSortClause(sortBy, sortOrder, !!dto.searchQuery)

    // ── Determine pagination mode ─────────────────────────────────────
    // If `page` is provided (and no cursor), use offset-based (from+size).
    // Otherwise, use cursor-based (search_after).
    const useOffsetPagination = dto.page != null && !dto.cursor

    let searchAfter: Array<string | number> | undefined
    let offsetFrom: number | undefined

    if (useOffsetPagination) {
      // Offset-based: calculate `from` value
      const page = dto.page!
      offsetFrom = (page - 1) * limit
    } else if (dto.cursor) {
      // Cursor-based: decode search_after values
      try {
        const cursorData: SearchCursorData = JSON.parse(
          Buffer.from(dto.cursor, 'base64').toString('utf-8')
        )
        searchAfter = cursorData.sortValues
      } catch {
        this.logger.warn(`Invalid cursor format: ${dto.cursor}`)
      }
    }

    // ── Aggregations (facets) ─────────────────────────────────────────

    let aggs: Record<string, unknown> | undefined
    if (dto.includeFacets) {
      aggs = {
        brands: {
          terms: { field: 'brand.id', size: 50 },
          aggs: { name: { terms: { field: 'brand.name.keyword', size: 1 } } }
        },
        countries: {
          terms: { field: 'countryOfOrigin.id', size: 50 },
          aggs: { name: { terms: { field: 'countryOfOrigin.name.keyword', size: 1 } } }
        },
        categories: {
          nested: { path: 'categories' },
          aggs: {
            category_ids: {
              terms: { field: 'categories.id', size: 50 },
              aggs: { name: { terms: { field: 'categories.name.keyword', size: 1 } } }
            }
          }
        },
        price_range: {
          stats: { field: 'basePrice' }
        }
      }
    }

    // ── Execute the search ────────────────────────────────────────────

    const body: Record<string, unknown> = {
      query: { bool: boolQuery },
      sort,
      size: useOffsetPagination ? limit : limit + 1,
      track_total_hits: true
    }

    if (offsetFrom !== undefined) {
      body.from = offsetFrom
    }

    if (searchAfter) {
      body.search_after = searchAfter
    }

    if (aggs) {
      body.aggs = aggs
    }

    const response = await this.esService.search<ProductDocument>({
      index: PRODUCTS_INDEX,
      body
    })

    // ── Process results ───────────────────────────────────────────────

    const hits = response.hits.hits
    const totalHits =
      typeof response.hits.total === 'object' ? response.hits.total.value : response.hits.total ?? 0

    const items: ProductDocument[] = hits.map((hit) => ({
      ...hit._source!,
      id: hit._id as string
    }))

    // ── Process facets ────────────────────────────────────────────────

    let facets: SearchFacets | undefined
    if (dto.includeFacets && response.aggregations) {
      facets = this.processFacets(response.aggregations)
    }

    // ── Build pagination meta ─────────────────────────────────────────

    if (useOffsetPagination) {
      // Offset-based pagination meta
      const page = dto.page!
      const total = totalHits
      const totalPages = Math.ceil(total / limit)

      return {
        items,
        meta: {
          limit,
          hasNextPage: page < totalPages,
          hasPreviousPage: page > 1,
          nextCursor: null,
          previousCursor: null,
          totalItems: total,
          page,
          totalPages
        },
        facets
      }
    }

    // Cursor-based pagination meta
    const hasNextPage = hits.length > limit
    if (hasNextPage) {
      hits.pop()
      items.pop()
    }

    let nextCursor: string | null = null
    if (hasNextPage && hits.length > 0) {
      const lastHit = hits[hits.length - 1]
      if (lastHit.sort) {
        const cursorData: SearchCursorData = { sortValues: lastHit.sort as Array<string | number> }
        nextCursor = Buffer.from(JSON.stringify(cursorData)).toString('base64')
      }
    }

    let previousCursor: string | null = null
    if (dto.cursor && hits.length > 0) {
      const firstHit = hits[0]
      if (firstHit.sort) {
        const cursorData: SearchCursorData = { sortValues: firstHit.sort as Array<string | number> }
        previousCursor = Buffer.from(JSON.stringify(cursorData)).toString('base64')
      }
    }

    return {
      items,
      meta: {
        limit,
        hasNextPage,
        hasPreviousPage: !!dto.cursor,
        nextCursor,
        totalItems: totalHits,
        previousCursor
      },
      facets
    }
  }

  // ─── Reindex ────────────────────────────────────────────────────────

  /**
   * Fetch all products from PostgreSQL and bulk-index them into ES.
   * Useful for initial setup or recovering from a corrupted index.
   */
  async reindexAll(): Promise<{ indexed: number }> {
    this.logger.log('Starting full reindex from PostgreSQL → ElasticSearch...')

    // Delete and recreate the index
    try {
      const exists = await this.esService.indices.exists({ index: PRODUCTS_INDEX })
      if (exists) {
        await this.esService.indices.delete({ index: PRODUCTS_INDEX })
        this.logger.log(`Deleted index "${PRODUCTS_INDEX}"`)
      }
    } catch (error) {
      this.logger.warn(`Error deleting index: ${error}`)
    }

    await this.createIndexIfNotExists()

    // Fetch all products with full relations
    const products = await this.prismaService.product.findMany({
      include: {
        brand: true,
        countryOfOrigin: true,
        categories: {
          include: {
            category: true
          }
        },
        images: {
          orderBy: { displayOrder: 'asc' }
        },
        variants: {
          include: {
            attributeValues: {
              include: {
                attributeValue: {
                  include: {
                    attribute: true
                  }
                }
              }
            }
          }
        }
      }
    })

    // Transform and bulk index in batches of 500
    const BATCH_SIZE = 500
    let indexed = 0

    for (let i = 0; i < products.length; i += BATCH_SIZE) {
      const batch = products.slice(i, i + BATCH_SIZE)
      const documents = batch.map((p) => this.transformToDocument(p as unknown as Product))
      await this.bulkIndexProducts(documents)
      indexed += documents.length
      this.logger.log(
        `Indexed batch ${Math.floor(i / BATCH_SIZE) + 1}: ${indexed}/${products.length} products`
      )
    }

    this.logger.log(`Reindex complete: ${indexed} products indexed`)
    return { indexed }
  }

  // ─── Private Helpers ────────────────────────────────────────────────

  private buildSortClause(
    sortBy: ProductSortBy,
    sortOrder: SortOrder,
    hasTextQuery: boolean
  ): Array<Record<string, unknown>> {
    const sort: Array<Record<string, unknown>> = []

    // If there's a text query and no explicit sort, sort by relevance first
    if (hasTextQuery && !sortBy) {
      sort.push({ _score: { order: 'desc' } })
    }

    // Map ProductSortBy enum to ES field names
    const sortFieldMap: Record<ProductSortBy, string> = {
      [ProductSortBy.CREATED_AT]: 'createdAt',
      [ProductSortBy.PRICE]: 'basePrice',
      [ProductSortBy.NAME]: 'name.keyword',
      [ProductSortBy.VIEWS]: 'views'
    }

    const esField = sortFieldMap[sortBy] || 'createdAt'
    sort.push({ [esField]: { order: sortOrder } })

    // Always add _id as tiebreaker for stable pagination
    sort.push({ id: { order: sortOrder } })

    return sort
  }

  private processFacets(aggregations: Record<string, any>): SearchFacets {
    const facets: SearchFacets = {}

    // Brand facets
    if (aggregations.brands?.buckets) {
      facets.brands = aggregations.brands.buckets.map((bucket: FacetBucket) => ({
        id: bucket.key,
        name: bucket.name?.buckets?.[0]?.key ?? bucket.key,
        count: bucket.doc_count
      }))
    }

    // Country facets
    if (aggregations.countries?.buckets) {
      facets.countries = aggregations.countries.buckets.map((bucket: FacetBucket) => ({
        id: bucket.key,
        name: bucket.name?.buckets?.[0]?.key ?? bucket.key,
        count: bucket.doc_count
      }))
    }

    // Category facets (nested aggregation)
    if (aggregations.categories?.category_ids?.buckets) {
      facets.categories = aggregations.categories.category_ids.buckets.map(
        (bucket: FacetBucket) => ({
          id: bucket.key,
          name: bucket.name?.buckets?.[0]?.key ?? bucket.key,
          count: bucket.doc_count
        })
      )
    }

    // Price range
    if (aggregations.price_range) {
      facets.priceRange = {
        min: aggregations.price_range.min ?? 0,
        max: aggregations.price_range.max ?? 0
      }
    }

    return facets
  }
}
