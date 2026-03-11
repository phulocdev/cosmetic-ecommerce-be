import {
  ArrayMinSize,
  ArrayUnique,
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength
} from 'class-validator'

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

  @IsBoolean({ message: 'isGlobalFilter must be a boolean' })
  @IsOptional()
  isGlobalFilter?: boolean // Show on /collections/all?

  // @IsString({ message: 'unit must be a string' })
  // @IsOptional()
  // unit?: string

  // Receive the list of attribute values as a array of string
  @IsArray({ message: 'values must be an array' })
  @ArrayMinSize(1, { message: 'At least one attribute value is required' })
  @ArrayUnique((value: string) => value.toLowerCase(), {
    message: 'Attribute values must be unique'
  })
  @IsString({ each: true, message: 'Each attribute value in values field must be a string' })
  @IsNotEmpty({ message: 'values are required', each: true })
  values: string[]
}
