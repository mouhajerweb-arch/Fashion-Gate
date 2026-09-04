import "server-only";

import { randomUUID } from "crypto";
import { bilingual, bilingualSubject, getNewsletterSettings } from "@/lib/newsletter/settings";
import { assertResendResult } from "./assert-resend-result";
import { getEmailConfig, getResendClient } from "./resend";

const PUBLIC_ASSET_URL = process.env.EMAIL_PUBLIC_ASSET_URL || "https://fashiongatemall.com";
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://fashiongatemall.com";
const LOGO_URL = `${PUBLIC_ASSET_URL.replace(/\/$/, "")}/brand/logo.png`;
const BRAND_ADDRESS = "Fashion Gate Mall, Damascus Boulevard, Syria";
const BRAND_PHONE = "+963 930 000 000";

type NewsletterWelcomeEmailInput = {
  email: string;
  unsubscribeToken: string;
  language?: "en" | "ar";
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

function getUnsubscribeUrl(token: string) {
  const baseUrl = SITE_URL.replace(/\/$/, "");
  return `${baseUrl}/newsletter/unsubscribe?token=${encodeURIComponent(token)}`;
}

function paragraph(value: string, dir: "rtl" | "ltr") {
  return `
    <p dir="${dir}" style="margin:14px 0 0; font-family:Arial, sans-serif; font-size:15px; line-height:1.85; color:#4d4741; text-align:${dir === "rtl" ? "right" : "left"};">
      ${escapeHtml(value)}
    </p>
  `;
}

function renderLanguageSection({
  title,
  intro,
  body,
  dir,
  divider,
}: {
  title: string;
  intro: string;
  body: string;
  dir: "rtl" | "ltr";
  divider?: boolean;
}) {
  const align = dir === "rtl" ? "right" : "left";

  return `
    <div dir="${dir}" style="${divider ? "margin-top:34px; padding-top:30px; border-top:1px solid #CB6116;" : ""} text-align:${align};">
      <h1 style="margin:0; font-family:Georgia, 'Times New Roman', serif; font-size:${dir === "rtl" ? "34px" : "30px"}; line-height:1.14; font-weight:400; color:#111111;">
        ${escapeHtml(title)}
      </h1>
      ${paragraph(intro, dir)}
      <div style="margin-top:20px;">
        ${paragraph(body, dir)}
      </div>
    </div>
  `;
}

function renderCommonContactBlock(supportEmail: string) {
  const safeSupportEmail = escapeHtml(supportEmail);

  return `
    <div style="margin-top:34px; padding-top:24px; border-top:1px solid #ded2c8;">
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
  `;
}

export async function sendNewsletterWelcomeEmail(input: NewsletterWelcomeEmailInput) {
  const resend = getResendClient();
  const { from, to: supportEmail } = getEmailConfig();
  const settings = await getNewsletterSettings();
  const unsubscribeUrl = getUnsubscribeUrl(input.unsubscribeToken);
  const subject = bilingualSubject(settings.welcomeEmailSubject, "Welcome to Fashion Gate Mall updates");
  const title = bilingual(settings.welcomeEmailTitle);
  const intro = bilingual(settings.welcomeEmailIntro);
  const body = bilingual(settings.welcomeEmailBody);
  const unsubscribe = bilingual(settings.unsubscribeLabel);
  const subscribedReason = bilingual(settings.subscribedReason);
  const eyebrow = bilingual(settings.campaignEyebrow);
  const safeUnsubscribeUrl = escapeHtml(unsubscribeUrl);

  const html = `
    <!doctype html>
    <html>
      <body style="margin:0; padding:0; background:#f4efe8;">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f4efe8; width:100%;">
          <tr>
            <td align="center" style="padding:34px 14px;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="width:100%; max-width:680px; background:#fbfaf8; border-collapse:collapse; box-shadow:0 22px 60px rgba(17,17,17,0.12);">
                <tr>
                  <td style="background:#111111; padding:34px 34px 30px; text-align:center;">
                    <a href="https://fashiongatemall.com" style="display:inline-block; text-decoration:none;">
                      <img src="${LOGO_URL}" width="86" alt="Fashion Gate Mall" style="display:block; margin:0 auto 18px; width:86px; max-width:86px; height:auto; border:0; outline:none; text-decoration:none;" />
                    </a>
                    <div style="font-family:Georgia, 'Times New Roman', serif; font-size:28px; line-height:1; letter-spacing:3px; color:#ffffff; text-transform:uppercase;">Fashion Gate Mall</div>
                    <div style="width:56px; height:1px; background:#CB6116; margin:18px auto 0;"></div>
                    <div dir="rtl" style="font-family:Arial, sans-serif; font-size:11px; line-height:1.6; letter-spacing:2px; color:#c8bdb2; margin-top:14px;">${escapeHtml(eyebrow.ar || eyebrow.en)}</div>
                  </td>
                </tr>
                <tr>
                  <td style="padding:38px 34px;">
                    ${renderLanguageSection({ title: title.ar, intro: intro.ar, body: body.ar, dir: "rtl" })}
                    ${renderLanguageSection({ title: title.en, intro: intro.en, body: body.en, dir: "ltr", divider: true })}
                    ${renderCommonContactBlock(supportEmail)}
                  </td>
                </tr>
                <tr>
                  <td style="background:#eee6dd; padding:22px 34px; text-align:center; border-top:1px solid #ded2c8;">
                    <p dir="rtl" style="margin:0 0 8px; font-family:Arial, sans-serif; font-size:12px; line-height:1.7; color:#756b62;">
                      ${escapeHtml(subscribedReason.ar)}
                      <a href="${safeUnsubscribeUrl}" style="color:#CB6116; text-decoration:none;">${escapeHtml(unsubscribe.ar)}</a>
                    </p>
                    <p style="margin:0; font-family:Arial, sans-serif; font-size:12px; line-height:1.7; color:#756b62;">
                      ${escapeHtml(subscribedReason.en)}
                      <a href="${safeUnsubscribeUrl}" style="color:#CB6116; text-decoration:none;">${escapeHtml(unsubscribe.en)}</a>
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

  const result = await resend.emails.send(
    {
      from,
      to: input.email,
      replyTo: from,
      subject,
      html,
      text: [
        title.ar,
        intro.ar,
        body.ar,
        "",
        title.en,
        intro.en,
        body.en,
        "",
        "Best regards,",
        "Fashion Gate Mall",
        "",
        `Unsubscribe: ${unsubscribeUrl}`,
      ].join("\n"),
    },
    { idempotencyKey: input.idempotencyKey || randomUUID() }
  );

  assertResendResult(result);
}
