import { Module } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { MulterModule } from '@nestjs/platform-express'
import { FileValidationPipe } from 'core/pipes/file-validation.pipe'
import { CloudinaryProvider } from 'domains/upload/cloudinary.provider'
import { TempFileCleanupService } from 'domains/upload/file-cleanup.service'
import * as fs from 'fs'
import { diskStorage } from 'multer'
import * as path from 'path'
import { v4 as uuidv4 } from 'uuid'
import { UploadController } from './upload.controller'
import { UploadService } from './upload.service'
import { TEMP_UPLOAD_DIR } from 'domains/upload/upload.constants'

if (!fs.existsSync(TEMP_UPLOAD_DIR)) {
  fs.mkdirSync(TEMP_UPLOAD_DIR, { recursive: true })
}

@Module({
  imports: [
    /**
     * diskStorage writes each uploaded file to TEMP_UPLOAD_DIR under a
     * unique UUID filename. The service streams from disk to Cloudinary,
     * then deletes the temp file immediately on success.
     *
     * If Cloudinary rejects the upload the temp file is left on disk.
     * TempFileCleanupService runs on a cron schedule to sweep those orphans.
     */
    MulterModule.register({
      storage: diskStorage({
        destination: (_req, _file, cb) => cb(null, TEMP_UPLOAD_DIR),
        filename: (_req, file, cb) => {
          const ext = path.extname(file.originalname).toLowerCase()
          cb(null, `${uuidv4()}${ext}`)
        }
      })
    })
  ],
  controllers: [UploadController],
  providers: [UploadService, TempFileCleanupService, CloudinaryProvider, FileValidationPipe],
  exports: [UploadService]
})
export class UploadModule {}
