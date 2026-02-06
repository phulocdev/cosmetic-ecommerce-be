import { ValidationError } from 'class-validator'

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
