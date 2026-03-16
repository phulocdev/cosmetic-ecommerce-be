import { UploadService } from './upload.service';
import { CloudinaryUploadResult } from 'domains/upload/interface/upload.interface';
export declare class UploadController {
    private readonly uploadService;
    constructor(uploadService: UploadService);
    uploadSingle(file: Express.Multer.File, folder?: string): Promise<CloudinaryUploadResult>;
    uploadMultiple(files: Express.Multer.File[], folder?: string): Promise<CloudinaryUploadResult[]>;
    deleteFile(publicId: string, resourceType?: 'image' | 'video' | 'raw'): Promise<{
        message: string;
    }>;
}
