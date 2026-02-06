/**
 * Trim Pipe
 * ===========================================
 * Trims whitespace from string values
 */

import { PipeTransform, Injectable, ArgumentMetadata } from '@nestjs/common'

@Injectable()
export class TrimPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata): any {
    if (typeof value === 'string') {
      return value.trim()
    }

    if (typeof value === 'object' && value !== null) {
      return this.trimObject(value)
    }

    return value
  }

  private trimObject(obj: Record<string, any>): Record<string, any> {
    const trimmed: Record<string, any> = {}

    for (const [key, value] of Object.entries(obj)) {
      if (typeof value === 'string') {
        trimmed[key] = value.trim()
      } else if (Array.isArray(value)) {
        trimmed[key] = value.map((item) => (typeof item === 'string' ? item.trim() : item))
      } else if (typeof value === 'object' && value !== null) {
        // Recursively trim nested objects
        trimmed[key] = this.trimObject(value)
      } else {
        trimmed[key] = value
      }
    }

    return trimmed
  }
}
