import BlogExperience from "@/components/BlogExperience";
import { getSanityBlogPosts, getBlogsPageSettings, getAllSanityBlogPostSlugs } from "@/lib/sanity";
import { buildMetadataFromSeo, buildBreadcrumbsJsonLd } from "@/lib/seo";
import { notFound, redirect } from "next/navigation";

export const revalidate = 60;

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  const blogSlugs = await getAllSanityBlogPostSlugs();
  const slugParams = blogSlugs.map((s) => ({ slug: s.slug }));
  return [
    { slug: "ar" },
    { slug: "en" },
    ...slugParams
  ];
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  
  if (slug === "ar" || slug === "en") {
    const isAr = slug === "ar";
    const title = isAr ? "مجلة فاشن غيت | كتالوج المقالات والأخبار" : "Fashion Gate Journal | Editorial & News Directory";
    const description = isAr
      ? "مجلة فاشن غيت دمشق: مقالات تحريرية فاخرة، رؤى معمارية، وأحدث أخبار قطاع التجزئة والافتتاح الكبير في بوليفارد دمشق."
      : "Fashion Gate Journal: luxury editorials, architectural insights, and the latest news regarding premium retail openings in Damascus.";
    const keywords = isAr
      ? ["مجلة فاشن غيت", "أخبار الفخامة سوريا", "مهاجر الدولية للتصميم", "مول دمشق"]
      : ["Fashion Gate Journal", "Syria Luxury News", "Damascus Retail Opening", "Fashion Gate Blog"];

    try {
      const settings = await getBlogsPageSettings();
      return buildMetadataFromSeo({
        seoData: settings?.seo,
        fallback: { title, description, keywords },
        lang: slug as "ar" | "en",
        pathname: `blogs/${slug}`
      });
    } catch (e) {
      return buildMetadataFromSeo({
        fallback: { title, description },
        lang: slug as "ar" | "en",
        pathname: `blogs/${slug}`
      });
    }
  }

  return {};
}

export default async function BlogOrRedirectPage({ params }: PageProps) {
  const { slug } = await params;

  if (slug === "ar" || slug === "en") {
    const posts = await getSanityBlogPosts();
    const settings = await getBlogsPageSettings();

    const breadcrumbsJsonLd = buildBreadcrumbsJsonLd([
      { name: slug === "ar" ? "الرئيسية" : "Home", url: `https://fashiongatemall.com/${slug}` },
      { name: slug === "ar" ? "المجلة" : "Journal", url: `https://fashiongatemall.com/blogs/${slug}` }
    ]);

    return (
      <>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbsJsonLd) }}
        />
        <BlogExperience initialPosts={posts} settings={settings} initialLang={slug as "ar" | "en"} />
      </>
    );
  }

  // Redirect to localized blog detail page
  redirect(`/blogs/${slug}/ar`);
}
