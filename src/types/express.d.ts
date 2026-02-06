/**
 * Express Type Extensions
 * ===========================================
 * Extends Express Request type with custom properties
 */

import { User as TUser } from '@prisma/client'

declare global {
  namespace Express {
    interface Request {
      user?: Partial<TUser> & {
        id: string
        email: string
        role: string
      }
      requestId?: string
    }
  }
}

export {}
