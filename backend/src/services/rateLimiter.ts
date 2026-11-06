import { redisConnection } from '../config/redis';

export async function checkAndIncrementRateLimit(senderEmail: string, limit: number): Promise<{ allowed: boolean; retryDelayMs: number }> {
  const currentHour = Math.floor(Date.now() / (1000 * 60 * 60));
  const redisKey = `ratelimit:${senderEmail}:${currentHour}`;

  const currentCount = await redisConnection.incr(redisKey);
  if (currentCount === 1) {
    await redisConnection.expire(redisKey, 3600); // 1 hour TTL
  }

  if (currentCount > limit) {
    const nextHourTimestamp = (currentHour + 1) * 60 * 60 * 1000;
    const retryDelayMs = nextHourTimestamp - Date.now();
    return { allowed: false, retryDelayMs };
  }

  return { allowed: true, retryDelayMs: 0 };
}