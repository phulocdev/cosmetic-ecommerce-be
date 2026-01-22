import { OmitType, PartialType } from '@nestjs/mapped-types'
import { IsBoolean, IsOptional } from 'class-validator'
import { CreateUserDto } from 'domains/users/dto/create-user.dto'

export class UpdateUserDto extends OmitType(PartialType(CreateUserDto), [] as const) {
  @IsBoolean()
  @IsOptional()
  isGuest?: boolean

  @IsBoolean()
  @IsOptional()
  isChangePhoneNumber?: boolean

  @IsBoolean()
  @IsOptional()
  isChangeEmail?: boolean
}
