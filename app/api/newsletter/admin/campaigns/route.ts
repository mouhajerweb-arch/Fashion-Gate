import { NextResponse } from "next/server";
import { createClient } from "@sanity/client";
import { z } from "zod";
import { isAuthorizedNewsletterAdmin, unauthorizedResponse } from "@/lib/newsletter/admin";
import { apiVersion, dataset, projectId } from "@/lib/sanity";

const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
  token: process.env.SANITY_API_WRITE_TOKEN || process.env.SANITY_API_TOKEN,
});

const campaignSchema = z.object({
  campaignId: z.string().trim().min(5).max(160).optional().or(z.literal("")),
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

function blocksToText(blocks?: Array<{ children?: Array<{ text?: string }> }>) {
  return (blocks || [])
    .map((block) => (block.children || []).map((child) => child.text || "").join(""))
    .filter(Boolean)
    .join("\n\n");
}

function getValidationMessage(error: z.ZodError) {
  const firstIssue = error.issues[0];
  const field = firstIssue?.path.join(".") || "campaign";
  return `${field}: ${firstIssue?.message || "Invalid value."}`;
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

function containsArabic(value?: string) {
  return /[\u0600-\u06FF]/.test(value || "");
}

function englishOnly(value?: string) {
  return containsArabic(value) ? "" : value || "";
}

export async function GET(request: Request) {
  if (!(await isAuthorizedNewsletterAdmin(request))) return unauthorizedResponse();

  if (!client.config().token) {
    return NextResponse.json({ success: false, message: "Sanity token missing." }, { status: 500 });
  }

  const campaigns = await client.fetch<
    Array<{
      _id: string;
      title?: string;
      subject?: string;
      previewText?: string;
      titleLocalized?: { ar?: string; en?: string };
      subjectLocalized?: { ar?: string; en?: string };
      previewTextLocalized?: { ar?: string; en?: string };
      heroImageUrl?: string;
      heroImage?: { asset?: { _ref?: string } };
      body?: Array<{ children?: Array<{ text?: string }> }>;
      bodyAr?: string;
      bodyEn?: string;
      ctaLabel?: string;
      ctaLabelLocalized?: { ar?: string; en?: string };
      ctaUrl?: string;
      status?: string;
      sentAt?: string;
      _updatedAt?: string;
    }>
  >(
    `*[_type == "newsletterCampaign"] | order(_updatedAt desc)[0...30]{
      _id,
      title,
      subject,
      previewText,
      titleLocalized,
      subjectLocalized,
      previewTextLocalized,
      heroImageUrl,
      heroImage,
      body,
      bodyAr,
      bodyEn,
      ctaLabel,
      ctaLabelLocalized,
      ctaUrl,
      status,
      sentAt,
      _updatedAt
    }`
  );

  return NextResponse.json({
    success: true,
    campaigns: campaigns.map((campaign) => ({
      id: campaign._id,
      title: campaign.title || "Untitled campaign",
      subject: campaign.subject || "",
      previewText: campaign.previewText || "",
      titleAr: campaign.titleLocalized?.ar || "",
      titleEn: englishOnly(campaign.titleLocalized?.en),
      subjectAr: campaign.subjectLocalized?.ar || "",
      subjectEn: englishOnly(campaign.subjectLocalized?.en),
      previewTextAr: campaign.previewTextLocalized?.ar || "",
      previewTextEn: englishOnly(campaign.previewTextLocalized?.en),
      heroImageUrl: campaign.heroImageUrl || "",
      heroImageAssetId: campaign.heroImage?.asset?._ref || "",
      body: blocksToText(campaign.body),
      bodyAr: campaign.bodyAr || "",
      bodyEn: englishOnly(campaign.bodyEn),
      ctaLabel: campaign.ctaLabel || "",
      ctaLabelAr: campaign.ctaLabelLocalized?.ar || "",
      ctaLabelEn: englishOnly(campaign.ctaLabelLocalized?.en),
      ctaUrl: campaign.ctaUrl || "",
      status: campaign.status || "draft",
      sentAt: campaign.sentAt || "",
      updatedAt: campaign._updatedAt || "",
    })),
  });
}

export async function POST(request: Request) {
  if (!(await isAuthorizedNewsletterAdmin(request))) return unauthorizedResponse();

  if (!client.config().token) {
    return NextResponse.json({ success: false, message: "Sanity token missing." }, { status: 500 });
  }

  const parsed = campaignSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ success: false, message: getValidationMessage(parsed.error) }, { status: 400 });
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
    titleLocalized: { ar: parsed.data.titleAr || "", en: englishOnly(parsed.data.titleEn) },
    subjectLocalized: { ar: parsed.data.subjectAr || "", en: englishOnly(parsed.data.subjectEn) },
    previewTextLocalized: { ar: parsed.data.previewTextAr || "", en: englishOnly(parsed.data.previewTextEn) },
    heroImageUrl: parsed.data.heroImageUrl || "",
    ...(heroImage ? { heroImage } : {}),
    status: "draft",
    body: bodyToBlocks(parsed.data.body),
    bodyAr: parsed.data.bodyAr || "",
    bodyEn: englishOnly(parsed.data.bodyEn),
    ctaLabel: parsed.data.ctaLabel || "",
    ctaLabelLocalized: { ar: parsed.data.ctaLabelAr || "", en: englishOnly(parsed.data.ctaLabelEn) },
    ctaUrl: parsed.data.ctaUrl || "",
  };

  const campaign = parsed.data.campaignId
    ? await client
        .patch(parsed.data.campaignId)
        .set(campaignPayload)
        .commit()
    : await client.create(campaignPayload);

  return NextResponse.json({
    success: true,
    message: parsed.data.campaignId ? "Draft updated." : "Draft saved.",
    campaignId: campaign._id,
  });
}
