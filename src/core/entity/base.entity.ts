import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { Exclude, Expose, Type } from 'class-transformer'

@Exclude()
export class BaseEntity {
  @Expose()
  @ApiProperty({ description: 'Unique identifier' })
  id: string

  @Expose()
  @ApiProperty({ description: 'Creation timestamp' })
  createdAt: Date

  @Expose()
  @ApiProperty({ description: 'Last update timestamp' })
  updatedAt: Date

  @Expose()
  @ApiPropertyOptional({ description: 'Deletion timestamp', nullable: true })
  deletedAt?: Date | null

  @Expose()
  @ApiPropertyOptional({ description: 'Soft deletion flag' })
  isDeleted?: boolean

  constructor(partial: Partial<BaseEntity>) {
    Object.assign(this, partial)
  }
}
