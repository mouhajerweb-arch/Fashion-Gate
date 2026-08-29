import type { MetadataRoute } from "next";
import { sanityClient } from "@/lib/sanity";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://fashiongatemall.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const languages = ["en", "ar"];
  const sitemapEntries: MetadataRoute.Sitemap = [];

  // 1. Static Routes (excl. redirects like root /dining)
  const staticRoutes = [
    "",
    "about",
    "blogs",
    "brand",
    "contact",
    "terms",
    "privacy"
  ];

  staticRoutes.forEach((route) => {
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

  // 2. Category Pages
  const categories = [
    "fashion",
    "perfumes",
    "skincare",
    "beauty",
    "makeup",
    "dining",
    "women",
    "men"
  ];
  categories.forEach((cat) => {
    languages.forEach((lang) => {
      sitemapEntries.push({
        url: `${SITE_URL}/category/${cat}/${lang}`,
        lastModified: new Date(),
        changeFrequency: "daily",
        priority: 0.9
      });
    });
  });

  // 3. Restaurant Pages
  const diningSpots = ["vilamore", "the-espresso-lab"];
  diningSpots.forEach((spot) => {
    languages.forEach((lang) => {
      sitemapEntries.push({
        url: `${SITE_URL}/dining/${spot}/${lang}`,
        lastModified: new Date(),
        changeFrequency: "weekly",
        priority: 0.8
      });
    });
  });

  // 4. Dynamic Sanity Brand Pages
  try {
    const brandSlugs = await sanityClient.fetch<string[]>(
      `*[_type == "brand" && isActive == true && defined(slug.current)].slug.current`
    );
    brandSlugs.forEach((slug) => {
      languages.forEach((lang) => {
        sitemapEntries.push({
          url: `${SITE_URL}/brand/${slug}/${lang}`,
          lastModified: new Date(),
          changeFrequency: "weekly",
          priority: 0.8
        });
      });
    });
  } catch (err) {
    console.error("Error fetching sitemap brand slugs:", err);
  }

  // 5. Dynamic Sanity Product Pages
  try {
    const productSlugs = await sanityClient.fetch<string[]>(
      `*[_type == "product" && defined(slug.current)].slug.current`
    );
    productSlugs.forEach((slug) => {
      languages.forEach((lang) => {
        sitemapEntries.push({
          url: `${SITE_URL}/product/${slug}/${lang}`,
          lastModified: new Date(),
          changeFrequency: "weekly",
          priority: 0.7
        });
      });
    });
  } catch (err) {
    console.error("Error fetching sitemap product slugs:", err);
  }

  // 6. Dynamic Sanity Blog Post Pages
  try {
    const blogSlugs = await sanityClient.fetch<string[]>(
      `*[_type == "post" && defined(slug.current)].slug.current`
    );
    blogSlugs.forEach((slug) => {
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
    console.error("Error fetching sitemap blog post slugs:", err);
  }

  return sitemapEntries;
}
