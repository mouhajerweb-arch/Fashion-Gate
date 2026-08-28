import { redirect } from "next/navigation";
import { headers } from "next/headers";

export const revalidate = 60;

interface PageProps {
  params: Promise<{
    restaurantId: string;
  }>;
}

export async function generateStaticParams() {
  return [
    { restaurantId: "ar" },
    { restaurantId: "en" },
    { restaurantId: "vilamore" },
    { restaurantId: "the-espresso-lab" }
  ];
}

export default async function RestaurantRedirectPage({ params }: PageProps) {
  const { restaurantId } = await params;

  if (restaurantId === "ar" || restaurantId === "en") {
    redirect(`/category/dining/${restaurantId}`);
  }
  
  let targetLang = "ar";
  try {
    const headersList = await headers();
    const referer = headersList.get("referer") || "";
    const isEnReferer = referer.includes("/en") || referer.endsWith("/en");
    targetLang = isEnReferer ? "en" : "ar";
  } catch (e) {
    // Falls back to "ar" if headers/request details are not readable (e.g. during static generation)
  }
  
  redirect(`/dining/${restaurantId}/${targetLang}`);
}
