import { getHomepageData } from "@/lib/sanity";
import { fallbackSections, fallbackSettings } from "@/lib/fallbackData";
import Storefront from "@/components/Storefront";
import type { Section, SiteSettings } from "@/lib/types";
import { buildMetadataFromSeo, buildOrganizationJsonLd, buildStoreJsonLd } from "@/lib/seo";
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
  const title = isAr 
    ? "فاشن غيت مول دمشق | أول مول فاخر عالمي في سوريا"
    : "Fashion Gate Mall Syria | Syria's Premier Luxury Department Store";
  const description = isAr
    ? "فاشن غيت مول دمشق هو أول مجمع تجاري فاخر بمواصفات عالمية يقع في بوليفارد دمشق، ويجمع أشهر دور الأزياء العالمية، ومستحضرات التجميل، والمطاعم الراقية تحت سقف واحد."
    : "Fashion Gate Mall Syria is Syria's first international luxury department store located at Damascus Boulevard, bringing global fashion houses, fine apparel, beauty, and luxury dining under one roof.";
  const keywords = isAr
    ? ["فاشن غيت", "مول بوابة الأزياء دمشق", "بوليفارد دمشق", "أول مول فاخر في سوريا", "إيلي صعب دمشق", "غوتشي دمشق"]
    : ["Fashion Gate Mall", "Syria Luxury Mall", "Damascus Boulevard", "Luxury Retail Syria", "Elie Saab Syria", "Gucci Syria"];

  try {
    const data = await getHomepageData();
    return buildMetadataFromSeo({
      seoData: data?.page?.seo,
      fallback: { title, description, keywords },
      lang: lang as "ar" | "en",
      pathname: lang
    });
  } catch (e) {
    return buildMetadataFromSeo({
      fallback: { title, description },
      lang: lang as "ar" | "en",
      pathname: lang
    });
  }
}

export default async function Home({ params }: PageProps) {
  const { lang } = await params;
  if (lang !== "ar" && lang !== "en") {
    notFound();
  }

  let data: { settings?: SiteSettings; page?: { sections?: Section[] }; brands?: any[] } = {};

  try {
    data = await getHomepageData();
  } catch (err) {
    console.error("Failed to load homepage data:", err);
    data = {};
  }

  const settings = { ...fallbackSettings, ...(data.settings || {}) };
  const sections = data.page?.sections?.length ? data.page.sections : (fallbackSections as Section[]);

  const orgJsonLd = buildOrganizationJsonLd();
  const storeJsonLd = buildStoreJsonLd();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(storeJsonLd) }}
      />
      <Storefront settings={settings} sections={sections} brands={data.brands} initialLang={lang as "ar" | "en"} />
    </>
  );
}
