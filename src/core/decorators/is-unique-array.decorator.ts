import { registerDecorator } from 'class-validator'
import { IsUniqueArrayConstraint } from 'core/validators/is-unique-array.validator'
import { ValidationOptions } from 'joi'

export function IsUniqueArray(message?: string, validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: { message, ...validationOptions },
      constraints: [message],
      validator: IsUniqueArrayConstraint
    })
  }
}
