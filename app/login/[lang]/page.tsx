import AuthClient from "@/components/AuthClient";
import { getLoginPageData } from "@/lib/sanity";
import { notFound } from "next/navigation";
import { buildMetadataFromSeo } from "@/lib/seo";

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
  const title = isAr ? "تسجيل الدخول | فاشن غيت مول دمشق" : "Sign In | Fashion Gate Mall Damascus";
  const description = isAr 
    ? "سجل دخولك إلى حسابك في فاشن غيت مول دمشق لإدارة ملفك الشخصي واستكشاف الماركات الحصرية."
    : "Sign in to your account at Fashion Gate Mall Damascus to manage your profile and view exclusive brands.";

  return buildMetadataFromSeo({
    seoData: {
      noIndex: true
    },
    fallback: {
      title,
      description
    },
    lang: lang as "ar" | "en",
    pathname: "login"
  });

}


export default async function LoginPage({ params }: PageProps) {
  const { lang } = await params;
  if (lang !== "ar" && lang !== "en") {
    notFound();
  }

  let sanityData = null;
  try {
    sanityData = await getLoginPageData();
  } catch (err) {
    console.error("Failed to load login page data:", err);
  }

  return <AuthClient initialLang={lang as "ar" | "en"} sanityData={sanityData} />;
}
