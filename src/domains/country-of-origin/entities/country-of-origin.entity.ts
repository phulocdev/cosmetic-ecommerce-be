export class CountryOfOrigin {
  id: string
  name: string

  constructor(partial: Partial<CountryOfOrigin>) {
    Object.assign(this, partial)
  }
}
