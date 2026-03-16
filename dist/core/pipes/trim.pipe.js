"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TrimPipe = void 0;
const common_1 = require("@nestjs/common");
let TrimPipe = class TrimPipe {
    transform(value, metadata) {
        if (typeof value === 'string') {
            return value.trim();
        }
        if (typeof value === 'object' && value !== null) {
            return this.trimObject(value);
        }
        return value;
    }
    trimObject(obj) {
        const trimmed = {};
        for (const [key, value] of Object.entries(obj)) {
            if (typeof value === 'string') {
                trimmed[key] = value.trim();
            }
            else if (Array.isArray(value)) {
                trimmed[key] = value.map((item) => (typeof item === 'string' ? item.trim() : item));
            }
            else if (typeof value === 'object' && value !== null) {
                trimmed[key] = this.trimObject(value);
            }
            else {
                trimmed[key] = value;
            }
        }
        return trimmed;
    }
};
exports.TrimPipe = TrimPipe;
exports.TrimPipe = TrimPipe = __decorate([
    (0, common_1.Injectable)()
], TrimPipe);
//# sourceMappingURL=trim.pipe.js.map