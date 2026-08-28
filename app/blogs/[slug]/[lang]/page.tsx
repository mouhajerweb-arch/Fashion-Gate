import { getSanityBlogPost, getAllSanityBlogPostSlugs } from "@/lib/sanity";
import BlogDetailClient from "@/components/BlogDetailClient";
import { notFound } from "next/navigation";
import { buildMetadataFromSeo, buildBlogPostJsonLd, buildBreadcrumbsJsonLd } from "@/lib/seo";

export const revalidate = 60;

interface PageProps {
  params: Promise<{
    slug: string;
    lang: string;
  }>;
}

export async function generateStaticParams() {
  const slugs = await getAllSanityBlogPostSlugs();
  const params: { slug: string; lang: string }[] = [];
  for (const item of slugs) {
    params.push({ slug: item.slug, lang: "ar" });
    params.push({ slug: item.slug, lang: "en" });
  }
  return params;
}

export async function generateMetadata({ params }: PageProps) {
  const { slug, lang } = await params;
  if (lang !== "ar" && lang !== "en") return {};

  try {
    const post = await getSanityBlogPost(slug);
    if (!post) return {};

    const isAr = lang === "ar";
    const postTitle = isAr ? (post.titleAr || post.title) : (post.title || post.titleAr);
    const postExcerpt = isAr ? (post.excerptAr || post.excerpt) : (post.excerpt || post.excerptAr);

    return buildMetadataFromSeo({
      seoData: post.seo,
      fallback: {
        title: `${postTitle} | ${isAr ? "مجلة فاشن غيت" : "Fashion Gate Journal"}`,
        description: postExcerpt || `${postTitle} — ${isAr ? "مقال تحريري من مجلة فاشن غيت دمشق." : "Editorial piece from Fashion Gate Journal Damascus."}`,
        imageUrl: post.image,
        keywords: post.tags
      },
      lang: lang as "ar" | "en",
      pathname: `blogs/${slug}/${lang}`
    });
  } catch (e) {
    return {};
  }
}

export default async function BlogDetailPage({ params }: PageProps) {
  const { slug, lang } = await params;
  if (lang !== "ar" && lang !== "en") {
    notFound();
  }

  const post = await getSanityBlogPost(slug);
  if (!post) {
    notFound();
  }

  const isAr = lang === "ar";
  const postTitle = isAr ? (post.titleAr || post.title) : (post.title || post.titleAr);
  const postExcerpt = isAr ? (post.excerptAr || post.excerpt) : (post.excerpt || post.excerptAr);

  const blogPostJsonLd = buildBlogPostJsonLd({
    title: postTitle,
    excerpt: postExcerpt,
    image: post.image,
    publishedAt: post.publishedAt,
    authorName: post.author?.name,
    url: `https://fashiongatemall.com/blogs/${slug}/${lang}`
  });

  const breadcrumbsJsonLd = buildBreadcrumbsJsonLd([
    { name: isAr ? "الرئيسية" : "Home", url: `https://fashiongatemall.com/${lang}` },
    { name: isAr ? "المجلة" : "Journal", url: `https://fashiongatemall.com/blogs/${lang}` },
    { name: postTitle, url: `https://fashiongatemall.com/blogs/${slug}/${lang}` }
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogPostJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbsJsonLd) }}
      />
      <BlogDetailClient post={post} initialLang={lang as "ar" | "en"} />
    </>
  );
}
