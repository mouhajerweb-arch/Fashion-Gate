import { createHash, randomUUID } from "crypto";
import { NextResponse } from "next/server";
import { createClient } from "@sanity/client";
import { z } from "zod";
import { sendNewsletterWelcomeEmail } from "@/lib/email/send-newsletter-welcome-email";
import { checkRateLimit } from "@/lib/rate-limit/contact";
import { apiVersion, dataset, projectId } from "@/lib/sanity";

const MAX_BODY_BYTES = 10 * 1024;

const writeClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
  token: process.env.SANITY_API_WRITE_TOKEN || process.env.SANITY_API_TOKEN,
});

const subscribeSchema = z.object({
  email: z.string().trim().email().max(160).transform((value) => value.toLowerCase()),
  source: z.string().trim().max(80).optional(),
  pageUrl: z.string().trim().url().max(500).optional().or(z.literal("")),
  language: z.enum(["en", "ar"]).optional(),
  companyWebsite: z.string().trim().max(200).optional().or(z.literal("")),
}).strict();

function json(success: boolean, message: string, status: number, code?: string) {
  return NextResponse.json({ success, message, code }, { status });
}

function getClientIp(request: Request) {
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) return forwardedFor.split(",")[0]?.trim() || "unknown";
  return request.headers.get("x-real-ip") || "unknown";
}

function isAllowedOrigin(request: Request) {
  const origin = request.headers.get("origin");
  if (!origin) return true;

  try {
    const originUrl = new URL(origin);

    if (
      process.env.NODE_ENV !== "production" &&
      ["localhost", "127.0.0.1"].includes(originUrl.hostname)
    ) {
      return true;
    }

    const configured = process.env.NEXT_PUBLIC_SITE_URL;
    if (!configured) return true;

    return originUrl.origin === new URL(configured).origin;
  } catch {
    return false;
  }
}

function subscriberId(email: string) {
  return `newsletterSubscriber.${createHash("sha256").update(email).digest("hex")}`;
}

export async function POST(request: Request) {
  if (!isAllowedOrigin(request)) {
    return json(false, "Please check the submitted information.", 400);
  }

  const contentLength = request.headers.get("content-length");
  if (contentLength && Number(contentLength) > MAX_BODY_BYTES) {
    return json(false, "Please check the submitted information.", 400);
  }

  const rateLimit = await checkRateLimit({
    key: getClientIp(request),
    namespace: "newsletter-subscribe-rate-limit",
    maxRequests: 8,
    windowMs: 10 * 60 * 1000,
  });
  if (!rateLimit.allowed) {
    return json(false, "Too many requests. Please try again later.", 429);
  }

  let body: unknown;
  try {
    const rawBody = await request.text();
    if (new TextEncoder().encode(rawBody).length > MAX_BODY_BYTES) {
      return json(false, "Please check the submitted information.", 400);
    }
    body = JSON.parse(rawBody);
  } catch {
    return json(false, "Please check the submitted information.", 400);
  }

  const parsed = subscribeSchema.safeParse(body);
  if (!parsed.success) {
    return json(false, "Please enter a valid email address.", 400);
  }

  const payload = parsed.data;
  if (payload.companyWebsite) {
    return json(true, "Subscribed successfully.", 200);
  }

  if (!writeClient.config().token) {
    console.error("Newsletter subscribe failed: Sanity write token missing");
    return json(false, "Unable to subscribe right now. Please try again later.", 500);
  }

  const id = subscriberId(payload.email);
  const now = new Date().toISOString();

  try {
    const nextUnsubscribeToken = randomUUID();
    const existing = await writeClient.fetch<{ status?: string; unsubscribeToken?: string } | null>(
      `*[_id == $id][0]{status, unsubscribeToken}`,
      { id }
    );
    const unsubscribeToken = existing?.unsubscribeToken || nextUnsubscribeToken;

    await writeClient.createIfNotExists({
      _id: id,
      _type: "newsletterSubscriber",
      email: payload.email,
      status: "subscribed",
      unsubscribeToken,
      language: payload.language || "en",
      source: payload.source || "footer-subscribe",
      pageUrl: payload.pageUrl || "",
      subscribedAt: now,
    });

    await writeClient
      .patch(id)
      .setIfMissing({
        _type: "newsletterSubscriber",
        email: payload.email,
        unsubscribeToken,
      })
      .set({
        email: payload.email,
        status: "subscribed",
        unsubscribeToken,
        language: payload.language || "en",
        source: payload.source || "footer-subscribe",
        pageUrl: payload.pageUrl || "",
        subscribedAt: now,
        unsubscribedAt: null,
      })
      .commit({ autoGenerateArrayKeys: true });

    if (existing?.status === "subscribed") {
      return json(true, "You're already subscribed.", 200, "already_subscribed");
    }

    if (process.env.RESEND_API_KEY) {
      try {
        await sendNewsletterWelcomeEmail({
          email: payload.email,
          language: payload.language || "en",
          unsubscribeToken,
          idempotencyKey: `newsletter-welcome-${id}-${now}`,
        });
      } catch (emailError) {
        console.error(
          "Newsletter welcome email failed",
          emailError instanceof Error ? emailError.message : "Unknown error"
        );
      }
    }

    return json(true, "Subscribed successfully.", 200, "subscribed");
  } catch (error) {
    console.error("Newsletter subscribe failed", error instanceof Error ? error.message : "Unknown error");
    return json(false, "Unable to subscribe right now. Please try again later.", 500);
  }
}
