import TermsClient from "@/components/TermsClient";
import { getTermsPageData } from "@/lib/sanity";
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
  const title = isAr ? "الشروط والأحكام | فاشن غيت مول دمشق" : "Terms & Conditions | Fashion Gate Mall Damascus";
  const description = isAr
    ? "اقرأ الشروط والأحكام في فاشن غيت مول دمشق للتعرف على شروط الاستخدام وقوانين كونسيرج التجزئة الفاخرة."
    : "Read the Terms & Conditions of Fashion Gate Mall Damascus to understand the usage terms, rules, and luxury concierge conditions.";
  const keywords = isAr
    ? ["شروط فاشن غيت", "اتفاقية الاستخدام سوريا", "الكونسيرج الفاخر دمشق"]
    : ["Terms Fashion Gate", "User Agreement Syria", "Luxury Concierge Terms Damascus"];

  try {
    const data = await getTermsPageData();
    return buildMetadataFromSeo({
      seoData: data?.seo,
      fallback: { title, description, keywords },
      lang: lang as "ar" | "en",
      pathname: `terms/${lang}`
    });
  } catch (e) {
    return buildMetadataFromSeo({
      fallback: { title, description },
      lang: lang as "ar" | "en",
      pathname: `terms/${lang}`
    });
  }
}

export default async function TermsPage({ params }: PageProps) {
  const { lang } = await params;
  if (lang !== "ar" && lang !== "en") {
    notFound();
  }

  let initialData = null;
  try {
    initialData = await Promise.race([
      getTermsPageData(),
      new Promise<null>((resolve) => setTimeout(() => resolve(null), 1500))
    ]);
  } catch (error) {
    console.error("Failed to load terms data from Sanity:", error);
  }

  const breadcrumbsJsonLd = buildBreadcrumbsJsonLd([
    { name: lang === "ar" ? "الرئيسية" : "Home", url: `https://fashiongatemall.com/${lang}` },
    { name: lang === "ar" ? "الشروط والأحكام" : "Terms & Conditions", url: `https://fashiongatemall.com/terms/${lang}` }
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbsJsonLd) }}
      />
      <TermsClient lang={lang as "ar" | "en"} initialData={initialData} />
    </>
  );
}
