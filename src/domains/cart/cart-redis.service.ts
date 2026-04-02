import { Inject, Injectable, Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { REDIS_CLIENT } from 'database/redis/redis.module'
import { CartWithItems, EnrichedCart } from './entities/cart.entity'
import Redis from 'ioredis'
import ms from 'ms'

/**
 * CartRedisService
 * ================
 * Handles Redis-specific cart operations:
 * - Cart caching (read-through / write-through)
 * - Idempotency key management (store + check previous responses)
 * - Guest cart TTL management
 *
 * Key patterns:
 * - cart:{cartId}          → Cart JSON data
 * - idempotency:{key}     → Previous response JSON
 *
 * TTL values are read from environment variables via ConfigService.
 */
@Injectable()
export class CartRedisService {
  private readonly logger = new Logger(CartRedisService.name)

  private readonly guestCartTtl: number
  private readonly authCartTtl: number
  private readonly idempotencyTtl: number

  constructor(
    @Inject(REDIS_CLIENT) private readonly redis: Redis,
    private readonly configService: ConfigService
  ) {
    this.guestCartTtl = +ms(this.configService.get('GUEST_CART_REDIS_TTL')) / 1000 // Convert ms to seconds for Redis EX option
    this.authCartTtl = +ms(this.configService.get('AUTH_CART_REDIS_TTL')) / 1000
    this.idempotencyTtl = +ms(this.configService.get('IDEMPOTENCY__REDIS_TTL')) / 1000
  }

  // ==========================================
  // Cart Cache Operations
  // ==========================================

  /**
   * Get cart data from Redis cache
   */
  async getCart(cartId: string): Promise<CartWithItems | null> {
    try {
      const key = this.getCartKey(cartId)
      const data = await this.redis.get(key)
      return data ? JSON.parse(data) : null
    } catch (error) {
      this.logger.error(`Failed to get cart from Redis: ${cartId}`, error)
      return null
    }
  }

  /**
   * Store cart data in Redis cache with appropriate TTL
   */
  async setCart(
    cartId: string,
    cartData: CartWithItems | EnrichedCart,
    isGuest: boolean = false
  ): Promise<void> {
    try {
      const key = this.getCartKey(cartId)
      const ttl = isGuest ? this.guestCartTtl : this.authCartTtl
      await this.redis.set(key, JSON.stringify(cartData), 'EX', ttl)
    } catch (error) {
      this.logger.error(`Failed to set cart in Redis: ${cartId}`, error)
    }
  }

  /**
   * Delete cart from Redis cache
   */
  async deleteCart(cartId: string): Promise<void> {
    try {
      const key = this.getCartKey(cartId)
      await this.redis.del(key)
    } catch (error) {
      this.logger.error(`Failed to delete cart from Redis: ${cartId}`, error)
    }
  }

  /**
   * Invalidate cart cache (forces DB read on next access)
   */
  async invalidateCart(cartId: string): Promise<void> {
    await this.deleteCart(cartId)
  }

  /**
   * Get TTL remaining for a cart key (useful for expiry warnings)
   */
  async getCartTTL(cartId: string): Promise<number> {
    try {
      const key = this.getCartKey(cartId)
      return await this.redis.ttl(key)
    } catch (error) {
      this.logger.error(`Failed to get cart TTL: ${cartId}`, error)
      return -1
    }
  }

  // ==========================================
  // Idempotency Key Operations
  // ==========================================

  /**
   * Check if an idempotency key exists and return the stored response if so
   * Returns null if the key doesn't exist (first request)
   */
  async getIdempotencyResponse(idempotencyKey: string): Promise<EnrichedCart | null> {
    try {
      const key = this.getIdempotencyKey(idempotencyKey)
      const data = await this.redis.get(key)
      return data ? JSON.parse(data) : null
    } catch (error) {
      this.logger.error(`Failed to check idempotency key: ${idempotencyKey}`, error)
      return null
    }
  }

  /**
   * Store the response for an idempotency key
   * This allows returning the same response for retry requests
   */
  async setIdempotencyResponse(idempotencyKey: string, response: EnrichedCart): Promise<void> {
    try {
      const key = this.getIdempotencyKey(idempotencyKey)
      await this.redis.set(key, JSON.stringify(response), 'EX', this.idempotencyTtl)
    } catch (error) {
      this.logger.error(`Failed to set idempotency response: ${idempotencyKey}`, error)
    }
  }

  /**
   * Get guest cart TTL in milliseconds (used for expiresAt on cart creation)
   */
  getGuestCartTtlMs(): number {
    return this.guestCartTtl * 1000
  }

  // ==========================================
  // Key Helpers
  // ==========================================

  private getCartKey(cartId: string): string {
    return `cart:${cartId}`
  }

  private getIdempotencyKey(key: string): string {
    return `idempotency:${key}`
  }
}
