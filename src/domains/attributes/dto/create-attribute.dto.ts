import {
  IsString,
  MaxLength,
  MinLength,
  IsNotEmpty,
  IsOptional,
  IsEnum,
  IsBoolean
} from 'class-validator'
import { AttributeType } from 'enums'

export class CreateAttributeDto {
  @MaxLength(255, { message: 'Name must be at most 255 characters' })
  @MinLength(1, { message: 'Name must be at least 1 character' })
  @IsString({ message: 'name must be a string' })
  @IsNotEmpty({ message: 'Name is required' })
  name: string

  @IsString({ message: 'slug must be a string' })
  @MaxLength(255, { message: 'Slug must be at most 255 characters' })
  @MinLength(1, { message: 'Slug must be at least 1 character' })
  @IsOptional()
  slug?: string

  @IsEnum(AttributeType, {
    message: `type must be a valid AttributeType: ${Object.values(AttributeType).join(', ')}`
  })
  @IsOptional()
  type?: AttributeType // enum: COLOR, SIZE, TEXT, NUMBER

  @IsBoolean({ message: 'isGlobalFilter must be a boolean' })
  @IsOptional()
  isGlobalFilter?: boolean // Show on /collections/all?

  @IsString({ message: 'filterGroup must be a string' })
  @IsOptional()
  filterGroup?: string

  @IsString({ message: 'unit must be a string' })
  @IsOptional()
  unit?: string
}
