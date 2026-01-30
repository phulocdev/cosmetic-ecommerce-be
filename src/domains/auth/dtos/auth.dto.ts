import { IsEmail, IsString, MinLength, IsOptional, IsNotEmpty, Matches, MaxLength, IsJWT } from 'class-validator'

export class RegisterDto {
  @IsEmail({}, { message: 'Invalid email format' })
  @IsNotEmpty({ message: 'Email is required' })
  email: string

  @MaxLength(50, { message: 'Password must not exceed 50 characters' })
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  @IsString({ message: 'Password must be a string' })
  @IsNotEmpty({ message: 'Password is required' })
  password: string

  @IsString({ message: 'Full name must be a string' })
  @IsOptional()
  fullName?: string

  @Matches(/(84|0[3|5|7|8|9])+([0-9]{8})\b/g, { message: 'Phone number is not in the correct format' })
  @IsString({ message: 'Phone number must be a string' })
  @IsOptional()
  phoneNumber?: string
}

export class LoginDto {
  @IsEmail({}, { message: 'Invalid email format' })
  @IsNotEmpty({ message: 'Email is required' })
  email: string

  @IsString({ message: 'Password must be a string' })
  @IsNotEmpty({ message: 'Password is required' })
  password: string
}

export class RefreshTokenDto {
  @IsJWT({ message: 'Invalid refresh token format' })
  @IsNotEmpty({ message: 'Refresh token is required' })
  refreshToken: string
}
