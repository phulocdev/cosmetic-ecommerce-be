const UPLOAD_CONFIG = {
  UPLOAD_PATH: 'uploads',
  MAX_SINGLE_FILE_SIZE: 5 * 1024 * 1024, // 5MB,
  MAX_COUNT_FILES: 2,
  ALLOWED_FILE_TYPES: ['image/jpg', 'image/jpeg', 'image/png'],
  TEMP_UPLOAD_DIR: 'tmp/uploads'
} as const

export { UPLOAD_CONFIG }
