// date-range.pipe.ts
import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common'
import { DateRangeQueryDto } from 'core/dto/date-range-query.dto'
import { buildUtcDateRange, UtcDateRange } from 'utils'

export interface ParsedDateRange {
  dateRange?: UtcDateRange
  raw: {
    startDate?: string
    endDate?: string
    timezone?: string
  }
}

@Injectable()
export class DateRangePipe implements PipeTransform<DateRangeQueryDto, ParsedDateRange> {
  transform(query: DateRangeQueryDto): ParsedDateRange {
    return {
      dateRange: buildUtcDateRange(query.startDate, query.endDate, query.timezone),
      raw: {
        startDate: query.startDate,
        endDate: query.endDate,
        timezone: query.timezone
      }
    }
  }
}
