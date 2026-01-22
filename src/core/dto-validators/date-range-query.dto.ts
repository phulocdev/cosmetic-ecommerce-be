import { IsOptional } from 'class-validator'

export class DateRangeQueryDto {
  @IsOptional()
  from?: Date | undefined

  @IsOptional()
  to?: Date | undefined
}
