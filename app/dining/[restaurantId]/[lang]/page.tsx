import RestaurantDetailClient from "@/components/RestaurantDetailClient";
import { getRestaurantPageData } from "@/lib/sanity";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { buildMetadataFromSeo, buildRestaurantJsonLd, buildBreadcrumbsJsonLd } from "@/lib/seo";

export const revalidate = 60;

interface PageProps {
  params: Promise<{
    restaurantId: string;
    lang: string;
  }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { restaurantId, lang } = await params;
  if ((lang !== "en" && lang !== "ar") || (restaurantId !== "sera" && restaurantId !== "the-espresso-lab")) {
    return {};
  }

  const isAr = lang === "ar";
  const sanityData = await getRestaurantPageData(restaurantId);

  const fallbackMap: Record<string, { title: string; titleAr: string; desc: string; descAr: string; keywords: string[] }> = {
    sera: {
      title: "SERA Restaurant & Cafe | Luxury Dining at Fashion Gate Mall",
      titleAr: "مطعم ومقهى سيرا | تجربة طعام فاخرة في فاشن غيت مول دمشق",
      desc: "Experience authentic Italian specialties, traditional breakfasts, signature pasta, and artisanal pizza at SERA Restaurant & Cafe in Fashion Gate Mall Syria.",
      descAr: "استمتع بأشهى الأطباق الإيطالية المميزة، والإفطار الفاخر، والباستا والبيتزا الإيطالية الأصيلة في مطعم ومقهى سيرا بوليفارد دمشق.",
      keywords: ["SERA Restaurant", "SERA Syria", "Luxury Dining Damascus", "مطعم سيرا دمشق", "أرقى مطاعم سوريا"]
    },
    "the-espresso-lab": {
      title: "The Espresso Lab | Specialty Artisanal Roastery at Fashion Gate Mall",
      titleAr: "ذا اسبريسو لاب | مقهى ومحمصة القهوة المختصة في فاشن غيت مول",
      desc: "Indulge in single-origin specialty coffees, freshly baked artisanal pastries, and refined lounge ambiance at The Espresso Lab, Fashion Gate Mall Syria.",
      descAr: "تذوق أجود أنواع القهوة المختصة أحادية المصدر والحلويات والمخبوزات الراقية في ذا اسبريسو لاب، فاشن غيت مول دمشق.",
      keywords: ["The Espresso Lab", "Specialty Coffee Damascus", "The Espresso Lab Syria", "ذا اسبريسو لاب دمشق", "قهوة مختصة سوريا"]
    }
  };

  const fb = fallbackMap[restaurantId] || fallbackMap["sera"];

  return buildMetadataFromSeo({
    seoData: sanityData?.seo,
    fallback: {
      title: isAr ? fb.titleAr : fb.title,
      description: isAr ? fb.descAr : fb.desc,
      keywords: fb.keywords
    },
    lang: lang as "en" | "ar",
    pathname: `dining/${restaurantId}/${lang}`
  });
}

export default async function RestaurantPage({ params }: PageProps) {
  const { restaurantId, lang } = await params;

  if (lang !== "en" && lang !== "ar") {
    notFound();
  }

  if (restaurantId !== "sera" && restaurantId !== "the-espresso-lab") {
    notFound();
  }

  // Fetch from Sanity
  const sanityData = await getRestaurantPageData(restaurantId);

  const isAr = lang === "ar";
  const restName = restaurantId === "the-espresso-lab"
    ? (isAr ? "ذا اسبريسو لاب" : "The Espresso Lab")
    : (isAr ? "مطعم ومقهى سيرا" : "SERA Restaurant & Cafe");

  const restJsonLd = buildRestaurantJsonLd({
    id: restaurantId,
    name: restName,
    description: isAr ? (sanityData?.heroDesc?.ar || "تجربة طعام فاخرة في بوليفارد دمشق") : (sanityData?.heroDesc?.en || "Luxury dining experience at Damascus Boulevard"),
    url: `https://fashiongatemall.com/dining/${restaurantId}/${lang}`
  });

  const breadcrumbsJsonLd = buildBreadcrumbsJsonLd([
    { name: isAr ? "الرئيسية" : "Home", url: `https://fashiongatemall.com/${lang}` },
    { name: isAr ? "المطاعم" : "Dining", url: `https://fashiongatemall.com/category/dining/${lang}` },
    { name: restName, url: `https://fashiongatemall.com/dining/${restaurantId}/${lang}` }
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(restJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbsJsonLd) }}
      />
      <Suspense fallback={null}>
        <RestaurantDetailClient 
          restaurantId={restaurantId} 
          lang={lang as "en" | "ar"} 
          initialSanityData={sanityData}
        />
      </Suspense>
    </>
  );
}
