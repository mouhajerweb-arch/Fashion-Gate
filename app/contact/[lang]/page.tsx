import ContactClient from "@/components/ContactClient";
import { getContactPageData } from "@/lib/sanity";
import { buildMetadataFromSeo, buildBreadcrumbsJsonLd } from "@/lib/seo";
import { notFound } from "next/navigation";

export const revalidate = 60;

interface PageProps {
  params: Promise<{
    lang: string;
  }>;
}

export async function generateStaticParams() {
  return [{ lang: "ar" }, { lang: "en" }];
}

export async function generateMetadata({ params }: PageProps) {
  const { lang } = await params;
  if (lang !== "ar" && lang !== "en") return {};

  const isAr = lang === "ar";
  const title = isAr ? "اتصل بنا واحجز أتيليه | فاشن غيت مول دمشق" : "Contact & Atelier Booking | Fashion Gate Mall Damascus";
  const description = isAr
    ? "تواصل مع فاشن غيت مول دمشق. احجز موعداً خاصاً في الأتيليه، أو أرسل استفسارك بخصوص العلامات التجارية والخدمات المتاحة."
    : "Get in touch with Fashion Gate Mall Damascus. Book a private atelier appointment, or submit inquiries regarding boutique brands and services.";
  const keywords = isAr
    ? ["حجز أتيليه فاشن غيت", "تواصل معنا فاشن غيت", "عنوان فاشن غيت دمشق", "خدمة العملاء"]
    : ["Book Atelier Fashion Gate", "Contact Fashion Gate", "Damascus Boulevard Address", "Luxury Customer Service"];

  try {
    const data = await getContactPageData();
    return buildMetadataFromSeo({
      seoData: data?.seo,
      fallback: { title, description, keywords },
      lang: lang as "ar" | "en",
      pathname: `contact/${lang}`
    });
  } catch (e) {
    return buildMetadataFromSeo({
      fallback: { title, description },
      lang: lang as "ar" | "en",
      pathname: `contact/${lang}`
    });
  }
}

export default async function ContactPage({ params }: PageProps) {
  const { lang } = await params;
  if (lang !== "ar" && lang !== "en") {
    notFound();
  }

  let initialData = null;
  try {
    initialData = await getContactPageData();
  } catch (error) {
    console.error("Failed to load contact page data from Sanity:", error);
  }

  const breadcrumbsJsonLd = buildBreadcrumbsJsonLd([
    { name: lang === "ar" ? "الرئيسية" : "Home", url: `https://fashiongatemall.com/${lang}` },
    { name: lang === "ar" ? "اتصل بنا" : "Contact Us", url: `https://fashiongatemall.com/contact/${lang}` }
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbsJsonLd) }}
      />
      <ContactClient initialLang={lang as "ar" | "en"} initialData={initialData} />
    </>
  );
}
