import { IsUUID, IsNotEmpty, IsNumber, IsPositive, IsString } from 'class-validator'

export class CreatePaymentDto {
  @IsString({ message: 'Order Code must be a string' })
  @IsNotEmpty({ message: 'Order Code is required' })
  orderCode: string

  @IsNumber({}, { message: 'Amount must be a number' })
  @IsPositive({ message: 'Amount must be positive' })
  amount: number
}
