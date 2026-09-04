import "server-only";

import { randomUUID } from "crypto";
import { assertResendResult } from "./assert-resend-result";
import { getEmailConfig, getResendClient } from "./resend";

const PUBLIC_ASSET_URL = process.env.EMAIL_PUBLIC_ASSET_URL || "https://fashiongatemall.com";
const LOGO_URL = `${PUBLIC_ASSET_URL.replace(/\/$/, "")}/brand/logo.png`;
const BRAND_ADDRESS = "Fashion Gate Boulevard, Damascus, Syria";
const BRAND_PHONE = "+963 930 000 000";

type ContactEmailInput = {
  name: string;
  email: string;
  phone?: string;
  message: string;
  source: string;
  pageUrl?: string;
  language: "en" | "ar";
  submittedAt: string;
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

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Asia/Dubai",
  }).format(new Date(value));
}

function renderShell({
  eyebrow,
  title,
  intro,
  body,
  footerNote,
  contactBlock,
}: {
  eyebrow: string;
  title: string;
  intro: string;
  body: string;
  footerNote: string;
  contactBlock?: string;
}) {
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
                      ${eyebrow}
                    </div>
                  </td>
                </tr>
                <tr>
                  <td style="padding:38px 34px 8px;">
                    <h1 style="margin:0; font-family:Georgia, 'Times New Roman', serif; font-size:34px; line-height:1.12; font-weight:400; color:#111111;">
                      ${title}
                    </h1>
                    <p style="margin:14px 0 0; font-family:Arial, sans-serif; font-size:15px; line-height:1.75; color:#5f5750;">
                      ${intro}
                    </p>
                  </td>
                </tr>
                <tr>
                  <td style="padding:24px 34px 38px;">
                    ${body}
                    ${contactBlock || ""}
                  </td>
                </tr>
                <tr>
                  <td style="background:#eee6dd; padding:22px 34px; text-align:center; border-top:1px solid #ded2c8;">
                    <p style="margin:0; font-family:Arial, sans-serif; font-size:12px; line-height:1.7; color:#756b62;">
                      ${footerNote}
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

function renderInfoRow(label: string, value: string) {
  return `
    <tr>
      <td style="padding:13px 0; border-bottom:1px solid #e2d8cf; font-family:Arial, sans-serif; font-size:12px; letter-spacing:1.2px; color:#8a7e73; text-transform:uppercase; width:130px;">
        ${label}
      </td>
      <td style="padding:13px 0; border-bottom:1px solid #e2d8cf; font-family:Arial, sans-serif; font-size:14px; line-height:1.6; color:#111111;">
        ${value}
      </td>
    </tr>
  `;
}

function renderContactBlock(email: string) {
  const safeSupportEmail = escapeHtml(email);

  return `
    <div style="margin-top:28px; padding-top:22px; border-top:1px solid #ded2c8;">
      <div style="font-family:Arial, sans-serif; font-size:11px; letter-spacing:1.5px; color:#8a7e73; text-transform:uppercase; margin-bottom:10px;">Contact</div>
      <div style="font-family:Arial, sans-serif; font-size:13px; line-height:1.8; color:#4d4741;">
        ${BRAND_ADDRESS}<br />
        <a href="tel:${BRAND_PHONE.replace(/\s/g, "")}" style="color:#CB6116; text-decoration:none;">${BRAND_PHONE}</a><br />
        <a href="mailto:${safeSupportEmail}" style="color:#CB6116; text-decoration:none;">${safeSupportEmail}</a><br />
        <a href="https://fashiongatemall.com" style="color:#CB6116; text-decoration:none;">fashiongatemall.com</a>
      </div>
    </div>
  `;
}

export async function sendContactEmail(input: ContactEmailInput) {
  const resend = getResendClient();
  const { from, to } = getEmailConfig();
  const idempotencyKey = input.idempotencyKey || randomUUID();
  const safeName = escapeHtml(input.name);
  const safeEmail = escapeHtml(input.email);
  const safePhone = input.phone ? escapeHtml(input.phone) : "Not provided";
  const safeMessage = escapeHtml(input.message).replace(/\n/g, "<br />");
  const safeSource = escapeHtml(input.source);
  const safePageUrl = input.pageUrl ? escapeHtml(input.pageUrl) : "Not provided";
  const safeSubmittedAt = escapeHtml(formatDate(input.submittedAt));
  const supportHtml = renderShell({
    eyebrow: "Client Services",
    title: "New website enquiry",
    intro: "A new contact request has been submitted through the Fashion Gate Mall website.",
    body: `
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-collapse:collapse;">
        ${renderInfoRow("Name", safeName)}
        ${renderInfoRow("Email", `<a href="mailto:${safeEmail}" style="color:#CB6116; text-decoration:none;">${safeEmail}</a>`)}
        ${renderInfoRow("Phone", safePhone)}
        ${renderInfoRow("Language", escapeHtml(input.language.toUpperCase()))}
        ${renderInfoRow("Source", safeSource)}
        ${renderInfoRow("Page", safePageUrl)}
        ${renderInfoRow("Submitted", safeSubmittedAt)}
      </table>
      <div style="margin-top:28px; padding:24px; background:#ffffff; border-left:3px solid #CB6116;">
        <div style="font-family:Arial, sans-serif; font-size:12px; letter-spacing:1.4px; color:#8a7e73; text-transform:uppercase; margin-bottom:10px;">Message</div>
        <div style="font-family:Georgia, 'Times New Roman', serif; font-size:19px; line-height:1.65; color:#111111;">${safeMessage}</div>
      </div>
    `,
    footerNote: "Reply to this email to respond directly to the customer.",
    contactBlock: renderContactBlock(to),
  });
  const customerHtml = renderShell({
    eyebrow: "Message Received",
    title: `Thank you, ${safeName}`,
    intro: "Your message has reached Fashion Gate Mall. Our client services team will review it and get back to you shortly.",
    body: `
      <div style="padding:26px; background:#ffffff; border-top:1px solid #CB6116; border-bottom:1px solid #e2d8cf;">
        <p style="margin:0; font-family:Arial, sans-serif; font-size:15px; line-height:1.8; color:#4d4741;">
          We appreciate you taking the time to contact us. A member of our team will follow up with you as soon as possible.
        </p>
      </div>
      <p style="margin:24px 0 0; font-family:Arial, sans-serif; font-size:14px; line-height:1.8; color:#5f5750;">
        Regards,<br />
        <strong style="color:#111111;">Fashion Gate Mall</strong>
      </p>
    `,
    footerNote: "This is an automated acknowledgement from Fashion Gate Mall.",
    contactBlock: renderContactBlock(to),
  });

  const supportResult = await resend.emails.send(
    {
      from,
      to,
      replyTo: input.email,
      subject: "New Website Enquiry - Fashion Gate Mall",
      html: supportHtml,
      text: [
        "New Website Enquiry - Fashion Gate Mall",
        `Name: ${input.name}`,
        `Email: ${input.email}`,
        `Phone: ${input.phone || "Not provided"}`,
        `Language: ${input.language}`,
        `Source: ${input.source}`,
        `Page: ${input.pageUrl || "Not provided"}`,
        `Submitted: ${input.submittedAt}`,
        "",
        input.message,
      ].join("\n"),
    },
    { idempotencyKey }
  );
  assertResendResult(supportResult);

  const customerResult = await resend.emails.send(
    {
      from,
      to: input.email,
      replyTo: from,
      subject: "We received your message",
      html: customerHtml,
      text: [
        `Hi ${input.name},`,
        "",
        "Thank you for contacting Fashion Gate Mall.",
        "",
        "We have received your message and our team will get back to you shortly.",
        "",
        "Regards,",
        "Fashion Gate Mall",
      ].join("\n"),
    },
    { idempotencyKey: `${idempotencyKey}-ack` }
  );
  assertResendResult(customerResult);
}
