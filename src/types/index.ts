import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { UserRole } from 'enums'

export class JwtPayload {
  userId: string
  email: string
  role: UserRole
  iat?: number
  exp?: number
}

export class AccessTokenPayload extends JwtPayload {
  version: number
}

export interface RefreshTokenPayload extends JwtPayload {}

export class User {
  id: string
  email: string
  password: string
  code: string
  fullName: string
  phoneNumber: string
  isActive: boolean
  avatarUrl: string
  role: UserRole
  createdAt: Date
  updatedAt: Date | null
}

// Define generic paginated response class
export class PaginationMetaDto {
  // ------------------------ Fields for offset pagination ------------------------

  // The total number of items available (only for offset pagination)
  @ApiPropertyOptional({ example: 100 })
  total?: number

  @ApiPropertyOptional({ example: 1 })
  page?: number

  @ApiPropertyOptional({ example: 5 })
  totalPages?: number

  // The below fields are for both pagination types: offset and cursor
  @ApiPropertyOptional({ example: 20 })
  limit?: number

  // ------------------------Fields for cursor pagination ------------------------
  @ApiPropertyOptional({ example: true })
  hasNextPage?: boolean

  @ApiPropertyOptional({ example: false })
  hasPreviousPage?: boolean

  @ApiPropertyOptional({ example: 'eyJpZCI6ImFiYzEyMyJ9' })
  nextCursor?: string | null

  @ApiPropertyOptional({ example: 'eyJpZCI6Inh5ejc4OSJ9' })
  previousCursor?: string | null
}

export class PaginatedResponse<T> {
  @ApiProperty()
  data: T[]

  @ApiProperty()
  meta: PaginationMetaDto
}

export class CursorData {
  id: string
  createdAt?: Date
  updatedAt?: Date
  basePrice?: number
  views?: number
  name?: string
}
