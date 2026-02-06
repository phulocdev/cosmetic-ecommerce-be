import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { IS_PUBLIC_KEY } from 'core/decorators'
import { ROLES_KEY } from 'core/decorators/roles.decorator'
import { UserRole } from 'enums'

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // Check if route is public
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass()
    ])

    if (isPublic) {
      return true
    }

    // Get required roles for the route
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass()
    ])

    // If no roles are required, allow access
    if (!requiredRoles || requiredRoles.length === 0) {
      return true
    }

    // Get the user from the request
    const { user } = context.switchToHttp().getRequest()

    if (!user) {
      throw new ForbiddenException('Access denied: No user found')
    }

    // Check if user has required role
    const hasRole = requiredRoles.some((role) => user.role === role)

    if (!hasRole) {
      throw new ForbiddenException(`Access denied: Required role(s): ${requiredRoles.join(', ')}`)
    }

    return true
  }
}
