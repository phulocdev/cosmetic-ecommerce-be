import { IsNotEmpty, IsOptional, IsString, IsUrl, MaxLength, MinLength } from 'class-validator'

export class CreateBrandDto {
  @MaxLength(255)
  @MinLength(1)
  @IsString()
  @IsNotEmpty()
  name: string

  @IsUrl()
  @IsString()
  @IsOptional()
  imageUrl?: string
}
