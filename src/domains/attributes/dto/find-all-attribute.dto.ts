import { ApiPropertyOptional } from '@nestjs/swagger'
import { Transform } from 'class-transformer'
import { IsBoolean, IsOptional, IsUUID } from 'class-validator'
import { PaginationQueryDto } from 'core'

export class FindAllAttributeDto extends PaginationQueryDto {
  @ApiPropertyOptional({ example: true, description: 'Filter by deleted status' })
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean()
  getAll?: boolean

  @IsUUID('4', { message: 'Category ID must be a valid UUID' })
  @IsOptional()
  categoryId?: string
}
