import { getSanityProduct, getAllSanityProductSlugs } from "@/lib/sanity";
import ProductDetailClient from "@/components/ProductDetailClient";
import { notFound } from "next/navigation";

export const revalidate = 60;

interface PageProps {
  params: Promise<{
    id: string;
    lang: string;
  }>;
}

export async function generateStaticParams() {
  const slugs = await getAllSanityProductSlugs();
  const params: { id: string; lang: string }[] = [];
  for (const item of slugs) {
    params.push({ id: item.id, lang: "ar" });
    params.push({ id: item.id, lang: "en" });
  }
  return params;
}

export default async function ProductPage({ params }: PageProps) {
  const { id, lang } = await params;
  if (lang !== "ar" && lang !== "en") {
    notFound();
  }

  const product = await getSanityProduct(id);
  if (!product) {
    notFound();
  }
  
  return <ProductDetailClient product={product} initialLang={lang as "ar" | "en"} />;
}
