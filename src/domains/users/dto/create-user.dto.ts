import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { Transform } from 'class-transformer'
import {
  IsBoolean,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  MaxLength,
  MinLength
} from 'class-validator'
import { UserRole } from 'enums'

export class CreateUserDto {
  @ApiProperty({ example: 'user@example.com', description: 'User email address' })
  @IsEmail({}, { message: 'Email must be a valid email address' })
  @IsNotEmpty({ message: 'Email is required' })
  email: string

  @ApiProperty({ example: 'password123', description: 'User password' })
  @IsString({ message: 'Password must be a string' })
  @IsNotEmpty({ message: 'Password is required' })
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  password: string

  @IsOptional()
  @IsString({ message: 'Code must be a string' })
  @MaxLength(50, { message: 'Code must be at most 50 characters long' })
  code?: string

  @ApiPropertyOptional({ example: 'John Doe', description: 'User full name' })
  @IsString({ message: 'Full name must be a string' })
  @IsOptional()
  @MaxLength(255, { message: 'Full name must be at most 255 characters long' })
  fullName?: string

  @ApiPropertyOptional({ example: '+1234567890', description: 'User phone number' })
  @IsString({ message: 'Phone number must be a string' })
  @IsOptional()
  @MaxLength(20, { message: 'Phone number must be at most 20 characters long' })
  phoneNumber?: string

  @ApiPropertyOptional({ example: true, description: 'Whether user is active', default: true })
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean()
  @IsOptional()
  isActive?: boolean

  @ApiPropertyOptional({
    example: 'https://example.com/avatar.jpg',
    description: 'User avatar URL'
  })
  @IsUrl({}, { message: 'Avatar URL must be a valid URL' })
  @IsOptional()
  avatarUrl?: string

  @IsOptional()
  @IsEnum(UserRole, { message: 'Role must be a valid UserRole' })
  role?: UserRole

  @ApiPropertyOptional({ example: 'facebook123', description: 'Facebook user ID' })
  @IsString({ message: 'Facebook ID must be a string' })
  @IsOptional()
  facebookId?: string

  @ApiPropertyOptional({ example: 'google456', description: 'Google user ID' })
  @IsString({ message: 'Google ID must be a string' })
  @IsOptional()
  googleId?: string
}
