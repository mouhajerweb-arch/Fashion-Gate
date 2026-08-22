import DesignersClient from "@/components/DesignersClient";
import { getDesignerPageCategories, getDesignerPageData } from "@/lib/sanity";
import { buildBreadcrumbsJsonLd, buildMetadataFromSeo } from "@/lib/seo";

export const revalidate = 0;

export async function generateMetadata() {
  const pageData = await getDesignerPageData();
  return buildMetadataFromSeo({
    seoData: pageData?.seo,
    fallback: {
      title: "Designers & Luxury Brand Categories | Fashion Gate Mall Syria",
      description: "Browse Fashion Gate Mall Syria designers by category, including luxury fashion houses, contemporary labels, beauty, jewelry, accessories, and lifestyle brands.",
      keywords: ["Fashion Gate designers", "Luxury brands Syria", "Designer categories Damascus", "Fashion Gate brands"],
    },
    lang: "en",
    pathname: "designers/en",
  });
}

export default async function DesignersEnPage() {
  const [pageData, categories] = await Promise.all([
    getDesignerPageData().catch(() => null),
    getDesignerPageCategories().catch(() => []),
  ]);

  const breadcrumbsJsonLd = buildBreadcrumbsJsonLd([
    { name: "Home", url: "https://fashiongatemall.com/en" },
    { name: "Designers", url: "https://fashiongatemall.com/designers/en" },
  ]);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbsJsonLd) }} />
      <DesignersClient pageData={pageData} categories={categories} initialLang="en" />
    </>
  );
}
