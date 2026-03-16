import { CloudinaryUploadResult } from 'domains/upload/interface/upload.interface';
export declare class UploadService {
    private readonly logger;
    uploadSingle(file: Express.Multer.File, folder?: string): Promise<CloudinaryUploadResult>;
    uploadMultiple(files: Express.Multer.File[], folder?: string): Promise<CloudinaryUploadResult[]>;
    deleteFile(publicId: string, resourceType?: 'image' | 'video' | 'raw'): Promise<{
        message: string;
    }>;
    private streamFromDisk;
    deleteTempFile(filePath: string): Promise<void>;
    private mapResult;
}
