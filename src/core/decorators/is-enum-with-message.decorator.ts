// validators/is-enum-with-message.decorator.ts
import { registerDecorator, ValidationOptions, ValidationArguments } from 'class-validator'

export interface IsEnumWithMessageOptions {
  display?: 'number' | 'string' // Mặc định: 'number'
  message?: string // Tùy chọn message có thể chứa placeholder {values}
}

export function IsEnumWithMessage(
  enumObj: object,
  options?: IsEnumWithMessageOptions,
  validationOptions?: ValidationOptions
) {
  const displayType = options?.display || 'number'

  const getEnumValues = (): (string | number)[] => {
    return Object.values(enumObj).filter((v) =>
      displayType === 'number' ? typeof v === 'number' : typeof v === 'string'
    )
  }

  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isEnumWithMessage',
      target: object.constructor,
      propertyName: propertyName,
      options: {
        ...validationOptions,
        message:
          options?.message?.replace('{values}', getEnumValues().join(', ')) ??
          `\`${propertyName}\` phải là một trong các giá trị: ${getEnumValues().join(', ')}`
      },
      constraints: [enumObj],
      validator: {
        validate(value: any, args: ValidationArguments) {
          const [enumObj] = args.constraints
          return Object.values(enumObj).includes(value)
        }
      }
    })
  }
}
