export class Attribute {
  id: string
  name: string
  slug: string
  isGlobalFilter: boolean

  constructor(data: Attribute) {
    Object.assign(this, data)
  }
}
