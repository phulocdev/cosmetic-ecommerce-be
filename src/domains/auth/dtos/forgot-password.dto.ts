import { IsEmail, IsNotEmpty } from 'class-validator'

export class ForgotPasswordDto {
  @IsEmail({}, { message: 'email không đúng định dạng' })
  @IsNotEmpty({
    message: 'email không được để trống'
  })
  email: string
}
