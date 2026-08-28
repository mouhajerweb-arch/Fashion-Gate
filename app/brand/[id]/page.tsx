import BrandListClient from "@/components/BrandListClient";
import { getSanityBrands } from "@/lib/sanity";
import { buildMetadataFromSeo, buildBreadcrumbsJsonLd } from "@/lib/seo";
import { notFound, redirect } from "next/navigation";
import { getAllBrands } from "@/lib/brandData";

export const revalidate = 60;

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export async function generateStaticParams() {
  const brandIds = getAllBrands().map((b) => ({ id: b.id }));
  return [
    { id: "ar" },
    { id: "en" },
    ...brandIds
  ];
}

export async function generateMetadata({ params }: PageProps) {
  const { id } = await params;
  
  if (id === "ar" || id === "en") {
    const isAr = id === "ar";
    const title = isAr ? "دليل دور الفخامة والمصممين | فاشن غيت مول دمشق" : "Luxury Brands & Designers Directory | Fashion Gate Mall Damascus";
    const description = isAr
      ? "استكشف دليل العلامات التجارية العالمية الفاخرة في فاشن غيت مول دمشق، وتصفح مجموعات إيلي صعب، غوتشي، ماكس مارا، برادا، فالنتينو، وسان لوران."
      : "Explore the directory of international luxury brands at Fashion Gate Mall Damascus, including Elie Saab, Gucci, Max Mara, Prada, Valentino, and Saint Laurent.";
    const keywords = isAr
      ? ["المصممون فاشن غيت", "إيلي صعب دمشق", "غوتشي سوريا", "برادا دمشق", "ماركات فاخرة سوريا"]
      : ["Designers Fashion Gate", "Elie Saab Damascus", "Gucci Syria", "Prada Damascus", "Luxury Brands Syria"];

    return buildMetadataFromSeo({
      fallback: { title, description, keywords },
      lang: id as "ar" | "en",
      pathname: `brand/${id}`
    });
  }

  return {};
}

export default async function BrandOrRedirectPage({ params }: PageProps) {
  const { id } = await params;

  if (id === "ar" || id === "en") {
    let initialBrands: any[] = [];
    try {
      initialBrands = await Promise.race([
        getSanityBrands(),
        new Promise<any[]>((resolve) => setTimeout(() => resolve([]), 1500))
      ]) || [];
    } catch (error) {
      console.error("Failed to load brands from Sanity:", error);
    }

    const breadcrumbsJsonLd = buildBreadcrumbsJsonLd([
      { name: id === "ar" ? "الرئيسية" : "Home", url: `https://fashiongatemall.com/${id}` },
      { name: id === "ar" ? "المصممون" : "Designers", url: `https://fashiongatemall.com/brand/${id}` }
    ]);

    return (
      <>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbsJsonLd) }}
        />
        <BrandListClient initialBrands={initialBrands} initialLang={id as "ar" | "en"} />
      </>
    );
  }

  // Redirect brand detail requests to the lang-specific page
  redirect(`/brand/${id}/ar`);
}
