import Redis from 'ioredis'

export interface AcquireOptions {
  /** Lock TTL in ms. Watchdog will renew at ttl/3 intervals. Default: 10_000 */
  ttl?: number
  /** Max total time (ms) to wait before throwing LockTimeoutError. Default: 30_000 */
  timeout?: number
  /** Max retry attempts (-1 = unlimited until timeout). Default: -1 */
  maxRetries?: number
  /** Base jitter delay in ms for exponential backoff. Default: 50 */
  retryDelay?: number
}

export interface LockHandle {
  token: string
  watchdogTimer: NodeJS.Timeout
  subscriberClient: Redis
}
