import { NextResponse } from "next/server";
import { createClient } from "@sanity/client";
import { isAuthorizedNewsletterAdmin, unauthorizedResponse } from "@/lib/newsletter/admin";
import { apiVersion, dataset, projectId } from "@/lib/sanity";

const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
  token: process.env.SANITY_API_WRITE_TOKEN || process.env.SANITY_API_TOKEN,
});

export async function GET(request: Request) {
  if (!(await isAuthorizedNewsletterAdmin(request))) return unauthorizedResponse();

  if (!client.config().token) {
    return NextResponse.json({ success: false, message: "Sanity token missing." }, { status: 500 });
  }

  const [subscribed, unsubscribed, sentCampaigns] = await Promise.all([
    client.fetch<number>(`count(*[_type == "newsletterSubscriber" && status == "subscribed"])`),
    client.fetch<number>(`count(*[_type == "newsletterSubscriber" && status == "unsubscribed"])`),
    client.fetch<number>(`count(*[_type == "newsletterCampaign" && status == "sent"])`),
  ]);

  return NextResponse.json({
    success: true,
    stats: {
      subscribed,
      unsubscribed,
      sentCampaigns,
    },
  });
}
