import { ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator'

@ValidatorConstraint({ name: 'IsUniqueArray', async: false })
export class IsUniqueArrayConstraint implements ValidatorConstraintInterface {
  validate(value: any[], args: ValidationArguments) {
    if (!Array.isArray(value)) return false
    return new Set(value).size === value.length
  }

  defaultMessage(args: ValidationArguments) {
    return args.constraints[0] || `Danh sách không được chứa các giá trị trùng lặp`
  }
}
