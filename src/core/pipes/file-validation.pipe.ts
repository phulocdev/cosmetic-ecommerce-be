import { Injectable, PipeTransform, BadRequestException } from '@nestjs/common'
import {
  ALLOWED_MIME_TYPES,
  MAGIC_BYTES,
  MAX_FILE_COUNT,
  MAX_FILE_SIZE
} from 'domains/upload/upload.constants'
import * as fs from 'fs'

/**
 * FileValidationPipe
 *
 * Validates one or more uploaded files (written to disk by diskStorage)
 * before they reach the service layer.
 *
 * Checks performed:
 *   1. At least one file was provided
 *   2. File count does not exceed MAX_FILE_COUNT
 *   3. Each file's declared MIME type is in the allow-list
 *   4. Each file's actual content (magic bytes) matches its MIME type
 *      — reads only the first 8 bytes from disk (no full file in memory)
 *   5. Each file's size is within MAX_FILE_SIZE
 *
 * Usage:
 *   @UploadedFile(new FileValidationPipe())
 *   @UploadedFiles(new FileValidationPipe())
 */
@Injectable()
export class FileValidationPipe
  implements PipeTransform<Express.Multer.File | Express.Multer.File[]>
{
  transform(
    value: Express.Multer.File | Express.Multer.File[] | undefined
  ): Express.Multer.File | Express.Multer.File[] {
    if (!value || (Array.isArray(value) && value.length === 0)) {
      throw new BadRequestException('No file(s) provided.')
    }

    const files = Array.isArray(value) ? value : [value]

    if (files.length > MAX_FILE_COUNT) {
      throw new BadRequestException(`Too many files. Maximum allowed: ${MAX_FILE_COUNT}.`)
    }

    for (const file of files) {
      this.validateFile(file)
    }

    return value
  }

  // ─── Private Helpers ──────────────────────────────────────────────────────

  private validateFile(file: Express.Multer.File): void {
    this.checkMimeType(file)
    this.checkMagicBytes(file)
    this.checkFileSize(file)
  }

  /** Ensure the declared MIME type is on the allow-list */
  private checkMimeType(file: Express.Multer.File): void {
    if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
      this.cleanupFile(file)
      throw new BadRequestException(
        `File type "${file.mimetype}" is not allowed. ` +
          `Accepted types: ${ALLOWED_MIME_TYPES.join(', ')}.`
      )
    }
  }

  /**
   * Reads only the first 8 bytes from the temp file on disk to verify
   * the magic-byte signature. This avoids loading the full file into memory.
   *
   * Falls back gracefully if the MIME type has no magic-byte entry (e.g. SVG).
   */
  private checkMagicBytes(file: Express.Multer.File): void {
    const signatures = MAGIC_BYTES[file.mimetype]
    if (!signatures) {
      // No binary signature for this type (e.g. SVG is XML text) — skip
      return
    }

    // Read only first 8 bytes from disk — no full file buffer in memory
    const fd = fs.openSync(file.path, 'r')
    const headerBuf = Buffer.alloc(8)
    fs.readSync(fd, headerBuf, 0, 8, 0)
    fs.closeSync(fd)

    const fileHex = headerBuf.toString('hex').toLowerCase()
    const isValid = signatures.some((sig) => fileHex.startsWith(sig))

    if (!isValid) {
      this.cleanupFile(file)
      throw new BadRequestException(
        `File "${file.originalname}" content does not match its declared ` +
          `type "${file.mimetype}". Possible malicious upload detected.`
      )
    }
  }

  /** Enforce maximum file size */
  private checkFileSize(file: Express.Multer.File): void {
    if (file.size > MAX_FILE_SIZE) {
      const limitMB = (MAX_FILE_SIZE / (1024 * 1024)).toFixed(0)
      const fileMB = (file.size / (1024 * 1024)).toFixed(2)
      this.cleanupFile(file)
      throw new BadRequestException(
        `File "${file.originalname}" is too large (${fileMB} MB). ` +
          `Maximum allowed size: ${limitMB} MB.`
      )
    }
  }

  /**
   * Deletes the temp file from disk when validation fails.
   * This prevents orphan files accumulating from rejected uploads.
   * Errors are swallowed — the cron job handles any stragglers.
   */
  private cleanupFile(file: Express.Multer.File): void {
    if (file.path) {
      try {
        fs.unlinkSync(file.path)
      } catch {
        // Intentionally ignored — cron sweep will handle it
      }
    }
  }
}
