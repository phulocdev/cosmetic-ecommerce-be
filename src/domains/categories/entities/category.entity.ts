import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { OffsetPaginatedResponseDto } from 'core'

export class Category {
  @ApiProperty()
  id: string

  @ApiProperty()
  name: string

  @ApiProperty()
  slug: string

  @ApiProperty()
  imageUrl: string

  @ApiPropertyOptional()
  description?: string

  @ApiPropertyOptional()
  parentId?: string

  @ApiProperty()
  path: string

  @ApiProperty()
  depth: number

  @ApiProperty()
  isActive: boolean

  @ApiPropertyOptional()
  metaTitle?: string

  @ApiPropertyOptional()
  metaDescription?: string

  @ApiProperty()
  createdAt: Date

  @ApiProperty()
  updatedAt: Date

  @ApiPropertyOptional({ type: [Category] })
  children?: Category[]

  @ApiPropertyOptional()
  productCount?: number

  @ApiPropertyOptional()
  parent?: Category

  constructor(partial: Partial<Category>) {
    Object.assign(this, partial)
  }
}

export class CategoryTreeNode {
  @ApiProperty()
  id: string

  @ApiProperty()
  name: string

  @ApiProperty()
  slug: string

  @ApiProperty()
  imageUrl: string

  @ApiProperty()
  path: string

  @ApiProperty()
  depth: number

  @ApiProperty()
  isActive: boolean

  @ApiPropertyOptional()
  productCount?: number

  @ApiPropertyOptional({ type: [CategoryTreeNode] })
  children?: CategoryTreeNode[]

  constructor(partial: Partial<CategoryTreeNode>) {
    Object.assign(this, partial)
  }
}

export class BreadcrumbItem {
  @ApiProperty()
  id: string

  @ApiProperty()
  name: string

  @ApiProperty()
  slug: string

  @ApiProperty()
  path: string

  constructor(partial: Partial<BreadcrumbItem>) {
    Object.assign(this, partial)
  }
}
