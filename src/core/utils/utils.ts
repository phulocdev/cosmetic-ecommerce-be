import { ValidationError } from 'class-validator'
import { UnprocessableEntityError } from 'core/exceptions/errors.exception'

export const extractErrorMessageFromDto = (errors: ValidationError[]): string[] => {
  const messages: string[] = []

  errors.forEach((error) => {
    if (error.constraints) {
      messages.push(...Object.values(error.constraints))
    }
    if (error.children && error.children.length > 0) {
      messages.push(...extractErrorMessageFromDto(error.children))
    }
  })
  return messages
}

export function isEmptyObject(obj: object) {
  for (const prop in obj) {
    if (Object.hasOwn(obj, prop)) {
      return false
    }
  }
  return true
}

export const generateSkuCode = () => {
  const randomNumber = Math.floor(100000000 + Math.random() * 900000000)
  return `SKU${randomNumber}`
}

export const validateLoginBody = async (email: string, password: string) => {
  if (!email || !/\S+@\S+\.\S+/.test(email)) {
    throw new UnprocessableEntityError([{ message: 'Email không hợp lệ', field: 'email' }])
  }

  if (!password || password.length < 8) {
    throw new UnprocessableEntityError([{ message: 'Mật khẩu phải có ít nhất  ký tự', field: 'password' }])
  }
}
