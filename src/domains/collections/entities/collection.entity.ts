import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { Exclude, Expose } from 'class-transformer'
import { BaseEntity } from '../../../core/entity/base.entity'
import { Product } from '../../products/entities/product.entity'
import { Attribute } from '../../attributes/entities/attribute.entity'
import { Category } from '../../categories/entities/category.entity'

@Exclude()
export class Collection extends BaseEntity {
  @Expose()
  @ApiProperty()
  title: string

  @Expose()
  @ApiProperty()
  slug: string

  @Expose()
  @ApiPropertyOptional()
  description?: string

  @Expose()
  @ApiPropertyOptional()
  imageUrl?: string

  @Expose()
  @ApiProperty()
  isActive: boolean

  @Expose()
  @ApiPropertyOptional()
  metaTitle?: string

  @Expose()
  @ApiPropertyOptional()
  metaDescription?: string

  // relations
  @Expose()
  @ApiPropertyOptional()
  products?: CollectionProduct[]

  @Expose()
  @ApiPropertyOptional()
  attributes?: CollectionAttribute[]

  @Expose()
  @ApiPropertyOptional()
  categories?: CollectionCategory[]

  constructor(partial: Partial<Collection>) {
    super(partial)
    Object.assign(this, partial)
  }
}

@Exclude()
export class CollectionProduct {
  @Expose()
  @ApiProperty()
  collectionId: string

  @Expose()
  @ApiProperty()
  productId: string

  @Expose()
  @ApiProperty()
  displayOrder: number

  @Expose()
  @ApiProperty()
  createdAt: Date

  @Expose()
  @ApiPropertyOptional()
  collection?: any

  @Expose()
  @ApiPropertyOptional()
  product?: any

  constructor(partial: Partial<CollectionProduct>) {
    Object.assign(this, partial)
  }
}

@Exclude()
export class CollectionAttribute {
  @Expose()
  @ApiProperty()
  collectionId: string

  @Expose()
  @ApiProperty()
  attributeId: string

  @Expose()
  @ApiProperty()
  createdAt: Date

  @Expose()
  @ApiPropertyOptional()
  collection?: any

  @Expose()
  @ApiPropertyOptional()
  attribute?: any

  constructor(partial: Partial<CollectionAttribute>) {
    Object.assign(this, partial)
  }
}

@Exclude()
export class CollectionCategory {
  @Expose()
  @ApiProperty()
  collectionId: string

  @Expose()
  @ApiProperty()
  categoryId: string

  @Expose()
  @ApiProperty()
  createdAt: Date

  @Expose()
  @ApiPropertyOptional()
  collection?: any

  @Expose()
  @ApiPropertyOptional()
  category?: any

  constructor(partial: Partial<CollectionCategory>) {
    Object.assign(this, partial)
  }
}
