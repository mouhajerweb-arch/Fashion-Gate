import "server-only";

import { randomUUID } from "crypto";
import { bilingual, bilingualSubject, getNewsletterSettings, type LocalizedText } from "@/lib/newsletter/settings";
import { assertResendResult } from "./assert-resend-result";
import { getEmailConfig, getResendClient } from "./resend";

const PUBLIC_ASSET_URL = process.env.EMAIL_PUBLIC_ASSET_URL || "https://fashiongatemall.com";
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://fashiongatemall.com";
const LOGO_URL = `${PUBLIC_ASSET_URL.replace(/\/$/, "")}/brand/logo.png`;
const BRAND_ADDRESS_AR = "فاشن غيت مول، بوليفارد دمشق، سوريا";
const BRAND_ADDRESS = "Fashion Gate Mall, Damascus Boulevard, Syria";
const BRAND_PHONE = "+963 930 000 000";

export type NewsletterCampaignEmailInput = {
  to: string;
  subject: string;
  title: string;
  previewText?: string;
  heroImageUrl?: string;
  body: string;
  ctaLabel?: string;
  ctaUrl?: string;
  subjectLocalized?: LocalizedText;
  titleLocalized?: LocalizedText;
  previewTextLocalized?: LocalizedText;
  bodyAr?: string;
  bodyEn?: string;
  ctaLabelLocalized?: LocalizedText;
  unsubscribeToken?: string;
  idempotencyKey?: string;
};

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function renderParagraphs(value: string, dir: "rtl" | "ltr") {
  return value
    .split(/\n{2,}/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean)
    .map(
      (paragraph) => `
        <p dir="${dir}" style="margin:0 0 18px; font-family:Arial, sans-serif; font-size:15px; line-height:1.85; color:#4d4741; text-align:${dir === "rtl" ? "right" : "left"};">
          ${escapeHtml(paragraph).replace(/\n/g, "<br />")}
        </p>
      `
    )
    .join("");
}

function getUnsubscribeUrl(token?: string) {
  if (!token) return "";
  const baseUrl = SITE_URL.replace(/\/$/, "");
  return `${baseUrl}/newsletter/unsubscribe?token=${encodeURIComponent(token)}`;
}

function renderSection({
  title,
  previewText,
  body,
  ctaLabel,
  ctaUrl,
  dir,
}: {
  title: string;
  previewText?: string;
  body: string;
  ctaLabel?: string;
  ctaUrl?: string;
  dir: "rtl" | "ltr";
}) {
  if (!title && !previewText && !body) return "";
  const textAlign = dir === "rtl" ? "right" : "left";

  return `
    <tr>
      <td dir="${dir}" style="padding:34px 36px 8px; text-align:${textAlign};">
        <h1 style="margin:0; font-family:Georgia, 'Times New Roman', serif; font-size:38px; line-height:1.08; font-weight:400; color:#111111;">
          ${escapeHtml(title)}
        </h1>
        ${
          previewText
            ? `<p style="margin:14px 0 0; font-family:Arial, sans-serif; font-size:15px; line-height:1.75; color:#5f5750;">${escapeHtml(previewText)}</p>`
            : ""
        }
      </td>
    </tr>
    <tr>
      <td style="padding:18px 36px 30px;">
        <div style="padding-top:24px; border-top:1px solid #CB6116;">
          ${renderParagraphs(body, dir)}
        </div>
        ${
          ctaLabel && ctaUrl
            ? `<div dir="${dir}" style="text-align:${textAlign};"><a href="${escapeHtml(ctaUrl)}" style="display:inline-block; margin-top:12px; background:#111111; color:#ffffff; text-decoration:none; font-family:Arial, sans-serif; font-size:12px; font-weight:700; letter-spacing:1.8px; text-transform:uppercase; padding:15px 24px;">${escapeHtml(ctaLabel)}</a></div>`
            : ""
        }
      </td>
    </tr>
  `;
}

function renderCommonContactBlock(supportEmail: string) {
  const safeSupportEmail = escapeHtml(supportEmail);

  return `
    <tr>
      <td style="padding:0 36px 40px;">
        <div style="margin-top:10px; padding-top:24px; border-top:1px solid #ded2c8;">
          <p style="margin:0 0 22px; font-family:Arial, sans-serif; font-size:14px; line-height:1.8; color:#5f5750;">
            Best regards,<br />
            <strong style="color:#111111;">Fashion Gate Mall</strong>
          </p>
          <div style="font-family:Arial, sans-serif; font-size:11px; letter-spacing:1.6px; color:#8a7e73; text-transform:uppercase; margin-bottom:10px;">Contact</div>
          <div style="font-family:Arial, sans-serif; font-size:13px; line-height:1.8; color:#4d4741;">
            ${BRAND_ADDRESS}<br />
            <a href="tel:${BRAND_PHONE.replace(/\s/g, "")}" style="color:#CB6116; text-decoration:none;">${BRAND_PHONE}</a><br />
            <a href="mailto:${safeSupportEmail}" style="color:#CB6116; text-decoration:none;">${safeSupportEmail}</a><br />
            <a href="https://fashiongatemall.com" style="color:#CB6116; text-decoration:none;">fashiongatemall.com</a>
          </div>
        </div>
      </td>
    </tr>
  `;
}

async function renderHtml(input: NewsletterCampaignEmailInput) {
  const settings = await getNewsletterSettings();
  const { to: supportEmail } = getEmailConfig();
  const unsubscribeUrl = getUnsubscribeUrl(input.unsubscribeToken);
  const title = bilingual(input.titleLocalized);
  const preview = bilingual(input.previewTextLocalized);
  const cta = bilingual(input.ctaLabelLocalized);
  const arTitle = title.ar || "";
  const enTitle = title.en || "";
  const arPreviewText = preview.ar || "";
  const enPreviewText = preview.en || "";
  const arBody = input.bodyAr || "";
  const enBody = input.bodyEn || "";
  const arCtaLabel = cta.ar || "";
  const enCtaLabel = cta.en || "";
  const safeHeroImageUrl = input.heroImageUrl ? escapeHtml(input.heroImageUrl) : "";
  const eyebrow = bilingual(settings.campaignEyebrow);
  const subscribedReason = bilingual(settings.subscribedReason);
  const unsubscribe = bilingual(settings.unsubscribeLabel);

  return `
    <!doctype html>
    <html>
      <body style="margin:0; padding:0; background:#f4efe8;">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f4efe8; width:100%;">
          <tr>
            <td align="center" style="padding:34px 14px;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="width:100%; max-width:700px; background:#fbfaf8; border-collapse:collapse; box-shadow:0 22px 60px rgba(17,17,17,0.12);">
                <tr>
                  <td style="background:#111111; padding:36px 34px 32px; text-align:center;">
                    <a href="https://fashiongatemall.com" style="display:inline-block; text-decoration:none;">
                      <img src="${LOGO_URL}" width="86" alt="Fashion Gate Mall" style="display:block; margin:0 auto 18px; width:86px; max-width:86px; height:auto; border:0; outline:none; text-decoration:none;" />
                    </a>
                    <div style="font-family:Georgia, 'Times New Roman', serif; font-size:28px; line-height:1; letter-spacing:3px; color:#ffffff; text-transform:uppercase;">Fashion Gate Mall</div>
                    <div style="width:56px; height:1px; background:#CB6116; margin:18px auto 0;"></div>
                    <div style="font-family:Arial, sans-serif; font-size:11px; line-height:1.6; letter-spacing:2px; color:#c8bdb2; text-transform:uppercase; margin-top:14px;">
                      ${escapeHtml(eyebrow.ar || eyebrow.en)}
                    </div>
                    ${eyebrow.en && eyebrow.en !== eyebrow.ar ? `<div style="font-family:Arial, sans-serif; font-size:10px; line-height:1.6; letter-spacing:2px; color:#9f9488; text-transform:uppercase; margin-top:4px;">${escapeHtml(eyebrow.en)}</div>` : ""}
                  </td>
                </tr>
                ${
                  safeHeroImageUrl
                    ? `<tr><td style="padding:34px 36px 0;"><img src="${safeHeroImageUrl}" alt="" width="628" style="display:block; width:100%; max-width:628px; height:auto; border:0; outline:none; text-decoration:none;" /></td></tr>`
                    : ""
                }
                ${renderSection({ title: arTitle, previewText: arPreviewText, body: arBody, ctaLabel: arCtaLabel, ctaUrl: input.ctaUrl, dir: "rtl" })}
                ${renderSection({ title: enTitle, previewText: enPreviewText, body: enBody, ctaLabel: enCtaLabel, ctaUrl: input.ctaUrl, dir: "ltr" })}
                ${renderCommonContactBlock(supportEmail)}
                <tr>
                  <td style="background:#eee6dd; padding:22px 34px; text-align:center; border-top:1px solid #ded2c8;">
                    <p dir="rtl" style="margin:0 0 8px; font-family:Arial, sans-serif; font-size:12px; line-height:1.7; color:#756b62;">
                      ${escapeHtml(subscribedReason.ar)}
                      ${unsubscribeUrl ? `<a href="${escapeHtml(unsubscribeUrl)}" style="color:#CB6116; text-decoration:none;">${escapeHtml(unsubscribe.ar)}</a>` : ""}
                    </p>
                    <p style="margin:0; font-family:Arial, sans-serif; font-size:12px; line-height:1.7; color:#756b62;">
                      ${escapeHtml(subscribedReason.en)}
                      ${unsubscribeUrl ? `<a href="${escapeHtml(unsubscribeUrl)}" style="color:#CB6116; text-decoration:none;">${escapeHtml(unsubscribe.en)}</a>` : ""}
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
    </html>
  `;
}

export async function sendNewsletterCampaignEmail(input: NewsletterCampaignEmailInput) {
  const resend = getResendClient();
  const { from } = getEmailConfig();
  const subject = bilingualSubject(input.subjectLocalized, input.subject);
  const title = bilingual(input.titleLocalized);

  const result = await resend.emails.send(
    {
      from,
      to: input.to,
      replyTo: from,
      subject,
      html: await renderHtml(input),
      text: [
        title.ar || input.title,
        input.previewTextLocalized?.ar || input.previewText || "",
        input.heroImageUrl ? `Image: ${input.heroImageUrl}` : "",
        "",
        input.bodyAr || input.body,
        "",
        title.en || input.title,
        input.previewTextLocalized?.en || input.previewText || "",
        "",
        input.bodyEn || input.body,
        "",
        input.ctaLabel && input.ctaUrl ? `${input.ctaLabel}: ${input.ctaUrl}` : "",
        "",
        input.unsubscribeToken ? `Unsubscribe: ${getUnsubscribeUrl(input.unsubscribeToken)}` : "",
      ]
        .filter(Boolean)
        .join("\n"),
    },
    { idempotencyKey: input.idempotencyKey || randomUUID() }
  );

  return assertResendResult(result);
}
