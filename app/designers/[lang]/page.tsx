import DesignersClient from "@/components/DesignersClient";
import { getDesignerPageData, getSanityBrands, getDesignerCategories } from "@/lib/sanity";
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
  const title = isAr ? "دليل المصممين | فاشن غيت مول دمشق" : "Designers Directory | Fashion Gate Mall Damascus";
  const description = isAr
    ? "تصفح دليل المصممين الفاخر واستكشف دور الأزياء العالمية في فاشن غيت مول دمشق."
    : "Browse our luxury designers directory and explore international fashion houses at Fashion Gate Mall Damascus.";
  const keywords = isAr
    ? ["المصممون في دمشق", "دور أزياء فاخرة", "فاشن غيت دمشق"]
    : ["Designers in Damascus", "Luxury Fashion Houses", "Fashion Gate Damascus"];

  try {
    const settings = await getDesignerPageData();
    return buildMetadataFromSeo({
      seoData: settings?.seo,
      fallback: { title, description, keywords },
      lang: lang as "ar" | "en",
      pathname: `designers/${lang}`
    });
  } catch (e) {
    return buildMetadataFromSeo({
      fallback: { title, description },
      lang: lang as "ar" | "en",
      pathname: `designers/${lang}`
    });
  }
}

export default async function DesignersPage({ params }: PageProps) {
  const { lang } = await params;
  if (lang !== "ar" && lang !== "en") {
    notFound();
  }

  let settings = null;
  let brands: any[] = [];
  let categories: any[] = [];

  try {
    const [resSettings, resBrands, resCategories] = await Promise.all([
      getDesignerPageData(),
      getSanityBrands(),
      getDesignerCategories()
    ]);
    settings = resSettings;
    brands = resBrands || [];
    categories = (resSettings?.categorySections && resSettings.categorySections.length > 0)
      ? resSettings.categorySections
      : (resCategories || []);
  } catch (error) {
    console.error("Failed to load designers page data from Sanity:", error);
  }

  const isAr = lang === "ar";
  const breadcrumbsJsonLd = buildBreadcrumbsJsonLd([
    { name: isAr ? "الرئيسية" : "Home", url: `https://fashiongatemall.com/${lang}` },
    { name: isAr ? "المصممون" : "Designers", url: `https://fashiongatemall.com/designers/${lang}` }
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbsJsonLd) }}
      />
      <DesignersClient pageData={settings} categories={categories} initialLang={lang as "ar" | "en"} />
    </>
  );
}
