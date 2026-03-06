import * as path from 'path'
import * as os from 'os'

export const MAX_FILE_SIZE = 50 * 1024 * 1024

/** Maximum number of files allowed in a multi-upload request */
export const MAX_FILE_COUNT = 10

/** Allowed MIME types — extend as needed */
export const ALLOWED_MIME_TYPES: readonly string[] = [
  // Images
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
  'image/svg+xml',
  // Documents
  'application/pdf',
  // Video
  'video/mp4',
  'video/webm'
]

/**
 * Magic-byte signatures used for content-type verification.
 * Key   → MIME type
 * Value → list of accepted byte-sequence prefixes (as hex strings)
 *
 * Checking magic bytes prevents a malicious user from simply
 * renaming "evil.exe" to "photo.jpg".
 *
 * NOTE: With diskStorage, we read only the first 8 bytes from the temp
 * file for this check — avoiding full file reads into memory.
 */
export const MAGIC_BYTES: Record<string, string[]> = {
  'image/jpeg': ['ffd8ff'],
  'image/png': ['89504e47'],
  'image/gif': ['47494638'],
  'image/webp': ['52494646'], // RIFF header — further validation in service
  'application/pdf': ['25504446'], // %PDF
  'video/mp4': ['00000018', '00000020', '66747970'], // ftyp variations
  'video/webm': ['1a45dfa3']
}

/** Cloudinary folder where uploads are stored */
export const CLOUDINARY_FOLDER = 'uploads'

/**
 * Absolute path to the temporary directory where Multer (diskStorage) writes
 * files before they are streamed to Cloudinary.
 *
 * Uses the OS temp dir so no manual directory creation is required.
 * Change to a custom path (e.g. '/var/app/tmp/uploads') if preferred.
 */
// export const TEMP_UPLOAD_DIR = path.join(os.tmpdir(), 'pploc-uploads')
export const TEMP_UPLOAD_DIR = path.join(process.env.UPLOAD_DEST || './uploads')

/**
 * How old (in milliseconds) a temp file must be before the cron job
 * considers it orphaned and deletes it.
 *
 * Default: 1 hour. This covers the case where Cloudinary rejected an upload
 * and the normal cleanup path was skipped.
 */
export const TEMP_FILE_MAX_AGE_MS = 60 * 60 * 1000 // 1 hour

/**
 * Cron expression for the orphan-cleanup job.
 * Default: every 30 minutes.
 * Adjust via the UPLOAD_CLEANUP_CRON env var.
 */
export const CLEANUP_CRON_EXPRESSION = process.env.UPLOAD_CLEANUP_CRON ?? '0 */30 * * * *'
