import "server-only";

import { Resend } from "resend";

let resend: Resend | null = null;

export function getResendClient() {
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    throw new Error("RESEND_API_KEY is not configured");
  }

  if (!resend) {
    resend = new Resend(apiKey);
  }

  return resend;
}

export function getEmailConfig() {
  return {
    from: process.env.EMAIL_FROM || "Fashion Gate Mall <noreply@fashiongatemall.com>",
    to: process.env.EMAIL_TO || "support@fashiongatemall.com",
  };
}
