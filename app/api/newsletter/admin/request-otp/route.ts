import { NextResponse } from "next/server";
import { checkRateLimit } from "@/lib/rate-limit/contact";
import { sendNewsletterAdminAccessTokenEmail } from "@/lib/email/send-newsletter-admin-otp-email";
import { generateNewsletterAccessToken, getNewsletterAdminEmail, storeNewsletterAccessToken } from "@/lib/newsletter/admin";

function getClientIp(request: Request) {
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) return forwardedFor.split(",")[0]?.trim() || "unknown";
  return request.headers.get("x-real-ip") || "unknown";
}

export async function POST(request: Request) {
  const rateLimit = await checkRateLimit({
    key: getClientIp(request),
    namespace: "newsletter-admin-token",
    maxRequests: 3,
    windowMs: 10 * 60 * 1000,
  });

  if (!rateLimit.allowed) {
    return NextResponse.json({ success: false, message: "Too many token requests. Please try again later." }, { status: 429 });
  }

  try {
    const token = generateNewsletterAccessToken();
    const to = getNewsletterAdminEmail();
    await storeNewsletterAccessToken(request, token);
    await sendNewsletterAdminAccessTokenEmail({ token, to });

    return NextResponse.json({
      success: true,
      message: `Access token sent to ${to}.`,
    });
  } catch (error) {
    console.error("Newsletter admin token request failed", error instanceof Error ? error.message : "Unknown error");
    return NextResponse.json({ success: false, message: "Unable to send access token right now." }, { status: 500 });
  }
}
