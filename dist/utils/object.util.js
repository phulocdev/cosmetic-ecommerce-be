"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isEmptyObject = isEmptyObject;
function isEmptyObject(obj) {
    for (const prop in obj) {
        if (Object.hasOwn(obj, prop)) {
            return false;
        }
    }
    return true;
}
//# sourceMappingURL=object.util.js.map