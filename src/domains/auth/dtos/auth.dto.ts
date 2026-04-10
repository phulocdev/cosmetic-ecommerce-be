import { Type } from 'class-transformer'
import {
  IsEmail,
  IsString,
  MinLength,
  IsOptional,
  IsNotEmpty,
  Matches,
  MaxLength,
  IsJWT,
  IsHash
} from 'class-validator'

/**
 * Strong password regex: at least 1 uppercase, 1 lowercase, 1 digit, 1 special character
 */
const STRONG_PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
const STRONG_PASSWORD_MESSAGE =
  'Password must contain at least 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character (@$!%*?&)'

export class RegisterDto {
  @IsEmail({}, { message: 'Invalid email format' })
  @IsNotEmpty({ message: 'Email is required' })
  email: string

  @Matches(STRONG_PASSWORD_REGEX, { message: STRONG_PASSWORD_MESSAGE })
  @MaxLength(50, { message: 'Password must not exceed 50 characters' })
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  @IsString({ message: 'Password must be a string' })
  @Type(() => String)
  @IsNotEmpty({ message: 'Password is required' })
  password: string

  @IsString({ message: 'Full name must be a string' })
  @IsOptional()
  fullName?: string

  @Matches(/(84|0[3|5|7|8|9])+([0-9]{8})\b/g, {
    message: 'Phone number is not in the correct format'
  })
  @IsString({ message: 'Phone number must be a string' })
  @IsOptional()
  phoneNumber?: string
}

export class LoginDto {
  @IsEmail({}, { message: 'Invalid email format' })
  @IsNotEmpty({ message: 'Email is required' })
  email: string

  @IsString({ message: 'Password must be a string' })
  @Type(() => String)
  @IsNotEmpty({ message: 'Password is required' })
  password: string
}

export class RefreshTokenDto {
  @IsJWT({ message: 'Invalid refresh token format' })
  @IsNotEmpty({ message: 'Refresh token is required' })
  refreshToken: string
}

export class ChangePasswordDto {
  @IsString({ message: 'Current password must be a string' })
  @IsNotEmpty({ message: 'Current password is required' })
  currentPassword: string

  @Matches(STRONG_PASSWORD_REGEX, { message: STRONG_PASSWORD_MESSAGE })
  @MaxLength(50, { message: 'New password must not exceed 50 characters' })
  @MinLength(8, { message: 'New password must be at least 8 characters long' })
  @IsString({ message: 'New password must be a string' })
  @IsNotEmpty({ message: 'New password is required' })
  newPassword: string

  @IsJWT({ message: 'Invalid refresh token format' })
  @IsNotEmpty({ message: 'Refresh token is required' })
  refreshToken: string
}

export class ForgotPasswordDto {
  @IsEmail({}, { message: 'Invalid email format' })
  @IsNotEmpty({ message: 'Email is required' })
  email: string
}

export class ResetPasswordDto {
  @IsHash('sha256', { message: 'Invalid reset token format' })
  @IsNotEmpty({ message: 'Reset token is required' })
  resetToken: string

  @Matches(STRONG_PASSWORD_REGEX, { message: STRONG_PASSWORD_MESSAGE })
  @MaxLength(50, { message: 'New password must not exceed 50 characters' })
  @MinLength(8, { message: 'New password must be at least 8 characters long' })
  @IsString({ message: 'New password must be a string' })
  @IsNotEmpty({ message: 'New password is required' })
  newPassword: string
}
