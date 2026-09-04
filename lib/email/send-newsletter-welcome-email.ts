import "server-only";

import { randomUUID } from "crypto";
import { assertResendResult } from "./assert-resend-result";
import { getEmailConfig, getResendClient } from "./resend";

const PUBLIC_ASSET_URL = process.env.EMAIL_PUBLIC_ASSET_URL || "https://fashiongatemall.com";
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://fashiongatemall.com";
const LOGO_URL = `${PUBLIC_ASSET_URL.replace(/\/$/, "")}/brand/logo.png`;
const BRAND_ADDRESS = "Fashion Gate Boulevard, Damascus, Syria";
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

function renderContactBlock(supportEmail: string) {
  const safeSupportEmail = escapeHtml(supportEmail);

  return `
    <div style="margin-top:30px; padding-top:22px; border-top:1px solid #ded2c8;">
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

function renderNewsletterWelcomeEmail({
  supportEmail,
  unsubscribeUrl,
}: {
  supportEmail: string;
  unsubscribeUrl: string;
}) {
  const safeUnsubscribeUrl = escapeHtml(unsubscribeUrl);

  return `
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
                    <div style="font-family:Arial, sans-serif; font-size:11px; line-height:1.6; letter-spacing:2px; color:#c8bdb2; text-transform:uppercase; margin-top:14px;">
                      Bespoke Updates
                    </div>
                  </td>
                </tr>
                <tr>
                  <td style="padding:38px 34px 10px;">
                    <h1 style="margin:0; font-family:Georgia, 'Times New Roman', serif; font-size:34px; line-height:1.12; font-weight:400; color:#111111;">
                      Welcome to Fashion Gate Mall
                    </h1>
                    <p style="margin:14px 0 0; font-family:Arial, sans-serif; font-size:15px; line-height:1.75; color:#5f5750;">
                      Thank you for subscribing to our private updates. You will receive selected invitations, seasonal collection launches, and refined notes from Fashion Gate Mall.
                    </p>
                  </td>
                </tr>
                <tr>
                  <td style="padding:24px 34px 38px;">
                    <p style="margin:0; padding-top:22px; border-top:1px solid #CB6116; font-family:Arial, sans-serif; font-size:15px; line-height:1.8; color:#4d4741;">
                      You're subscribed. We'll keep you close to our latest invitations, seasonal collections, and private Fashion Gate Mall updates.
                    </p>
                    <p style="margin:24px 0 0; font-family:Arial, sans-serif; font-size:14px; line-height:1.8; color:#5f5750;">
                      Best regards,<br />
                      <strong style="color:#111111;">Fashion Gate Mall</strong>
                    </p>
                    ${renderContactBlock(supportEmail)}
                  </td>
                </tr>
                <tr>
                  <td style="background:#eee6dd; padding:22px 34px; text-align:center; border-top:1px solid #ded2c8;">
                    <p style="margin:0; font-family:Arial, sans-serif; font-size:12px; line-height:1.7; color:#756b62;">
                      You are receiving this email because you subscribed on Fashion Gate Mall.
                      <a href="${safeUnsubscribeUrl}" style="color:#CB6116; text-decoration:none;">Unsubscribe</a>
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

export async function sendNewsletterWelcomeEmail(input: NewsletterWelcomeEmailInput) {
  const resend = getResendClient();
  const { from, to: supportEmail } = getEmailConfig();
  const unsubscribeUrl = getUnsubscribeUrl(input.unsubscribeToken);

  const result = await resend.emails.send(
    {
      from,
      to: input.email,
      replyTo: from,
      subject: "Welcome to Fashion Gate Mall updates",
      html: renderNewsletterWelcomeEmail({ supportEmail, unsubscribeUrl }),
      text: [
        "Welcome to Fashion Gate Mall updates",
        "",
        "Thank you for subscribing to our private updates.",
        "You will receive selected invitations, seasonal collection launches, and refined notes from Fashion Gate Mall.",
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
