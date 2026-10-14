import type { MetadataRoute } from "next";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://fashiongatemall.com";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/studio/", "/api/"]
    },
    sitemap: process.env.FG_WORDPRESS_ORIGIN
      ? [`${SITE_URL}/sitemap.xml`, "https://www.fashiongatemall.com/landing/sitemap_index.xml"]
      : `${SITE_URL}/sitemap.xml`
  };
}
