import { IsEmail, IsNotEmpty, IsOptional, IsString, IsUrl, Matches, MaxLength, MinLength } from 'class-validator'
import { Gender, Role, UserStatus } from 'core/constants/enum'
import { IsEnumWithMessage } from 'core/decorators/is-enum-with-message.decorator'

export class CreateUserDto {
  @IsEmail({}, { message: 'email không đúng định dạng' })
  @IsNotEmpty({ message: 'email không được  bỏ trống' })
  email: string

  @MaxLength(40, { message: 'password không được vượt quá 40 kí tự' })
  @MinLength(8, { message: 'password phải có ít nhất 8 kí tự' })
  @IsString({ message: 'password phải là kiểu dữ liệu là string' })
  @IsNotEmpty({ message: 'password không được bỏ trống' })
  password: string

  @MaxLength(40, { message: 'fullname không được vượt quá 40 kí tự' })
  @MinLength(1, { message: 'password phải có ít nhất 1 kí tự' })
  @IsString({ message: 'fullname phải là kiểu dữ liệu là string' })
  @IsNotEmpty({ message: 'fullname không được bỏ trống' })
  fullName: string

  //  @MaxLength(40, { message: 'fullname không được vượt quá 40 kí tự' })
  // @MinLength(1, { message: 'password phải có ít nhất 1 kí tự' })
  @IsString({ message: 'code phải là kiểu dữ liệu là string' })
  @IsOptional()
  code?: string

  @Matches(/(84|0[3|5|7|8|9])+([0-9]{8})\b/g, { message: 'phoneNumber không đúng định dạng' })
  @IsString({ message: 'phoneNumber phải là kiểu dữ liệu là string' })
  @IsOptional()
  phoneNumber?: string

  @IsEnumWithMessage(UserStatus)
  @IsOptional()
  status?: UserStatus

  @IsUrl({}, { message: 'avatarUrl phải là định dạng url' })
  @IsString({ message: 'avatarUrl phải là kiểu dữ liệu là string' })
  @IsOptional()
  avatarUrl?: string

  @IsEnumWithMessage(Role)
  @IsOptional()
  role?: Role

  @IsEnumWithMessage(Gender)
  @IsOptional()
  gender?: Gender
}
