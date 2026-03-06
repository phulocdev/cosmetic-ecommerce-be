import { IsDateString, IsOptional, IsTimeZone } from 'class-validator'
import { IsBeforeDate } from 'core/decorators/is-before-date.decorator'

export class DateRangeQueryDto {
  @IsOptional()
  @IsDateString()
  @IsBeforeDate('endDate')
  startDate?: string

  @IsOptional()
  @IsDateString()
  endDate?: string

  @IsTimeZone()
  @IsOptional()
  timezone?: string // e.g. "Asia/Ho_Chi_Minh"
}
