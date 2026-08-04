import type { MetadataRoute } from "next";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://fashiongatemall.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const routes = [
    "",
    "about",
    "blogs",
    "brand",
    "dining",
    "contact",
    "terms",
    "privacy"
  ];

  const languages = ["en", "ar"];
  const sitemapEntries: MetadataRoute.Sitemap = [];

  // Static routes for en and ar
  routes.forEach((route) => {
    languages.forEach((lang) => {
      const urlPath = route ? `${route}/${lang}` : lang;
      sitemapEntries.push({
        url: `${SITE_URL}/${urlPath}`,
        lastModified: new Date(),
        changeFrequency: route === "" ? "daily" : "weekly",
        priority: route === "" ? 1.0 : 0.8
      });
    });
  });

  // Dining / Restaurant pages
  const diningSpots = ["vilamore", "the-espresso-lab"];
  diningSpots.forEach((spot) => {
    languages.forEach((lang) => {
      sitemapEntries.push({
        url: `${SITE_URL}/dining/${spot}/${lang}`,
        lastModified: new Date(),
        changeFrequency: "weekly",
        priority: 0.9
      });
    });
  });

  // Dynamic Sanity Blog Slugs
  try {
    const { getAllSanityBlogPostSlugs } = await import("@/lib/sanity");
    const blogSlugs = await getAllSanityBlogPostSlugs();
    blogSlugs.forEach(({ slug }) => {
      languages.forEach((lang) => {
        sitemapEntries.push({
          url: `${SITE_URL}/blogs/${slug}/${lang}`,
          lastModified: new Date(),
          changeFrequency: "weekly",
          priority: 0.7
        });
      });
    });
  } catch (err) {
    console.error("Error generating sitemap blog slugs:", err);
  }

  return sitemapEntries;
}
