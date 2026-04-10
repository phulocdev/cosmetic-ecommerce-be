import { Transform } from 'class-transformer'
import { IsArray, IsEnum, IsOptional, IsString } from 'class-validator'
import { PaginationQueryDto } from 'core/dto/pagination.dto'
import { OrderSortBy, OrderStatus } from 'enums'

export class QueryOrderDto extends PaginationQueryDto {
  @IsOptional()
  @IsEnum(OrderSortBy)
  sortBy?: OrderSortBy = OrderSortBy.CREATED_AT

  @IsArray({ message: 'Status must be an array' })
  @IsEnum(OrderStatus, {
    each: true,
    message: `Each status must be a valid OrderStatus: ${Object.values(OrderStatus).join(', ')}`
  })
  @Transform(({ value }) => (Array.isArray(value) ? value : [value]))
  @IsOptional()
  status?: OrderStatus[]

  @IsOptional()
  @IsString()
  userId?: string

  @IsOptional()
  @IsString()
  search?: string
}
