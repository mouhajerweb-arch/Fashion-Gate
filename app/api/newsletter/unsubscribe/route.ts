import { NextResponse } from "next/server";
import { createClient } from "@sanity/client";
import { z } from "zod";
import { apiVersion, dataset, projectId } from "@/lib/sanity";

const writeClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
  token: process.env.SANITY_API_WRITE_TOKEN || process.env.SANITY_API_TOKEN,
});

const unsubscribeSchema = z.object({
  token: z.string().trim().min(10).max(120),
}).strict();

export async function POST(request: Request) {
  if (!writeClient.config().token) {
    return NextResponse.json(
      { success: false, message: "Unable to unsubscribe right now." },
      { status: 500 }
    );
  }

  try {
    const body = await request.json();
    const parsed = unsubscribeSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, message: "Invalid unsubscribe request." },
        { status: 400 }
      );
    }

    const subscriber = await writeClient.fetch<{ _id: string } | null>(
      `*[_type == "newsletterSubscriber" && unsubscribeToken == $token][0]{_id}`,
      { token: parsed.data.token } as Record<string, string>
    );

    if (subscriber?._id) {
      await writeClient
        .patch(subscriber._id)
        .set({ status: "unsubscribed", unsubscribedAt: new Date().toISOString() })
        .commit();
    }

    return NextResponse.json({ success: true, message: "You have been unsubscribed." });
  } catch (error) {
    console.error("Newsletter unsubscribe failed", error instanceof Error ? error.message : "Unknown error");
    return NextResponse.json(
      { success: false, message: "Unable to unsubscribe right now." },
      { status: 500 }
    );
  }
}
