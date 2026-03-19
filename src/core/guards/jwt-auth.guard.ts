// src/auth/guards/jwt-auth.guard.ts
import {
  BadRequestException,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException
} from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { TokenExpiredError } from '@nestjs/jwt'
import { AuthGuard } from '@nestjs/passport'
import { IS_PUBLIC_KEY } from 'core/decorators/public.decorator'
import { REDIS_CLIENT } from 'database/redis/redis.module'
import Redis from 'ioredis/built/Redis'
import { ExtractJwt } from 'passport-jwt'
import { Observable } from 'rxjs'

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(
    private reflector: Reflector,
    @Inject(REDIS_CLIENT) private redis: Redis
  ) {
    super()
  }

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass()
    ])

    if (isPublic) {
      return true
    }

    const request = context.switchToHttp().getRequest()
    const token = ExtractJwt.fromAuthHeaderAsBearerToken()(request)
    if (!token) {
      throw new BadRequestException('Access token is required')
    }

    return super.canActivate(context)
  }

  handleRequest<TUser = any>(err: any, user: TUser, info: any, context: ExecutionContext): TUser {
    if (info instanceof TokenExpiredError) {
      throw new UnauthorizedException('Access token has expired')
    }

    if (err || !user) {
      throw err || new UnauthorizedException('Invalid access token')
    }

    return user
  }
}
