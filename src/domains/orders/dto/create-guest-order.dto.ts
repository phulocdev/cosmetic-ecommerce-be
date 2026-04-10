import { CreateOrderDto } from './create-order.dto'

/**
 * CreateGuestOrderDto
 * Same fields as CreateOrderDto — no auth required.
 * Guest user will be found/created by shippingInfo.email + shippingInfo.phoneNumber.
 */
export class CreateGuestOrderDto extends CreateOrderDto {}
