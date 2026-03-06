import {
  Body,
  Controller,
  Delete,
  HttpCode,
  HttpStatus,
  Post,
  Query,
  UploadedFile,
  UploadedFiles,
  UseInterceptors
} from '@nestjs/common'
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express'
import { MAX_FILE_COUNT } from './upload.constants'
import { UploadService } from './upload.service'
import { FileValidationPipe } from 'core/pipes/file-validation.pipe'
import { CloudinaryUploadResult } from 'domains/upload/interface/upload.interface'

@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  // ───  Single File Upload ──────────────────────────────────────────

  /**
   * Accepts a single file under the field name "file".
   * Multer writes it to disk → service streams from disk → Cloudinary.
   * Temp file is deleted in a finally block after upload completes.
   *
   * multipart/form-data  field: file
   */
  @Post('single')
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(FileInterceptor('file'))
  async uploadSingle(
    @UploadedFile(new FileValidationPipe()) file: Express.Multer.File,
    @Query('folder') folder?: string
  ): Promise<CloudinaryUploadResult> {
    return this.uploadService.uploadSingle(file, folder)
  }

  // ─── Broker: Multiple Files Upload ───────────────────────────────────────

  /**
   * Accepts up to MAX_FILE_COUNT files under the field name "files".
   * All files are uploaded concurrently; each temp file is cleaned up
   * individually after its own upload completes.
   *
   * multipart/form-data  field: files (array)
   */
  @Post('multiple')
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(FilesInterceptor('files', MAX_FILE_COUNT))
  uploadMultiple(
    @UploadedFiles(new FileValidationPipe()) files: Express.Multer.File[],
    @Query('folder') folder?: string
  ): Promise<CloudinaryUploadResult[]> {
    return this.uploadService.uploadMultiple(files, folder)
  }

  // ─── Delete Asset ─────────────────────────────────────────────────────────

  /**
   * Deletes an asset from Cloudinary by its public_id.
   *
   * Body (JSON):
   *   { "publicId": "uploads/abc123", "resourceType": "image" }
   *
   * resourceType is optional — defaults to "image".
   * Pass "video" or "raw" for other asset types.
   */
  @Delete()
  @HttpCode(HttpStatus.OK)
  async deleteFile(
    @Body('publicId') publicId: string,
    @Body('resourceType') resourceType?: 'image' | 'video' | 'raw'
  ): Promise<{ message: string }> {
    return this.uploadService.deleteFile(publicId, resourceType)
  }
}
