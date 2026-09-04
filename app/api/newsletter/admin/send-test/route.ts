import { NextResponse } from "next/server";
import { z } from "zod";
import { sendNewsletterCampaignEmail } from "@/lib/email/send-newsletter-campaign-email";
import { isAuthorizedNewsletterAdmin, unauthorizedResponse } from "@/lib/newsletter/admin";

const sendTestSchema = z.object({
  campaignId: z.string().trim().min(5).max(160).optional().or(z.literal("")),
  testEmail: z.string().trim().email().max(160),
  title: z.string().trim().min(2).max(140),
  subject: z.string().trim().min(2).max(120),
  previewText: z.string().trim().max(180).optional().or(z.literal("")),
  titleAr: z.string().trim().max(140).optional().or(z.literal("")),
  titleEn: z.string().trim().max(140).optional().or(z.literal("")),
  subjectAr: z.string().trim().max(120).optional().or(z.literal("")),
  subjectEn: z.string().trim().max(120).optional().or(z.literal("")),
  previewTextAr: z.string().trim().max(180).optional().or(z.literal("")),
  previewTextEn: z.string().trim().max(180).optional().or(z.literal("")),
  heroImageUrl: z.string().trim().url().max(500).optional().or(z.literal("")),
  heroImageAssetId: z.string().trim().min(5).max(180).optional().or(z.literal("")),
  body: z.string().trim().min(10).max(12000),
  bodyAr: z.string().trim().max(12000).optional().or(z.literal("")),
  bodyEn: z.string().trim().max(12000).optional().or(z.literal("")),
  ctaLabel: z.string().trim().max(60).optional().or(z.literal("")),
  ctaLabelAr: z.string().trim().max(60).optional().or(z.literal("")),
  ctaLabelEn: z.string().trim().max(60).optional().or(z.literal("")),
  ctaUrl: z.string().trim().url().max(500).optional().or(z.literal("")),
}).strict();

function getValidationMessage(error: z.ZodError) {
  const firstIssue = error.issues[0];
  const field = firstIssue?.path.join(".") || "campaign";
  return `${field}: ${firstIssue?.message || "Invalid value."}`;
}

export async function POST(request: Request) {
  if (!(await isAuthorizedNewsletterAdmin(request))) return unauthorizedResponse();

  const parsed = sendTestSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ success: false, message: getValidationMessage(parsed.error) }, { status: 400 });
  }

  await sendNewsletterCampaignEmail({
    title: parsed.data.title,
    subject: `[Test] ${parsed.data.subject}`,
    previewText: parsed.data.previewText,
    titleLocalized: { ar: parsed.data.titleAr || "", en: parsed.data.titleEn || "" },
    subjectLocalized: { ar: parsed.data.subjectAr || "", en: parsed.data.subjectEn ? `[Test] ${parsed.data.subjectEn}` : "" },
    previewTextLocalized: { ar: parsed.data.previewTextAr || "", en: parsed.data.previewTextEn || "" },
    heroImageUrl: parsed.data.heroImageUrl,
    body: parsed.data.body,
    bodyAr: parsed.data.bodyAr || "",
    bodyEn: parsed.data.bodyEn || "",
    ctaLabel: parsed.data.ctaLabel,
    ctaLabelLocalized: { ar: parsed.data.ctaLabelAr || "", en: parsed.data.ctaLabelEn || "" },
    ctaUrl: parsed.data.ctaUrl,
    to: parsed.data.testEmail,
    idempotencyKey: `newsletter-test-${Date.now()}`,
  });

  return NextResponse.json({ success: true, message: "Test email sent." });
}
