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
exports.CLEANUP_CRON_EXPRESSION = exports.TEMP_FILE_MAX_AGE_MS = exports.TEMP_UPLOAD_DIR = exports.CLOUDINARY_FOLDER = exports.MAGIC_BYTES = exports.ALLOWED_MIME_TYPES = exports.MAX_FILE_COUNT = exports.MAX_FILE_SIZE = void 0;
const path = __importStar(require("path"));
exports.MAX_FILE_SIZE = 50 * 1024 * 1024;
exports.MAX_FILE_COUNT = 10;
exports.ALLOWED_MIME_TYPES = [
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp',
    'image/svg+xml',
    'application/pdf',
    'video/mp4',
    'video/webm'
];
exports.MAGIC_BYTES = {
    'image/jpeg': ['ffd8ff'],
    'image/png': ['89504e47'],
    'image/gif': ['47494638'],
    'image/webp': ['52494646'],
    'application/pdf': ['25504446'],
    'video/mp4': ['00000018', '00000020', '66747970'],
    'video/webm': ['1a45dfa3']
};
exports.CLOUDINARY_FOLDER = 'uploads';
exports.TEMP_UPLOAD_DIR = path.join(process.env.UPLOAD_DEST || './uploads');
exports.TEMP_FILE_MAX_AGE_MS = 60 * 60 * 1000;
exports.CLEANUP_CRON_EXPRESSION = process.env.UPLOAD_CLEANUP_CRON ?? '0 */30 * * * *';
//# sourceMappingURL=upload.constants.js.map