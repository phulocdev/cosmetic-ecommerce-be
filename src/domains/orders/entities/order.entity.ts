import { Prisma } from '@prisma/client'
import { OrderStatus } from 'enums'

// ==========================================
// Prisma Include Definitions
// ==========================================

export const ORDER_DETAIL_INCLUDE = {
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
      }
    }
  }
} satisfies Prisma.OrderDetailInclude

export const ORDER_INCLUDE = {
  items: {
    include: ORDER_DETAIL_INCLUDE
  },
  shippingInfo: true,
  user: {
    select: {
      id: true,
      email: true,
      fullName: true,
      phoneNumber: true
    }
  }
} satisfies Prisma.OrderInclude

// ==========================================
// Derived Types from Prisma
// ==========================================

export type OrderWithDetails = Prisma.OrderGetPayload<{ include: typeof ORDER_INCLUDE }>

export type OrderDetailWithVariant = Prisma.OrderDetailGetPayload<{
  include: typeof ORDER_DETAIL_INCLUDE
}>

// ==========================================
// Order Status FSM (Finite State Machine)
// ==========================================

/**
 * Defines valid transitions for each order status.
 * If a status maps to an empty array, it is a terminal state.
 */
export const ORDER_STATUS_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  [OrderStatus.PROCESSING]: [
    OrderStatus.PENDING_PAYMENT,
    OrderStatus.PAID,
    OrderStatus.PACKED,
    OrderStatus.CANCELLED
  ],
  [OrderStatus.PENDING_PAYMENT]: [OrderStatus.PAID, OrderStatus.CANCELLED],
  [OrderStatus.PAID]: [OrderStatus.PACKED, OrderStatus.CANCELLED, OrderStatus.RETURNED],
  [OrderStatus.PACKED]: [OrderStatus.READY_TO_SHIP, OrderStatus.CANCELLED],
  [OrderStatus.READY_TO_SHIP]: [OrderStatus.SHIPPED],
  [OrderStatus.SHIPPED]: [OrderStatus.DELIVERED, OrderStatus.RETURNED],
  [OrderStatus.DELIVERED]: [OrderStatus.COMPLETED, OrderStatus.RETURNED],
  [OrderStatus.COMPLETED]: [], // terminal
  [OrderStatus.CANCELLED]: [], // terminal
  [OrderStatus.RETURNED]: [] // terminal
}

/**
 * Check if a status transition is valid according to the FSM.
 */
export function isValidStatusTransition(
  currentStatus: OrderStatus,
  newStatus: OrderStatus
): boolean {
  const allowedTransitions = ORDER_STATUS_TRANSITIONS[currentStatus]
  return allowedTransitions.includes(newStatus)
}
