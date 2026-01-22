import { Injectable, PipeTransform, ArgumentMetadata } from '@nestjs/common'

@Injectable()
export class TrimBodyPayloadPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    if (typeof value !== 'object' || value === null) return value

    return this.trimStrings(value)
  }

  private trimStrings(obj: any): any {
    if (Array.isArray(obj)) {
      return obj.map((item) => this.trimStrings(item))
    } else if (typeof obj === 'object' && obj !== null) {
      const trimmedObj = {}
      for (const key in obj) {
        if (!obj.hasOwnProperty(key)) continue

        const val = obj[key]
        if (typeof val === 'string') {
          trimmedObj[key] = val.trim()
        } else if (typeof val === 'object') {
          trimmedObj[key] = this.trimStrings(val)
        } else {
          trimmedObj[key] = val
        }
      }
      return trimmedObj
    }

    return obj
  }
}
