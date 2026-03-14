import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator'

export class CreateCountryOfOriginDto {
  @MaxLength(255)
  @MinLength(1)
  @IsString()
  @IsNotEmpty()
  name: string
}
