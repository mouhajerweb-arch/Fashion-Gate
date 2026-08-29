import CategoryDetailClient from "@/components/CategoryDetailClient";
import { notFound, redirect } from "next/navigation";
import { Suspense } from "react";
import { getAllSanityProducts, getCategoryPageData } from "@/lib/sanity";
import { buildMetadataFromSeo } from "@/lib/seo";

export const revalidate = 60;

interface PageProps {
  params: Promise<{
    id: string;
    lang: string;
  }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export async function generateStaticParams() {
  const categories = ["women", "men", "perfumes", "skincare", "beauty", "makeup", "dining", "fashion", "designers"];
  const params: { id: string; lang: string }[] = [];
  for (const id of categories) {
    params.push({ id, lang: "ar" });
    params.push({ id, lang: "en" });
  }
  return params;
}

export async function generateMetadata({ params }: PageProps) {
  const { id, lang } = await params;
  if (lang !== "ar" && lang !== "en") return {};

  const isAr = lang === "ar";
  const defaultTitles: { [key: string]: { en: string; ar: string } } = {
    fashion: { en: "Fashion / Apparel", ar: "الأزياء والموضة" },
    perfumes: { en: "Perfumes / Fragrances", ar: "العطور الفاخرة" },
    beauty: { en: "Beauty / Cosmetics", ar: "الجمال ومستحضرات التجميل" },
    skincare: { en: "Skincare & Beauty", ar: "العناية بالبشرة والجمال" },
    makeup: { en: "Makeup / Cosmetics", ar: "المكياج ومستحضرات التجميل" },
    dining: { en: "Luxury Dining & Cafés", ar: "المطاعم الراقية والمقاهي" },
    women: { en: "Women's Fashion", ar: "أزياء النساء" },
    men: { en: "Men's Fashion", ar: "أزياء الرجال" }
  };

  const defaultDescs: { [key: string]: { en: string; ar: string } } = {
    fashion: { 
      en: "Discover high-end luxury fashion, ready-to-wear collections, and premium designers at Fashion Gate Mall Damascus.", 
      ar: "اكتشف أرقى خطوط الموضة والأزياء الجاهزة، وأشهر المصممين العالميين في فاشن غيت مول دمشق." 
    },
    perfumes: { 
      en: "Explore an exquisite collection of luxury perfumes, signature fragrances, and exclusive scents at Fashion Gate Mall Damascus.", 
      ar: "تصفح تشكيلة فاخرة من العطور العالمية، والروائح الحصرية في فاشن غيت مول دمشق." 
    },
    beauty: { 
      en: "Browse premium cosmetics, skincare essentials, and luxury beauty brands at Fashion Gate Mall Damascus.", 
      ar: "تصفح مستحضرات التجميل المميزة، وأساسيات العناية بالبشرة، وأرقى الماركات الجمالية في فاشن غيت مول دمشق." 
    },
    skincare: { 
      en: "Treat yourself to high-performance skincare, premium serums, and organic beauty brands at Fashion Gate Mall Damascus.", 
      ar: "دلل نفسك مع مستحضرات العناية بالبشرة عالية الفعالية، والسيرومات المميزة، والماركات الجمالية العضوية في فاشن غيت مول دمشق." 
    },
    makeup: { 
      en: "Find luxury foundations, lipsticks, and makeup collections from world-renowned brands at Fashion Gate Mall Damascus.", 
      ar: "ابحثي عن كريمات الأساس وأحمر الشفاه ومجموعات المكياج الفاخرة من أشهر الماركات العالمية في فاشن غيت مول دمشق." 
    },
    dining: { 
      en: "Enjoy an elevated culinary experience at VILAMORE Syrian Restaurant & Cafe and The Espresso Lab at Fashion Gate Mall Damascus.", 
      ar: "استمتع بتجربة طعام استثنائية في مطعم ومقهى فيلامور السوري وذا اسبريسو لاب في فاشن غيت مول دمشق." 
    },
    women: { 
      en: "Browse the latest women's fashion trends, elegant dresses, and luxury apparel at Fashion Gate Mall Damascus.", 
      ar: "تصفحي أحدث صيحات الموضة النسائية، والفساتين الأنيقة، والملابس الفاخرة في فاشن غيت مول دمشق." 
    },
    men: { 
      en: "Discover premium men's suits, contemporary streetwear, and active lifestyle apparel at Fashion Gate Mall Damascus.", 
      ar: "اكتشف البدلات الرجالية الفاخرة، وملابس الشارع المعاصرة، والملابس الرياضية في فاشن غيت مول دمشق." 
    }
  };

  const catTitle = defaultTitles[id]?.[lang] || id.toUpperCase();
  const catDesc = defaultDescs[id]?.[lang] || `${catTitle} at Fashion Gate Mall Damascus.`;

  try {
    const data = await getCategoryPageData(id);
    return buildMetadataFromSeo({
      seoData: data?.seo,
      fallback: {
        title: catTitle,
        description: catDesc
      },
      lang: lang as "ar" | "en",
      pathname: `category/${id}`
    });
  } catch (e) {
    return buildMetadataFromSeo({
      fallback: {
        title: catTitle,
        description: catDesc
      },
      lang: lang as "ar" | "en",
      pathname: `category/${id}`
    });
  }
}


export default async function CategoryPage({ params, searchParams }: PageProps) {
  const { id, lang } = await params;
  if (lang !== "ar" && lang !== "en") {
    notFound();
  }

  if (id === "designers") {
    redirect(`/brand/${lang}`);
  }
  
  const categories = ["women", "men", "perfumes", "skincare", "beauty", "makeup", "dining", "fashion", "designers"];
  if (!categories.includes(id)) {
    notFound();
  }

  const productsList = await getAllSanityProducts();
  const resolvedSearchParams = await searchParams;
  const initialSub = (resolvedSearchParams.sub as string) || "all";
  const initialBrand = (resolvedSearchParams.brand as string) || "all";
  
  return (
    <Suspense fallback={null}>
      <CategoryDetailClient 
        categoryId={id} 
        initialLang={lang as "ar" | "en"} 
        initialProducts={productsList} 
        initialSub={initialSub}
        initialBrand={initialBrand}
      />
    </Suspense>
  );
}
