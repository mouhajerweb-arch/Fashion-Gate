import "server-only";

import { randomUUID } from "crypto";
import { bilingual, bilingualSubject, getNewsletterSettings } from "@/lib/newsletter/settings";
import { assertResendResult } from "./assert-resend-result";
import { getEmailConfig, getResendClient } from "./resend";

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function renderTokenBlock(token: string, label: string, dir: "rtl" | "ltr") {
  return `
    <div dir="${dir}" style="margin:22px 0 0; text-align:${dir === "rtl" ? "right" : "left"};">
      <div style="font-family:Arial, sans-serif; font-size:11px; letter-spacing:1.6px; color:#8a7e73; text-transform:uppercase; margin-bottom:8px;">${escapeHtml(label)}</div>
      <div style="display:inline-block; padding:16px 22px; background:#111111; color:#ffffff; font-family:Arial, sans-serif; font-size:22px; font-weight:700; letter-spacing:3px;">${escapeHtml(token)}</div>
    </div>
  `;
}

export async function sendNewsletterAdminAccessTokenEmail({ token, to }: { token: string; to: string }) {
  const resend = getResendClient();
  const { from } = getEmailConfig();
  const settings = await getNewsletterSettings();
  const subject = bilingualSubject(settings.adminTokenSubject, "Fashion Gate Mall newsletter dashboard access token");
  const title = bilingual(settings.adminTokenTitle);
  const body = bilingual(settings.adminTokenBody);

  const result = await resend.emails.send(
    {
      from,
      to,
      replyTo: from,
      subject,
      html: `
        <!doctype html>
        <html>
          <body style="margin:0; padding:0; background:#f4efe8;">
            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f4efe8;">
              <tr>
                <td align="center" style="padding:34px 14px;">
                  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:560px; background:#fbfaf8; border-collapse:collapse;">
                    <tr>
                      <td style="background:#111111; padding:30px; text-align:center;">
                        <div style="font-family:Georgia, 'Times New Roman', serif; font-size:24px; letter-spacing:3px; color:#ffffff; text-transform:uppercase;">Fashion Gate Mall</div>
                        <div style="width:54px; height:1px; background:#CB6116; margin:16px auto 0;"></div>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding:34px 30px;">
                        <p style="margin:0 0 24px; font-family:Arial, sans-serif; font-size:12px; letter-spacing:2px; text-transform:uppercase; color:#8a7e73; text-align:center;">Newsletter Dashboard</p>
                        <div dir="rtl" style="text-align:right;">
                          <h1 style="margin:0; font-family:Georgia, 'Times New Roman', serif; font-size:34px; font-weight:400; color:#111111;">${escapeHtml(title.ar)}</h1>
                          <p style="margin:14px 0 0; font-family:Arial, sans-serif; font-size:14px; line-height:1.8; color:#5f5750;">${escapeHtml(body.ar)}</p>
                          ${renderTokenBlock(token, "رمز الدخول", "rtl")}
                        </div>
                        <div style="margin-top:34px; padding-top:30px; border-top:1px solid #CB6116;">
                          <h2 style="margin:0; font-family:Georgia, 'Times New Roman', serif; font-size:26px; font-weight:400; color:#111111;">${escapeHtml(title.en)}</h2>
                          <p style="margin:14px 0 0; font-family:Arial, sans-serif; font-size:14px; line-height:1.8; color:#5f5750;">${escapeHtml(body.en)}</p>
                          ${renderTokenBlock(token, "Access token", "ltr")}
                        </div>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </body>
        </html>
      `,
      text: [title.ar, body.ar, `رمز الدخول: ${token}`, "", title.en, body.en, `Access token: ${token}`].join("\n"),
    },
    { idempotencyKey: `newsletter-admin-token-${randomUUID()}` }
  );

  assertResendResult(result);
}
