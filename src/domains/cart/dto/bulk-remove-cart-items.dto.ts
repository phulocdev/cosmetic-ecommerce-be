import { IsArray, IsUUID, ArrayMinSize, IsInt, Min } from 'class-validator'

export class BulkRemoveCartItemsDto {
  @IsArray({ message: 'Item IDs must be an array' })
  @ArrayMinSize(1, { message: 'At least one item ID is required' })
  @IsUUID('4', { each: true, message: 'Each item ID must be a valid UUID' })
  itemIds: string[]

  @IsInt({ message: 'Version must be an integer' })
  @Min(1, { message: 'Version must be at least 1' })
  version: number
}
