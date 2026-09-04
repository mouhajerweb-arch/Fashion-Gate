import NewsletterDashboardClient from "@/components/NewsletterDashboardClient";

export const metadata = {
  title: "Newsletter Dashboard | Fashion Gate Mall",
  robots: {
    index: false,
    follow: false,
  },
};

export default function NewsletterDashboardPage() {
  return <NewsletterDashboardClient initialLanguage="en" />;
}
