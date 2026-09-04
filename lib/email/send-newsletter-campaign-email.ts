import "server-only";

import { randomUUID } from "crypto";
import { assertResendResult } from "./assert-resend-result";
import { getEmailConfig, getResendClient } from "./resend";

const PUBLIC_ASSET_URL = process.env.EMAIL_PUBLIC_ASSET_URL || "https://fashiongatemall.com";
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://fashiongatemall.com";
const LOGO_URL = `${PUBLIC_ASSET_URL.replace(/\/$/, "")}/brand/logo.png`;
const BRAND_ADDRESS = "Fashion Gate Boulevard, Damascus, Syria";
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

function renderParagraphs(value: string) {
  return value
    .split(/\n{2,}/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean)
    .map(
      (paragraph) => `
        <p style="margin:0 0 18px; font-family:Arial, sans-serif; font-size:15px; line-height:1.85; color:#4d4741;">
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

function renderHtml(input: NewsletterCampaignEmailInput) {
  const { to: supportEmail } = getEmailConfig();
  const unsubscribeUrl = getUnsubscribeUrl(input.unsubscribeToken);
  const safeTitle = escapeHtml(input.title);
  const safePreviewText = input.previewText ? escapeHtml(input.previewText) : "";
  const safeHeroImageUrl = input.heroImageUrl ? escapeHtml(input.heroImageUrl) : "";
  const safeCtaLabel = input.ctaLabel ? escapeHtml(input.ctaLabel) : "";
  const safeCtaUrl = input.ctaUrl ? escapeHtml(input.ctaUrl) : "";
  const safeSupportEmail = escapeHtml(supportEmail);

  return `
    <!doctype html>
    <html>
      <head>
        ${safePreviewText ? `<meta name="description" content="${safePreviewText}" />` : ""}
      </head>
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
                      Bespoke Updates
                    </div>
                  </td>
                </tr>
                <tr>
                  <td style="padding:40px 36px 12px;">
                    <h1 style="margin:0; font-family:Georgia, 'Times New Roman', serif; font-size:38px; line-height:1.08; font-weight:400; color:#111111;">
                      ${safeTitle}
                    </h1>
                    ${
                      safePreviewText
                        ? `<p style="margin:14px 0 0; font-family:Arial, sans-serif; font-size:15px; line-height:1.75; color:#5f5750;">${safePreviewText}</p>`
                        : ""
                    }
                  </td>
                </tr>
                ${
                  safeHeroImageUrl
                    ? `<tr>
                        <td style="padding:12px 36px 0;">
                          <img src="${safeHeroImageUrl}" alt="" width="628" style="display:block; width:100%; max-width:628px; height:auto; border:0; outline:none; text-decoration:none;" />
                        </td>
                      </tr>`
                    : ""
                }
                <tr>
                  <td style="padding:24px 36px 40px;">
                    <div style="padding-top:24px; border-top:1px solid #CB6116;">
                      ${renderParagraphs(input.body)}
                    </div>
                    ${
                      safeCtaLabel && safeCtaUrl
                        ? `<a href="${safeCtaUrl}" style="display:inline-block; margin-top:12px; background:#111111; color:#ffffff; text-decoration:none; font-family:Arial, sans-serif; font-size:12px; font-weight:700; letter-spacing:1.8px; text-transform:uppercase; padding:15px 24px;">${safeCtaLabel}</a>`
                        : ""
                    }
                    <p style="margin:28px 0 0; font-family:Arial, sans-serif; font-size:14px; line-height:1.8; color:#5f5750;">
                      Best regards,<br />
                      <strong style="color:#111111;">Fashion Gate Mall</strong>
                    </p>
                    <div style="margin-top:30px; padding-top:22px; border-top:1px solid #ded2c8;">
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
                <tr>
                  <td style="background:#eee6dd; padding:22px 34px; text-align:center; border-top:1px solid #ded2c8;">
                    <p style="margin:0; font-family:Arial, sans-serif; font-size:12px; line-height:1.7; color:#756b62;">
                      You are receiving this email because you subscribed on Fashion Gate Mall.
                      ${unsubscribeUrl ? `<a href="${escapeHtml(unsubscribeUrl)}" style="color:#CB6116; text-decoration:none;">Unsubscribe</a>` : ""}
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

  const result = await resend.emails.send(
    {
      from,
      to: input.to,
      replyTo: from,
      subject: input.subject,
      html: renderHtml(input),
      text: [
        input.title,
        input.previewText || "",
        input.heroImageUrl ? `Image: ${input.heroImageUrl}` : "",
        "",
        input.body,
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
