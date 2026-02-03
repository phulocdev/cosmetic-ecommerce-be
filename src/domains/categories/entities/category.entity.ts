import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { PaginatedResponse } from 'types'

// Category entity representation for API Documentation (Swagger) and type definitions for response type of service methods
export class CategoryEntity {
  @ApiProperty()
  id: string

  @ApiProperty()
  name: string

  @ApiProperty()
  slug: string

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

  @ApiPropertyOptional({ type: [CategoryEntity] })
  children?: CategoryEntity[]

  @ApiPropertyOptional()
  productCount?: number

  @ApiPropertyOptional()
  parent?: CategoryEntity
}

export class CategoryTreeNode {
  @ApiProperty()
  id: string

  @ApiProperty()
  name: string

  @ApiProperty()
  slug: string

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
}

export class PaginatedCategoriesResponse extends PaginatedResponse<CategoryEntity> {}
