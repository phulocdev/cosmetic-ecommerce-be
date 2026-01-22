import { IsEmail, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator'

export class ResetPasswordDto {
  @IsEmail({}, { message: 'email không đúng định dạng' })
  @IsNotEmpty({
    message: 'email không được để trống'
  })
  email: string

  @IsString({
    message: 'password không đúng định dạng'
  })
  @IsNotEmpty({
    message: 'password không được để trống'
  })
  password: string

  @IsNumber({}, { message: 'otpCode không đúng định dạng' })
  @IsNotEmpty({
    message: 'otpCode không được để trống'
  })
  otpCode: number
}
