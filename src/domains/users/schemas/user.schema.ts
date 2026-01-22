import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { EmailVerificationStatus, Gender, Role, UserStatus } from 'core/constants/enum'
import * as mongoose from 'mongoose'

export type UserDocument = mongoose.HydratedDocument<User>

@Schema({ timestamps: true, versionKey: false, collection: 'Users' })
export class User {
  @Prop({ required: true, index: true, unique: true, type: String })
  email: string

  @Prop({ required: true, type: String })
  password: string

  @Prop({ required: false, type: String, default: '' })
  code: string

  @Prop({ required: true, type: String })
  fullName: string

  @Prop({ required: false, default: '', type: String })
  phoneNumber: string

  @Prop({ required: false, type: Number, enum: UserStatus, default: UserStatus.ACTIVE })
  status: UserStatus

  @Prop({ required: false, type: String, default: '' })
  avatarUrl: string

  @Prop({ required: false, type: Number, enum: Role, default: Role.CUSTOMER })
  role: Role

  @Prop({ required: false, type: Number, enum: Gender, default: Gender.UNSET })
  gender: Gender

  @Prop({ required: false, type: Number, enum: EmailVerificationStatus, default: EmailVerificationStatus.UNVERIFIED })
  isEmailVerified: EmailVerificationStatus

  @Prop({ required: false, type: String, default: '' })
  verifyEmailToken: string

  @Prop({ required: false, type: String, default: '' })
  resetPasswordToken: string // Forgot Password Flow | Can return Expire Message or Invalid Token
}

export const UserSchema = SchemaFactory.createForClass(User)
