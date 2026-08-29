"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { products, type Product } from "@/lib/productData";
import { getBrandById, brands as fallbackBrands } from "@/lib/brandData";
import BrandListClient from "@/components/BrandListClient";
import { Box, Container, Stack, Typography, Grid, Button, Divider, Link as MuiLink, ThemeProvider, createTheme, InputBase, IconButton } from "@mui/material";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useMemo } from "react";


import NorthEastIcon from "@mui/icons-material/NorthEast";
import SearchIcon from "@mui/icons-material/Search";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { motion, AnimatePresence } from "framer-motion";
import { getLocalizedValue, imageUrl } from "@/lib/sanity";

const MotionBox = motion.create(Box);

const brandVectorLogos: Record<string, React.ReactNode> = {
  adidas: (
    <svg width="100%" height="24" viewBox="0 0 120 30" fill="currentColor">
      <text x="50%" y="22" fontFamily="'Futura', 'Helvetica Neue', 'Arial', sans-serif" fontSize="20" fontWeight="bold" letterSpacing="0.1em" textAnchor="middle">adidas</text>
    </svg>
  ),
  "calvin-klein": (
    <svg width="100%" height="24" viewBox="0 0 140 30" fill="currentColor">
      <text x="50%" y="22" fontFamily="'Futura', 'Helvetica Neue', 'Arial', sans-serif" fontSize="17" fontWeight="bold" letterSpacing="0.12em" textAnchor="middle">Calvin Klein</text>
    </svg>
  ),
  skechers: (
    <svg width="100%" height="24" viewBox="0 0 140 30" fill="currentColor">
      <text x="50%" y="22" fontFamily="'Arial Black', sans-serif" fontSize="18" fontWeight="900" letterSpacing="0.08em" textAnchor="middle">Skechers</text>
    </svg>
  ),
  "paul-shark": (
    <svg width="100%" height="24" viewBox="0 0 160 30" fill="currentColor">
      <text x="50%" y="22" fontFamily="'Futura', 'Arial Black', sans-serif" fontSize="16" fontWeight="900" letterSpacing="0.08em" textAnchor="middle">Paul & Shark</text>
    </svg>
  ),
  maxmara: (
    <svg width="100%" height="24" viewBox="0 0 120 30" fill="currentColor">
      <text x="50%" y="22" fontFamily="'Granjon', 'Garamond', serif" fontSize="21" fontWeight="bold" letterSpacing="0.08em" textAnchor="middle">Max Mara</text>
    </svg>
  ),
  editorial: (
    <svg width="100%" height="24" viewBox="0 0 120 30" fill="currentColor">
      <text x="50%" y="22" fontFamily='"Apple Garamond", "EB Garamond", "Cormorant Garamond", serif"' fontSize="18" fontWeight="bold" letterSpacing="0.12em" textAnchor="middle">Editorial</text>
    </svg>
  ),
  sandro: (
    <svg width="100%" height="24" viewBox="0 0 120 30" fill="currentColor">
      <text x="50%" y="22" fontFamily="'Futura', 'Helvetica Neue', 'Arial', sans-serif" fontSize="20" fontWeight="bold" letterSpacing="0.08em" textAnchor="middle">Sandro</text>
    </svg>
  ),
  moje: (
    <svg width="100%" height="24" viewBox="0 0 100 30" fill="currentColor">
      <text x="50%" y="22" fontFamily="'Didot', 'Times New Roman', serif" fontSize="21" fontStyle="italic" fontWeight="bold" letterSpacing="0.06em" textAnchor="middle">Moje</text>
    </svg>
  )

};

interface CategoryDetailClientProps {
  categoryId: string;
  initialLang: "en" | "ar";
  initialProducts?: Product[];
  initialSub?: string;
  initialBrand?: string;
}


const CATEGORY_CARD_DEFAULT_LOGO_SCALE = 1.5;
const PAGE_ROW_DEFAULT_LOGO_SCALE = 1;
const CATEGORY_SCALE_PAGE_IDS = ["fashion", "perfumes", "beauty", "skincare", "makeup"];

function positiveNumber(value: unknown): number | undefined {
  const numeric = Number(value);
  return Number.isFinite(numeric) && numeric > 0 ? numeric : undefined;
}

function resolveCategoryCardLogoScale({
  overrideScale,
  sharedPageScale,
  pageRowScale,
}: {
  overrideScale?: number;
  sharedPageScale?: number;
  pageRowScale?: number;
}) {
  if (overrideScale) return overrideScale;
  if (sharedPageScale) return sharedPageScale;
  if (pageRowScale && pageRowScale !== PAGE_ROW_DEFAULT_LOGO_SCALE) return pageRowScale;
  return CATEGORY_CARD_DEFAULT_LOGO_SCALE;
}

function BrandLogoMark({ brand, variant = "default" }: { brand: any; variant?: "default" | "category-card" }) {
  if (brand.logoUrl) {
    const sizeMultiplier = variant === "category-card" ? 1 : brand.logoSize === "large" ? 1.15 : brand.logoSize === "small" ? 0.82 : 1;
    const rawScale = variant === "category-card"
      ? Number(brand.categoryLogoScale || CATEGORY_CARD_DEFAULT_LOGO_SCALE)
      : Number(brand.logoScale || 1) * sizeMultiplier;
    const maxScale = variant === "category-card" ? 8 : 3;
    const scale = Math.max(0.25, Math.min(rawScale, maxScale));

    return (
      <Box
        component="img"
        src={brand.logoUrl}
        alt={brand.name}
        sx={{
          display: "block",
          maxHeight: variant === "category-card" ? 72 : 112,
          maxWidth: variant === "category-card" ? "74%" : "82%",
          objectFit: "contain",
          transform: `scale(${scale})`,
          transformOrigin: "center",
        }}
      />
    );
  }

  return (
    <Typography sx={{ fontSize: 16, fontWeight: 700, letterSpacing: "0.05em", color: "#111111" }}>
      {brand.name}
    </Typography>
  );
}

function BrandLogoCard({ brand, lang }: { brand: any; lang: "en" | "ar" }) {
  return (
    <Grid size={{ xs: 12, sm: 6, md: 3 }} key={brand.id}>
      <Link href={`/brand/${brand.id}/${lang}`} style={{ textDecoration: "none", color: "inherit" }}>
        <Box
          sx={{
            bgcolor: "#ffffff",
            border: "1px solid rgba(0,0,0,0.06)",
            p: 3,
            height: "190px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            textAlign: "center",
            transition: "all 0.4s cubic-bezier(0.25, 1, 0.5, 1)",
            "&:hover": {
              borderColor: "#CB6116",
              boxShadow: "0 10px 24px rgba(203, 97, 22, 0.06)",
              transform: "translateY(-4px)"
            }
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: 104, width: "100%", color: "#111111" }}>
            <BrandLogoMark brand={brand} variant="category-card" />
          </Box>
        </Box>
      </Link>
    </Grid>
  );
}

// Translations for category names and UI
const categoryTranslations = {
  en: {
    women: "Women",
    men: "Men",
    perfumes: "Perfumes",
    skincare: "Skincare",
    beauty: "Beauty",
    dining: "Dining",
    fashion: "Fashion",
    designers: "Designers & Brands",
    all: "All Products",
    filterTitle: "Brands",
    noProducts: "No products found matching the criteria.",
    viewDetails: "View Details",
    subcategories: {
      "dresses": "Dresses",
      "abayas-kaftans": "Abayas / Kaftans",
      "tops-blouses": "Tops & Blouses",
      "t-shirts": "Women T-Shirts",
      "pants-trousers": "Pants & Trousers",
      "jeans": "Women Jeans",
      "skirts": "Skirts",
      "coords-sets": "Co-ords & Sets",
      "outerwear-women": "Outerwear Women",
      "women-activewear": "Women Activewear",
      "sleepwear-innerwear": "Sleepwear & Innerwear",
      "women-bags": "Women Bags",
      "women-accessories": "Women Accessories",
      "women-jewellery": "Women Jewellery",
      "men-formal-suits": "Men Formal Suits",
      "t-shirts-polos": "T-Shirts & Polos",
      "men-shirts": "Men Shirts",
      "men-outerwear": "Men Outerwear",
      "men-shoes": "Men Shoes",
      "innerwear-sleepwear": "Innerwear & Sleepwear",
      "men-accessories": "Men Accessories"
    }
  },
  ar: {
    women: "النساء",
    men: "الرجال",
    perfumes: "العطور",
    skincare: "العناية بالبشرة",
    beauty: "الجمال",
    dining: "المطاعم والمقاهي",
    fashion: "الأزياء والموضة",
    designers: "المصممين والعلامات التجارية",
    all: "جميع المنتجات",
    filterTitle: "العلامات التجارية",
    noProducts: "لم يتم العثور على منتجات تطابق المعايير.",
    viewDetails: "عرض التفاصيل",
    subcategories: {
      "dresses": "فساتين",
      "abayas-kaftans": "عبايات وقفاطين",
      "tops-blouses": "بلوزات وقمصان علوية",
      "t-shirts": "تي شيرت نسائي",
      "pants-trousers": "سراويل وبناطيل",
      "jeans": "جينز نسائي",
      "skirts": "تنانير",
      "coords-sets": "أطقم متطابقة",
      "outerwear-women": "ملابس خارجية نسائية",
      "women-activewear": "ملابس رياضية نسائية",
      "sleepwear-innerwear": "ملابس نوم وداخلية نسائية",
      "women-bags": "حقائب نسائية",
      "women-accessories": "إكسسوارات نسائية",
      "women-jewellery": "مجوهرات نسائية",
      "men-formal-suits": "بدل رسمية رجالية",
      "t-shirts-polos": "تي شيرت وبولو رجالي",
      "men-shirts": "قمصان رجالية",
      "men-outerwear": "ملابس خارجية رجالية",
      "men-shoes": "أحذية رجالية",
      "innerwear-sleepwear": "ملابس داخلية ونوم رجالية",
      "men-accessories": "إكسسوارات رجالية"
    }
  }
};

export default function CategoryDetailClient({ 
  categoryId, 
  initialLang, 
  initialProducts,
  initialSub = "all",
  initialBrand = "all"
}: CategoryDetailClientProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const lang = initialLang;

  const [activeSub, setActiveSub] = useState(initialSub);
  const [activeBrand, setActiveBrand] = useState(initialBrand);

  const querySub = searchParams.get("sub") || "all";
  const queryBrand = searchParams.get("brand") || "all";

  useEffect(() => {
    setActiveSub(querySub);
  }, [querySub]);

  useEffect(() => {
    setActiveBrand(queryBrand);
  }, [queryBrand]);

  if (categoryId === "designers") {
    return <BrandListClient initialBrands={[]} initialLang={lang} />;
  }

  const showWomen = activeSub === "all" || activeSub === "women";
  const showMen = activeSub === "all" || activeSub === "men";
  const showUnisex = activeSub === "all" || activeSub === "unisex";
  const womenGridSize = activeSub === "women" ? 12 : 6;
  const menGridSize = activeSub === "men" ? 12 : 6;

  const [isLangTransitioning, setIsLangTransitioning] = useState(false);
  const [brands, setBrands] = useState<any[]>([]);
  const [brandSearchQuery, setSidebarSearchQuery] = useState("");
  const [diningCmsData, setDiningCmsData] = useState<any>(null);
  const [categoryCmsData, setCategoryCmsData] = useState<any>(null);

  useEffect(() => {
    if (categoryId === "dining") {
      import("@/lib/sanity").then(({ getDiningPageData }) => {
        getDiningPageData().then((data) => {
          if (data) {
            setDiningCmsData(data);
          }
        });
      });
    } else if (["fashion", "perfumes", "beauty", "skincare", "makeup"].includes(categoryId)) {
      import("@/lib/sanity").then(({ getCategoryPageData }) => {
        getCategoryPageData(categoryId).then((data) => {
          if (data) {
            setCategoryCmsData(data);
          }
        });
      });
    }
  }, [categoryId]);

  useEffect(() => {
    import("@/lib/sanity").then(({ getSanityBrands }) => {
      getSanityBrands().then((data) => {
        if (data && data.length > 0) {
          setBrands(data);
        }
      });
    });
  }, []);

  const processedBrands = useMemo(() => {
    let rawList: any[] = [];
    const scaleOverrides = new Map<string, number>();
    const sharedPageScales = new Map<string, number>();

    (categoryCmsData?.brandLogoScaleOverrides || []).forEach((override: any) => {
      const id = override?.brand?.slug?.current || override?.brand?._id;
      const scale = Number(override?.scale);
      if (id && Number.isFinite(scale) && scale > 0) {
        scaleOverrides.set(id, scale);
      }
    });

    if (CATEGORY_SCALE_PAGE_IDS.includes(categoryId)) {
      (categoryCmsData?.sharedCategoryLogoScaleSources || []).forEach((sourcePage: any) => {
        (sourcePage?.allowedBrands || []).forEach((row: any) => {
          const id = row?.brand?.slug?.current || row?.brand?._id;
          const scale = positiveNumber(row?.categoryLogoScale);
          if (id && scale && scale !== PAGE_ROW_DEFAULT_LOGO_SCALE && !sharedPageScales.has(id)) {
            sharedPageScales.set(id, scale);
          }
        });

        (sourcePage?.brandLogoScaleOverrides || []).forEach((override: any) => {
          const id = override?.brand?.slug?.current || override?.brand?._id;
          const scale = positiveNumber(override?.scale);
          if (id && scale && !sharedPageScales.has(id)) {
            sharedPageScales.set(id, scale);
          }
        });
      });
    }

    if (categoryCmsData?.allowedBrands && categoryCmsData.allowedBrands.length > 0) {
      rawList = categoryCmsData.allowedBrands;
    } else {
      const cmsList = Array.isArray(brands) ? brands : [];
      const list = [...cmsList];
      fallbackBrands.forEach((fb) => {
        const exists = list.some((sb) => sb.slug?.current === fb.id);
        if (!exists) {
          list.push({
            title: fb.name,
            titleAr: fb.nameAr,
            slug: { current: fb.id },
            description: { en: fb.description, ar: fb.descriptionAr },
            headline: { en: fb.headline, ar: fb.headlineAr },
            bgImage: { asset: { url: fb.backdropUrl } }
          });
        }
      });

      if (categoryId === "beauty") {
        rawList = list.filter((b) => [
          "lancome",
          "loreal",
          "gucci",
          "prada",
          "ysl",
          "giorgio-armani",
          "valentino",
          "jimmy-choo",
          "cartier",
          "chloe",
          "coach",
          "elie-saab",
          "atelier-rebul",
          "clarins-paris",
          "elizabeth-arden",
          "anastasia-beverly-hills",
          "the-face-shop",
          "belif",
          "dr-belmeur",
          "beyond",
          "fmgt",
          "suntique",
          "allione",
          "your-vegan",
          "dermedic",
          "gemology",
          "lakme",
          "alfaparf-milano",
          "mavala",
          "shiseido"
        ].includes(b.slug?.current || b._id));
      } else if (categoryId === "skincare") {
        rawList = list.filter((b) => ["lancome", "moje", "sandro-moje", "maxmara", "adidas"].includes(b.slug?.current || b._id));
      } else if (categoryId === "perfumes") {
        rawList = list.filter((b) => ["elie-saab", "gucci", "prada", "valentino", "ysl", "cartier", "lancome", "calvin-klein", "giorgio-armani", "hugo-boss"].includes(b.slug?.current || b._id));
      } else {
        rawList = list;
      }
    }

    return rawList.filter((entry: any) => {
      const sb = entry?.brand || entry;
      return Boolean(sb) && (entry?._type === "reference" || entry?.isVisible !== false);
    }).map((entry: any) => {
      const sb = entry?.brand || entry;
      const pageCategoryLogoScale = entry?.brand ? positiveNumber(entry.categoryLogoScale) : undefined;
      const brandId = sb.slug?.current || sb._id || sb.id;
      const fb = fallbackBrands.find((b) => b.id === (sb.slug?.current || sb.id || sb._id));
      const name = sb.title || fb?.name || "";
      const nameAr = sb.titleAr || fb?.nameAr || name;

      const description = getLocalizedValue(sb.description, "en", fb?.description || "");
      const descriptionAr = getLocalizedValue(sb.description, "ar", fb?.descriptionAr || description);

      const headline = getLocalizedValue(sb.headline, "en", fb?.headline || "");
      const headlineAr = getLocalizedValue(sb.headline, "ar", fb?.headlineAr || headline);

      const logoUrl = sb.image?.asset?.url || sb.logoUrl || sb.imageAr?.asset?.url || null;

      return {
        id: brandId,
        name: lang === "ar" ? nameAr : name,
        headline: lang === "ar" ? headlineAr : headline,
        description: lang === "ar" ? descriptionAr : description,
        logoUrl,
        logoScale: typeof sb.scale === "number" ? sb.scale : 1,
        categoryLogoScale: resolveCategoryCardLogoScale({
          overrideScale: scaleOverrides.get(brandId),
          sharedPageScale: sharedPageScales.get(brandId),
          pageRowScale: pageCategoryLogoScale,
        }),
        logoSize: sb.size || "medium",
        bgImage: sb.bgImage?.asset?.url || sb.bgImage || fb?.backdropUrl || "/brand-pages/page_01.jpg"
      };
    });
  }, [brands, lang, categoryCmsData, categoryId]);

  const filteredSidebarBrands = useMemo(() => {
    return processedBrands.filter((brand) =>
      brand.name.toLowerCase().includes(brandSearchQuery.toLowerCase()) ||
      brand.description.toLowerCase().includes(brandSearchQuery.toLowerCase())
    );
  }, [processedBrands, brandSearchQuery]);

  useEffect(() => {
    setIsLangTransitioning(false);
  }, [initialLang]);

  const t = categoryTranslations[lang];

  const fallbackDiningData = useMemo(() => ({
    description: "At Fashion Gate Mall Syria, exceptional food and drink is something we take incredibly seriously. That is why we are proud to offer a destination featuring VILAMORE RESTAURANT & CAFE and The Espresso Lab. We have carefully curated these establishments to provide an elevated culinary experience, ensuring that every visit offers both quality and variety. Whether you are looking for a refined meal or a perfect brew, our selection is designed to satisfy the most discerning tastes in a comfortable and sophisticated setting.",
    places: [
      {
        title: "VILAMORE RESTAURANT & CAFE",
        description: "VILAMORE RESTAURANT & CAFE brings a celebrated blend of Syrian and Turkish culinary traditions to our guests, offering an authentic taste of the Levantine region in every bite. We are delighted to announce the grand opening of our newest destination at Fashion Gate Mall Syria. When visiting our new home in Syria, you will find warm lighting, sophisticated comfort, and a menu featuring traditional breakfasts, signature grilled specialties, and rich Mediterranean flavors. We invite you to join us for a beautiful dining experience that celebrates great food and genuine hospitality.",
        image: "/brand/vilamore-bg.jpg",
        logo: "/brand/vilamore-logo.png",
        operatingHoursLabel: "Operating Hours",
        operatingHoursValue: "Daily TBC",
        contactUsLabel: "Contact Us",
        contactUsValue: "TBC",
        buttonText: "Explore Menu",
        redirectionType: "custom",
        buttonPath: "/dining/vilamore",
        showSecondaryButton: true,
        secondaryButtonText: "Book A Table",
        secondaryButtonPath: "https://wa.me/963119988"
      },
      {
        title: "The Espresso Lab",
        description: "From the vibrant heart of Dubai to the welcoming atmosphere of Fashion Gate Mall Syria, The Espresso Lab brings a refined coffee culture to Syria. We take pride in our dedication to excellence, sourcing premium specialty beans directly from world-renowned origins to ensure a superior cup in every pour. Whether you are pausing for a quiet moment during your shopping day or meeting friends to share our selection of artisanal treats, our cafe provides an inviting space where quality meets passion.",
        image: "/brand/the-espresso-lab-bg.jpg",
        logo: "/brand/the-espresso-lab-logo.png",
        operatingHoursLabel: "Operating Hours",
        operatingHoursValue: "Daily TBC",
        contactUsLabel: "Contact Us",
        contactUsValue: "TBC",
        buttonText: "Explore Menu",
        redirectionType: "custom",
        buttonPath: "/dining/the-espresso-lab",
        showSecondaryButton: false,
        secondaryButtonText: "Book A Table",
        secondaryButtonPath: "https://wa.me/963119988"
      }
    ]
  }), []);

  const getPlacePath = (p: any, fallbackPath: string) => {
    let rawPath = fallbackPath;
    if (p.redirectionType === "reference" && p.pageReference?.restaurantId) {
      rawPath = `/dining/${p.pageReference.restaurantId}/${lang}`;
    } else {
      rawPath = p.buttonPath || fallbackPath;
    }
    if (rawPath.startsWith("/")) {
      let clean = rawPath.replace(/\/(ar|en)$/, "").replace(/\/(ar|en)\//, "/");
      return `${clean}/${lang}`;
    }
    return rawPath;
  };

  const resolvedDiningIntro = getLocalizedValue(diningCmsData?.description, lang, fallbackDiningData.description);

  const resolvedRestaurant = useMemo(() => {
    const p = diningCmsData?.restaurantPlace || {};
    const f = fallbackDiningData.places[0];
    return {
      title: getLocalizedValue(p.title, lang, f.title),
      description: getLocalizedValue(p.description, lang, f.description),
      operatingHoursLabel: getLocalizedValue(p.operatingHoursLabel, lang, f.operatingHoursLabel),
      operatingHoursValue: getLocalizedValue(p.operatingHoursValue, lang, f.operatingHoursValue),
      contactUsLabel: getLocalizedValue(p.contactUsLabel, lang, f.contactUsLabel),
      contactUsValue: getLocalizedValue(p.contactUsValue, lang, f.contactUsValue),
      buttonText: getLocalizedValue(p.buttonText, lang, f.buttonText),
      buttonPath: getPlacePath(p, f.buttonPath),
      image: p.image ? (p.image.asset?.url || imageUrl(p.image).url()) : f.image,
      logo: p.logo ? (p.logo.asset?.url || imageUrl(p.logo).url()) : f.logo,
      showSecondaryButton: p.showSecondaryButton !== undefined ? p.showSecondaryButton : f.showSecondaryButton,
      secondaryButtonText: getLocalizedValue(p.secondaryButtonText, lang, f.secondaryButtonText),
      secondaryButtonPath: p.secondaryButtonPath || f.secondaryButtonPath
    };
  }, [diningCmsData?.restaurantPlace, lang, fallbackDiningData]);

  const resolvedCafe = useMemo(() => {
    const p = diningCmsData?.cafePlace || {};
    const f = fallbackDiningData.places[1];
    return {
      title: getLocalizedValue(p.title, lang, f.title),
      description: getLocalizedValue(p.description, lang, f.description),
      operatingHoursLabel: getLocalizedValue(p.operatingHoursLabel, lang, f.operatingHoursLabel),
      operatingHoursValue: getLocalizedValue(p.operatingHoursValue, lang, f.operatingHoursValue),
      contactUsLabel: getLocalizedValue(p.contactUsLabel, lang, f.contactUsLabel),
      contactUsValue: getLocalizedValue(p.contactUsValue, lang, f.contactUsValue),
      buttonText: getLocalizedValue(p.buttonText, lang, f.buttonText),
      buttonPath: getPlacePath(p, f.buttonPath),
      image: p.image ? (p.image.asset?.url || imageUrl(p.image).url()) : f.image,
      logo: p.logo ? (p.logo.asset?.url || imageUrl(p.logo).url()) : f.logo,
      showSecondaryButton: p.showSecondaryButton !== undefined ? p.showSecondaryButton : f.showSecondaryButton,
      secondaryButtonText: getLocalizedValue(p.secondaryButtonText, lang, f.secondaryButtonText),
      secondaryButtonPath: p.secondaryButtonPath || f.secondaryButtonPath
    };
  }, [diningCmsData?.cafePlace, lang, fallbackDiningData]);

  // 1. Determine layout subcategories list
  const subcategoryList = useMemo(() => {
    if (categoryId === "dining" || categoryId === "fashion") {
      return [];
    }

    const getBrandName = (id: string, defaultName: string) => {
      if (lang === "ar") {
        const b = getBrandById(id);
        if (b?.nameAr) return b.nameAr;
      }
      return defaultName;
    };

    return [
      { id: "adidas", label: getBrandName("adidas", "adidas") },
      { id: "calvin-klein", label: getBrandName("calvin-klein", "Calvin Klein") },
      { id: "skechers", label: getBrandName("skechers", "Skechers") },
      { id: "maxmara", label: getBrandName("maxmara", "Max Mara") },
      { id: "editorial", label: getBrandName("editorial", "Editorial") },
      { id: "paul-shark", label: getBrandName("paul-shark", "Paul & Shark") },
      { id: "brands-link", label: lang === "ar" ? "العلامات التجارية" : "Brands" }
    ];
  }, [categoryId, lang]);

  // 2. Filter products based on active filters
  const filteredProducts = useMemo(() => {
    let list = initialProducts || products;

    if (categoryId === "women") {
      list = list.filter((p) => p.category.toLowerCase() === "women");
      if (activeSub !== "all") {
        list = list.filter((p) => p.subcategory?.toLowerCase() === activeSub.toLowerCase());
      }
    } else if (categoryId === "men") {
      list = list.filter((p) => p.category.toLowerCase() === "men");
      if (activeSub !== "all") {
        list = list.filter((p) => p.subcategory?.toLowerCase() === activeSub.toLowerCase());
      }
    } else if (categoryId === "perfumes") {
      list = list.filter((p) => p.category.toLowerCase() === "perfumes");
      if (activeBrand !== "all") {
        list = list.filter((p) => p.brandId.toLowerCase() === activeBrand.toLowerCase());
      }
    } else if (categoryId === "skincare") {
      list = list.filter((p) => p.category.toLowerCase() === "skincare");
      if (activeBrand !== "all") {
        list = list.filter((p) => p.brandId.toLowerCase() === activeBrand.toLowerCase());
      }
    } else if (categoryId === "dining") {
      list = list.filter((p) => p.category.toLowerCase() === "dining");
    } else if (categoryId === "fashion") {
      list = list.filter((p) => p.category.toLowerCase() === "women" || p.category.toLowerCase() === "men");
      if (activeSub !== "all") {
        list = list.filter((p) => p.subcategory?.toLowerCase() === activeSub.toLowerCase());
      }
    } else if (categoryId === "designers") {
      if (activeBrand !== "all") {
        list = list.filter((p) => p.brandId.toLowerCase() === activeBrand.toLowerCase());
      }
    }

    return list;
  }, [categoryId, activeSub, activeBrand]);

  const selectFilter = (filterId: string) => {
    if (filterId === "brands-link") {
      router.push(`/brand/${lang}`);
      return;
    }

    if (filterId !== "all" && filterId !== "brands-link") {
      router.push(`/brand/${filterId}/${lang}`);
      return;
    }

    if (filterId === "all") {
      router.push(`/category/${categoryId}/${lang}`);
    } else {
      router.push(`/category/${categoryId}/${lang}?sub=${filterId}`);
    }
  };

  const pageTitle = categoryCmsData?.title
    ? (getLocalizedValue(categoryCmsData.title, lang, "") || ((typeof t[categoryId as keyof typeof t] === "string" ? t[categoryId as keyof typeof t] : categoryId) as string))
    : ((typeof t[categoryId as keyof typeof t] === "string" ? t[categoryId as keyof typeof t] : categoryId) as string);

  const pageDescription = categoryCmsData?.description
    ? getLocalizedValue(categoryCmsData.description, lang, "")
    : "";

  const theme = useMemo(() => createTheme({
    palette: {
      mode: "light",
      primary: { main: "#CB6116", dark: "#9D430C" },
      secondary: { main: "#D06010" }
    },
    typography: {
      fontFamily: `"Cairo", sans-serif`,
      button: { fontWeight: 800 }
    },
    shape: { borderRadius: 0 }
  }), []);

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ bgcolor: "#fbfaf8", color: "#111111", minHeight: "100vh", display: "flex", flexDirection: "column" }} dir={lang === "ar" ? "rtl" : "ltr"}>
        <Box sx={{ flexGrow: 1, py: { xs: 6, md: 10 }, opacity: isLangTransitioning ? 0 : 1, transition: "opacity 0.25s ease" }}>
          <Container maxWidth="xl">
            {/* Breadcrumbs Section */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                mb: 2.5,
                fontSize: 12.5,
                fontWeight: 500,
                color: "rgba(0,0,0,0.4)",
                fontFamily: '"Cairo", sans-serif',
                textAlign: lang === "ar" ? "right" : "left",
                justifyContent: "flex-start",
                flexWrap: "wrap"
              }}
              dir={lang === "ar" ? "rtl" : "ltr"}
            >
              <Link href={`/${lang}`} style={{ textDecoration: "none", color: "inherit", transition: "color 0.2s ease" }}>
                <Box component="span" sx={{ "&:hover": { color: "#CB6116" }, cursor: "pointer" }}>
                  {lang === "ar" ? "الرئيسية" : "Home"}
                </Box>
              </Link>
              <Box component="span" sx={{ mx: 0.5, fontSize: 10 }}>/</Box>
              <Box component="span" sx={{ color: "rgba(0,0,0,0.8)", fontWeight: 600 }}>
                {pageTitle}
              </Box>
            </Box>

            {/* Header Title Section */}
            <Stack spacing={2} sx={{ mb: 6, textAlign: lang === "ar" ? "right" : "left" }}>
              <Typography sx={{ color: "#CB6116", textTransform: "uppercase", fontSize: 11, fontWeight: 800, letterSpacing: lang === "ar" ? 0 : "0.2em", fontFamily: '"Cairo", sans-serif' }}>
                {lang === "ar" ? "فاشن غيت مول" : "Fashion Gate Mall"}
              </Typography>
              <Typography variant="h3" sx={{ fontFamily: "var(--heading-font)", fontWeight: 500, color: "#111111" }}>
                {pageTitle}
              </Typography>
              {pageDescription && (
                <Typography sx={{ fontSize: 14.8, color: "rgba(0,0,0,0.6)", maxWidth: "800px", lineHeight: 1.7, mt: 1, fontFamily: '"Cairo", sans-serif' }}>
                  {pageDescription}
                </Typography>
              )}
              <Divider sx={{ borderColor: "rgba(0,0,0,0.06)", mt: 2 }} />
            </Stack>

            <Grid container spacing={4}>
              {/* Sidebar Filter Panel */}
              {["women", "men"].includes(categoryId) && (
                <Grid size={{ xs: 12, md: 3 }} sx={{ borderRight: lang === "en" ? "1px solid rgba(0,0,0,0.06)" : "none", borderLeft: lang === "ar" ? "1px solid rgba(0,0,0,0.06)" : "none", px: 2 }}>
                  <Typography sx={{ color: "#111111", fontSize: 12, fontWeight: 800, letterSpacing: lang === "ar" ? 0 : "0.15em", textTransform: "uppercase", mb: 2, textAlign: lang === "ar" ? "right" : "left", fontFamily: '"Cairo", sans-serif' }}>
                    {lang === "ar" ? "العلامات التجارية" : "Brands"}
                  </Typography>

                  {/* Sidebar Search Bar */}
                  <Box sx={{ mb: 3 }}>
                    <InputBase
                      placeholder={lang === "ar" ? "ابحث عن علامة..." : "Search brand..."}
                      value={brandSearchQuery}
                      onChange={(e) => setSidebarSearchQuery(e.target.value)}
                      dir={lang === "ar" ? "rtl" : "ltr"}
                      sx={{
                        width: "100%",
                        bgcolor: "rgba(0, 0, 0, 0.02)",
                        borderBottom: "1.5px solid rgba(0, 0, 0, 0.12)",
                        px: 1.5,
                        py: 0.5,
                        fontSize: 13,
                        fontFamily: '"Cairo", sans-serif',
                        "&:focus-within": {
                          borderColor: "#CB6116"
                        }
                      }}
                    />
                  </Box>

                  {/* Scrollable Brands List */}
                  <Box
                    sx={{
                      maxHeight: "55vh",
                      overflowY: "auto",
                      pr: lang === "en" ? 1 : 0,
                      pl: lang === "ar" ? 1 : 0,
                      display: "flex",
                      flexDirection: "column",
                      gap: 0.5,
                      "&::-webkit-scrollbar": {
                        width: "4px"
                      },
                      "&::-webkit-scrollbar-thumb": {
                        bgcolor: "rgba(0, 0, 0, 0.08)",
                        borderRadius: "2px"
                      }
                    }}
                  >
                    {filteredSidebarBrands.map((brand) => {
                      const isSelected = activeBrand === brand.id;
                      return (
                        <Button
                          key={brand.id}
                          onClick={() => selectFilter(brand.id)}
                          sx={{
                            color: isSelected ? "#CB6116" : "rgba(0,0,0,0.6)",
                            fontWeight: isSelected ? 700 : 500,
                            fontSize: 13,
                            py: 0.8,
                            px: 1.5,
                            width: "100%",
                            justifyContent: lang === "ar" ? "flex-start" : "flex-start",
                            textAlign: lang === "ar" ? "right" : "left",
                            borderRadius: 0,
                            fontFamily: '"Cairo", sans-serif',
                            bgcolor: isSelected ? "rgba(203, 97, 22, 0.05)" : "transparent",
                            borderBottom: "1px solid rgba(0,0,0,0.03)",
                            "&:hover": {
                              bgcolor: "rgba(0,0,0,0.03)",
                              color: "#CB6116"
                            }
                          }}
                        >
                          {brand.name}
                        </Button>
                      );
                    })}
                  </Box>

                  {/* Brands Redirection Link */}
                  <Button
                    onClick={() => selectFilter("brands-link")}
                    sx={{
                      color: "#CB6116",
                      fontWeight: 700,
                      fontSize: 13,
                      py: 1,
                      px: 1.5,
                      width: "100%",
                      justifyContent: lang === "ar" ? "flex-start" : "flex-start",
                      textAlign: lang === "ar" ? "right" : "left",
                      borderRadius: 0,
                      fontFamily: '"Cairo", sans-serif',
                      mt: 2,
                      borderTop: "1.5px solid rgba(203, 97, 22, 0.15)",
                      "&:hover": {
                        bgcolor: "rgba(203, 97, 22, 0.05)"
                      }
                    }}
                  >
                    {lang === "ar" ? "كل العلامات التجارية" : "All Brands Catalog"}
                  </Button>
                </Grid>
              )}

              {/* Products Grid Panel */}
              <Grid size={{ xs: 12, md: ["women", "men"].includes(categoryId) ? 9 : 12 }}>
                <AnimatePresence mode="wait">
                  <MotionBox
                    key={`${activeSub}-${activeBrand}-${categoryId}`}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    transition={{ duration: 0.4 }}
                  >
                    {categoryCmsData?.banners && categoryCmsData.banners.length > 0 ? (
                      <Box sx={{ mb: 6 }} dir={lang === "ar" ? "rtl" : "ltr"}>
                        <Grid container spacing={4} sx={{ mb: 8 }}>
                          {(() => {
                            const isBannerMatchingSub = (banner: any, sub: string) => {
                              if (sub === "all") return true;
                              const titleEn = (banner.title?.en || "").toLowerCase();
                              const subtitleEn = (banner.subtitle?.en || "").toLowerCase();
                              const link = (banner.link || "").toLowerCase();
                              let bannerSub = "all";
                              if (link.includes("sub=women") || link.includes("/women") || titleEn.includes("women") || subtitleEn.includes("women") || titleEn.includes("نسائ") || subtitleEn.includes("نسائ")) {
                                bannerSub = "women";
                              } else if (link.includes("sub=unisex") || link.includes("/unisex") || titleEn.includes("unisex") || subtitleEn.includes("unisex") || titleEn.includes("للجنسين") || subtitleEn.includes("للجنسين")) {
                                bannerSub = "unisex";
                              } else if (link.includes("sub=men") || link.includes("/men") || titleEn.includes("men") || subtitleEn.includes("men") || titleEn.includes("رجال") || subtitleEn.includes("رجال")) {
                                bannerSub = "men";
                              }
                              return bannerSub === sub;
                            };
                            const visibleBanners = categoryCmsData.banners.filter((b: any) => isBannerMatchingSub(b, activeSub));
                            const finalBanners = visibleBanners.length > 0 ? visibleBanners : categoryCmsData.banners;

                            return finalBanners.map((banner: any, index: number) => {
                              let gridSize = { xs: 12, sm: 6 };
                              if (activeSub !== "all" || finalBanners.length === 1) {
                                gridSize = { xs: 12, sm: 12 };
                              } else if (finalBanners.length === 3 && index === 2) {
                                gridSize = { xs: 12, sm: 12 };
                              }

                              const bannerTitle = getLocalizedValue(banner.title, lang, "");
                              const bannerSubtitle = getLocalizedValue(banner.subtitle, lang, "");
                              let bannerImg = "/brand-pages/page_01.jpg";
                              if (banner.image?.asset) {
                                try {
                                  bannerImg = imageUrl(banner.image).width(gridSize.sm === 12 ? 1200 : 800).auto("format").quality(85).url() || bannerImg;
                                } catch (e) {
                                  console.error("Failed to parse optimized banner image url", e);
                                  bannerImg = banner.image.asset.url || bannerImg;
                                }
                              }

                              const rawBannerHref = banner.link || "#";
                              const bannerHref = rawBannerHref !== "#" ? rawBannerHref.replace(/\/(en|ar)(?=\?|#|$|\/)/g, `/${lang}`) : "#";

                              const currentPathRoot = `/category/${categoryId}/${lang}`;
                              const currentPathWithSub = activeSub !== "all" ? `${currentPathRoot}?sub=${activeSub}` : currentPathRoot;
                              const normalizePathForCompare = (url: string) => {
                                if (!url) return "";
                                let path = url.replace(/^(https?:\/\/[^\/]+)?/, "");
                                return path.replace(/\/+$/, "");
                              };
                              const isCurrentPage = normalizePathForCompare(bannerHref) === normalizePathForCompare(currentPathRoot) || 
                                                    normalizePathForCompare(bannerHref) === normalizePathForCompare(currentPathWithSub) || 
                                                    bannerHref === "#" || 
                                                    bannerHref === "";

                              const isAtSubOrLeafCategory = categoryId === "women" || categoryId === "men" || activeSub === "women" || activeSub === "men" || activeSub === "unisex";
                              const isClickable = !isAtSubOrLeafCategory && !isCurrentPage;
                              const content = (
                                <Box sx={{ display: "flex", flexDirection: "column", gap: 2, cursor: isClickable ? "pointer" : "default" }}>
                                  <Box
                                    sx={{
                                      position: "relative",
                                      overflow: "hidden",
                                      height: {
                                        xs: "240px",
                                        sm: gridSize.sm === 12 ? "720px" : "440px"
                                      },
                                      border: "1px solid rgb(255 255 255) !important",
                                      transition: isClickable ? "transform 0.4s ease" : "none",
                                      "&:hover": isClickable ? {
                                        transform: "scale(1.01)"
                                      } : {}
                                    }}
                                  >
                                    <Image
                                      src={bannerImg}
                                      alt={bannerTitle || "Category Banner"}
                                      fill
                                      priority={index === 0}
                                      sizes="(max-width: 600px) 100vw, (max-width: 960px) 50vw, 33vw"
                                      style={{
                                        objectFit: "cover",
                                        objectPosition: "center top"
                                      }}
                                    />
                                  </Box>

                                  <Stack alignItems="center" spacing={0.5} sx={{ py: 1 }}>
                                    <Typography sx={{ fontFamily: '"Apple Garamond", "EB Garamond", "Cormorant Garamond", serif', fontSize: 20, fontWeight: 500, letterSpacing: "0.15em", textTransform: "uppercase", color: "#111111", textAlign: "center" }}>
                                      {bannerTitle}
                                    </Typography>
                                    <Typography sx={{ fontSize: 9.5, letterSpacing: lang === "ar" ? 0 : "0.25em", textTransform: "uppercase", fontWeight: 700, color: "#CB6116", fontFamily: '"Cairo", sans-serif', textAlign: "center" }}>
                                      {bannerSubtitle}
                                    </Typography>
                                  </Stack>
                                </Box>
                              );

                              return (
                                <Grid size={gridSize} key={banner._key || index}>
                                  {isClickable ? (
                                    <Link href={bannerHref} style={{ textDecoration: "none", color: "inherit" }}>
                                      {content}
                                    </Link>
                                  ) : (
                                    content
                                  )}
                                </Grid>
                              );
                            });
                          })()}
                        </Grid>

                        {/* Brands Grid Section */}
                        <Typography sx={{ fontSize: 20, fontWeight: 600, fontFamily: "var(--heading-font)", mb: 4, textAlign: "center", color: "#111111" }}>
                          {getLocalizedValue(categoryCmsData?.brandsHeading, lang, lang === "ar" ? "علاماتنا التجارية الفاخرة" : "Our Luxury Brands")}
                        </Typography>

                        <Grid container spacing={3} sx={{ justifyContent: "center" }}>
                          {processedBrands.map((brand) => (
                            <Grid size={{ xs: 12, sm: 6, md: 3 }} key={brand.id}>
                              <Link href={`/brand/${brand.id}/${lang}`} style={{ textDecoration: "none", color: "inherit" }}>
                                <Box
                                  sx={{
                                    bgcolor: "#ffffff",
                                    border: "1px solid rgba(0,0,0,0.06)",
                                    p: 3,
                                    height: "190px",
                                    display: "flex",
                                    flexDirection: "column",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                    textAlign: "center",
                                    transition: "all 0.4s cubic-bezier(0.25, 1, 0.5, 1)",
                                    "&:hover": {
                                      borderColor: "#CB6116",
                                      boxShadow: "0 10px 24px rgba(203, 97, 22, 0.06)",
                                      transform: "translateY(-4px)",
                                      "& .brand-action-arrow": {
                                        color: "#CB6116",
                                        transform: lang === "ar" ? "translateX(-4px)" : "translateX(4px)"
                                      }
                                    }
                                  }}
                                >
                                  <Box sx={{ flexGrow: 1, display: "flex", alignItems: "center", justifyContent: "center", minHeight: 40, width: "100%", color: "#111111" }}>
                                    <BrandLogoMark brand={brand} variant="category-card" />
                                  </Box>

                                  <Stack spacing={0.5} sx={{ mt: 1.5, width: "100%" }}>
                                    {/* <Typography sx={{ fontSize: 13, fontWeight: 600, color: "#111111", fontFamily: '"Cairo", sans-serif', textTransform: "uppercase" }}>
                                      {brand.name}
                                    </Typography> */}
                                    <Typography sx={{ fontSize: 12.5, color: "rgba(0, 0, 0, 0.66)", fontWeight: 500, fontFamily: '"Cairo", sans-serif', overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                      {brand.headline || brand.description}
                                    </Typography>
                                  </Stack>

                                  <Stack direction="row" alignItems="center" spacing={0.5} className="brand-action-arrow" sx={{ mt: 1.5, color: "rgba(0, 0, 0, 0.56)", transition: "all 0.3s ease" }}>
                                    <Typography sx={{ fontSize: 9.5, fontWeight: 700, textTransform: "uppercase", letterSpacing: lang === "ar" ? 0 : "0.12em", fontFamily: '"Cairo", sans-serif' }}>
                                      {lang === "ar" ? "تصفح المجموعة" : "Explore"}
                                    </Typography>
                                    {lang === "ar" ? <ArrowBackIcon sx={{ fontSize: 12 }} /> : <ArrowForwardIcon sx={{ fontSize: 12 }} />}
                                  </Stack>
                                </Box>
                              </Link>
                            </Grid>
                          ))}
                        </Grid>
                      </Box>
                    ) : categoryId === "fashion" ? (
                      <Box sx={{ mb: 6 }} dir={lang === "ar" ? "rtl" : "ltr"}>
                        <Grid container spacing={4} sx={{ mb: 8 }}>
                          {/* Women Banner */}
                          {showWomen && (
                            <Grid size={{ xs: 12, sm: womenGridSize }}>
                              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                                <Box
                                  sx={{
                                    height: { xs: "280px", sm: "440px" },
                                    backgroundImage: 'url("/brand/hero-woman.jpg")',
                                    backgroundSize: "cover",
                                    backgroundPosition: "center top",
                                    border: "1px solid rgb(255 255 255) !important"
                                  }}
                                />
                                <Stack alignItems="center" spacing={0.5} sx={{ py: 1 }}>
                                  <Typography sx={{ fontFamily: '"Apple Garamond", "EB Garamond", "Cormorant Garamond", serif', fontSize: 22, fontWeight: 500, letterSpacing: "0.15em", textTransform: "uppercase", color: "#111111" }}>
                                    {lang === "ar" ? "النساء" : "WOMEN"}
                                  </Typography>
                                  <Typography sx={{ fontSize: 9.5, letterSpacing: "0.25em", textTransform: "uppercase", fontWeight: 700, color: "#CB6116", fontFamily: '"Cairo", sans-serif' }}>
                                    {lang === "ar" ? "تشكيلة النساء" : "WOMEN COLLECTION"}
                                  </Typography>
                                </Stack>
                              </Box>
                            </Grid>
                          )}

                          {/* Men Banner */}
                          {showMen && (
                            <Grid size={{ xs: 12, sm: menGridSize }}>
                              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                                <Box
                                  sx={{
                                    height: { xs: "280px", sm: "440px" },
                                    backgroundImage: 'url("/brand/hero-look-03.jpg")',
                                    backgroundSize: "cover",
                                    backgroundPosition: "center top",
                                    border: "1px solid rgb(255 255 255) !important"
                                  }}
                                />
                                <Stack alignItems="center" spacing={0.5} sx={{ py: 1 }}>
                                  <Typography sx={{ fontFamily: '"Apple Garamond", "EB Garamond", "Cormorant Garamond", serif', fontSize: 22, fontWeight: 500, letterSpacing: "0.15em", textTransform: "uppercase", color: "#111111" }}>
                                    {lang === "ar" ? "الرجال" : "MEN"}
                                  </Typography>
                                  <Typography sx={{ fontSize: 9.5, letterSpacing: "0.25em", textTransform: "uppercase", fontWeight: 700, color: "#CB6116", fontFamily: '"Cairo", sans-serif' }}>
                                    {lang === "ar" ? "تشكيلة الرجال" : "MEN COLLECTION"}
                                  </Typography>
                                </Stack>
                              </Box>
                            </Grid>
                          )}
                        </Grid>

                        {/* Brands Grid Section */}
                        <Typography sx={{ fontSize: 20, fontWeight: 600, fontFamily: "var(--heading-font)", mb: 4, textAlign: "center", color: "#111111" }}>
                          {getLocalizedValue(categoryCmsData?.brandsHeading, lang, lang === "ar" ? "علاماتنا التجارية الفاخرة" : "Our Luxury Brands")}
                        </Typography>

                        <Grid container spacing={3} sx={{ justifyContent: "center" }}>
                          {processedBrands.map((brand) => (
                            <Grid size={{ xs: 12, sm: 6, md: 3 }} key={brand.id}>
                              <Link href={`/brand/${brand.id}/${lang}`} style={{ textDecoration: "none", color: "inherit" }}>
                                <Box
                                  sx={{
                                    bgcolor: "#ffffff",
                                    border: "1px solid rgba(0,0,0,0.06)",
                                    p: 3,
                                    height: "190px",
                                    display: "flex",
                                    flexDirection: "column",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                    textAlign: "center",
                                    transition: "all 0.4s cubic-bezier(0.25, 1, 0.5, 1)",
                                    "&:hover": {
                                      borderColor: "#CB6116",
                                      boxShadow: "0 10px 24px rgba(203, 97, 22, 0.06)",
                                      transform: "translateY(-4px)",
                                      "& .brand-action-arrow": {
                                        color: "#CB6116",
                                        transform: lang === "ar" ? "translateX(-4px)" : "translateX(4px)"
                                      }
                                    }
                                  }}
                                >
                                  <Box sx={{ flexGrow: 1, display: "flex", alignItems: "center", justifyContent: "center", minHeight: 40, width: "100%", color: "#111111" }}>
                                    <BrandLogoMark brand={brand} variant="category-card" />
                                  </Box>

                                  <Stack spacing={0.5} sx={{ mt: 1.5, width: "100%" }}>
                                    <Typography sx={{ fontSize: 13, fontWeight: 600, color: "#111111", fontFamily: '"Cairo", sans-serif' }}>
                                      {brand.name}
                                    </Typography>
                                    <Typography sx={{ fontSize: 12.5, color: "rgba(0, 0, 0, 0.66)", fontWeight: 500, fontFamily: '"Cairo", sans-serif', overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                      {brand.headline || brand.description}
                                    </Typography>
                                  </Stack>

                                  <Stack direction="row" alignItems="center" spacing={0.5} className="brand-action-arrow" sx={{ mt: 1.5, color: "rgba(0, 0, 0, 0.56)", transition: "all 0.3s ease" }}>
                                    <Typography sx={{ fontSize: 9.5, fontWeight: 700, textTransform: "uppercase", letterSpacing: lang === "ar" ? 0 : "0.12em", fontFamily: '"Cairo", sans-serif' }}>
                                      {lang === "ar" ? "تصفح المجموعة" : "Explore"}
                                    </Typography>
                                    {lang === "ar" ? <ArrowBackIcon sx={{ fontSize: 12 }} /> : <ArrowForwardIcon sx={{ fontSize: 12 }} />}
                                  </Stack>
                                </Box>
                              </Link>
                            </Grid>
                          ))}
                        </Grid>
                      </Box>
                    ) : categoryId === "perfumes" ? (
                      <Box sx={{ mb: 6 }} dir={lang === "ar" ? "rtl" : "ltr"}>
                        {/* Row 1: Men and Women Perfume Banners */}
                        {(showWomen || showMen) && (
                          <Grid container spacing={4} sx={{ mb: 4 }}>
                            {/* Women Perfumes Banner */}
                            {showWomen && (
                              <Grid size={{ xs: 12, sm: womenGridSize }}>
                                <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                                  <Box
                                    sx={{
                                      height: { xs: "240px", sm: "380px" },
                                      backgroundImage: 'url("/brand/hero-woman.jpg")',
                                      backgroundSize: "cover",
                                      backgroundPosition: "center top",
                                      border: "1px solid rgb(255 255 255) !important"
                                    }}
                                  />
                                  <Stack alignItems="center" spacing={0.5} sx={{ py: 1 }}>
                                    <Typography sx={{ fontFamily: '"Apple Garamond", "EB Garamond", "Cormorant Garamond", serif', fontSize: 20, fontWeight: 500, letterSpacing: "0.15em", textTransform: "uppercase", color: "#111111" }}>
                                      {lang === "ar" ? "العطور النسائية" : "WOMEN'S FRAGRANCES"}
                                    </Typography>
                                    <Typography sx={{ fontSize: 9.5, letterSpacing: "0.25em", textTransform: "uppercase", fontWeight: 700, color: "#CB6116", fontFamily: '"Cairo", sans-serif' }}>
                                      {lang === "ar" ? "رقة وجمال" : "ELEGANT & FEMININE"}
                                    </Typography>
                                  </Stack>
                                </Box>
                              </Grid>
                            )}

                            {/* Men Perfumes Banner */}
                            {showMen && (
                              <Grid size={{ xs: 12, sm: menGridSize }}>
                                <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                                  <Box
                                    sx={{
                                      height: { xs: "240px", sm: "380px" },
                                      backgroundImage: 'url("/brand/hero-look-03.jpg")',
                                      backgroundSize: "cover",
                                      backgroundPosition: "center top",
                                      border: "1px solid rgb(255 255 255) !important"
                                    }}
                                  />
                                  <Stack alignItems="center" spacing={0.5} sx={{ py: 1 }}>
                                    <Typography sx={{ fontFamily: '"Apple Garamond", "EB Garamond", "Cormorant Garamond", serif', fontSize: 20, fontWeight: 500, letterSpacing: "0.15em", textTransform: "uppercase", color: "#111111" }}>
                                      {lang === "ar" ? "العطور الرجالية" : "MEN'S FRAGRANCES"}
                                    </Typography>
                                    <Typography sx={{ fontSize: 9.5, letterSpacing: "0.25em", textTransform: "uppercase", fontWeight: 700, color: "#CB6116", fontFamily: '"Cairo", sans-serif' }}>
                                      {lang === "ar" ? "جاذبية وقوة" : "BOLD & SOPHISTICATED"}
                                    </Typography>
                                  </Stack>
                                </Box>
                              </Grid>
                            )}
                          </Grid>
                        )}

                        {/* Row 2: Unisex Perfume Banner */}
                        {showUnisex && (
                          <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mb: 8 }}>
                            <Box
                              sx={{
                                height: { xs: "260px", sm: "420px" },
                                backgroundImage: 'url("/brand/hero-unisex-perfume.jpg")',
                                backgroundSize: "cover",
                                backgroundPosition: "center center",
                                border: "1px solid rgb(255 255 255) !important"
                              }}
                            />
                            <Stack alignItems="center" spacing={0.5} sx={{ py: 1 }}>
                              <Typography sx={{ fontFamily: '"Apple Garamond", "EB Garamond", "Cormorant Garamond", serif', fontSize: 22, fontWeight: 500, letterSpacing: "0.15em", textTransform: "uppercase", color: "#111111" }}>
                                {lang === "ar" ? "العطور المشتركة (للجنسين)" : "UNISEX FRAGRANCES"}
                              </Typography>
                              <Typography sx={{ fontSize: 9.5, letterSpacing: lang === "ar" ? 0 : "0.25em", textTransform: "uppercase", fontWeight: 700, color: "#CB6116", fontFamily: '"Cairo", sans-serif' }}>
                                {lang === "ar" ? "تناغم وتفرد" : "UNIVERSAL HARMONY"}
                              </Typography>
                            </Stack>
                          </Box>
                        )}

                        {/* Perfumes Brands Grid Section */}
                        <Typography sx={{ fontSize: 20, fontWeight: 600, fontFamily: "var(--heading-font)", mb: 4, textAlign: "center", color: "#111111" }}>
                          {getLocalizedValue(categoryCmsData?.brandsHeading, lang, lang === "ar" ? "دور العطور العالمية الفاخرة" : "Luxury Fragrance Houses")}
                        </Typography>

                        <Grid container spacing={3} sx={{ justifyContent: "center" }}>
                          {processedBrands.map((brand) => (
                              <Grid size={{ xs: 12, sm: 6, md: 3 }} key={brand.id}>
                                <Link href={`/brand/${brand.id}/${lang}`} style={{ textDecoration: "none", color: "inherit" }}>
                                  <Box
                                    sx={{
                                      bgcolor: "#ffffff",
                                      border: "1px solid rgb(255 255 255) !important",

                                      p: 2,
                                      height: "190px",
                                      display: "flex",
                                      flexDirection: "column",
                                      justifyContent: "space-between",
                                      alignItems: "center",
                                      textAlign: "center",
                                      transition: "all 0.4s cubic-bezier(0.25, 1, 0.5, 1)",
                                      "&:hover": {
                                        borderColor: "#CB6116",
                                        boxShadow: "0 10px 24px rgba(203, 97, 22, 0.06)",
                                        transform: "translateY(-4px)",
                                        "& .brand-action-arrow": {
                                          color: "#CB6116",
                                          transform: lang === "ar" ? "translateX(-4px)" : "translateX(4px)"
                                        }
                                      }
                                    }}
                                  >
                                    <Box sx={{ flexGrow: 1, display: "flex", alignItems: "center", justifyContent: "center", minHeight: 40, width: "100%", color: "#111111" }}>
                                      <BrandLogoMark brand={brand} variant="category-card" />
                                    </Box>

                                    <Stack spacing={0.5} sx={{ mt: 1.5, width: "100%" }}>
                                      <Typography sx={{ fontSize: 13, fontWeight: 600, color: "#111111", fontFamily: '"Cairo", sans-serif' }}>
                                        {brand.name}
                                      </Typography>
                                      <Typography sx={{ fontSize: 12.5, color: "rgba(0, 0, 0, 0.66)", fontWeight: 500, fontFamily: '"Cairo", sans-serif', overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                        {brand.headline || brand.description}
                                      </Typography>
                                    </Stack>

                                    <Stack direction="row" alignItems="center" spacing={0.5} className="brand-action-arrow" sx={{ mt: 1.5, color: "rgba(0, 0, 0, 0.56)", transition: "all 0.3s ease" }}>
                                      <Typography sx={{ fontSize: 9.5, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", fontFamily: '"Cairo", sans-serif' }}>
                                        {lang === "ar" ? "تصفح المجموعة" : "Explore"}
                                      </Typography>
                                      {lang === "ar" ? <ArrowBackIcon sx={{ fontSize: 12 }} /> : <ArrowForwardIcon sx={{ fontSize: 12 }} />}
                                    </Stack>
                                  </Box>
                                </Link>
                              </Grid>
                            ))}
                        </Grid>
                      </Box>
                    ) : categoryId === "beauty" ? (
                      <Box sx={{ mb: 6 }} dir={lang === "ar" ? "rtl" : "ltr"}>
                        <Grid container spacing={4} sx={{ mb: 5 }}>
                          <Grid size={{ xs: 12, sm: 6 }}>
                            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                              <Box
                                sx={{
                                  height: { xs: "280px", sm: "440px" },
                                  backgroundImage: 'url("/brand/luxury-beauty.png")',
                                  backgroundSize: "cover",
                                  backgroundPosition: "center center",
                                  border: "1px solid rgb(255 255 255) !important"
                                }}
                              />
                              <Stack alignItems="center" spacing={0.5} sx={{ py: 1 }}>
                                <Typography sx={{ fontFamily: '"Apple Garamond", "EB Garamond", "Cormorant Garamond", serif', fontSize: 22, fontWeight: 500, letterSpacing: lang === "ar" ? 0 : "0.15em", textTransform: "uppercase", color: "#111111", textAlign: "center" }}>
                                  {lang === "ar" ? "Makeup" : "MAKEUP"}
                                </Typography>
                                <Typography sx={{ fontSize: 9.5, letterSpacing: lang === "ar" ? 0 : "0.25em", textTransform: "uppercase", fontWeight: 700, color: "#CB6116", fontFamily: '"Cairo", sans-serif', textAlign: "center" }}>
                                  {lang === "ar" ? "Color, artistry and radiance" : "COLOR, ARTISTRY & RADIANCE"}
                                </Typography>
                              </Stack>
                            </Box>
                          </Grid>

                          <Grid size={{ xs: 12, sm: 6 }}>
                            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                              <Box
                                sx={{
                                  height: { xs: "280px", sm: "440px" },
                                  backgroundImage: 'url("/brand/hero-look-07.jpg")',
                                  backgroundSize: "cover",
                                  backgroundPosition: "center top",
                                  border: "1px solid rgb(255 255 255) !important"
                                }}
                              />
                              <Stack alignItems="center" spacing={0.5} sx={{ py: 1 }}>
                                <Typography sx={{ fontFamily: '"Apple Garamond", "EB Garamond", "Cormorant Garamond", serif', fontSize: 22, fontWeight: 500, letterSpacing: lang === "ar" ? 0 : "0.15em", textTransform: "uppercase", color: "#111111", textAlign: "center" }}>
                                  {lang === "ar" ? "Skincare" : "SKINCARE"}
                                </Typography>
                                <Typography sx={{ fontSize: 9.5, letterSpacing: lang === "ar" ? 0 : "0.25em", textTransform: "uppercase", fontWeight: 700, color: "#CB6116", fontFamily: '"Cairo", sans-serif', textAlign: "center" }}>
                                  {lang === "ar" ? "Ritual, care and glow" : "RITUAL, CARE & GLOW"}
                                </Typography>
                              </Stack>
                            </Box>
                          </Grid>
                        </Grid>

                        <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mb: 8 }}>
                          <Box
                            sx={{
                              height: { xs: "260px", sm: "420px" },
                              backgroundImage: 'url("/brand/hero-woman-wide.png")',
                              backgroundSize: "cover",
                              backgroundPosition: "center center",
                              border: "1px solid rgb(255 255 255) !important"
                            }}
                          />
                          <Stack alignItems="center" spacing={0.5} sx={{ py: 1 }}>
                            <Typography sx={{ fontFamily: '"Apple Garamond", "EB Garamond", "Cormorant Garamond", serif', fontSize: 22, fontWeight: 500, letterSpacing: lang === "ar" ? 0 : "0.15em", textTransform: "uppercase", color: "#111111", textAlign: "center" }}>
                              {lang === "ar" ? "Beauty Houses" : "BEAUTY HOUSES"}
                            </Typography>
                            <Typography sx={{ fontSize: 9.5, letterSpacing: lang === "ar" ? 0 : "0.25em", textTransform: "uppercase", fontWeight: 700, color: "#CB6116", fontFamily: '"Cairo", sans-serif', textAlign: "center" }}>
                              {lang === "ar" ? "World-renowned beauty, skincare and fragrance brands" : "WORLD-RENOWNED BEAUTY, SKINCARE & FRAGRANCE BRANDS"}
                            </Typography>
                          </Stack>
                        </Box>

                        <Typography sx={{ fontSize: 20, fontWeight: 600, fontFamily: "var(--heading-font)", mb: 4, textAlign: "center", color: "#111111" }}>
                          {lang === "ar" ? "Luxury Beauty Houses" : "Luxury Beauty Houses"}
                        </Typography>

                        <Grid container spacing={3} sx={{ justifyContent: "center" }}>
                          {processedBrands.map((brand) => (
                            <Grid size={{ xs: 12, sm: 6, md: 3 }} key={brand.id}>
                              <Link href={`/brand/${brand.id}/${lang}`} style={{ textDecoration: "none", color: "inherit" }}>
                                <Box
                                  sx={{
                                    bgcolor: "#ffffff",
                                    border: "1px solid rgba(0,0,0,0.06)",
                                    p: 3,
                                    height: "190px",
                                    display: "flex",
                                    flexDirection: "column",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                    textAlign: "center",
                                    transition: "all 0.4s cubic-bezier(0.25, 1, 0.5, 1)",
                                    "&:hover": {
                                      borderColor: "#CB6116",
                                      boxShadow: "0 10px 24px rgba(203, 97, 22, 0.06)",
                                      transform: "translateY(-4px)",
                                      "& .brand-action-arrow": {
                                        color: "#CB6116",
                                        transform: lang === "ar" ? "translateX(-4px)" : "translateX(4px)"
                                      }
                                    }
                                  }}
                                >
                                  <Box sx={{ flexGrow: 1, display: "flex", alignItems: "center", justifyContent: "center", minHeight: 40, width: "100%", color: "#111111" }}>
                                    <BrandLogoMark brand={brand} variant="category-card" />
                                  </Box>

                                  <Stack spacing={0.5} sx={{ mt: 1.5, width: "100%" }}>
                                    <Typography sx={{ fontSize: 13, fontWeight: 600, color: "#111111", fontFamily: '"Cairo", sans-serif' }}>
                                      {brand.name}
                                    </Typography>
                                    <Typography sx={{ fontSize: 12.5, color: "rgba(0, 0, 0, 0.66)", fontWeight: 500, fontFamily: '"Cairo", sans-serif', overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                      {brand.headline || brand.description}
                                    </Typography>
                                  </Stack>

                                  <Stack direction="row" alignItems="center" spacing={0.5} className="brand-action-arrow" sx={{ mt: 1.5, color: "rgba(0, 0, 0, 0.56)", transition: "all 0.3s ease" }}>
                                    <Typography sx={{ fontSize: 9.5, fontWeight: 700, textTransform: "uppercase", letterSpacing: lang === "ar" ? 0 : "0.12em", fontFamily: '"Cairo", sans-serif' }}>
                                      {lang === "ar" ? "Explore" : "Explore"}
                                    </Typography>
                                    {lang === "ar" ? <ArrowBackIcon sx={{ fontSize: 12 }} /> : <ArrowForwardIcon sx={{ fontSize: 12 }} />}
                                  </Stack>
                                </Box>
                              </Link>
                            </Grid>
                          ))}
                        </Grid>
                      </Box>
                    ) : categoryId === "skincare" ? (
                      <Box sx={{ mb: 6 }} dir={lang === "ar" ? "rtl" : "ltr"}>
                        <Grid container spacing={4} sx={{ mb: 8 }}>
                          {/* Women Skincare Banner */}
                          {showWomen && (
                            <Grid size={{ xs: 12, sm: womenGridSize }}>
                              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                                <Box
                                  sx={{
                                    height: { xs: "280px", sm: "440px" },
                                    backgroundImage: 'url("/brand/hero-woman.jpg")',
                                    backgroundSize: "cover",
                                    backgroundPosition: "center top",
                                    border: "1px solid rgb(255 255 255) !important"
                                  }}
                                />
                                <Stack alignItems="center" spacing={0.5} sx={{ py: 1 }}>
                                  <Typography sx={{ fontFamily: '"Apple Garamond", "EB Garamond", "Cormorant Garamond", serif', fontSize: 20, fontWeight: 500, letterSpacing: "0.15em", textTransform: "uppercase", color: "#111111" }}>
                                    {lang === "ar" ? "العناية بالبشرة للنساء" : "WOMEN'S SKINCARE"}
                                  </Typography>
                                  <Typography sx={{ fontSize: 9.5, letterSpacing: "0.25em", textTransform: "uppercase", fontWeight: 700, color: "#CB6116", fontFamily: '"Cairo", sans-serif' }}>
                                    {lang === "ar" ? "جمال ونضارة" : "GLOW & RADIANCE"}
                                  </Typography>
                                </Stack>
                              </Box>
                            </Grid>
                          )}

                          {/* Men Skincare Banner */}
                          {showMen && (
                            <Grid size={{ xs: 12, sm: menGridSize }}>
                              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                                <Box
                                  sx={{
                                    height: { xs: "280px", sm: "440px" },
                                    backgroundImage: 'url("/brand/hero-look-03.jpg")',
                                    backgroundSize: "cover",
                                    backgroundPosition: "center top",
                                    border: "1px solid rgb(255 255 255) !important"
                                  }}
                                />
                                <Stack alignItems="center" spacing={0.5} sx={{ py: 1 }}>
                                  <Typography sx={{ fontFamily: '"Apple Garamond", "EB Garamond", "Cormorant Garamond", serif', fontSize: 20, fontWeight: 500, letterSpacing: "0.15em", textTransform: "uppercase", color: "#111111" }}>
                                    {lang === "ar" ? "العناية بالبشرة للرجال" : "MEN'S SKINCARE"}
                                  </Typography>
                                  <Typography sx={{ fontSize: 9.5, letterSpacing: "0.25em", textTransform: "uppercase", fontWeight: 700, color: "#CB6116", fontFamily: '"Cairo", sans-serif' }}>
                                    {lang === "ar" ? "عناية يومية" : "DAILY ESSENTIALS"}
                                  </Typography>
                                </Stack>
                              </Box>
                            </Grid>
                          )}
                        </Grid>

                        {/* Skincare Brands Grid Section */}
                        <Typography sx={{ fontSize: 20, fontWeight: 600, fontFamily: "var(--heading-font)", mb: 4, textAlign: "center", color: "#111111" }}>
                          {lang === "ar" ? "علامات العناية بالبشرة الفاخرة" : "Luxury Skincare Houses"}
                        </Typography>

                        <Grid container spacing={3} sx={{ justifyContent: "center" }}>
                          {processedBrands.map((brand) => (
                              <Grid size={{ xs: 12, sm: 6, md: 3 }} key={brand.id}>
                                <Link href={`/brand/${brand.id}/${lang}`} style={{ textDecoration: "none", color: "inherit" }}>
                                  <Box
                                    sx={{
                                      bgcolor: "#ffffff",
                                      border: "1px solid rgb(255 255 255) !important",
                                      p: 3,
                                      height: "190px",
                                      display: "flex",
                                      flexDirection: "column",
                                      justifyContent: "space-between",
                                      alignItems: "center",
                                      textAlign: "center",
                                      transition: "all 0.4s cubic-bezier(0.25, 1, 0.5, 1)",
                                      "&:hover": {
                                        borderColor: "#CB6116",
                                        boxShadow: "0 10px 24px rgba(203, 97, 22, 0.06)",
                                        transform: "translateY(-4px)",
                                        "& .brand-action-arrow": {
                                          color: "#CB6116",
                                          transform: lang === "ar" ? "translateX(-4px)" : "translateX(4px)"
                                        }
                                      }
                                    }}
                                  >
                                    <Box sx={{ flexGrow: 1, display: "flex", alignItems: "center", justifyContent: "center", minHeight: 40, width: "100%", color: "#111111" }}>
                                      <BrandLogoMark brand={brand} variant="category-card" />
                                    </Box>

                                    <Stack spacing={0.5} sx={{ mt: 1.5, width: "100%" }}>
                                      <Typography sx={{ fontSize: 13, fontWeight: 600, color: "#111111", fontFamily: '"Cairo", sans-serif' }}>
                                        {brand.name}
                                      </Typography>
                                      <Typography sx={{ fontSize: 12.5, color: "rgba(0, 0, 0, 0.66)", fontWeight: 500, fontFamily: '"Cairo", sans-serif', overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                        {brand.headline || brand.description}
                                      </Typography>
                                    </Stack>

                                    <Stack direction="row" alignItems="center" spacing={0.5} className="brand-action-arrow" sx={{ mt: 1.5, color: "rgba(0, 0, 0, 0.56)", transition: "all 0.3s ease" }}>
                                      <Typography sx={{ fontSize: 9.5, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", fontFamily: '"Cairo", sans-serif' }}>
                                        {lang === "ar" ? "تصفح المجموعة" : "Explore"}
                                      </Typography>
                                      {lang === "ar" ? <ArrowBackIcon sx={{ fontSize: 12 }} /> : <ArrowForwardIcon sx={{ fontSize: 12 }} />}
                                    </Stack>
                                  </Box>
                                </Link>
                              </Grid>
                            ))}
                        </Grid>
                      </Box>
                    ) : categoryId === "dining" ? (
                      <Box sx={{ mb: 6 }} dir={lang === "ar" ? "rtl" : "ltr"}>
                        {/* Dining Intro Description Block */}
                        <Box
                          component={motion.div}
                          initial={{ opacity: 0, y: 20 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.6 }}
                          sx={{
                            textAlign: "left",
                            maxWidth: "850px",
                            // mx: "auto",
                            mb: 8,
                            px: 2
                          }}
                        >
                          <Typography
                            sx={{
                              fontSize: { xs: 15, md: 17 },
                              lineHeight: 1.9,
                              color: "rgba(0,0,0,0.65)",
                              fontFamily: '"Cairo", sans-serif',
                              fontWeight: 400
                            }}
                          >
                            {resolvedDiningIntro}
                          </Typography>
                        </Box>

                        {/* Vilamore Restaurant & Cafe Showcase */}
                        <Grid
                          container
                          spacing={{ xs: 0, md: 0 }}
                          sx={{
                            mb: 10,
                            alignItems: "stretch",
                            border: "1px solid rgba(0,0,0,0.06)",
                            bgcolor: "#ffffff"
                          }}
                          component={motion.div}
                          initial={{ opacity: 0, y: 30 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true, margin: "-50px" }}
                          transition={{ duration: 0.8 }}
                        >
                          {/* Image Left */}
                          <Grid size={{ xs: 12, md: 6 }}>
                            <Link href={resolvedRestaurant.buttonPath} style={{ textDecoration: "none", display: "block", height: "100%" }}>
                              <Box
                                sx={{
                                  height: { xs: "300px", sm: "400px", md: "100%" },
                                  minHeight: { md: "520px" },
                                  position: "relative",
                                  overflow: "hidden",
                                  cursor: "pointer",
                                  "&:hover .dining-bg": {
                                    transform: "scale(1.04)"
                                  }
                                }}
                              >
                                <Box
                                  className="dining-bg"
                                  sx={{
                                    position: "absolute",
                                    inset: 0,
                                    backgroundImage: `url("${resolvedRestaurant.image}")`,
                                    backgroundSize: "cover",
                                    backgroundPosition: "center center",
                                    transition: "transform 1s cubic-bezier(0.25, 1, 0.5, 1)"
                                  }}
                                />
                                <Box
                                  sx={{
                                    position: "absolute",
                                    inset: 0,
                                    bgcolor: "rgba(0,0,0,0.15)"
                                  }}
                                />
                              </Box>
                            </Link>
                          </Grid>

                          {/* Content Right */}
                          <Grid
                            size={{ xs: 12, md: 6 }}
                            sx={{
                              p: { xs: 4, sm: 6, md: 8 },
                              display: "flex",
                              flexDirection: "column",
                              justifyContent: "center",
                              textAlign: lang === "ar" ? "right" : "left"
                            }}
                          >
                            <Link href={resolvedRestaurant.buttonPath}>
                              <Box
                                component="img"
                                src={resolvedRestaurant.logo}
                                alt="Vilamore Logo"
                                sx={{
                                  maxHeight: { xs: 65, md: 80 },
                                  maxWidth: "280px",
                                  objectFit: "contain",
                                  alignSelf: "flex-start",
                                  mb: 4,
                                  cursor: "pointer"
                                }}
                              />
                            </Link>

                            <Link href={resolvedRestaurant.buttonPath} style={{ textDecoration: "none", color: "inherit" }}>
                              <Typography
                                variant="h5"
                                sx={{
                                  fontFamily: "var(--heading-font)",
                                  fontWeight: 500,
                                  mb: 2,
                                  color: "#111111",
                                  "&:hover": { color: "#CB6116" }
                                }}
                              >
                                {resolvedRestaurant.title}
                              </Typography>
                            </Link>

                            <Typography
                              sx={{
                                fontSize: 14.5,
                                lineHeight: 1.8,
                                color: "rgba(0,0,0,0.6)",
                                fontFamily: '"Cairo", sans-serif',
                                mb: 4
                              }}
                            >
                              {resolvedRestaurant.description}
                            </Typography>

                            <Divider sx={{ borderColor: "rgba(0,0,0,0.06)", mb: 3 }} />

                            {/* Metadata */}
                            <Stack spacing={1.5} sx={{ mb: 4 }}>
                              <Typography sx={{ fontSize: 13, fontFamily: '"Cairo", sans-serif', color: "rgba(0,0,0,0.7)" }}>
                                <strong>{resolvedRestaurant.operatingHoursLabel || (lang === "ar" ? "أوقات العمل:" : "Operating Hours:")}</strong> {resolvedRestaurant.operatingHoursValue}
                              </Typography>
                              <Typography sx={{ fontSize: 13, fontFamily: '"Cairo", sans-serif', color: "rgba(0,0,0,0.7)" }}>
                                <strong>{resolvedRestaurant.contactUsLabel || (lang === "ar" ? "اتصل بنا:" : "Contact Us:")}</strong> {resolvedRestaurant.contactUsValue}
                              </Typography>
                            </Stack>

                            {/* Buttons */}
                            <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                              {resolvedRestaurant.showSecondaryButton && (
                                <Link href={resolvedRestaurant.secondaryButtonPath} target="_blank" style={{ textDecoration: "none" }}>
                                  <Button
                                    variant="contained"
                                    sx={{
                                      bgcolor: "#111111",
                                      color: "#ffffff",
                                      px: 4,
                                      py: 1.5,
                                      borderRadius: 0,
                                      textTransform: "uppercase",
                                      fontSize: 12,
                                      fontWeight: 700,
                                      letterSpacing: "0.1em",
                                      fontFamily: '"Cairo", sans-serif',
                                      width: "100%",
                                      "&:hover": {
                                        bgcolor: "#CB6116"
                                      }
                                    }}
                                  >
                                    {resolvedRestaurant.secondaryButtonText}
                                  </Button>
                                </Link>
                              )}
                              <Link href={resolvedRestaurant.buttonPath} style={{ textDecoration: "none" }}>
                                <Button
                                  variant="outlined"
                                  sx={{
                                    bgcolor: "#111111",
                                    color: "#ffffff",
                                    px: 4,
                                    py: 1.5,
                                    borderRadius: 0,
                                    textTransform: "uppercase",
                                    fontSize: 12,
                                    fontWeight: 700,
                                    letterSpacing: "0.1em",
                                    fontFamily: '"Cairo", sans-serif',
                                    width: "100%",
                                    "&:hover": {
                                      bgcolor: "#CB6116"
                                    }
                                  }}
                                >
                                  {resolvedRestaurant.buttonText}
                                </Button>
                              </Link>
                            </Stack>
                          </Grid>
                        </Grid>

                        {/* The Espresso Lab Showcase */}
                        <Grid
                          container
                          spacing={{ xs: 0, md: 0 }}
                          sx={{
                            mb: 10,
                            alignItems: "stretch",
                            border: "1px solid rgba(0,0,0,0.06)",
                            bgcolor: "#ffffff",
                            flexDirection: { xs: "column-reverse", md: "row-reverse" }
                          }}
                          component={motion.div}
                          initial={{ opacity: 0, y: 30 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true, margin: "-50px" }}
                          transition={{ duration: 0.8 }}
                        >
                          {/* Image Right */}
                          <Grid size={{ xs: 12, md: 6 }}>
                            <Link href={resolvedCafe.buttonPath} style={{ textDecoration: "none", display: "block", height: "100%" }}>
                              <Box
                                sx={{
                                  height: { xs: "300px", sm: "400px", md: "100%" },
                                  minHeight: { md: "520px" },
                                  position: "relative",
                                  overflow: "hidden",
                                  cursor: "pointer",
                                  "&:hover .dining-bg": {
                                    transform: "scale(1.04)"
                                  }
                                }}
                              >
                                <Box
                                  className="dining-bg"
                                  sx={{
                                    position: "absolute",
                                    inset: 0,
                                    backgroundImage: `url("${resolvedCafe.image}")`,
                                    backgroundSize: "cover",
                                    backgroundPosition: "center center",
                                    transition: "transform 1s cubic-bezier(0.25, 1, 0.5, 1)"
                                  }}
                                />
                                <Box
                                  sx={{
                                    position: "absolute",
                                    inset: 0,
                                    bgcolor: "rgba(0,0,0,0.15)"
                                  }}
                                />
                              </Box>
                            </Link>
                          </Grid>

                          {/* Content Left */}
                          <Grid
                            size={{ xs: 12, md: 6 }}
                            sx={{
                              p: { xs: 4, sm: 6, md: 8 },
                              display: "flex",
                              flexDirection: "column",
                              justifyContent: "center",
                              textAlign: lang === "ar" ? "right" : "left"
                            }}
                          >
                            <Link href={resolvedCafe.buttonPath}>
                              <Box
                                component="img"
                                src={resolvedCafe.logo}
                                alt="The Espresso Lab Logo"
                                sx={{
                                  maxHeight: { xs: 65, md: 80 },
                                  maxWidth: "280px",
                                  objectFit: "contain",
                                  alignSelf: "flex-start",
                                  mb: 4,
                                  cursor: "pointer"
                                }}
                              />
                            </Link>

                            <Link href={resolvedCafe.buttonPath} style={{ textDecoration: "none", color: "inherit" }}>
                              <Typography
                                variant="h5"
                                sx={{
                                  fontFamily: "var(--heading-font)",
                                  fontWeight: 500,
                                  mb: 2,
                                  color: "#111111",
                                  "&:hover": { color: "#CB6116" }
                                }}
                              >
                                {resolvedCafe.title}
                              </Typography>
                            </Link>

                            <Typography
                              sx={{
                                fontSize: 14.5,
                                lineHeight: 1.8,
                                color: "rgba(0,0,0,0.6)",
                                fontFamily: '"Cairo", sans-serif',
                                mb: 4
                              }}
                            >
                              {resolvedCafe.description}
                            </Typography>

                            <Divider sx={{ borderColor: "rgba(0,0,0,0.06)", mb: 3 }} />

                            {/* Metadata */}
                            <Stack spacing={1.5} sx={{ mb: 4 }}>
                              <Typography sx={{ fontSize: 13, fontFamily: '"Cairo", sans-serif', color: "rgba(0,0,0,0.7)" }}>
                                <strong>{resolvedCafe.operatingHoursLabel || (lang === "ar" ? "أوقات العمل:" : "Operating Hours:")}</strong> {resolvedCafe.operatingHoursValue}
                              </Typography>
                              <Typography sx={{ fontSize: 13, fontFamily: '"Cairo", sans-serif', color: "rgba(0,0,0,0.7)" }}>
                                <strong>{resolvedCafe.contactUsLabel || (lang === "ar" ? "اتصل بنا:" : "Contact Us:")}</strong> {resolvedCafe.contactUsValue}
                              </Typography>
                            </Stack>

                            {/* Buttons */}
                            <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                              {resolvedCafe.showSecondaryButton && (
                                <Link href={resolvedCafe.secondaryButtonPath} target="_blank" style={{ textDecoration: "none" }}>
                                  <Button
                                    variant="outlined"
                                    sx={{
                                      bgcolor: "#111111",
                                      color: "#ffffff",
                                      px: 4,
                                      py: 1.5,
                                      borderRadius: 0,
                                      textTransform: "uppercase",
                                      fontSize: 12,
                                      fontWeight: 700,
                                      letterSpacing: "0.1em",
                                      fontFamily: '"Cairo", sans-serif',
                                      width: "100%",
                                      "&:hover": {
                                        bgcolor: "#CB6116"
                                      }
                                    }}
                                  >
                                    {resolvedCafe.secondaryButtonText}
                                  </Button>
                                </Link>
                              )}
                              <Link href={resolvedCafe.buttonPath} style={{ textDecoration: "none" }}>
                                <Button
                                  variant="contained"
                                  sx={{
                                    bgcolor: "#111111",
                                    color: "#ffffff",
                                    px: 4,
                                    py: 1.5,
                                    borderRadius: 0,
                                    textTransform: "uppercase",
                                    fontSize: 12,
                                    fontWeight: 700,
                                    letterSpacing: "0.1em",
                                    fontFamily: '"Cairo", sans-serif',
                                    width: "100%",
                                    "&:hover": {
                                      bgcolor: "#CB6116"
                                    }
                                  }}
                                >
                                  {resolvedCafe.buttonText}
                                </Button>
                              </Link>
                            </Stack>
                          </Grid>
                        </Grid>
                      </Box>
                    ) : (
                      <Box
                        sx={{
                          py: 10,
                          px: 3,
                          textAlign: "center",
                          border: "1px solid rgb(255 255 255) !important",

                          bgcolor: "rgba(0,0,0,0.01)",
                          borderRadius: 0
                        }}
                      >
                        <Typography
                          sx={{
                            color: "rgba(0,0,0,0.42)",
                            fontSize: 14,
                            fontWeight: 500,
                            letterSpacing: "0.05em",
                            fontFamily: '"Cairo", sans-serif'
                          }}
                        >
                          {lang === "ar" ? "لا توجد منتجات متوفرة حالياً في هذا القسم" : "No products available in this category for now"}
                        </Typography>
                      </Box>
                    )}
                  </MotionBox>
                </AnimatePresence>
              </Grid>
            </Grid>
          </Container>
        </Box>

      </Box>
    </ThemeProvider>
  );
}
