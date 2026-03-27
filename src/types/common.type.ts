import { UserRole } from 'enums'

/**
 * Standard API response structure
 */
export interface ApiResponse<T = any> {
  success: boolean
  statusCode: number
  message: string
  data: T
  meta?: Record<string, any>
  timestamp: string
}

/**
 * Error response structure
 */
export interface ErrorResponse {
  success: false
  statusCode: number
  message: string
  error: string
  path: string
  details?: any
  timestamp: string
  requestId?: string
}

/**
 * JWT Payload
 */
export interface JwtPayload {
  userId: string
  email: string
  role: UserRole
  jti: string
  iat?: number
  exp?: number
  iss?: string
  aud?: string
}

/**
 * Access Token Payload - Include version for token rotation
 */
export interface AccessTokenPayload extends JwtPayload {
  version: number
}

/**
 * Refresh Token Payload
 */
export interface RefreshTokenPayload extends JwtPayload {}

/**
 * Base entity with common fields
 */
export interface BaseEntity {
  id: string
  createdAt: Date
  updatedAt: Date
  deletedAt?: Date | null
  isDeleted?: boolean
}

export interface User extends BaseEntity {
  email: string | null
  googleId: string | null
  facebookId: string | null
  password: string
  code: string
  fullName: string
  phoneNumber: string
  isActive: boolean
  avatarUrl: string
  role: string
}

/**
 * Interface for paginated responses with 2 types: offset and cursor pagination
 * Are defined in the dto folder: pagination.dto.ts
 */

export class ProductCursorData {
  id: string
  createdAt?: Date
  updatedAt?: Date
  basePrice?: number
  views?: number
  name?: string
}

export class CategoryCursorData {
  id: string
  createdAt?: Date
  name?: string
  depth?: number
}

export class CollectionCursorData {
  id: string
  createdAt?: Date
  title?: string
  slug?: string
}

export interface TransactionManager {
  runInTransaction<T>(work: () => Promise<T>): Promise<T>
}
