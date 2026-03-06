import {
  IsDateString,
  IsOptional,
  ValidateIf,
  registerDecorator,
  ValidationOptions,
  ValidationArguments
} from 'class-validator'

export function IsBeforeDate(property: string, options?: ValidationOptions) {
  return (object: object, propertyName: string) => {
    registerDecorator({
      name: 'isBeforeDate',
      target: object.constructor,
      propertyName,
      constraints: [property],
      options,
      validator: {
        validate(value: string, args: ValidationArguments) {
          const [relatedProp] = args.constraints
          const relatedValue = (args.object as Record<string, string>)[relatedProp]
          if (!value || !relatedValue) return true
          return new Date(value) <= new Date(relatedValue)
        },
        defaultMessage: () => '`from` must be before or equal to `to`'
      }
    })
  }
}
