"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IsBeforeDate = IsBeforeDate;
const class_validator_1 = require("class-validator");
function IsBeforeDate(property, options) {
    return (object, propertyName) => {
        (0, class_validator_1.registerDecorator)({
            name: 'isBeforeDate',
            target: object.constructor,
            propertyName,
            constraints: [property],
            options,
            validator: {
                validate(value, args) {
                    const [relatedProp] = args.constraints;
                    const relatedValue = args.object[relatedProp];
                    if (!value || !relatedValue)
                        return true;
                    return new Date(value) <= new Date(relatedValue);
                },
                defaultMessage: () => '`from` must be before or equal to `to`'
            }
        });
    };
}
//# sourceMappingURL=is-before-date.decorator.js.map