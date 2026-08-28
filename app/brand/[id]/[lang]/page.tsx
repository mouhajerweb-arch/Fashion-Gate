import { getBrandById, getAllBrands } from "@/lib/brandData";
import BrandDetailClient from "@/components/BrandDetailClient";
import { getSanityBrand } from "@/lib/sanity";
import { notFound } from "next/navigation";
import { buildMetadataFromSeo, buildBreadcrumbsJsonLd } from "@/lib/seo";

export const revalidate = 60;

interface PageProps {
  params: Promise<{
    id: string;
    lang: string;
  }>;
}

export async function generateStaticParams() {
  const brandsList = getAllBrands();
  const params: { id: string; lang: string }[] = [];
  for (const brand of brandsList) {
    params.push({ id: brand.id, lang: "ar" });
    params.push({ id: brand.id, lang: "en" });
  }
  return params;
}

export async function generateMetadata({ params }: PageProps) {
  const { id, lang } = await params;
  if (lang !== "ar" && lang !== "en") return {};

  const localBrand = getBrandById(id);
  const isAr = lang === "ar";
  try {
    const brand = await getSanityBrand(id);
    const title = isAr 
      ? (brand?.titleAr || brand?.title || localBrand?.nameAr || localBrand?.name || id.toUpperCase())
      : (brand?.title || brand?.titleAr || localBrand?.name || localBrand?.nameAr || id.toUpperCase());
    
    const desc = isAr
      ? ((typeof brand?.description === "string" ? brand?.description : brand?.description?.ar || brand?.description?.en) || localBrand?.descriptionAr || localBrand?.description || `تشكيلة ${title} الفاخرة في فاشن غيت مول دمشق.`)
      : ((typeof brand?.description === "string" ? brand?.description : brand?.description?.en || brand?.description?.ar) || localBrand?.description || localBrand?.descriptionAr || `The luxury collection of ${title} at Fashion Gate Mall Damascus.`);

    return buildMetadataFromSeo({
      seoData: brand?.seo,
      fallback: {
        title: isAr ? `${title} | دار الأزياء الفاخرة في فاشن غيت` : `${title} | Luxury Fashion House at Fashion Gate`,
        description: desc,
        keywords: [title, `${title} دمشق`, `${title} سوريا`, "دار أزياء فاشن غيت"]
      },
      lang: lang as "ar" | "en",
      pathname: `brand/${id}/${lang}`
    });
  } catch (e) {
    return {};
  }
}

export default async function BrandPage({ params }: PageProps) {
  const { id, lang } = await params;
  if (lang !== "ar" && lang !== "en") {
    notFound();
  }

  const localBrand = getBrandById(id);
  
  let brand = null;
  try {
    brand = await getSanityBrand(id);
  } catch (err) {
    console.error("Failed to fetch brand from Sanity:", err);
  }
  
  if (brand) {
    brand = {
      ...brand,
      id: localBrand?.id || id,
      backdropUrl: localBrand?.backdropUrl
    };
  } else if (localBrand) {
    brand = {
      id: localBrand.id,
      title: localBrand.name,
      slug: { current: localBrand.id },
      headline: { en: localBrand.headline, ar: localBrand.headlineAr },
      description: { en: localBrand.description, ar: localBrand.descriptionAr },
      backdropUrl: localBrand.backdropUrl
    };
  } else {
    notFound();
  }

  const isAr = lang === "ar";
  const brandName = isAr
    ? (brand.titleAr || brand.title || localBrand?.nameAr || localBrand?.name || id.toUpperCase())
    : (brand.title || brand.titleAr || localBrand?.name || localBrand?.nameAr || id.toUpperCase());

  const breadcrumbsJsonLd = buildBreadcrumbsJsonLd([
    { name: isAr ? "الرئيسية" : "Home", url: `https://fashiongatemall.com/${lang}` },
    { name: isAr ? "المصممون" : "Designers", url: `https://fashiongatemall.com/brand/${lang}` },
    { name: brandName, url: `https://fashiongatemall.com/brand/${id}/${lang}` }
  ]);
  
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbsJsonLd) }}
      />
      <BrandDetailClient brand={brand} initialLang={lang as "ar" | "en"} />
    </>
  );
}
