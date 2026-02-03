import { ApiProperty } from '@nestjs/swagger'
import { UserRole } from '@prisma/client'

// Define generic paginated response class
export class PaginatedResponse<T> {
  @ApiProperty()
  data: T[]

  @ApiProperty()
  totalItems: number

  @ApiProperty()
  currentPage: number

  @ApiProperty()
  limit: number

  @ApiProperty()
  totalPages: number

  // constructor(items: T[], totalItems: number, totalPages: number, currentPage: number) {
  //   this.items = items
  //   this.totalItems = totalItems
  //   this.totalPages = totalPages
  //   this.currentPage = currentPage
  // }
}

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
