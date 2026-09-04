import "server-only";

import { randomUUID } from "crypto";
import { bilingual, bilingualSubject, getNewsletterSettings } from "@/lib/newsletter/settings";
import { assertResendResult } from "./assert-resend-result";
import { getEmailConfig, getResendClient } from "./resend";

const PUBLIC_ASSET_URL = process.env.EMAIL_PUBLIC_ASSET_URL || "https://fashiongatemall.com";
const LOGO_URL = `${PUBLIC_ASSET_URL.replace(/\/$/, "")}/brand/logo.png`;
const BRAND_ADDRESS = "Fashion Gate Mall, Damascus Boulevard, Syria";
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
  body,
  footerNote,
  contactBlock,
}: {
  eyebrow: string;
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
                  <td style="padding:38px 34px;">
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

function renderInfoRows(rows: Array<[string, string]>, dir: "rtl" | "ltr") {
  const align = dir === "rtl" ? "right" : "left";

  return `
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-collapse:collapse;">
      ${rows
        .map(
          ([label, value]) => `
            <tr>
              <td style="padding:13px 0; border-bottom:1px solid #e2d8cf; font-family:Arial, sans-serif; font-size:12px; letter-spacing:1.2px; color:#8a7e73; text-transform:uppercase; width:135px; text-align:${align};">
                ${label}
              </td>
              <td style="padding:13px 0; border-bottom:1px solid #e2d8cf; font-family:Arial, sans-serif; font-size:14px; line-height:1.6; color:#111111; text-align:${align};">
                ${value}
              </td>
            </tr>
          `
        )
        .join("")}
    </table>
  `;
}

function renderContactBlock(email: string) {
  const safeSupportEmail = escapeHtml(email);

  return `
    <div style="margin-top:30px; padding-top:22px; border-top:1px solid #ded2c8;">
      <p style="margin:0 0 20px; font-family:Arial, sans-serif; font-size:14px; line-height:1.8; color:#5f5750;">
        Best regards,<br />
        <strong style="color:#111111;">Fashion Gate Mall</strong>
      </p>
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

function renderLanguageIntro({
  title,
  intro,
  dir,
  divider,
}: {
  title: string;
  intro: string;
  dir: "rtl" | "ltr";
  divider?: boolean;
}) {
  const align = dir === "rtl" ? "right" : "left";

  return `
    <div dir="${dir}" style="${divider ? "margin-top:34px; padding-top:30px; border-top:1px solid #CB6116;" : ""} text-align:${align};">
      <h1 style="margin:0; font-family:Georgia, 'Times New Roman', serif; font-size:${dir === "rtl" ? "34px" : "30px"}; line-height:1.14; font-weight:400; color:#111111;">
        ${title}
      </h1>
      <p style="margin:14px 0 0; font-family:Arial, sans-serif; font-size:15px; line-height:1.85; color:#5f5750;">
        ${intro}
      </p>
    </div>
  `;
}

function renderMessageBox(label: string, message: string, dir: "rtl" | "ltr") {
  const align = dir === "rtl" ? "right" : "left";

  return `
    <div dir="${dir}" style="margin-top:24px; padding:24px; background:#ffffff; border-top:1px solid #CB6116; border-bottom:1px solid #e2d8cf; text-align:${align};">
      <div style="font-family:Arial, sans-serif; font-size:12px; letter-spacing:1.4px; color:#8a7e73; text-transform:uppercase; margin-bottom:10px;">${label}</div>
      <div style="font-family:Georgia, 'Times New Roman', serif; font-size:18px; line-height:1.65; color:#111111;">${message}</div>
    </div>
  `;
}

export async function sendContactEmail(input: ContactEmailInput) {
  const resend = getResendClient();
  const { from, to } = getEmailConfig();
  const settings = await getNewsletterSettings();
  const supportSubject = bilingualSubject(settings.contactSupportSubject, "New Website Enquiry - Fashion Gate Mall");
  const supportTitle = bilingual(settings.contactSupportTitle);
  const supportIntro = bilingual(settings.contactSupportIntro);
  const customerSubject = bilingualSubject(settings.contactCustomerSubject, "We received your message");
  const customerIntro = bilingual(settings.contactCustomerIntro);
  const customerBody = bilingual(settings.contactCustomerBody);
  const replyFooter = bilingual(settings.contactReplyFooter);
  const ackFooter = bilingual(settings.contactAckFooter);
  const idempotencyKey = input.idempotencyKey || randomUUID();
  const safeName = escapeHtml(input.name);
  const safeEmail = escapeHtml(input.email);
  const safePhone = input.phone ? escapeHtml(input.phone) : "Not provided";
  const safeMessage = escapeHtml(input.message).replace(/\n/g, "<br />");
  const safeSource = escapeHtml(input.source);
  const safePageUrl = input.pageUrl ? escapeHtml(input.pageUrl) : "Not provided";
  const safeSubmittedAt = escapeHtml(formatDate(input.submittedAt));
  const safeLanguage = escapeHtml(input.language.toUpperCase());
  const mailTo = `<a href="mailto:${safeEmail}" style="color:#CB6116; text-decoration:none;">${safeEmail}</a>`;

  const supportHtml = renderShell({
    eyebrow: "Client Services",
    body: `
      ${renderLanguageIntro({ title: escapeHtml(supportTitle.ar), intro: escapeHtml(supportIntro.ar), dir: "rtl" })}
      <div dir="rtl" style="margin-top:22px;">
        ${renderInfoRows(
          [
            ["الاسم", safeName],
            ["البريد الإلكتروني", mailTo],
            ["الهاتف", safePhone],
            ["اللغة", safeLanguage],
            ["المصدر", safeSource],
            ["الصفحة", safePageUrl],
            ["تاريخ الإرسال", safeSubmittedAt],
          ],
          "rtl"
        )}
        ${renderMessageBox("الرسالة", safeMessage, "rtl")}
      </div>
      ${renderLanguageIntro({ title: escapeHtml(supportTitle.en), intro: escapeHtml(supportIntro.en), dir: "ltr", divider: true })}
      <div style="margin-top:22px;">
        ${renderInfoRows(
          [
            ["Name", safeName],
            ["Email", mailTo],
            ["Phone", safePhone],
            ["Language", safeLanguage],
            ["Source", safeSource],
            ["Page", safePageUrl],
            ["Submitted", safeSubmittedAt],
          ],
          "ltr"
        )}
        ${renderMessageBox("Message", safeMessage, "ltr")}
      </div>
    `,
    footerNote: `${escapeHtml(replyFooter.ar)}<br />${escapeHtml(replyFooter.en)}`,
    contactBlock: renderContactBlock(to),
  });

  const customerHtml = renderShell({
    eyebrow: "Message Received",
    body: `
      ${renderLanguageIntro({ title: `شكراً لك، ${safeName}`, intro: escapeHtml(customerIntro.ar), dir: "rtl" })}
      <div dir="rtl" style="margin-top:24px; padding:24px; background:#ffffff; border-top:1px solid #CB6116; border-bottom:1px solid #e2d8cf; text-align:right;">
        <p style="margin:0; font-family:Arial, sans-serif; font-size:15px; line-height:1.85; color:#4d4741;">
          ${escapeHtml(customerBody.ar)}
        </p>
      </div>
      ${renderLanguageIntro({ title: `Thank you, ${safeName}`, intro: escapeHtml(customerIntro.en), dir: "ltr", divider: true })}
      <div style="margin-top:24px; padding:24px; background:#ffffff; border-top:1px solid #CB6116; border-bottom:1px solid #e2d8cf;">
        <p style="margin:0; font-family:Arial, sans-serif; font-size:15px; line-height:1.85; color:#4d4741;">
          ${escapeHtml(customerBody.en)}
        </p>
      </div>
    `,
    footerNote: `${escapeHtml(ackFooter.ar)}<br />${escapeHtml(ackFooter.en)}`,
    contactBlock: renderContactBlock(to),
  });

  const supportResult = await resend.emails.send(
    {
      from,
      to,
      replyTo: input.email,
      subject: supportSubject,
      html: supportHtml,
      text: [
        supportSubject,
        "",
        supportTitle.ar,
        supportIntro.ar,
        `الاسم: ${input.name}`,
        `البريد الإلكتروني: ${input.email}`,
        `الهاتف: ${input.phone || "Not provided"}`,
        `اللغة: ${input.language}`,
        `المصدر: ${input.source}`,
        `الصفحة: ${input.pageUrl || "Not provided"}`,
        `تاريخ الإرسال: ${input.submittedAt}`,
        "",
        input.message,
        "",
        supportTitle.en,
        supportIntro.en,
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
      subject: customerSubject,
      html: customerHtml,
      text: [
        customerSubject,
        "",
        `شكراً لك، ${input.name}`,
        customerIntro.ar,
        customerBody.ar,
        "",
        `Thank you, ${input.name}`,
        customerIntro.en,
        customerBody.en,
        "",
        "Best regards,",
        "Fashion Gate Mall",
      ].join("\n"),
    },
    { idempotencyKey: `${idempotencyKey}-ack` }
  );
  assertResendResult(customerResult);
}
