/**
 * Parse UUID Pipe
 * ===========================================
 * Validates and transforms UUID parameters
 */

import { PipeTransform, Injectable, ArgumentMetadata, BadRequestException } from '@nestjs/common'
import { validate as isUUID } from 'uuid'

@Injectable()
export class ParseUUIDPipe implements PipeTransform<string> {
  transform(value: string, metadata: ArgumentMetadata): string {
    if (!isUUID(value)) {
      throw new BadRequestException(`Invalid UUID format for ${metadata.data || 'parameter'}`)
    }
    return value
  }
}
