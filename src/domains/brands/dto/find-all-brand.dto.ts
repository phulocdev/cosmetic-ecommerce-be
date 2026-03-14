import { Transform } from 'class-transformer'
import { IsBoolean, IsOptional } from 'class-validator'
import { PaginationQueryDto } from 'core'

export class FindAllBrandDto extends PaginationQueryDto {
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean()
  getAll?: boolean
}
