import DesignersClient from "@/components/DesignersClient";
import { getDesignerPageCategories, getDesignerPageData } from "@/lib/sanity";
import { buildBreadcrumbsJsonLd, buildMetadataFromSeo } from "@/lib/seo";

export const revalidate = 0;

export async function generateMetadata() {
  const pageData = await getDesignerPageData();
  return buildMetadataFromSeo({
    seoData: pageData?.seo,
    fallback: {
      title: "المصممون وفئات العلامات الفاخرة | فاشن غيت مول دمشق",
      description: "تصفح مصممي وعلامات فاشن غيت مول دمشق حسب الفئة، من دور الأزياء الفاخرة إلى الجمال والمجوهرات والإكسسوارات.",
      keywords: ["مصممين فاشن غيت", "ماركات فاخرة سوريا", "دليل المصممين دمشق", "علامات فاشن غيت"],
    },
    lang: "ar",
    pathname: "designers/ar",
  });
}

export default async function DesignersArPage() {
  const [pageData, categories] = await Promise.all([
    getDesignerPageData().catch(() => null),
    getDesignerPageCategories().catch(() => []),
  ]);

  const breadcrumbsJsonLd = buildBreadcrumbsJsonLd([
    { name: "الرئيسية", url: "https://fashiongatemall.com/ar" },
    { name: "المصممون", url: "https://fashiongatemall.com/designers/ar" },
  ]);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbsJsonLd) }} />
      <DesignersClient pageData={pageData} categories={categories} initialLang="ar" />
    </>
  );
}
