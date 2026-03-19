/**
 * Current User Decorator
 * ===========================================
 * Extracts the current user from request
 */

import { createParamDecorator, ExecutionContext } from '@nestjs/common'
import { UserRole } from 'enums'
import { User } from 'types'

export interface AuthenticatedUser extends Partial<User> {
  id: string
  email: string
  role: UserRole
}

export const CurrentUser = createParamDecorator(
  (data: keyof AuthenticatedUser | undefined, ctx: ExecutionContext): AuthenticatedUser | any => {
    const request = ctx.switchToHttp().getRequest()
    const user = request.user as AuthenticatedUser

    if (!user) {
      return null
    }

    // If specific property is requested which is provided in the value of data parameter, return that property
    // Example: @CurrentUser('email') will return only email of the user, if not provided, return the whole user object
    return data ? user[data] : user
  }
)
