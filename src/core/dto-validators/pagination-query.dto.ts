import { Type } from 'class-transformer'
import { IsInt, IsOptional, Min } from 'class-validator'

export class PaginationQueryDto {
  @Min(1, { message: 'page phải > 0' })
  @IsInt({ message: 'page phải là định dạng số nguyên' })
  @Type(() => Number)
  @IsOptional()
  page?: number | undefined

  @Min(1, { message: 'limit phải > 0' })
  @IsInt({ message: 'limit phải là định dạng số nguyên' })
  @Type(() => Number)
  @IsOptional()
  limit?: number | undefined
}
