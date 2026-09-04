import { NextResponse } from "next/server";
import { createClient } from "@sanity/client";
import { isAuthorizedNewsletterAdmin, unauthorizedResponse } from "@/lib/newsletter/admin";
import { apiVersion, dataset, projectId } from "@/lib/sanity";

const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);

const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
  token: process.env.SANITY_API_WRITE_TOKEN || process.env.SANITY_API_TOKEN,
});

export async function POST(request: Request) {
  if (!(await isAuthorizedNewsletterAdmin(request))) return unauthorizedResponse();

  if (!client.config().token) {
    return NextResponse.json({ success: false, message: "Sanity token missing." }, { status: 500 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get("image");

    if (!(file instanceof File)) {
      return NextResponse.json({ success: false, message: "Please choose an image." }, { status: 400 });
    }

    if (!ALLOWED_IMAGE_TYPES.has(file.type)) {
      return NextResponse.json({ success: false, message: "Use JPG, PNG, WEBP, or GIF images only." }, { status: 400 });
    }

    if (file.size > MAX_IMAGE_BYTES) {
      return NextResponse.json({ success: false, message: "Image must be 5 MB or smaller." }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const asset = await client.assets.upload("image", buffer, {
      filename: file.name,
      contentType: file.type,
    });

    return NextResponse.json({
      success: true,
      message: "Image uploaded.",
      assetId: asset._id,
      imageUrl: asset.url,
    });
  } catch (error) {
    console.error("Newsletter image upload failed", error instanceof Error ? error.message : "Unknown error");
    return NextResponse.json({ success: false, message: "Unable to upload image right now." }, { status: 500 });
  }
}
