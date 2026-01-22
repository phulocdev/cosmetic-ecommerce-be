import { AddressStatus, EmailVerificationStatus, Gender, UserStatus } from 'core/constants/enum'

declare global {
  type AuthTokenPayload = {
    _id: string | mongoose.Types.ObjectId
    email: string
    role: Role
    isEmailVerified: EmailVerificationStatus
    iat: number
    exp: number
  }

  type UserType = {
    _id: string | mongoose.Types.ObjectId
    email: string
    role: Role
    isEmailVerified: EmailVerificationStatus
    // phoneNumber: string
    // fullName: string
    // avatarUrl: string
    // status: UserStatus,
    // gender: Gender
  }

  type QueryType = {
    [key: string]: string
  }

  type GenerateEntityCodePayload = {
    prefixCode: string
    counterName: string
    maxLength: number
  }

  type CreateRefreshTokenPayload = {
    user: string
    expiresAt: Date
    value: string
  }
}

export {}
