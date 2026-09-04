import "server-only";

import { createClient } from "redis";

type Bucket = {
  count: number;
  resetAt: number;
};

const buckets = new Map<string, Bucket>();
let redisClient: ReturnType<typeof createClient> | null = null;

async function getRedisClient() {
  const url = process.env.REDIS_URL;
  if (!url) return null;

  if (!redisClient) {
    redisClient = createClient({ url });
    redisClient.on("error", (error) => {
      console.error("Contact rate-limit Redis error", error instanceof Error ? error.message : "Unknown error");
    });
  }

  if (!redisClient.isOpen) {
    await redisClient.connect();
  }

  return redisClient;
}

export async function checkRateLimit({
  key,
  namespace,
  maxRequests,
  windowMs,
}: {
  key: string;
  namespace: string;
  maxRequests: number;
  windowMs: number;
}) {
  const redis = await getRedisClient();
  if (redis) {
    const redisKey = `${namespace}:${key}`;
    const count = await redis.incr(redisKey);

    if (count === 1) {
      await redis.pExpire(redisKey, windowMs);
    }

    return { allowed: count <= maxRequests };
  }

  const now = Date.now();
  const memoryKey = `${namespace}:${key}`;
  const bucket = buckets.get(memoryKey);

  if (!bucket || bucket.resetAt <= now) {
    buckets.set(memoryKey, { count: 1, resetAt: now + windowMs });
    return { allowed: true };
  }

  if (bucket.count >= maxRequests) {
    return { allowed: false };
  }

  bucket.count += 1;
  return { allowed: true };
}

export async function checkContactRateLimit(key: string) {
  return checkRateLimit({
    key,
    namespace: "contact-rate-limit",
    maxRequests: 5,
    windowMs: 10 * 60 * 1000,
  });
}
