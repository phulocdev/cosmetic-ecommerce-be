import { ExecutionContext, Injectable } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { AuthGuard } from '@nestjs/passport'

/**
 * OptionalJwtAuthGuard
 * ====================
 * Attempts JWT authentication but does NOT reject unauthenticated requests.
 * - If JWT is present and valid → sets req.user with the authenticated user
 * - If JWT is missing or invalid → sets req.user = null and allows the request to proceed
 *
 * Used for cart endpoints where both guests and authenticated users can interact.
 */
@Injectable()
export class OptionalJwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super()
  }

  canActivate(context: ExecutionContext) {
    // Always try to authenticate, but don't fail if it doesn't work
    return super.canActivate(context)
  }

  handleRequest<TUser = any>(err: any, user: TUser): TUser {
    // If there's an error or no user, just return null instead of throwing
    // This allows guests to access the endpoint
    if (err || !user) {
      return null as any
    }
    return user
  }
}
