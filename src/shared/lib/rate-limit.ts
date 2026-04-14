import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';
import { logger } from '@/shared/lib/logger';

let ratelimit: Ratelimit | null = null;

const RATE_LIMIT_CONFIG_ERROR =
  'Rate limiting is not configured: set UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN.';

function getLimiter(): Ratelimit | null {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) {
    if (process.env.NODE_ENV === 'production') {
      throw new Error(RATE_LIMIT_CONFIG_ERROR);
    }
    return null;
  }
  ratelimit ??= new Ratelimit({
    redis: new Redis({ url, token }),
    limiter: Ratelimit.slidingWindow(30, '1 m'),
    analytics: true,
    prefix: 'planrelay',
  });
  return ratelimit;
}

export async function enforceRateLimit(key: string): Promise<void> {
  const limiter = getLimiter();
  if (!limiter) {
    return;
  }
  const { success } = await limiter.limit(key);
  if (!success) {
    logger.warn({ key }, 'Rate limit exceeded');
    throw new Error('Too many requests. Try again shortly.');
  }
}
