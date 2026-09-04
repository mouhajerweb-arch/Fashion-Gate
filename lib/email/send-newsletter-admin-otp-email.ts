import "server-only";

import { randomUUID } from "crypto";
import { assertResendResult } from "./assert-resend-result";
import { getEmailConfig, getResendClient } from "./resend";

export async function sendNewsletterAdminAccessTokenEmail({ token, to }: { token: string; to: string }) {
  const resend = getResendClient();
  const { from } = getEmailConfig();

  const result = await resend.emails.send(
    {
      from,
      to,
      replyTo: from,
      subject: "Fashion Gate Mall newsletter dashboard access token",
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
                      <td style="padding:34px 30px; text-align:center;">
                        <p style="margin:0 0 14px; font-family:Arial, sans-serif; font-size:12px; letter-spacing:2px; text-transform:uppercase; color:#8a7e73;">Newsletter Dashboard</p>
                        <h1 style="margin:0; font-family:Georgia, 'Times New Roman', serif; font-size:34px; font-weight:400; color:#111111;">Your Access Token</h1>
                        <div style="margin:26px auto; display:inline-block; padding:16px 22px; background:#111111; color:#ffffff; font-family:Arial, sans-serif; font-size:22px; font-weight:700; letter-spacing:3px;">${token}</div>
                        <p style="margin:0; font-family:Arial, sans-serif; font-size:14px; line-height:1.8; color:#5f5750;">This token expires in 10 minutes. Paste it in the newsletter dashboard only if you requested access.</p>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </body>
        </html>
      `,
      text: `Fashion Gate Mall newsletter dashboard access token: ${token}\n\nThis token expires in 10 minutes.`,
    },
    { idempotencyKey: `newsletter-admin-token-${randomUUID()}` }
  );

  assertResendResult(result);
}
