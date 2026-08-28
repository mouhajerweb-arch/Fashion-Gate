import CategoryDetailClient from "@/components/CategoryDetailClient";
import { notFound, redirect } from "next/navigation";
import { Suspense } from "react";
import { getAllSanityProducts } from "@/lib/sanity";

export const revalidate = 60;

interface PageProps {
  params: Promise<{
    id: string;
    lang: string;
  }>;
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

export default async function CategoryPage({ params }: PageProps) {
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
  
  return (
    <Suspense fallback={null}>
      <CategoryDetailClient categoryId={id} initialLang={lang as "ar" | "en"} initialProducts={productsList} />
    </Suspense>
  );
}
