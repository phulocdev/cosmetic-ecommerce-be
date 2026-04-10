import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Query,
  UseGuards,
  Headers,
  HttpCode,
  HttpStatus
} from '@nestjs/common'
import { OrdersService } from './orders.service'
import { CreateOrderDto } from './dto/create-order.dto'
import { CreateGuestOrderDto } from './dto/create-guest-order.dto'
import { UpdateOrderStatusDto, CancelOrderDto } from './dto/update-order.dto'
import { QueryOrderDto } from './dto/query-order.dto'
import { OptionalJwtAuthGuard } from 'domains/cart/guards/optional-jwt-auth.guard'
import { ParseUUIDPipe } from 'core'
import { Public } from 'core/decorators/public.decorator'
import { Roles } from 'core/decorators/roles.decorator'
import { CurrentUser, AuthenticatedUser } from 'core/decorators/current-user.decorator'
import { ResponseMessage } from 'core/decorators/response-message.decorator'
import { UserRole } from 'enums'
import { DateRangePipe, ParsedDateRange } from 'core/pipes/date-range.pipe'

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  /**
   * POST /orders — Create order (authenticated user)
   */
  @Post()
  @ResponseMessage('Order created successfully')
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body() createOrderDto: CreateOrderDto,
    @CurrentUser() user: AuthenticatedUser,
    @Headers('idempotency-key') idempotencyKey?: string
  ) {
    return this.ordersService.createOrder(user.id, createOrderDto, idempotencyKey)
  }

  /**
   * POST /orders/guest — Create order (guest, uses email + phone)
   */
  @Public()
  @UseGuards(OptionalJwtAuthGuard)
  @Post('guest')
  @ResponseMessage('Guest order created successfully')
  @HttpCode(HttpStatus.CREATED)
  async createGuest(
    @Body() createGuestOrderDto: CreateGuestOrderDto,
    @CurrentUser() user: AuthenticatedUser | null,
    @Headers('idempotency-key') idempotencyKey?: string
  ) {
    // If user is authenticated, use their ID directly
    if (user?.id) {
      return this.ordersService.createOrder(user.id, createGuestOrderDto, idempotencyKey)
    }
    return this.ordersService.createGuestOrder(createGuestOrderDto, idempotencyKey)
  }

  /**
   * GET /orders — List orders
   * ADMIN/STAFF: all orders; Customer: own orders
   */
  @Get()
  @ResponseMessage('Orders retrieved successfully')
  async findAll(
    @Query() query: QueryOrderDto,
    @Query(DateRangePipe) { dateRange }: ParsedDateRange,
    @CurrentUser() user: AuthenticatedUser
  ) {
    // If customer, force filter to their own orders
    if (user.role === UserRole.CUSTOMER) {
      query.userId = user.id
    }
    return this.ordersService.findAll(query, dateRange)
  }

  /**
   * GET /orders/shipping-fee — Get shipping fee
   */
  @Public()
  @Get('shipping-fee')
  @ResponseMessage('Shipping fee retrieved successfully')
  getShippingFee() {
    return { shippingFee: this.ordersService.getShippingFee() }
  }

  /**
   * GET /orders/:id — Get order details
   */
  @Get(':id')
  @ResponseMessage('Order retrieved successfully')
  async findOne(@Param('id', ParseUUIDPipe) id: string, @CurrentUser() user: AuthenticatedUser) {
    const order = await this.ordersService.findOne(id)

    // Customers can only view their own orders
    if (user.role === UserRole.CUSTOMER && order.userId !== user.id) {
      throw new Error('You can only view your own orders')
    }

    return order
  }

  /**
   * POST /orders/:id/cancel — Cancel an order
   */
  @Post(':id/cancel')
  @ResponseMessage('Order cancelled successfully')
  @HttpCode(HttpStatus.OK)
  async cancel(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() cancelDto: CancelOrderDto,
    @CurrentUser() user: AuthenticatedUser
  ) {
    const isAdmin = user.role === UserRole.ADMIN || user.role === UserRole.STAFF
    return this.ordersService.cancelOrder(id, user.id, cancelDto.reason, isAdmin)
  }

  /**
   * PATCH /orders/:id/status — Update order status (admin only)
   */
  @Patch(':id/status')
  @Roles(UserRole.ADMIN, UserRole.STAFF)
  @ResponseMessage('Order status updated successfully')
  async updateStatus(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateDto: UpdateOrderStatusDto
  ) {
    return this.ordersService.updateOrderStatus(id, updateDto.status)
  }
}
