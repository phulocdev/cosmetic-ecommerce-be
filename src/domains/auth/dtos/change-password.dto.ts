import { Transform } from 'class-transformer'
import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator'

export class ChangePasswordDto {
  @MaxLength(40, { message: 'olPassword không được vượt quá 40 kí tự' })
  @MinLength(6, { message: 'olPassword phải có ít nhất 6 kí tự' })
  @IsString({ message: 'olPassword phải là kiểu dữ liệu là string' })
  @IsNotEmpty({ message: 'olPassword không được bỏ trống' })
  @Transform(({ value }) => String(value).trim())
  oldPassword: string

  @MaxLength(40, { message: 'newPassword không được vượt quá 40 kí tự' })
  @MinLength(6, { message: 'newPassword phải có ít nhất 6 kí tự' })
  @IsString({ message: 'newPassword phải là kiểu dữ liệu là string' })
  @IsNotEmpty({ message: 'newPassword không được bỏ trống' })
  @Transform(({ value }) => String(value).trim())
  newPassword: string
}
