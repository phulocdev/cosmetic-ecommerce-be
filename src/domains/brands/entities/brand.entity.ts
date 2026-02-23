export class Brand {
  id: string
  name: string
  imageUrl: string

  constructor(partial: Partial<Brand>) {
    Object.assign(this, partial)
  }
}
