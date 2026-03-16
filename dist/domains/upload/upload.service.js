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
var UploadService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.UploadService = void 0;
const common_1 = require("@nestjs/common");
const cloudinary_1 = require("cloudinary");
const fs = __importStar(require("fs"));
const upload_constants_1 = require("./upload.constants");
let UploadService = UploadService_1 = class UploadService {
    logger = new common_1.Logger(UploadService_1.name);
    async uploadSingle(file, folder = upload_constants_1.CLOUDINARY_FOLDER) {
        const tempPath = file.path;
        try {
            const result = await this.streamFromDisk(tempPath, folder);
            return this.mapResult(file, result);
        }
        finally {
            await this.deleteTempFile(tempPath);
        }
    }
    async uploadMultiple(files, folder = upload_constants_1.CLOUDINARY_FOLDER) {
        return Promise.all(files.map((file) => this.uploadSingle(file, folder)));
    }
    async deleteFile(publicId, resourceType = 'image') {
        try {
            const result = await cloudinary_1.v2.uploader.destroy(publicId, {
                resource_type: resourceType
            });
            if (result.result === 'not found') {
                throw new common_1.NotFoundException(`Asset with public_id "${publicId}" was not found on Cloudinary.`);
            }
            if (result.result !== 'ok') {
                throw new common_1.InternalServerErrorException(`Cloudinary returned an unexpected result: ${result.result}`);
            }
            this.logger.log(`Deleted Cloudinary asset: ${publicId}`);
            return { message: `Asset "${publicId}" deleted successfully.` };
        }
        catch (err) {
            if (err instanceof common_1.NotFoundException || err instanceof common_1.InternalServerErrorException) {
                throw err;
            }
            this.logger.error(`Failed to delete asset ${publicId}`, err);
            throw new common_1.InternalServerErrorException('An error occurred while deleting the file.');
        }
    }
    streamFromDisk(tempPath, folder) {
        return new Promise((resolve, reject) => {
            const uploadStream = cloudinary_1.v2.uploader.upload_stream({
                folder,
                resource_type: 'auto',
                allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'pdf', 'mp4', 'webm'],
                invalidate: true
            }, (error, result) => {
                if (error || !result) {
                    this.logger.error('Cloudinary upload failed', error);
                    return reject(new common_1.InternalServerErrorException(error?.message ?? 'Cloudinary upload failed.'));
                }
                resolve(result);
            });
            fs.createReadStream(tempPath).pipe(uploadStream);
        });
    }
    async deleteTempFile(filePath) {
        try {
            await fs.promises.unlink(filePath);
            this.logger.debug(`Deleted temp file: ${filePath}`);
        }
        catch (err) {
            this.logger.warn(`Could not delete temp file ${filePath}: ${err.message}`);
        }
    }
    mapResult(file, result) {
        return {
            publicId: result.public_id,
            url: result.secure_url,
            originalName: file.originalname,
            size: file.size,
            format: result.format,
            width: result.width,
            height: result.height
        };
    }
};
exports.UploadService = UploadService;
exports.UploadService = UploadService = UploadService_1 = __decorate([
    (0, common_1.Injectable)()
], UploadService);
//# sourceMappingURL=upload.service.js.map