import { Prisma } from '@prisma/client'

/**
 * Cart Entity Types
 * =================
 * Provides strongly-typed definitions for Cart and CartItem
 * used across CartService, CartRedisService, and CartGateway.
 */

// ==========================================
// Prisma Include Definitions (reusable)
// ==========================================

/**
 * The standard include shape used when fetching cart items
 * with product variant details and attributes.
 */
export const CART_ITEM_INCLUDE = {
  productVariant: {
    include: {
      product: {
        select: {
          id: true,
          name: true,
          slug: true,
          images: {
            select: { url: true, altText: true },
            take: 1,
            orderBy: { displayOrder: 'asc' as const }
          }
        }
      },
      attributeValues: {
        include: {
          attributeValue: {
            include: {
              attribute: {
                select: { id: true, name: true }
              }
            }
          }
        }
      }
    }
  }
} satisfies Prisma.CartItemInclude

export const CART_INCLUDE = {
  items: {
    include: CART_ITEM_INCLUDE,
    orderBy: { createdAt: 'desc' as const }
  }
} satisfies Prisma.CartInclude

// ==========================================
// Derived Types from Prisma
// ==========================================

/** Full cart with items and all nested relations */
export type CartWithItems = Prisma.CartGetPayload<{ include: typeof CART_INCLUDE }>

/** A single cart item with product variant, product, and attribute values */
export type CartItemWithVariant = Prisma.CartItemGetPayload<{
  include: typeof CART_ITEM_INCLUDE
}>

// ==========================================
// Enriched Types (server adds extra fields)
// ==========================================

/** Cart item enriched with price change detection */
export interface EnrichedCartItem extends CartItemWithVariant {
  priceChanged: boolean
  previousPrice: number | null
  currentPrice: number
}

/** Cart enriched with price change info on items */
export interface EnrichedCart extends Omit<CartWithItems, 'items'> {
  items: EnrichedCartItem[]
}

// ==========================================
// Cookie & Session Types
// ==========================================

export interface CartCookieOptions {
  cartId: string
  maxAgeMs: number
  isProduction: boolean
}
