/**
 * Express Type Extensions
 * ===========================================
 * Extends Express Request type with custom properties
 */

import { User as TUser } from '@prisma/client'
import { AuthenticatedUser } from 'core'

declare global {
  namespace Express {
    interface Request {
      user?: Partial<TUser> & AuthenticatedUser
      requestId?: string
    }
  }
}

export {}
