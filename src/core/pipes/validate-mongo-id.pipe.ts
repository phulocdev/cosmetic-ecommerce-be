import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common'
import { BadRequestError } from 'core/exceptions/errors.exception'
import { ObjectId } from 'mongodb'

@Injectable()
export class ValidateMongoIdPipe implements PipeTransform<string> {
  transform(value: string, metadata: ArgumentMetadata): string {
    if (ObjectId.isValid(value)) {
      if (String(new ObjectId(value)) === value) {
        return value
      }
      throw new BadRequestError('Path Param của route này phải là định dạng ObjectId')
    }
    throw new BadRequestError('Path Param của route này phải là định dạng ObjectId')
  }
}
