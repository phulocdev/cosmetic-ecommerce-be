import { IsNotEmpty, IsOptional, IsString, MaxLength, MinLength } from 'class-validator'
import { AddressStatus } from 'core/constants/enum'
import { IsEnumWithMessage } from 'core/decorators/is-enum-with-message.decorator'

export class AddressPayloadDto {
  @MaxLength(30, { message: 'address.province không được vượt quá 30 kí tự' })
  @IsString({ message: 'address.province phải là kiểu dữ liệu là string' })
  @MinLength(3, { message: 'address.province phải có ít nhất 3 kí tự' })
  @IsNotEmpty({ message: 'address.province không được bỏ trống' })
  province: string

  @MaxLength(45, { message: 'address.district không được vượt quá 45 kí tự' })
  @IsString({ message: 'address.district phải là kiểu dữ liệu là string' })
  @MinLength(3, { message: 'address.district phải có ít nhất 3 kí tự' })
  @IsNotEmpty({ message: 'address.district không được bỏ trống' })
  district: string

  @MaxLength(40, { message: 'address.ward không được vượt quá 40 kí tự' })
  @IsString({ message: 'address.ward phải là kiểu dữ liệu là string' })
  @MinLength(3, { message: 'address.ward phải có ít nhất 3 kí tự' })
  @IsNotEmpty({ message: 'address.ward không được bỏ trống' })
  ward: string

  @MaxLength(80, { message: 'address.streetAddress không được vượt quá 80 kí tự' })
  @IsString({ message: 'address.streetAddress phải là kiểu dữ liệu là string' })
  @MinLength(3, { message: 'address.streetAddress phải có ít nhất 3 kí tự' })
  @IsNotEmpty({ message: 'address.streetAddress không được bỏ trống' })
  streetAddress: string

  @IsEnumWithMessage(AddressStatus, { message: 'address.isDefault phải là một trong các giá trị sau: {values}' })
  @IsOptional()
  isDefault?: AddressStatus
}
