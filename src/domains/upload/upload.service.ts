import { Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common'
import { v2 as cloudinary, UploadApiResponse } from 'cloudinary'
import * as fs from 'fs'
import { CLOUDINARY_FOLDER } from './upload.constants'
import { CloudinaryUploadResult } from 'domains/upload/interface/upload.interface'

@Injectable()
export class UploadService {
  private readonly logger = new Logger(UploadService.name)

  // ─── Single Upload (diskStorage → stream from disk → Cloudinary) ─────────

  /**
   * Streams a single temp file from disk to Cloudinary, then immediately
   * deletes the temp file regardless of success or failure.
   *
   * Flow:
   *   Multer writes to TEMP_UPLOAD_DIR
   *   → this method opens a read-stream from disk
   *   → pipes into cloudinary.upload_stream
   *   → deletes temp file in a finally block
   */
  async uploadSingle(
    file: Express.Multer.File,
    folder = CLOUDINARY_FOLDER
  ): Promise<CloudinaryUploadResult> {
    const tempPath = file.path // absolute path written by diskStorage

    try {
      const result = await this.streamFromDisk(tempPath, folder)
      return this.mapResult(file, result)
    } finally {
      // Always clean up — even if Cloudinary threw an error
      await this.deleteTempFile(tempPath)
    }
  }

  // ─── Multiple Upload ─────────────────────────────────────────────────────

  /**
   * Uploads multiple temp files concurrently.
   * Each individual upload cleans up its own temp file in its finally block.
   */
  async uploadMultiple(
    files: Express.Multer.File[],
    folder = CLOUDINARY_FOLDER
  ): Promise<CloudinaryUploadResult[]> {
    return Promise.all(files.map((file) => this.uploadSingle(file, folder)))
  }

  // ─── Delete from Cloudinary ───────────────────────────────────────────────

  /**
   * Removes an asset from Cloudinary by its public_id.
   * @param publicId      The public_id returned at upload time.
   * @param resourceType  'image' | 'video' | 'raw' — defaults to 'image'.
   */
  async deleteFile(
    publicId: string,
    resourceType: 'image' | 'video' | 'raw' = 'image'
  ): Promise<{ message: string }> {
    try {
      const result = await cloudinary.uploader.destroy(publicId, {
        resource_type: resourceType
      })

      if (result.result === 'not found') {
        throw new NotFoundException(
          `Asset with public_id "${publicId}" was not found on Cloudinary.`
        )
      }

      if (result.result !== 'ok') {
        throw new InternalServerErrorException(
          `Cloudinary returned an unexpected result: ${result.result}`
        )
      }

      this.logger.log(`Deleted Cloudinary asset: ${publicId}`)
      return { message: `Asset "${publicId}" deleted successfully.` }
    } catch (err) {
      if (err instanceof NotFoundException || err instanceof InternalServerErrorException) {
        throw err
      }
      this.logger.error(`Failed to delete asset ${publicId}`, err)
      throw new InternalServerErrorException('An error occurred while deleting the file.')
    }
  }

  // ─── Private Helpers ─────────────────────────────────────────────────────

  /**
   * Opens a read-stream from the temp file path and pipes it into
   * Cloudinary's upload_stream. No bytes are loaded into the heap.
   */
  private streamFromDisk(tempPath: string, folder: string): Promise<UploadApiResponse> {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder,
          resource_type: 'auto',
          allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'pdf', 'mp4', 'webm'],
          invalidate: true
        },
        (error, result) => {
          if (error || !result) {
            this.logger.error('Cloudinary upload failed', error)
            return reject(
              new InternalServerErrorException(error?.message ?? 'Cloudinary upload failed.')
            )
          }
          resolve(result)
        }
      )

      // Stream directly from disk — no Buffer in memory
      fs.createReadStream(tempPath).pipe(uploadStream)
    })
  }

  /**
   * Deletes a single temp file from disk.
   * Errors are logged but not re-thrown — the upload result is unaffected.
   * The cron job acts as a safety net if this somehow fails.
   */
  async deleteTempFile(filePath: string): Promise<void> {
    try {
      await fs.promises.unlink(filePath)
      this.logger.debug(`Deleted temp file: ${filePath}`)
    } catch (err) {
      this.logger.warn(`Could not delete temp file ${filePath}: ${(err as any).message}`)
    }
  }

  /** Maps a Cloudinary API response to our clean return type */
  private mapResult(file: Express.Multer.File, result: UploadApiResponse): CloudinaryUploadResult {
    return {
      publicId: result.public_id,
      url: result.secure_url,
      originalName: file.originalname,
      size: file.size,
      format: result.format,
      width: result.width,
      height: result.height
    }
  }
}
