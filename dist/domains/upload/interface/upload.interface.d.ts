export interface CloudinaryUploadResult {
    publicId: string;
    url: string;
    originalName: string;
    size: number;
    format: string;
    width?: number;
    height?: number;
}
export declare class DeleteFileDto {
    publicId: string;
}
