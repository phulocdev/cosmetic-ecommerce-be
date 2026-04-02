import { IsOptional, IsUUID, IsInt, Min, Max } from 'class-validator'

export class UpdateCartItemDto {
  @IsOptional()
  @IsUUID('4', { message: 'New product variant ID must be a valid UUID' })
  newProductVariantId?: string

  @IsOptional()
  @IsInt({ message: 'Quantity must be an integer' })
  @Min(1, { message: 'Quantity must be at least 1' })
  @Max(99, { message: 'Quantity cannot exceed 99' })
  quantity?: number

  @IsInt({ message: 'Version must be an integer' })
  @Min(1, { message: 'Version must be at least 1' })
  version: number
}
