import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common'
import { UnprocessableEntityError } from 'core/exceptions/errors.exception'
import { endOfDay, isAfter, isValid, startOfDay } from 'date-fns'

interface IDateRangeQuery {
  from: string
  to: string
}

@Injectable()
export class ValidateDateRange
  implements PipeTransform<IDateRangeQuery, { from: Date | undefined; to: Date | undefined }>
{
  transform(value: IDateRangeQuery, metadata: ArgumentMetadata): { from: Date | undefined; to: Date | undefined } {
    // Trường hợp client không cần filter theo DateRange
    if (!value.from || !value.to) {
      return {
        from: undefined,
        to: undefined
      }
    }

    const fromDate = new Date(value.from)
    const toDate = new Date(value.to)

    if (!isValid(fromDate)) {
      throw new UnprocessableEntityError(
        [{ field: 'from', message: 'from có giá trị Date không hợp lệ' }],
        'Giá trị ngày lọc không hợp lệ'
      )
    }

    if (!isValid(toDate)) {
      throw new UnprocessableEntityError(
        [{ field: 'to', message: 'to có giá trị Date không hợp lệ' }],
        'Giá trị ngày lọc không hợp lệ'
      )
    }

    if (isAfter(fromDate, toDate)) {
      throw new UnprocessableEntityError(
        [
          { field: 'from', message: 'from phải nhỏ hơn to' },
          { field: 'to', message: 'to phải lớn hơn from' }
        ],
        'Giá trị ngày lọc không hợp lệ'
      )
    }

    return {
      from: startOfDay(fromDate),
      to: endOfDay(toDate)
    }
  }
}
