import { IsInt, Min } from 'class-validator'

export class RemoveCartItemDto {
  @IsInt({ message: 'Version must be an integer' })
  @Min(1, { message: 'Version must be at least 1' })
  version: number
}
