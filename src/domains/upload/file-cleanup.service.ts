import { Injectable, Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config/dist/config.service'
import { Cron } from '@nestjs/schedule'
import {
  CLEANUP_CRON_EXPRESSION,
  TEMP_FILE_MAX_AGE_MS,
  TEMP_UPLOAD_DIR
} from 'domains/upload/upload.constants'
import * as fs from 'fs'
import * as path from 'path'

/**
 * TempFileCleanupService
 *
 * Why this exists
 * ───────────────
 * When a file is uploaded via the broker endpoints (POST /upload/single or
 * POST /upload/multiple), Multer (diskStorage) writes it to TEMP_UPLOAD_DIR
 * and the service streams it to Cloudinary from disk.
 *
 * Normally, the service deletes the temp file in its `finally` block right
 * after the Cloudinary call resolves or rejects. However there are edge cases
 * where the temp file can be orphaned:
 *
 *   - Cloudinary request times out before the finally block runs
 *   - The Node process is killed mid-upload (SIGKILL, OOM)
 *   - The pipe unexpectedly drops without triggering the error callback
 *   - Validation rejects a file but the fs.unlinkSync in the pipe failed
 *
 * This service runs on a cron schedule and sweeps any file older than
 * TEMP_FILE_MAX_AGE_MS (default: 1 hour) from TEMP_UPLOAD_DIR, ensuring
 * the disk never accumulates leftover uploads.
 *
 * Schedule
 * ────────
 * Controlled by CLEANUP_CRON_EXPRESSION (default: every 30 minutes).
 * Override via the UPLOAD_CLEANUP_CRON env var.
 */
@Injectable()
export class TempFileCleanupService {
  private readonly logger = new Logger(TempFileCleanupService.name)
  constructor(private readonly configService: ConfigService) {}

  @Cron(CLEANUP_CRON_EXPRESSION)
  async sweepOrphanedTempFiles(): Promise<void> {
    this.logger.log('Running orphaned temp file sweep...')

    // Guard: if the directory doesn't exist yet, nothing to sweep
    if (!fs.existsSync(TEMP_UPLOAD_DIR)) {
      this.logger.debug(`Temp dir does not exist yet: ${TEMP_UPLOAD_DIR}`)
      return
    }

    let entries: fs.Dirent[]
    try {
      entries = fs.readdirSync(TEMP_UPLOAD_DIR, { withFileTypes: true })
    } catch (err) {
      this.logger.error(`Failed to read temp dir: ${(err as any).message}`)
      return
    }

    const now = Date.now()
    let deleted = 0
    let failed = 0

    for (const entry of entries) {
      // Only target regular files — ignore subdirectories
      if (!entry.isFile()) continue

      const filePath = path.join(TEMP_UPLOAD_DIR, entry.name)

      try {
        const stat = fs.statSync(filePath)
        const ageMs = now - stat.mtimeMs

        if (ageMs >= TEMP_FILE_MAX_AGE_MS) {
          fs.unlinkSync(filePath)
          deleted++
          this.logger.debug(
            `Deleted orphaned temp file: ${entry.name} ` +
              `(age: ${(ageMs / 1000 / 60).toFixed(1)} min)`
          )
        }
      } catch (err) {
        failed++
        this.logger.warn(`Could not process temp file ${entry.name}: ${(err as any).message}`)
      }
    }

    this.logger.log(
      `Sweep complete — deleted: ${deleted}, failed: ${failed}, ` +
        `skipped: ${entries.filter((e) => e.isFile()).length - deleted - failed}`
    )
  }
}
