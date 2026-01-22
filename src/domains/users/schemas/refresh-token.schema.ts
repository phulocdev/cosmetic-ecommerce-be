import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import mongoose, { Types } from 'mongoose'

export type RefreshTokenDocument = mongoose.HydratedDocument<RefreshToken>

@Schema({ collection: 'RefreshTokens', versionKey: false, timestamps: true })
export class RefreshToken {
  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true })
  user: Types.ObjectId

  @Prop({ required: true, type: String, unique: true, index: true })
  value: string

  @Prop({
    required: true,
    type: Date,
    index: { expireAfterSeconds: 0 }
  })
  expiresAt: Date

  // @Prop({
  //   required: false,
  //   type: String,
  //   default: ''
  // })
  // createdByIp: string

  // @Prop({
  //   required: false,
  //   type: String,
  //   default: ''
  // })
  // deviceInfo: string

  // @Prop({
  //   type: Number,
  //   enum: RefreshTokenStatus,
  //   default: RefreshTokenStatus.ACTIVE
  // })
  // status: RefreshTokenStatus

  // @Prop({
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: 'RefreshToken'
  // })
  // replacedByToken?: Types.ObjectId
}

export const RefreshTokenSchema = SchemaFactory.createForClass(RefreshToken)
