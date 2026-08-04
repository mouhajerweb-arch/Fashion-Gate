import CategoryDetailClient from "@/components/CategoryDetailClient";
import { getAllSanityProducts, getDiningPageData } from "@/lib/sanity";
import { buildMetadataFromSeo, buildBreadcrumbsJsonLd } from "@/lib/seo";

export const revalidate = 0;

export async function generateMetadata() {
  try {
    const data = await getDiningPageData();
    return buildMetadataFromSeo({
      seoData: data?.seo,
      fallback: {
        title: "المطاعم والمقاهي الفاخرة | فاشن غيت مول دمشق",
        description: "استمتع بتجربة طعام استثنائية في فاشن غيت مول دمشق، وتذوق أشهى المأكولات والمشروبات في مطعم ومقهى فيلامور وذا اسبريسو لاب في بوليفارد دمشق.",
        keywords: ["مطاعم فاشن غيت", "مطعم فيلامور دمشق", "ذا اسبريسو لاب سوريا", "مطاعم بوليفارد دمشق"]
      },
      lang: "ar",
      pathname: "dining/ar"
    });
  } catch (e) {
    return buildMetadataFromSeo({
      fallback: {
        title: "المطاعم والمقاهي الفاخرة | فاشن غيت مول دمشق",
        description: "استمتع بتجربة طعام استثنائية في فاشن غيت مول دمشق."
      },
      lang: "ar",
      pathname: "dining/ar"
    });
  }
}

export default async function DiningArPage() {
  const productsList = await getAllSanityProducts();

  const breadcrumbsJsonLd = buildBreadcrumbsJsonLd([
    { name: "الرئيسية", url: "https://fashiongatemall.com/ar" },
    { name: "المطاعم", url: "https://fashiongatemall.com/dining/ar" }
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbsJsonLd) }}
      />
      <CategoryDetailClient categoryId="dining" initialLang="ar" initialProducts={productsList} />
    </>
  );
}
