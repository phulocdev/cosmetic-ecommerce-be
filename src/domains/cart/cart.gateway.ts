import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  ConnectedSocket,
  MessageBody
} from '@nestjs/websockets'
import { Server, Socket } from 'socket.io'
import { Logger, UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { ConfigService } from '@nestjs/config'

/**
 * CartGateway — WebSocket Gateway for Real-Time Cart Sync
 * =======================================================
 * - Namespace: /cart
 * - Requires JWT for connection (authenticated users only)
 * - Guest users don't use WebSocket (their cart exists only on one device)
 * - Each user joins a room named after their userId
 * - After any cart mutation, the server emits `cart:updated` to the user's room
 * - If another device receives the event, it refetches the cart via React Query
 *
 * Events:
 * - `cart:updated` (server → client): Cart data has changed
 * - `cart:conflict` (server → client): Version conflict detected
 */
@WebSocketGateway({
  namespace: '/cart',
  cors: {
    origin: true,
    credentials: true
  }
})
export class CartGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server

  private readonly logger = new Logger(CartGateway.name)

  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService
  ) {}

  /**
   * Authenticate on connection using JWT from handshake auth token
   */
  async handleConnection(client: Socket) {
    try {
      const token =
        client.handshake.auth?.token ||
        client.handshake.headers?.authorization?.replace('Bearer ', '')

      if (!token) {
        this.logger.warn(`WebSocket connection rejected: no token provided`)
        client.disconnect()
        return
      }

      // Verify JWT
      const payload = this.jwtService.verify(token, {
        secret: this.configService.get('jwt.accessSecret')
      })

      if (!payload?.userId) {
        client.disconnect()
        return
      }

      // Store userId on the socket for later use
      client.data.userId = payload.userId

      // Auto-join the user's room
      const room = this.getUserRoom(payload.userId)
      client.join(room)

      this.logger.log(
        `User ${payload.userId} connected to cart WebSocket (socket: ${client.id})`
      )
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error'
      this.logger.warn(`WebSocket auth failed: ${message}`)
      client.disconnect()
    }
  }

  handleDisconnect(client: Socket) {
    const userId = client.data?.userId
    if (userId) {
      this.logger.log(`User ${userId} disconnected from cart WebSocket`)
    }
  }

  /**
   * Emit cart:updated event to all devices of a user
   * Called by CartController after any cart mutation
   */
  emitCartUpdated(userId: string, cartData: any) {
    const room = this.getUserRoom(userId)
    this.server.to(room).emit('cart:updated', {
      cart: cartData,
      timestamp: new Date().toISOString()
    })
  }

  /**
   * Emit cart:conflict event when optimistic locking fails
   */
  emitCartConflict(userId: string, message: string) {
    const room = this.getUserRoom(userId)
    this.server.to(room).emit('cart:conflict', {
      message,
      timestamp: new Date().toISOString()
    })
  }

  private getUserRoom(userId: string): string {
    return `user:${userId}:cart`
  }
}
