import { IsBoolean, IsOptional } from 'class-validator'
import { PaginationQueryDto } from 'core'

export class FindAllAttributeDto extends PaginationQueryDto {
  @IsBoolean({ message: 'getAll must be a boolean value' })
  @IsOptional()
  getAll?: boolean
}
