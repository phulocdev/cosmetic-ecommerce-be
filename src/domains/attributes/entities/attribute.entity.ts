import { AttributeDataType } from 'enums'

export class Attribute {
  id: string
  name: string
  slug: string
  dataType: string
  // dataType: AttributeDataType
  isGlobalFilter: boolean
  filterGroup?: string
  unit?: string

  constructor(data: Attribute) {
    Object.assign(this, data)
  }
}
