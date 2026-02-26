import { AttributeType } from 'enums'

export class Attribute {
  id: string
  name: string
  slug: string
  // type: AttributeType
  type: string
  isGlobalFilter: boolean
  filterGroup?: string
  unit?: string

  constructor(data: Attribute) {
    Object.assign(this, data)
  }
}
