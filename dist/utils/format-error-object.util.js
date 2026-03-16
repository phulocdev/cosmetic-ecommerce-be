"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractErrorMessageFromDto = void 0;
const extractErrorMessageFromDto = (errors) => {
    const messages = [];
    errors.forEach((error) => {
        if (error.constraints) {
            messages.push(...Object.values(error.constraints));
        }
        if (error.children && error.children.length > 0) {
            messages.push(...(0, exports.extractErrorMessageFromDto)(error.children));
        }
    });
    return messages;
};
exports.extractErrorMessageFromDto = extractErrorMessageFromDto;
//# sourceMappingURL=format-error-object.util.js.map