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
        title: "Fine Dining & Cafes | Fashion Gate Mall Syria",
        description: "Experience luxury dining at Fashion Gate Mall Syria featuring Vilamore Restaurant & Cafe and The Espresso Lab at Damascus Boulevard.",
        keywords: ["Fashion Gate Dining", "Vilamore Syria", "The Espresso Lab Damascus", "Luxury Restaurant Damascus"]
      },
      lang: "en",
      pathname: "dining/en"
    });
  } catch (e) {
    return buildMetadataFromSeo({
      fallback: {
        title: "Fine Dining & Cafes | Fashion Gate Mall Syria",
        description: "Experience luxury dining at Fashion Gate Mall Syria."
      },
      lang: "en",
      pathname: "dining/en"
    });
  }
}

export default async function DiningEnPage() {
  const productsList = await getAllSanityProducts();

  const breadcrumbsJsonLd = buildBreadcrumbsJsonLd([
    { name: "Home", url: "https://fashiongatemall.com/en" },
    { name: "Dining", url: "https://fashiongatemall.com/dining/en" }
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbsJsonLd) }}
      />
      <CategoryDetailClient categoryId="dining" initialLang="en" initialProducts={productsList} />
    </>
  );
}
