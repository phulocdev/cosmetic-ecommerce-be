import { Type } from 'class-transformer'
import { IsEnum, IsInt, IsOptional, IsString } from 'class-validator'
import { Role } from 'core/constants/enum'

export class UserQueryDto {
  @IsString({ message: 'sort phải là định dạng chuỗi' })
  @IsOptional()
  @Type(() => String)
  sort?: string

  @IsString({ message: 'email phải là định dạng chuỗi' })
  @IsOptional()
  @Type(() => String)
  email?: string

  @IsString({ message: 'fullName phải là định dạng chuỗi' })
  @IsOptional()
  @Type(() => String)
  fullName?: string

  @IsString({ message: 'phoneNumber phải là định dạng chuỗi' })
  @IsOptional()
  @Type(() => String)
  phoneNumber?: string

  @IsInt({ message: 'isActive phải là 0 || 1' })
  @IsOptional()
  @Type(() => Number)
  isActive?: number

  @IsString({ message: 'address phải là định dạng chuỗi' })
  @IsOptional()
  @Type(() => String)
  address?: string

  @IsEnum(Role, { message: 'role phải là một trong các giá trị hợp lệ của Role' })
  @IsOptional()
  @Type(() => String)
  role?: Role
}
