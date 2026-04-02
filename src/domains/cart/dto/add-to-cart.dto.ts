import { IsNotEmpty, IsUUID, IsInt, Min, Max } from 'class-validator'

export class AddToCartDto {
  @IsUUID('4', { message: 'Product variant ID must be a valid UUID' })
  @IsNotEmpty({ message: 'Product variant ID is required' })
  productVariantId: string

  @IsInt({ message: 'Quantity must be an integer' })
  @Min(1, { message: 'Quantity must be at least 1' })
  @Max(99, { message: 'Quantity cannot exceed 99' })
  @IsNotEmpty({ message: 'Quantity is required' })
  quantity: number
}
