import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  Res,
  Headers,
  HttpCode,
  HttpStatus
} from '@nestjs/common'
import { CartService } from './cart.service'
import { AddToCartDto } from './dto/add-to-cart.dto'
import { UpdateCartItemDto } from './dto/update-cart-item.dto'
import { RemoveCartItemDto } from './dto/remove-cart-item.dto'
import { BulkRemoveCartItemsDto } from './dto/bulk-remove-cart-items.dto'
import { OptionalJwtAuthGuard } from './guards/optional-jwt-auth.guard'
import { ParseUUIDPipe } from 'core'
import { Public } from 'core/decorators/public.decorator'
import { CurrentUser, AuthenticatedUser } from 'core/decorators/current-user.decorator'
import { ResponseMessage } from 'core/decorators/response-message.decorator'
import { Request, Response } from 'express'

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Public()
  @UseGuards(OptionalJwtAuthGuard)
  @Get()
  @ResponseMessage('Cart retrieved successfully')
  async getCart(
    @CurrentUser() user: AuthenticatedUser | null,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response
  ) {
    return this.cartService.getCart(req, res, user?.id)
  }

  @Public()
  @UseGuards(OptionalJwtAuthGuard)
  @Post('items')
  @ResponseMessage('Item added to cart successfully')
  @HttpCode(HttpStatus.CREATED)
  async addToCart(
    @Body() addToCartDto: AddToCartDto,
    @CurrentUser() user: AuthenticatedUser | null,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
    @Headers('idempotency-key') idempotencyKey?: string
  ) {
    return this.cartService.addToCart(req, res, user?.id, addToCartDto, idempotencyKey)
  }

  @Public()
  @UseGuards(OptionalJwtAuthGuard)
  @Patch('items/:item_id')
  @ResponseMessage('Cart item updated successfully')
  async updateCartItem(
    @Param('item_id', ParseUUIDPipe) itemId: string,
    @Body() updateCartItemDto: UpdateCartItemDto,
    @CurrentUser() user: AuthenticatedUser | null,
    @Req() req: Request
  ) {
    return this.cartService.updateCartItem(req, user?.id, itemId, updateCartItemDto)
  }

  @Public()
  @UseGuards(OptionalJwtAuthGuard)
  @Delete('items/:item_id')
  @ResponseMessage('Cart item removed successfully')
  async removeCartItem(
    @Param('item_id', ParseUUIDPipe) itemId: string,
    @Body() removeCartItemDto: RemoveCartItemDto,
    @CurrentUser() user: AuthenticatedUser | null,
    @Req() req: Request
  ) {
    return this.cartService.removeCartItem(req, user?.id, itemId, removeCartItemDto.version)
  }

  @Public()
  @UseGuards(OptionalJwtAuthGuard)
  @Post('items/bulk-delete')
  @ResponseMessage('Cart items removed successfully')
  @HttpCode(HttpStatus.OK)
  async bulkRemoveCartItems(
    @Body() bulkRemoveDto: BulkRemoveCartItemsDto,
    @CurrentUser() user: AuthenticatedUser | null,
    @Req() req: Request
  ) {
    return this.cartService.bulkRemoveCartItems(req, user?.id, bulkRemoveDto)
  }

  @Post('merge')
  @ResponseMessage('Cart merged successfully')
  @HttpCode(HttpStatus.OK)
  async mergeCart(
    @CurrentUser() user: AuthenticatedUser,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response
  ) {
    return this.cartService.mergeCart(req, res, user.id)
  }

  @Public()
  @Get('variants/:product_id')
  @ResponseMessage('Product variants retrieved successfully')
  async getProductVariants(@Param('product_id', ParseUUIDPipe) productId: string) {
    return this.cartService.getProductVariants(productId)
  }
}
