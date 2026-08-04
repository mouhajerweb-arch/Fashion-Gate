import type { Metadata } from "next";

export interface SanitySeoData {
  metaTitle?: { en?: string; ar?: string };
  metaDescription?: { en?: string; ar?: string };
  keywords?: string[];
  ogImage?: { asset?: { url?: string } } | string;
  canonicalUrl?: string;
  noIndex?: boolean;
}

export interface FallbackSeoData {
  title: string;
  description: string;
  keywords?: string[];
  imageUrl?: string;
}

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://fashiongatemall.com";
const DEFAULT_BRAND_NAME = "Fashion Gate Mall";
const DEFAULT_BRAND_NAME_AR = "فاشن غيت مول";

/**
 * Builds a standardized Next.js Metadata object from Sanity SEO inputs or fallback data.
 */
export function buildMetadataFromSeo({
  seoData,
  fallback,
  lang,
  pathname = ""
}: {
  seoData?: SanitySeoData | null;
  fallback: FallbackSeoData;
  lang: "ar" | "en";
  pathname?: string;
}): Metadata {
  const isAr = lang === "ar";
  
  // Title resolution
  const sanityTitle = isAr
    ? seoData?.metaTitle?.ar || seoData?.metaTitle?.en
    : seoData?.metaTitle?.en || seoData?.metaTitle?.ar;
  
  const rawTitle = sanityTitle && sanityTitle.trim().length > 0 ? sanityTitle : fallback.title;
  const brandSuffix = isAr ? DEFAULT_BRAND_NAME_AR : DEFAULT_BRAND_NAME;
  const fullTitle = rawTitle.includes(brandSuffix) ? rawTitle : `${rawTitle} | ${brandSuffix}`;

  // Description resolution
  const sanityDesc = isAr
    ? seoData?.metaDescription?.ar || seoData?.metaDescription?.en
    : seoData?.metaDescription?.en || seoData?.metaDescription?.ar;
  
  const fullDescription = sanityDesc && sanityDesc.trim().length > 0 ? sanityDesc : fallback.description;

  // Keywords resolution
  const keywords = (seoData?.keywords && seoData.keywords.length > 0)
    ? seoData.keywords
    : (fallback.keywords || [
        "Fashion Gate",
        "Fashion Gate Mall",
        "Damascus Boulevard",
        "Luxury Mall Syria",
        "مول بوابة الأزياء دمشق",
        "فاشن غيت دمشق",
        "أول مول فاخر في سوريا"
      ]);

  // Image resolution
  let imageUrl = fallback.imageUrl || `${SITE_URL}/brand-pages/page_01.jpg`;
  if (seoData?.ogImage) {
    if (typeof seoData.ogImage === "string") {
      imageUrl = seoData.ogImage;
    } else if (seoData.ogImage.asset?.url) {
      imageUrl = seoData.ogImage.asset.url;
    }
  }

  // Canonical & hreflang URL resolution
  const cleanPath = pathname.replace(/^\/+|\/+$/g, "").replace(/\/(ar|en)$/, "");
  const canonicalUrl = seoData?.canonicalUrl || `${SITE_URL}/${cleanPath ? `${cleanPath}/${lang}` : lang}`;
  const enUrl = `${SITE_URL}/${cleanPath ? `${cleanPath}/en` : "en"}`;
  const arUrl = `${SITE_URL}/${cleanPath ? `${cleanPath}/ar` : "ar"}`;

  return {
    title: fullTitle,
    description: fullDescription,
    keywords: keywords,
    alternates: {
      canonical: canonicalUrl,
      languages: {
        en: enUrl,
        ar: arUrl,
        "x-default": enUrl
      }
    },
    robots: {
      index: !seoData?.noIndex,
      follow: !seoData?.noIndex,
      googleBot: {
        index: !seoData?.noIndex,
        follow: !seoData?.noIndex,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1
      }
    },
    openGraph: {
      title: fullTitle,
      description: fullDescription,
      url: canonicalUrl,
      siteName: isAr ? DEFAULT_BRAND_NAME_AR : DEFAULT_BRAND_NAME,
      locale: isAr ? "ar_SY" : "en_US",
      alternateLocale: isAr ? "en_US" : "ar_SY",
      type: "website",
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: fullTitle
        }
      ]
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description: fullDescription,
      images: [imageUrl]
    }
  };
}

/**
 * Schema.org JSON-LD Structured Data Generators
 */

export function buildOrganizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Fashion Gate Mall Syria",
    alternateName: "فاشن غيت مول سوريا",
    url: SITE_URL,
    logo: `${SITE_URL}/brand/logo.png`,
    sameAs: [
      "https://instagram.com",
      "https://facebook.com"
    ],
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+963-930-000-000",
      contactType: "customer service",
      availableLanguage: ["Arabic", "English"]
    }
  };
}

export function buildStoreJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "DepartmentStore",
    name: "Fashion Gate Mall",
    alternateName: "فاشن غيت مول دمشق",
    image: `${SITE_URL}/brand-pages/page_01.jpg`,
    "@id": SITE_URL,
    url: SITE_URL,
    telephone: "+963-930-000-000",
    priceRange: "$$$$",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Damascus Boulevard District",
      addressLocality: "Damascus",
      addressCountry: "SY"
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
          "Sunday"
        ],
        opens: "10:00",
        closes: "22:00"
      }
    ]
  };
}

export function buildBlogPostJsonLd(post: {
  title: string;
  excerpt: string;
  image?: string;
  publishedAt?: string;
  authorName?: string;
  url: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    image: post.image ? [post.image] : [`${SITE_URL}/brand-pages/page_01.jpg`],
    datePublished: post.publishedAt || new Date().toISOString(),
    author: {
      "@type": "Person",
      name: post.authorName || "Fashion Gate Editorial"
    },
    publisher: {
      "@type": "Organization",
      name: "Fashion Gate Mall",
      logo: {
        "@type": "ImageObject",
        url: `${SITE_URL}/brand/logo.png`
      }
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": post.url
    }
  };
}

export function buildProductJsonLd(product: {
  name: string;
  description?: string;
  image?: string;
  brandName?: string;
  url: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    image: product.image ? [product.image] : [`${SITE_URL}/brand/logo.png`],
    description: product.description || product.name,
    brand: {
      "@type": "Brand",
      name: product.brandName || "Fashion Gate"
    },
    offers: {
      "@type": "Offer",
      url: product.url,
      priceCurrency: "USD",
      price: "0",
      availability: "https://schema.org/InStock"
    }
  };
}

export function buildBreadcrumbsJsonLd(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url
    }))
  };
}

export function buildRestaurantJsonLd(restaurant: {
  id: string;
  name: string;
  description?: string;
  image?: string;
  telephone?: string;
  address?: string;
  url: string;
  servesCuisine?: string[];
}) {
  return {
    "@context": "https://schema.org",
    "@type": (restaurant.id === "the-espresso-lab" || restaurant.id === "arto-coffee") ? "CafeOrCoffeeShop" : "Restaurant",
    name: restaurant.name,
    description: restaurant.description,
    image: restaurant.image ? [restaurant.image] : [`${SITE_URL}/brand-pages/page_01.jpg`],
    url: restaurant.url,
    telephone: restaurant.telephone || "+963-930-000-000",
    priceRange: "$$$",
    servesCuisine: restaurant.servesCuisine || ((restaurant.id === "the-espresso-lab" || restaurant.id === "arto-coffee") ? ["Specialty Coffee", "Artisanal Bakery", "Levantine Pastries"] : ["Mediterranean", "Levantine Fine Dining", "Charcoal Grills"]),
    address: {
      "@type": "PostalAddress",
      streetAddress: "Damascus Boulevard District, Fashion Gate Mall",
      addressLocality: "Damascus",
      addressCountry: "SY"
    }
  };
}
