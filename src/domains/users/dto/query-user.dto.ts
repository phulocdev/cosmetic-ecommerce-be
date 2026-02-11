import { ApiPropertyOptional } from '@nestjs/swagger'
import { IsBoolean, IsEmail, IsEnum, IsOptional, IsString } from 'class-validator'
import { PaginationQueryDto } from 'core'
import { UserRole } from 'enums'

/**
 * Request DTO for querying users with pagination
 */
export class UserQueryDto extends PaginationQueryDto {
  @ApiPropertyOptional({
    example: 'cotton shirt',
    description: 'Search in product name, description, or code'
  })
  @IsString({ message: 'Search query must be a string' })
  @IsOptional()
  search?: string

  @ApiPropertyOptional({
    example: 'user@example.com',
    description: 'Filter by email address'
  })
  @IsEmail({}, { message: 'Invalid email format' })
  @IsOptional()
  email?: string

  @ApiPropertyOptional({
    example: 'USER123',
    description: 'Filter by user code'
  })
  @IsString({ message: 'Code must be a string' })
  @IsOptional()
  code?: string

  @ApiPropertyOptional({
    example: 'John Doe',
    description: 'Filter by full name'
  })
  @IsString({ message: 'Full name must be a string' })
  @IsOptional()
  fullName?: string

  @ApiPropertyOptional({
    example: '+1234567890',
    description: 'Filter by phone number'
  })
  @IsString({ message: 'Phone number must be a string' })
  @IsOptional()
  phoneNumber?: string

  @ApiPropertyOptional({
    example: true,
    description: 'Filter by active status'
  })
  @IsBoolean({ message: 'isActive must be a boolean value' })
  @IsOptional()
  isActive?: boolean

  @ApiPropertyOptional({
    enum: UserRole,
    enumName: 'UserRole',
    example: UserRole.ADMIN
  })
  @IsEnum(UserRole, {
    message: `Role must be a valid UserRole: ${Object.values(UserRole).join(', ')}`
  })
  @IsOptional()
  role?: UserRole
}
