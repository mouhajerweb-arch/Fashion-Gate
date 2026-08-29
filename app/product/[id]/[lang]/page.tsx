import { getSanityProduct, getAllSanityProductSlugs, sanityClient } from "@/lib/sanity";
import ProductDetailClient from "@/components/ProductDetailClient";
import { notFound } from "next/navigation";
import { buildMetadataFromSeo, buildProductJsonLd } from "@/lib/seo";

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

export async function generateMetadata({ params }: PageProps) {
  const { id, lang } = await params;
  if (lang !== "ar" && lang !== "en") return {};

  const isAr = lang === "ar";
  try {
    const product = await sanityClient.fetch(`*[_type == "product" && slug.current == $slug][0] {
      name { en, ar },
      description { en, ar },
      image { asset->{ url } },
      brand->{ title, titleAr },
      seo { metaTitle, metaDescription, keywords, ogImage { asset->{ url } }, canonicalUrl, noIndex }
    }`, { slug: id });

    if (!product) return {};

    const name = isAr ? (product.name?.ar || product.name?.en) : (product.name?.en || product.name?.ar);
    const desc = isAr ? (product.description?.ar || product.description?.en) : (product.description?.en || product.description?.ar);
    const brandName = isAr ? (product.brand?.titleAr || product.brand?.title) : (product.brand?.title || product.brand?.titleAr);

    const title = brandName ? `${name} - ${brandName}` : name;
    const description = desc || `${name} luxury product at Fashion Gate Mall Damascus.`;
    const imageUrl = product.image?.asset?.url || "";

    return buildMetadataFromSeo({
      seoData: product.seo,
      fallback: {
        title,
        description,
        imageUrl
      },
      lang: lang as "ar" | "en",
      pathname: `product/${id}`
    });
  } catch (e) {
    console.error("Error generating product metadata:", e);
    return {};
  }
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

  // Fetch raw details for JSON-LD structured schema
  let jsonLd = null;
  try {
    const rawProduct = await sanityClient.fetch(`*[_type == "product" && slug.current == $slug][0] {
      name { en, ar },
      description { en, ar },
      image { asset->{ url } },
      brand->{ title, titleAr }
    }`, { slug: id });

    if (rawProduct) {
      const isAr = lang === "ar";
      jsonLd = buildProductJsonLd({
        name: isAr ? (rawProduct.name?.ar || rawProduct.name?.en) : (rawProduct.name?.en || rawProduct.name?.ar),
        description: isAr ? (rawProduct.description?.ar || rawProduct.description?.en) : (rawProduct.description?.en || rawProduct.description?.ar),
        image: rawProduct.image?.asset?.url || undefined,
        brandName: isAr ? (rawProduct.brand?.titleAr || rawProduct.brand?.title) : (rawProduct.brand?.title || rawProduct.brand?.titleAr),
        url: `https://fashiongatemall.com/product/${id}/${lang}`
      });
    }
  } catch (e) {
    console.error("Error building product JSON-LD:", e);
  }
  
  return (
    <>
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
      <ProductDetailClient product={product} initialLang={lang as "ar" | "en"} />
    </>
  );
}

