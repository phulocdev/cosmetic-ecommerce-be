"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileValidationPipe = void 0;
const common_1 = require("@nestjs/common");
const upload_constants_1 = require("../../domains/upload/upload.constants");
const fs = __importStar(require("fs"));
let FileValidationPipe = class FileValidationPipe {
    transform(value) {
        if (!value || (Array.isArray(value) && value.length === 0)) {
            throw new common_1.BadRequestException('No file(s) provided.');
        }
        const files = Array.isArray(value) ? value : [value];
        if (files.length > upload_constants_1.MAX_FILE_COUNT) {
            throw new common_1.BadRequestException(`Too many files. Maximum allowed: ${upload_constants_1.MAX_FILE_COUNT}.`);
        }
        for (const file of files) {
            this.validateFile(file);
        }
        return value;
    }
    validateFile(file) {
        this.checkMimeType(file);
        this.checkMagicBytes(file);
        this.checkFileSize(file);
    }
    checkMimeType(file) {
        if (!upload_constants_1.ALLOWED_MIME_TYPES.includes(file.mimetype)) {
            this.cleanupFile(file);
            throw new common_1.BadRequestException(`File type "${file.mimetype}" is not allowed. ` +
                `Accepted types: ${upload_constants_1.ALLOWED_MIME_TYPES.join(', ')}.`);
        }
    }
    checkMagicBytes(file) {
        const signatures = upload_constants_1.MAGIC_BYTES[file.mimetype];
        if (!signatures) {
            return;
        }
        const fd = fs.openSync(file.path, 'r');
        const headerBuf = Buffer.alloc(8);
        fs.readSync(fd, headerBuf, 0, 8, 0);
        fs.closeSync(fd);
        const fileHex = headerBuf.toString('hex').toLowerCase();
        const isValid = signatures.some((sig) => fileHex.startsWith(sig));
        if (!isValid) {
            this.cleanupFile(file);
            throw new common_1.BadRequestException(`File "${file.originalname}" content does not match its declared ` +
                `type "${file.mimetype}". Possible malicious upload detected.`);
        }
    }
    checkFileSize(file) {
        if (file.size > upload_constants_1.MAX_FILE_SIZE) {
            const limitMB = (upload_constants_1.MAX_FILE_SIZE / (1024 * 1024)).toFixed(0);
            const fileMB = (file.size / (1024 * 1024)).toFixed(2);
            this.cleanupFile(file);
            throw new common_1.BadRequestException(`File "${file.originalname}" is too large (${fileMB} MB). ` +
                `Maximum allowed size: ${limitMB} MB.`);
        }
    }
    cleanupFile(file) {
        if (file.path) {
            try {
                fs.unlinkSync(file.path);
            }
            catch {
            }
        }
    }
};
exports.FileValidationPipe = FileValidationPipe;
exports.FileValidationPipe = FileValidationPipe = __decorate([
    (0, common_1.Injectable)()
], FileValidationPipe);
//# sourceMappingURL=file-validation.pipe.js.map