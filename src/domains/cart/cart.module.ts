import { Module } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { CartController } from './cart.controller'
import { CartService } from './cart.service'
import { CartRedisService } from './cart-redis.service'
import { CartGateway } from './cart.gateway'
import { OptionalJwtAuthGuard } from './guards/optional-jwt-auth.guard'

@Module({
  controllers: [CartController],
  providers: [
    CartService,
    CartRedisService,
    CartGateway,
    OptionalJwtAuthGuard,
    JwtService
  ],
  exports: [CartService]
})
export class CartModule {}
