import AboutClient from "@/components/AboutClient";
import { getAboutPageData } from "@/lib/sanity";
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
  const title = isAr ? "من نحن | فاشن غيت مول دمشق" : "About Us | Fashion Gate Mall Damascus";
  const description = isAr
    ? "تعرف على فاشن غيت مول دمشق — وجهة التجزئة الفاخرة الرائدة في بوليفارد دمشق والتي تجمع أشهر دور الأزياء العالمية، ومستحضرات التجميل، والمطاعم الراقية."
    : "Learn about Fashion Gate Mall Damascus — Syria's premier luxury retail destination at Damascus Boulevard, bringing global fashion houses, beauty, and fine dining under one roof.";
  const keywords = isAr
    ? ["من نحن فاشن غيت", "معرض بوليفارد دمشق", "الفخامة في سوريا", "مجموعة أنليميتد"]
    : ["About Fashion Gate", "Damascus Boulevard Showroom", "Luxury Syria", "Unlimited Group"];

  try {
    const data = await getAboutPageData();
    return buildMetadataFromSeo({
      seoData: data?.seo,
      fallback: { title, description, keywords },
      lang: lang as "ar" | "en",
      pathname: `about/${lang}`
    });
  } catch (e) {
    return buildMetadataFromSeo({
      fallback: { title, description },
      lang: lang as "ar" | "en",
      pathname: `about/${lang}`
    });
  }
}

export default async function AboutPage({ params }: PageProps) {
  const { lang } = await params;
  if (lang !== "ar" && lang !== "en") {
    notFound();
  }

  let initialData = null;
  try {
    initialData = await getAboutPageData();
  } catch (error) {
    console.error("Failed to load about page data from Sanity:", error);
  }

  const breadcrumbsJsonLd = buildBreadcrumbsJsonLd([
    { name: lang === "ar" ? "الرئيسية" : "Home", url: `https://fashiongatemall.com/${lang}` },
    { name: lang === "ar" ? "من نحن" : "About Us", url: `https://fashiongatemall.com/about/${lang}` }
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbsJsonLd) }}
      />
      <AboutClient initialLang={lang as "ar" | "en"} initialData={initialData} />
    </>
  );
}
