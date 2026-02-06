import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { UserRole, User } from '@prisma/client'
import { Exclude, Expose } from 'class-transformer'
import { BaseEntity } from 'core'

@Exclude()
export class UserEntity extends BaseEntity {
  @Expose()
  @ApiProperty({ description: 'Email address' })
  email: string

  @Exclude()
  password: string

  @Expose()
  @ApiPropertyOptional({ description: 'Unique code' })
  code?: string | null

  @Expose()
  @ApiProperty({ description: 'Full name' })
  fullName: string

  @Expose()
  @ApiProperty({ description: 'Phone number' })
  phoneNumber: string

  @Expose()
  @ApiProperty({ description: 'Is the user active?' })
  isActive: boolean

  @Expose()
  @ApiProperty({ description: 'Avatar URL' })
  avatarUrl: string

  @Expose()
  @ApiProperty({ description: 'User role', enum: UserRole })
  role: UserRole

  constructor(partial: Partial<UserEntity & BaseEntity>) {
    super(partial)
    Object.assign(this, partial)
  }
}
