import { randomUUID } from "crypto";
import { NextResponse } from "next/server";
import { createClient } from "@sanity/client";
import { z } from "zod";
import { sendContactEmail } from "@/lib/email/send-contact-email";
import { checkContactRateLimit } from "@/lib/rate-limit/contact";
import { apiVersion, dataset, projectId } from "@/lib/sanity";

const MAX_BODY_BYTES = 20 * 1024;

const writeClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
  token: process.env.SANITY_API_WRITE_TOKEN || process.env.SANITY_API_TOKEN,
});

const contactInquirySchema = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.string().trim().email().max(160).transform((value) => value.toLowerCase()),
  phone: z.string().trim().max(40).optional().or(z.literal("")),
  message: z.string().trim().min(5).max(5000),
  source: z.string().trim().max(80).optional(),
  pageUrl: z.string().trim().url().max(500).optional().or(z.literal("")),
  language: z.enum(["en", "ar"]).optional(),
  companyWebsite: z.string().trim().max(200).optional().or(z.literal("")),
}).strict();

function json(success: boolean, message: string, status: number) {
  return NextResponse.json({ success, message }, { status });
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

export async function POST(request: Request) {
  if (!isAllowedOrigin(request)) {
    return json(false, "Please check the submitted information.", 400);
  }

  const contentLength = request.headers.get("content-length");
  if (contentLength && Number(contentLength) > MAX_BODY_BYTES) {
    return json(false, "Please check the submitted information.", 400);
  }

  const rateLimit = await checkContactRateLimit(getClientIp(request));
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

  const parsed = contactInquirySchema.safeParse(body);
  if (!parsed.success) {
    return json(false, "Please check the submitted information.", 400);
  }

  const payload = parsed.data;
  if (payload.companyWebsite) {
    return json(true, "Your message has been sent successfully.", 200);
  }

  if (!writeClient.config().token) {
    console.error("Contact inquiry failed: Sanity write token missing");
    return json(false, "Unable to send your message right now. Please try again later.", 500);
  }

  const submittedAt = new Date().toISOString();
  const idempotencyKey = randomUUID();

  try {
    await writeClient.create({
      _type: "contactInquiry",
      name: payload.name,
      email: payload.email,
      phone: payload.phone || "",
      message: payload.message,
      source: payload.source || "website",
      pageUrl: payload.pageUrl || "",
      language: payload.language || "en",
      status: "new",
      submittedAt,
    });

    if (process.env.RESEND_API_KEY) {
      await sendContactEmail({
        name: payload.name,
        email: payload.email,
        phone: payload.phone || "",
        message: payload.message,
        source: payload.source || "website",
        pageUrl: payload.pageUrl || "",
        language: payload.language || "en",
        submittedAt,
        idempotencyKey,
      });
    }

    return json(true, "Your message has been sent successfully.", 200);
  } catch (error) {
    console.error("Contact inquiry failed", error instanceof Error ? error.message : "Unknown error");
    return json(false, "Unable to send your message right now. Please try again later.", 500);
  }
}
