import { NextResponse } from "next/server";
import { z } from "zod";
import { verifyNewsletterAccessToken } from "@/lib/newsletter/admin";

const verifySchema = z.object({
  token: z.string().trim().toUpperCase().regex(/^FGM-[A-Z0-9]{12}$/),
}).strict();

export async function POST(request: Request) {
  const parsed = verifySchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ success: false, message: "Enter the access token from support email." }, { status: 400 });
  }

  const sessionToken = await verifyNewsletterAccessToken(request, parsed.data.token);
  if (!sessionToken) {
    return NextResponse.json({ success: false, message: "Invalid or expired access token." }, { status: 401 });
  }

  return NextResponse.json({
    success: true,
    message: "Dashboard verified.",
    sessionToken,
  });
}
