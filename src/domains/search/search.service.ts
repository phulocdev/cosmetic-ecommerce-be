import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common'
import { ElasticsearchService } from '@nestjs/elasticsearch'
import { SearchProductsDto } from 'domains/search/dto/search-product.dto'

export interface ProductDocument {
  id: string
  code: string
  name: string
  slug: string
  description: string
  status: string
  basePrice: number
  views: number
  brand: { id: string; name: string }
  countryOfOrigin: { id: string; name: string }
  categories: { id: string; name: string; slug: string; isPrimary: boolean }[]
  // Flat list of all attribute values across all variants — for faceted filtering
  attributes: { attributeId: string; attributeName: string; valueId: string; value: string }[]
  // Variant price range for filter UI
  minSellingPrice: number
  maxSellingPrice: number
  createdAt: Date
  updatedAt: Date
}

export interface SearchResult {
  total: number
  products: ProductDocument[]
  facets: Facets
}

interface Facets {
  brands: FacetItem[]
  countries: FacetItem[]
  categories: FacetItem[]
  attributes: AttributeFacet[]
  priceRange: { min: number; max: number }
}

interface FacetItem {
  id: string
  name: string
  count: number
}

interface AttributeFacet {
  attributeId: string
  attributeName: string
  values: FacetItem[]
}

interface Bucket {
  key: string
  doc_count: number
  name?: { buckets: Bucket[] }
  attributeName?: { buckets: Bucket[] }
  values?: { buckets: Bucket[] }
  label?: { buckets: Bucket[] }
}

interface Aggregations {
  brands?: { buckets: Bucket[] }
  countries?: { buckets: Bucket[] }
  categories?: { ids?: { buckets: Bucket[] } }
  attributes?: { byAttribute?: { buckets: Bucket[] } }
  priceRange?: { min: number; max: number }
}

type ESQuery = Record<string, unknown>

@Injectable()
export class SearchService implements OnApplicationBootstrap {
  private readonly INDEX = 'products'
  private readonly logger = new Logger(SearchService.name)

  constructor(private readonly esService: ElasticsearchService) {}

  async onApplicationBootstrap() {
    await this.createProductsIndex()
  }

  async createProductsIndex() {
    const exists = await this.esService.indices.exists({ index: this.INDEX })
    if (exists) {
      this.logger.log(`Index "${this.INDEX}" already exists, skipping creation.`)
      return
    }

    await this.esService.indices.create({
      index: this.INDEX,
      mappings: {
        properties: {
          id: { type: 'keyword' },
          code: { type: 'keyword' },
          name: {
            type: 'text',
            analyzer: 'standard',
            fields: { keyword: { type: 'keyword' } } // for sorting
          },
          slug: { type: 'keyword' },
          description: { type: 'text', analyzer: 'standard' },
          status: { type: 'keyword' },
          basePrice: { type: 'double' },
          views: { type: 'integer' },
          brand: {
            properties: {
              id: { type: 'keyword' },
              name: { type: 'text', fields: { keyword: { type: 'keyword' } } }
            }
          },
          countryOfOrigin: {
            properties: {
              id: { type: 'keyword' },
              name: { type: 'text', fields: { keyword: { type: 'keyword' } } }
            }
          },
          categories: {
            type: 'nested',
            properties: {
              id: { type: 'keyword' },
              name: { type: 'text', fields: { keyword: { type: 'keyword' } } },
              slug: { type: 'keyword' },
              isPrimary: { type: 'boolean' }
            }
          },
          // Nested type is CRITICAL for faceted filtering.
          // A flat array would mix up attributeId + valueId across attributes,
          // causing incorrect cross-attribute matches.
          attributes: {
            type: 'nested',
            properties: {
              attributeId: { type: 'keyword' },
              attributeName: { type: 'keyword' },
              valueId: { type: 'keyword' },
              value: { type: 'keyword' }
            }
          },
          minSellingPrice: { type: 'double' },
          maxSellingPrice: { type: 'double' },
          createdAt: { type: 'date' },
          updatedAt: { type: 'date' }
        }
      },
      settings: {
        number_of_shards: 1,
        number_of_replicas: 0,
        analysis: {
          analyzer: {
            standard: { type: 'standard' }
          }
        }
      }
    })

    this.logger.log(`Index "${this.INDEX}" created successfully.`)
  }

  async indexProduct(doc: ProductDocument) {
    return this.esService.index({
      index: this.INDEX,
      id: doc.id,
      document: doc
    })
  }

  async deleteProduct(productId: string) {
    return this.esService.delete({ index: this.INDEX, id: productId })
  }

  async searchProducts(dto: SearchProductsDto): Promise<SearchResult> {
    const {
      query,
      categoryIds,
      brandIds,
      countryOriginIds,
      attributeFilters,
      priceMin,
      priceMax,
      status = 'PUBLISHED',
      from = 0,
      size = 20
    } = dto

    // --- Build filter clauses ---
    const filters: ESQuery[] = [{ term: { status } }]

    if (brandIds?.length) {
      filters.push({ terms: { 'brand.id': brandIds } })
    }

    if (countryOriginIds?.length) {
      filters.push({ terms: { 'countryOfOrigin.id': countryOriginIds } })
    }

    if (categoryIds?.length) {
      // nested query because categories is a nested type
      filters.push({
        nested: {
          path: 'categories',
          query: { terms: { 'categories.id': categoryIds } }
        }
      })
    }

    if (priceMin !== undefined || priceMax !== undefined) {
      const range: { gte?: number; lte?: number } = {}
      if (priceMin !== undefined) range.gte = priceMin
      if (priceMax !== undefined) range.lte = priceMax
      filters.push({ range: { minSellingPrice: range } })
    }

    // Faceted attribute filtering — each attribute group is an independent nested filter.
    // Within one attribute (e.g. Color), values are OR-ed (Red OR Blue).
    // Across attributes (e.g. Color + Size), groups are AND-ed.
    if (attributeFilters?.length) {
      for (const af of attributeFilters) {
        filters.push({
          nested: {
            path: 'attributes',
            query: {
              bool: {
                must: [
                  { term: { 'attributes.attributeId': af.attributeId } },
                  { terms: { 'attributes.valueId': af.valueIds } }
                ]
              }
            }
          }
        })
      }
    }

    // --- Build must (full-text) clause ---
    const must: ESQuery[] = []
    if (query?.trim()) {
      must.push({
        multi_match: {
          query: query.trim(),
          fields: [
            'name^3', // boost product name matches
            'description',
            'brand.name',
            'categories.name'
          ],
          type: 'best_fields',
          fuzziness: 'AUTO' // handles typos naturally
        }
      })
    }

    // --- Build aggregations for filter panel counts ---
    const aggs: Record<string, unknown> = {
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
          ids: {
            terms: { field: 'categories.id', size: 100 },
            aggs: { name: { terms: { field: 'categories.name.keyword', size: 1 } } }
          }
        }
      },
      // Nested agg for attribute facets — groups by attribute then by value
      attributes: {
        nested: { path: 'attributes' },
        aggs: {
          byAttribute: {
            terms: { field: 'attributes.attributeId', size: 50 },
            aggs: {
              attributeName: { terms: { field: 'attributes.attributeName', size: 1 } },
              values: {
                terms: { field: 'attributes.valueId', size: 100 },
                aggs: { label: { terms: { field: 'attributes.value', size: 1 } } }
              }
            }
          }
        }
      },
      priceRange: {
        stats: { field: 'minSellingPrice' }
      }
    }

    const result = await this.esService.search({
      index: this.INDEX,
      from,
      size,
      query: {
        bool: {
          must: must.length ? must : [{ match_all: {} }],
          filter: filters
        }
      },
      aggregations: aggs,
      sort: query?.trim()
        ? ['_score'] // relevance for keyword search
        : [{ createdAt: { order: 'desc' } }] // newest first for browsing
    })

    return {
      total: (result.hits.total as { value: number }).value,
      products: result.hits.hits.map((h) => h._source as ProductDocument),
      facets: this.formatFacets(result.aggregations)
    }
  }

  // Format raw ES aggregations into a clean shape for the frontend filter panel
  private formatFacets(aggs: Aggregations): Facets {
    if (!aggs)
      return {
        brands: [],
        countries: [],
        categories: [],
        attributes: [],
        priceRange: { min: 0, max: 0 }
      }

    const brandBuckets = aggs.brands?.buckets ?? []
    const countryBuckets = aggs.countries?.buckets ?? []
    const categoryBuckets = aggs.categories?.ids?.buckets ?? []
    const attributeBuckets = aggs.attributes?.byAttribute?.buckets ?? []

    return {
      brands: brandBuckets.map((b: Bucket) => ({
        id: b.key,
        name: b.name?.buckets?.[0]?.key ?? b.key,
        count: b.doc_count
      })),
      countries: countryBuckets.map((b: Bucket) => ({
        id: b.key,
        name: b.name?.buckets?.[0]?.key ?? b.key,
        count: b.doc_count
      })),
      categories: categoryBuckets.map((b: Bucket) => ({
        id: b.key,
        name: b.name?.buckets?.[0]?.key ?? b.key,
        count: b.doc_count
      })),
      attributes: attributeBuckets.map((ab: Bucket) => ({
        attributeId: ab.key,
        attributeName: ab.attributeName?.buckets?.[0]?.key ?? ab.key,
        values: (ab.values?.buckets ?? []).map((vb: Bucket) => ({
          id: vb.key,
          name: vb.label?.buckets?.[0]?.key ?? vb.key,
          count: vb.doc_count
        }))
      })),
      priceRange: {
        min: aggs.priceRange?.min ?? 0,
        max: aggs.priceRange?.max ?? 0
      }
    }
  }
}
