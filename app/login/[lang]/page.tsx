import AuthClient from "@/components/AuthClient";
import { getLoginPageData } from "@/lib/sanity";
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
