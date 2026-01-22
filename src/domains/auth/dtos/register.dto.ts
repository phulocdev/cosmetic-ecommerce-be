import { Transform, Type } from 'class-transformer'
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
  ValidateNested
} from 'class-validator'
import { Gender } from 'core/constants/enum'
import { IsEnumWithMessage } from 'core/decorators/is-enum-with-message.decorator'
import { CreateAddressDto } from 'domains/addresses/dto/create-address.dto'
import { AddressPayloadDto } from 'domains/auth/dtos/address-payload.dto'

export class RegisterDto {
  @IsEmail({}, { message: 'email không đúng định dạng' })
  @IsNotEmpty({ message: 'email không được  bỏ trống' })
  email: string

  @MaxLength(40, { message: 'password không được vượt quá 40 kí tự' })
  @MinLength(8, { message: 'password phải có ít nhất 8 kí tự' })
  @IsString({ message: 'password phải là kiểu dữ liệu là string' })
  @IsNotEmpty({ message: 'password không được bỏ trống' })
  password: string

  @MaxLength(40, { message: 'fullname không được vượt quá 40 kí tự' })
  @IsString({ message: 'fullname phải là kiểu dữ liệu là string' })
  @MinLength(1, { message: 'fullname phải có ít nhất 1 kí tự' })
  @IsNotEmpty({ message: 'fullname không được bỏ trống' })
  fullName: string

  // NOTE: VALIDATE NESTED OBJECT IN PAYLOAD BODY
  @Type(() => AddressPayloadDto)
  @ValidateNested()
  @IsObject({ message: 'address phải là dạng Object' })
  @IsOptional()
  address?: AddressPayloadDto | undefined

  @Matches(/(84|0[3|5|7|8|9])+([0-9]{8})\b/g, { message: 'phoneNumber không đúng định dạng' })
  @IsString({ message: 'phoneNumber phải là kiểu dữ liệu là string' })
  @IsOptional()
  phoneNumber?: string

  @IsEnumWithMessage(Gender)
  @IsOptional()
  gender?: Gender
}

// @Transform(({ value }) => typeof value === 'string' ? value.trim() : value)
