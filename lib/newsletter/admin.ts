import "server-only";

import { randomUUID } from "crypto";
import { createClient } from "redis";

type AccessTokenRecord = {
  token: string;
  expiresAt: number;
  attempts: number;
};

const tokenStore = new Map<string, AccessTokenRecord>();
const sessionStore = new Map<string, number>();
let redisClient: ReturnType<typeof createClient> | null = null;

async function getRedisClient() {
  const url = process.env.REDIS_URL;
  if (!url) return null;

  if (!redisClient) {
    redisClient = createClient({ url });
    redisClient.on("error", (error) => {
      console.error("Newsletter admin Redis error", error instanceof Error ? error.message : "Unknown error");
    });
  }

  if (!redisClient.isOpen) {
    await redisClient.connect();
  }

  return redisClient;
}

function safeEqual(a: string, b: string) {
  if (a.length !== b.length) return false;

  let result = 0;
  for (let index = 0; index < a.length; index += 1) {
    result |= a.charCodeAt(index) ^ b.charCodeAt(index);
  }

  return result === 0;
}

function getClientIp(request: Request) {
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) return forwardedFor.split(",")[0]?.trim() || "unknown";
  return request.headers.get("x-real-ip") || "unknown";
}

export function getNewsletterAdminEmail() {
  return process.env.NEWSLETTER_ADMIN_EMAIL || process.env.EMAIL_TO || "support@fashiongatemall.com";
}

export function generateNewsletterAccessToken() {
  return `FGM-${randomUUID().replace(/-/g, "").slice(0, 12).toUpperCase()}`;
}

export async function storeNewsletterAccessToken(request: Request, token: string) {
  const key = `newsletter-admin-token:${getClientIp(request)}`;
  const record: AccessTokenRecord = {
    token,
    expiresAt: Date.now() + 10 * 60 * 1000,
    attempts: 0,
  };
  const redis = await getRedisClient();

  if (redis) {
    await redis.set(key, JSON.stringify(record), { EX: 10 * 60 });
    return;
  }

  tokenStore.set(key, record);
}

export async function verifyNewsletterAccessToken(request: Request, token: string) {
  const key = `newsletter-admin-token:${getClientIp(request)}`;
  const redis = await getRedisClient();
  const rawRecord = redis ? await redis.get(key) : tokenStore.get(key);
  const record = typeof rawRecord === "string" ? (JSON.parse(rawRecord) as AccessTokenRecord) : rawRecord;

  if (!record || record.expiresAt < Date.now() || record.attempts >= 5) {
    return "";
  }

  if (!safeEqual(record.token, token)) {
    const nextRecord = { ...record, attempts: record.attempts + 1 };
    if (redis) {
      await redis.set(key, JSON.stringify(nextRecord), { EX: Math.max(60, Math.ceil((record.expiresAt - Date.now()) / 1000)) });
    } else {
      tokenStore.set(key, nextRecord);
    }
    return "";
  }

  if (redis) {
    await redis.del(key);
  } else {
    tokenStore.delete(key);
  }

  return createNewsletterAdminSession();
}

async function createNewsletterAdminSession() {
  const token = randomUUID();
  const expiresAt = Date.now() + 7 * 24 * 60 * 60 * 1000;
  const redis = await getRedisClient();

  if (redis) {
    await redis.set(`newsletter-admin-session:${token}`, String(expiresAt), { EX: 7 * 24 * 60 * 60 });
  } else {
    sessionStore.set(token, expiresAt);
  }

  return token;
}

export async function isAuthorizedNewsletterAdmin(request: Request) {
  const legacyToken = process.env.NEWSLETTER_ADMIN_TOKEN;
  const submittedLegacyToken = request.headers.get("x-newsletter-admin-token") || "";
  if (legacyToken && safeEqual(submittedLegacyToken, legacyToken)) return true;

  const sessionToken = request.headers.get("x-newsletter-admin-session") || "";
  if (!sessionToken) return false;

  const redis = await getRedisClient();
  const rawExpiresAt = redis
    ? await redis.get(`newsletter-admin-session:${sessionToken}`)
    : sessionStore.get(sessionToken);
  const expiresAt = typeof rawExpiresAt === "string" ? Number(rawExpiresAt) : rawExpiresAt;

  if (!expiresAt || expiresAt < Date.now()) {
    if (redis) {
      await redis.del(`newsletter-admin-session:${sessionToken}`);
    } else {
      sessionStore.delete(sessionToken);
    }
    return false;
  }

  return true;
}

export function unauthorizedResponse() {
  return Response.json({ success: false, message: "Unauthorized." }, { status: 401 });
}
