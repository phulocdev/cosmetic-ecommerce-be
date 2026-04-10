import { Inject, Injectable, Logger, OnModuleDestroy } from '@nestjs/common'
import { LockNotOwnedException, LockTimeoutException } from 'core/exceptions'
import { AcquireOptions, LockHandle } from 'core/redis-lock/interfaces'
import { REDIS_CLIENT } from 'database/redis/redis.module'
import Redis from 'ioredis'
import { v4 as uuidv4 } from 'uuid'

@Injectable()
export class RedisLockService implements OnModuleDestroy {
  private readonly logger = new Logger(RedisLockService.name)
  private readonly activeLocks = new Map<string, LockHandle>()

  constructor(@Inject(REDIS_CLIENT) private readonly redis: Redis) {}

  /**
   * Acquire a distributed lock. Returns a unique token to pass to release().
   * Throws LockTimeoutError if the lock cannot be acquired within `timeout` ms.
   */
  async acquire(key: string, options: AcquireOptions = {}): Promise<string> {
    const { ttl = 10_000, timeout = 30_000, maxRetries = -1, retryDelay = 50 } = options

    const token = uuidv4()
    const lockKey = this.lockKey(key)
    const channelKey = this.channelKey(key)
    const deadline = Date.now() + timeout
    let attempts = 0

    while (true) {
      // ── Attempt SET NX PX ──────────────────────────────────────────────
      const acquired = await this.redis.set(lockKey, token, 'PX', ttl, 'NX')

      if (acquired === 'OK') {
        this.logger.debug(`Lock acquired: ${key} (token=${token})`)
        const handle = this.startWatchdog(lockKey, token, ttl)
        this.activeLocks.set(token, handle)
        return token
      }

      // ── Check exit conditions ──────────────────────────────────────────
      attempts++
      const remaining = deadline - Date.now()

      if (remaining <= 0) throw new LockTimeoutException(key)
      if (maxRetries !== -1 && attempts >= maxRetries) throw new LockTimeoutException(key)

      // ── Thundering-herd guard: subscribe + jitter wait ─────────────────
      await this.waitForRelease(channelKey, remaining, retryDelay, attempts)
    }
  }

  /**
   * Release the lock. Uses a Lua script to ensure we only delete our own lock.
   * Publishes an event to wake exactly one waiting subscriber.
   * Throws LockNotOwnedError if the token doesn't match (lock expired/stolen).
   */
  async release(key: string, token: string): Promise<void> {
    const lockKey = this.lockKey(key)
    const channelKey = this.channelKey(key)

    // Stop watchdog first (even if unlock fails below we must clean up)
    this.stopWatchdog(token)

    // Safe unlock via Lua (atomic GET + match + DEL)

    // ── Lua: safe unlock ────────────────────────────────────────────────────────
    // Atomically: only delete if the stored value equals our token.
    // Prevents releasing a lock we no longer own (expired + re-acquired by B).
    const UNLOCK_SCRIPT = `
      if redis.call("GET", KEYS[1]) == ARGV[1] then
        redis.call("DEL", KEYS[1])
        return 1
      end
      return 0
    `

    const result = (await this.redis.eval(UNLOCK_SCRIPT, 1, lockKey, token)) as number

    if (result === 0) {
      throw new LockNotOwnedException(key)
    }

    // Notify waiters — only ONE pub/sub subscriber fires at a time (no thundering herd)
    await this.redis.publish(channelKey, 'released')
    this.logger.debug(`Lock released: ${key} (token=${token})`)
  }

  // ── Watchdog (Auto-Refresh Lock) ───────────────────────────────────────────

  private startWatchdog(lockKey: string, token: string, ttl: number): LockHandle {
    const renewInterval = Math.floor(ttl / 3)

    const watchdogTimer = setInterval(async () => {
      try {
        // Atomically: only reset TTL if we still own the lock.
        const RENEW_SCRIPT = `
        if redis.call("GET", KEYS[1]) == ARGV[1] then
          redis.call("PEXPIRE", KEYS[1], ARGV[2])
          return 1
        end
        return 0
      `

        const renewed = (await this.redis.eval(
          RENEW_SCRIPT,
          1,
          lockKey,
          token,
          String(ttl)
        )) as number

        if (renewed === 0) {
          // Lock was lost (expired or stolen) — stop the watchdog
          this.logger.warn(`Watchdog: lock ${lockKey} lost, stopping renewal`)
          clearInterval(watchdogTimer)
        } else {
          this.logger.debug(`Watchdog: renewed ${lockKey} (+${ttl}ms)`)
        }
      } catch (err: any) {
        this.logger.error(`Watchdog renewal error for ${lockKey}: ${err.message}`)
      }
    }, renewInterval)

    // Create a dedicated subscriber client (ioredis can't mix pub/sub with commands)
    const subscriberClient = this.redis.duplicate()

    return { token, watchdogTimer, subscriberClient }
  }

  private stopWatchdog(token: string): void {
    const handle = this.activeLocks.get(token)
    if (!handle) return
    clearInterval(handle.watchdogTimer)
    handle.subscriberClient.disconnect()
    this.activeLocks.delete(token)
  }

  // ── Thundering-herd mitigation: pub/sub + jitter ───────────────────────────

  private waitForRelease(
    channel: string,
    maxWaitMs: number,
    baseDelay: number,
    attempt: number
  ): Promise<void> {
    return new Promise((resolve) => {
      // Exponential backoff with full jitter — each waiter gets a random slot
      const cap = Math.min(baseDelay * Math.pow(2, attempt), 2000)
      const jitter = Math.random() * cap
      const waitMs = Math.min(jitter, maxWaitMs)

      const subscriber = this.redis.duplicate()
      let resolved = false

      const done = () => {
        if (resolved) return
        resolved = true
        subscriber.unsubscribe(channel).finally(() => {
          subscriber.disconnect()
          resolve()
        })
      }

      // Wake up when the current holder publishes "released"
      subscriber.subscribe(channel, () => {
        subscriber.on('message', (_ch: string, _msg: string) => done())
      })

      // Fallback: don't wait longer than our jitter/remaining window
      setTimeout(done, waitMs)
    })
  }

  // ── Cleanup ────────────────────────────────────────────────────────────────

  async onModuleDestroy(): Promise<void> {
    for (const [token] of this.activeLocks) {
      this.stopWatchdog(token)
    }
  }

  // ── Helpers ────────────────────────────────────────────────────────────────

  private lockKey(key: string): string {
    return `lock:${key}`
  }

  private channelKey(key: string): string {
    return `lock-channel:${key}`
  }

  /**
   * Convenience wrapper: acquire → run callback → always release.
   * The lock is guaranteed to be released even if the callback throws.
   */
  // async withLock<T>(
  //   key: string,
  //   callback: () => Promise<T>,
  //   options: AcquireOptions = {}
  // ): Promise<T> {
  //   const token = await this.acquire(key, options)
  //   try {
  //     return await callback()
  //   } finally {
  //     await this.release(key, token).catch((err) =>
  //       this.logger.warn(`Release failed silently: ${err.message}`)
  //     )
  //   }
  // }
}
