import { PipeTransform } from '@nestjs/common';
export declare class FileValidationPipe implements PipeTransform<Express.Multer.File | Express.Multer.File[]> {
    transform(value: Express.Multer.File | Express.Multer.File[] | undefined): Express.Multer.File | Express.Multer.File[];
    private validateFile;
    private checkMimeType;
    private checkMagicBytes;
    private checkFileSize;
    private cleanupFile;
}
