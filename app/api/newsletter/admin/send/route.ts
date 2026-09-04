import { NextResponse } from "next/server";
import { createClient } from "@sanity/client";
import { randomUUID } from "crypto";
import { z } from "zod";
import { sendNewsletterCampaignEmail } from "@/lib/email/send-newsletter-campaign-email";
import { isAuthorizedNewsletterAdmin, unauthorizedResponse } from "@/lib/newsletter/admin";
import { apiVersion, dataset, projectId } from "@/lib/sanity";

const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
  token: process.env.SANITY_API_WRITE_TOKEN || process.env.SANITY_API_TOKEN,
});

const sendSchema = z.object({
  campaignId: z.string().trim().min(5).max(160).optional().or(z.literal("")),
  title: z.string().trim().min(2).max(140),
  subject: z.string().trim().min(2).max(120),
  previewText: z.string().trim().max(180).optional().or(z.literal("")),
  heroImageUrl: z.string().trim().url().max(500).optional().or(z.literal("")),
  heroImageAssetId: z.string().trim().min(5).max(180).optional().or(z.literal("")),
  body: z.string().trim().min(10).max(12000),
  ctaLabel: z.string().trim().max(60).optional().or(z.literal("")),
  ctaUrl: z.string().trim().url().max(500).optional().or(z.literal("")),
}).strict();

function getValidationMessage(error: z.ZodError) {
  const firstIssue = error.issues[0];
  const field = firstIssue?.path.join(".") || "campaign";
  return `${field}: ${firstIssue?.message || "Invalid value."}`;
}

function bodyToBlocks(body: string) {
  return body
    .split(/\n{2,}/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean)
    .map((paragraph, index) => ({
      _key: `p${index}_${Math.random().toString(36).slice(2, 10)}`,
      _type: "block",
      style: "normal",
      children: [{ _key: `s${index}_${Math.random().toString(36).slice(2, 10)}`, _type: "span", text: paragraph, marks: [] }],
      markDefs: [],
    }));
}

function assetIdFromSanityImageUrl(url?: string) {
  if (!url) return "";
  try {
    const parsedUrl = new URL(url);
    if (parsedUrl.hostname !== "cdn.sanity.io") return "";
    const filename = parsedUrl.pathname.split("/").pop() || "";
    const match = filename.match(/^([a-f0-9]+)-(\d+x\d+)\.(jpg|jpeg|png|webp|gif)$/i);
    if (!match) return "";
    const extension = match[3].toLowerCase() === "jpg" ? "jpg" : match[3].toLowerCase();
    return `image-${match[1]}-${match[2]}-${extension}`;
  } catch {
    return "";
  }
}

type Subscriber = {
  _id: string;
  email: string;
  unsubscribeToken?: string;
};

export async function POST(request: Request) {
  if (!(await isAuthorizedNewsletterAdmin(request))) return unauthorizedResponse();

  if (!client.config().token) {
    return NextResponse.json({ success: false, message: "Sanity token missing." }, { status: 500 });
  }

  const parsed = sendSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ success: false, message: getValidationMessage(parsed.error) }, { status: 400 });
  }

  const subscribers = await client.fetch<Subscriber[]>(
    `*[_type == "newsletterSubscriber" && status == "subscribed" && defined(email)]{_id, email, unsubscribeToken}`
  );

  if (!subscribers.length) {
    return NextResponse.json({ success: false, message: "No subscribed users found." }, { status: 400 });
  }

  const heroImageAssetId = parsed.data.heroImageAssetId || assetIdFromSanityImageUrl(parsed.data.heroImageUrl);
  const heroImage = heroImageAssetId
    ? {
        _type: "image",
        asset: {
          _type: "reference",
          _ref: heroImageAssetId,
        },
      }
    : undefined;

  const campaignPayload = {
    _type: "newsletterCampaign",
    title: parsed.data.title,
    subject: parsed.data.subject,
    previewText: parsed.data.previewText || "",
    heroImageUrl: parsed.data.heroImageUrl || "",
    ...(heroImage ? { heroImage } : {}),
    status: "sending",
    body: bodyToBlocks(parsed.data.body),
    ctaLabel: parsed.data.ctaLabel || "",
    ctaUrl: parsed.data.ctaUrl || "",
  };

  const campaign = parsed.data.campaignId
    ? await client
        .patch(parsed.data.campaignId)
        .set(campaignPayload)
        .commit()
    : await client.create(campaignPayload);

  let sent = 0;
  let failed = 0;
  const failureReasons: string[] = [];
  const deliveryLog: Array<{ _key: string; email: string; resendId: string; status: "accepted" | "failed"; reason?: string }> = [];

  for (const subscriber of subscribers) {
    try {
      const unsubscribeToken = subscriber.unsubscribeToken || randomUUID();
      if (!subscriber.unsubscribeToken) {
        await client.patch(subscriber._id).set({ unsubscribeToken }).commit();
      }

      const resendId = await sendNewsletterCampaignEmail({
        ...parsed.data,
        to: subscriber.email,
        unsubscribeToken,
        idempotencyKey: `newsletter-${campaign._id}-${subscriber.email}`,
      });
      sent += 1;
      deliveryLog.push({
        _key: `log_${sent}_${Math.random().toString(36).slice(2, 10)}`,
        email: subscriber.email,
        resendId,
        status: "accepted",
      });
    } catch (error) {
      failed += 1;
      const reason = error instanceof Error ? error.message : "Unknown error";
      if (failureReasons.length < 3) failureReasons.push(reason);
      deliveryLog.push({
        _key: `log_failed_${failed}_${Math.random().toString(36).slice(2, 10)}`,
        email: subscriber.email,
        resendId: "",
        status: "failed",
        reason,
      });
      console.error("Newsletter campaign email failed", reason);
    }
  }

  await client
    .patch(campaign._id)
    .set({
      status: "sent",
      sentAt: new Date().toISOString(),
      sentCount: sent,
      failedCount: failed,
      deliveryLog,
    })
    .commit();

  return NextResponse.json({
    success: failed === 0,
    message:
      failed === 0
        ? `Campaign sent to ${sent} subscribers.`
        : `Campaign sent to ${sent}; ${failed} failed. ${failureReasons[0] || "Check Resend dashboard."}`,
    sent,
    failed,
    deliveryLog,
  });
}
