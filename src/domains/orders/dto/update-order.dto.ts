import { IsEnum, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator'
import { OrderStatus } from 'enums'

export class UpdateOrderStatusDto {
  @IsEnum(OrderStatus, { message: 'Status must be a valid OrderStatus' })
  @IsNotEmpty({ message: 'Status is required' })
  status: OrderStatus
}

export class CancelOrderDto {
  @IsString()
  @IsOptional()
  @MaxLength(500)
  reason?: string
}
