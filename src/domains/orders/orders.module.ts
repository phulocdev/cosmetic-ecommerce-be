import { Module } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { EmailModule } from 'domains/email/email.module'
import { UsersModule } from 'domains/users/users.module'
import { OrdersController } from './orders.controller'
import { OrdersService } from './orders.service'
import { OrderRedisService } from './order-redis.service'
import { OptionalJwtAuthGuard } from 'domains/cart/guards/optional-jwt-auth.guard'
import { RolesGuard } from 'core/guards/roles.guard'
import { RedisLockModule } from 'core/redis-lock/redis-lock.module'
import { RedisLockService } from 'core/redis-lock/redis-lock.service'

@Module({
  imports: [EmailModule, UsersModule],
  controllers: [OrdersController],
  providers: [
    OrdersService,
    OrderRedisService,
    OptionalJwtAuthGuard,
    JwtService,
    RolesGuard,
    RedisLockService
  ],
  exports: [OrdersService]
})
export class OrdersModule {}
