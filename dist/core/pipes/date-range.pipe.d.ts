import { PipeTransform } from '@nestjs/common';
import { DateRangeQueryDto } from 'core/dto/date-range-query.dto';
import { UtcDateRange } from 'utils';
export interface ParsedDateRange {
    dateRange?: UtcDateRange;
    raw: {
        startDate?: string;
        endDate?: string;
        timezone?: string;
    };
}
export declare class DateRangePipe implements PipeTransform<DateRangeQueryDto, ParsedDateRange> {
    transform(query: DateRangeQueryDto): ParsedDateRange;
}
