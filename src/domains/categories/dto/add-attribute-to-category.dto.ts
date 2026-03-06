import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IsBoolean, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, Min } from 'class-validator'
import { FilterDisplayType } from 'enums'

export class CategoryAttributeBaseDto {
  @ApiPropertyOptional({ example: 'uuid-attribute', description: 'Attribute ID' })
  @IsString({ message: 'Attribute ID must be a string' })
  @IsOptional()
  attributeId?: string

  @ApiPropertyOptional({ example: 'Color', description: 'Display name for the attribute' })
  @IsString({ message: 'Display name must be a string' })
  @IsOptional()
  displayName?: string

  @ApiPropertyOptional({ example: 1, description: 'Display order' })
  @IsNumber({}, { message: 'Display order must be a number' })
  @Min(0, { message: 'Display order must be at least 0' })
  @IsOptional()
  displayOrder?: number

  // @ApiPropertyOptional({ example: 'CHECKBOX', description: 'Filter type' })
  // @IsString({ message: 'Filter type must be a string' })
  // @IsIn(['CHECKBOX', 'RADIO', 'SLIDER', 'SWATCH', 'DROPDOWN', 'TOGGLE'], {
  //   message: 'Filter type must be one of the allowed values'
  // })
  // @IsOptional()
  // filterType?: 'CHECKBOX' | 'RADIO' | 'SLIDER' | 'SWATCH' | 'DROPDOWN' | 'TOGGLE'

  @IsEnum(FilterDisplayType, { message: 'Status must be a valid ProductStatus' })
  @IsOptional()
  filterType?: FilterDisplayType

  @ApiPropertyOptional({ example: true, description: 'Whether the attribute is filterable' })
  @IsBoolean({ message: 'isFilterable must be a boolean value' })
  @IsOptional()
  isFilterable?: boolean

  @ApiPropertyOptional({ example: false, description: 'Whether the attribute is required' })
  @IsBoolean({ message: 'isRequired must be a boolean value' })
  @IsOptional()
  isRequired?: boolean

  @ApiPropertyOptional({ example: true, description: 'Whether to inherit to children' })
  @IsBoolean({ message: 'inheritToChildren must be a boolean value' })
  @IsOptional()
  inheritToChildren?: boolean
}

export class AddAttributeToCategoryDto extends CategoryAttributeBaseDto {
  @ApiProperty({ example: 'uuid-attribute', description: 'Attribute ID' })
  @IsString({ message: 'Attribute ID must be a string' })
  @IsNotEmpty({ message: 'Attribute ID is required' })
  declare attributeId: string
}
