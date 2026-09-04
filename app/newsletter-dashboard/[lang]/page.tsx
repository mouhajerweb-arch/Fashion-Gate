import { notFound } from "next/navigation";
import NewsletterDashboardClient from "@/components/NewsletterDashboardClient";

export const metadata = {
  title: "Newsletter Dashboard | Fashion Gate Mall",
  robots: {
    index: false,
    follow: false,
  },
};

type PageProps = {
  params: Promise<{ lang: string }>;
};

export default async function LocalizedNewsletterDashboardPage({ params }: PageProps) {
  const { lang } = await params;
  if (lang !== "ar" && lang !== "en") notFound();

  return <NewsletterDashboardClient initialLanguage={lang} />;
}
