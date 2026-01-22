import { Transform } from 'class-transformer'
import { IsNotEmpty, IsString } from 'class-validator'

export class RefreshTokenDto {
  @IsString({ message: 'refreshToken phải là kiểu dữ liệu là string' })
  @IsNotEmpty({ message: 'refreshToken không được bỏ trống' })
  @Transform(({ value }) => String(value).trim())
  refreshToken: string
}
