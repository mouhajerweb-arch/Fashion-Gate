import PrivacyClient from "@/components/PrivacyClient";
import { getPrivacyPageData } from "@/lib/sanity";
import { buildMetadataFromSeo, buildBreadcrumbsJsonLd } from "@/lib/seo";
import { notFound } from "next/navigation";

export const revalidate = 60;

interface PageProps {
  params: Promise<{
    lang: string;
  }>;
}

export async function generateStaticParams() {
  return [{ lang: "ar" }, { lang: "en" }];
}

export async function generateMetadata({ params }: PageProps) {
  const { lang } = await params;
  if (lang !== "ar" && lang !== "en") return {};

  const isAr = lang === "ar";
  const title = isAr ? "سياسة الخصوصية | فاشن غيت مول دمشق" : "Privacy Policy | Fashion Gate Mall Damascus";
  const description = isAr
    ? "اقرأ سياسة الخصوصية لفهم كيفية حماية فاشن غيت مول دمشق لمعلوماتك الشخصية وطلبات الكونسيرج وحقوق الخصوصية."
    : "Read the Privacy Policy to understand how Fashion Gate Mall Damascus protects your personal information, concierge requests, and privacy rights.";
  const keywords = isAr
    ? ["خصوصية فاشن غيت", "سياسة الخصوصية سوريا", "حماية البيانات بوليفارد دمشق"]
    : ["Privacy Fashion Gate", "Privacy Policy Syria", "Data Protection Damascus Boulevard"];

  try {
    const data = await getPrivacyPageData();
    return buildMetadataFromSeo({
      seoData: data?.seo,
      fallback: { title, description, keywords },
      lang: lang as "ar" | "en",
      pathname: `privacy/${lang}`
    });
  } catch (e) {
    return buildMetadataFromSeo({
      fallback: { title, description },
      lang: lang as "ar" | "en",
      pathname: `privacy/${lang}`
    });
  }
}

export default async function PrivacyPage({ params }: PageProps) {
  const { lang } = await params;
  if (lang !== "ar" && lang !== "en") {
    notFound();
  }

  let initialData = null;
  try {
    initialData = await Promise.race([
      getPrivacyPageData(),
      new Promise<null>((resolve) => setTimeout(() => resolve(null), 1500))
    ]);
  } catch (error) {
    console.error("Failed to load privacy data from Sanity:", error);
  }

  const breadcrumbsJsonLd = buildBreadcrumbsJsonLd([
    { name: lang === "ar" ? "الرئيسية" : "Home", url: `https://fashiongatemall.com/${lang}` },
    { name: lang === "ar" ? "سياسة الخصوصية" : "Privacy Policy", url: `https://fashiongatemall.com/privacy/${lang}` }
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbsJsonLd) }}
      />
      <PrivacyClient lang={lang as "ar" | "en"} initialData={initialData} />
    </>
  );
}
