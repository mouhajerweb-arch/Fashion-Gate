"use client";

import CloseIcon from "@mui/icons-material/Close";
import MenuIcon from "@mui/icons-material/Menu";
import NorthEastIcon from "@mui/icons-material/NorthEast";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import { Box, Button, Container, Drawer, IconButton, Stack, Typography, Divider, Link as MuiLink } from "@mui/material";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { useParams, usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { useLoader } from "@/components/LoaderProvider";
import type { Product } from "@/lib/productData";
import { getBrandById, getAllBrands } from "@/lib/brandData";
import { getAnnouncements, getLocalizedValue } from "@/lib/sanity";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import Tooltip from "./Tooltip";
import { logoutUser } from "@/app/actions/auth";

const brandArabicTranslations: { [key: string]: string } = {
  "anastasia beverly hills": "أناستازيا بيفرلي هيلز",
  "elizabeth arden": "إليزابيث أردن",
  "clarins paris": "كلارنس باريس",
  "clarins": "كلارنس",
  "mcm": "إم سي إم",
  "michael kors": "مايكل كورس",
  "lacoste": "لاكوست",
  "trussardi": "تروساردي",
  "emporio armani ea7": "إمبوريو أرماني EA7",
  "ea7": "EA7",
  "versace": "فيرساتشي",
  "ralph lauren": "رالف لورين",
  "ferragamo": "فيراغامو",
  "salvatore ferragamo": "سلفاتوري فيراغامو",
  "guess": "غيس",
  "diesel": "ديزل",
  "kenneth cole": "كينيث كول",
  "george rech": "جورج ريش",
  "beverly hills polo club": "بيفرلي هيلز بولو كلوب",
  "lakmé": "لاكمي",
  "lakme": "لاكمي",
  "shiseido": "شيسيدو",
  "dr. belmeur": "د. بيلمر",
  "suntique": "سنتيك",
  "mugler": "موغلر",
  "azzaro": "أزارو",
  "oscar": "أوسكار",
  "narciso rodriguez": "نارسيسو رودريغز",
  "gemology": "جيمولوجي",
  "mavala": "مافالا",
  "alfaparf milano": "ألفابارف ميلانو",
  "the face shop": "ذا فيس شوب",
  "beyond": "بيوند",
  "allione": "أليون",
  "your vegan": "يور فيغان",
  "armand basi": "أرمان باسي",
  "vince camuto": "فينس كاموتو",
  "jeanne arthes": "جان أرثيس",
  "dermedic": "ديرميديك",
  "belif": "بيليف",
  "fmgt": "إف إم جي تي",
  "davidoff": "ديفيدوف",
  "pascal morabito": "باسكال مورابيتو",
  "signature": "سيجنيتشر"
};

const resolveBrandTitleAr = (title: string, titleAr?: string) => {
  if (titleAr && titleAr !== title) return titleAr;
  const cleanTitle = (title || "").trim().toLowerCase();
  if (brandArabicTranslations[cleanTitle]) {
    return brandArabicTranslations[cleanTitle];
  }
  return titleAr || title;
};

export function resolvePath(href: string, lang: "ar" | "en") {
  if (!href || href === "/" || href.trim() === "") return `/${lang}`;
  if (href.startsWith("#")) return `/${lang}${href}`;
  if (href.startsWith("http://") || href.startsWith("https://")) return href;

  const queryIndex = href.indexOf("?");
  const hashIndex = href.indexOf("#");
  let splitIndex = -1;
  if (queryIndex !== -1 && hashIndex !== -1) {
    splitIndex = Math.min(queryIndex, hashIndex);
  } else {
    splitIndex = queryIndex !== -1 ? queryIndex : hashIndex;
  }

  let pathname = splitIndex !== -1 ? href.substring(0, splitIndex) : href;
  const suffix = splitIndex !== -1 ? href.substring(splitIndex) : "";

  let cleanHref = pathname.replace(/^\/+|\/+$/g, "");
  if (cleanHref === "") return `/${lang}${suffix}`;

  if (cleanHref === "designers" || cleanHref === "category/designers" || cleanHref.includes("designers")) {
    return `/designers/${lang}${suffix}`;
  }

  // Handle dining subroutes like dining/sera, dining/the-espresso-lab
  if (cleanHref.startsWith("dining/")) {
    const diningParts = cleanHref.split("/");
    const lastPart = diningParts[diningParts.length - 1];
    if (lastPart === "ar" || lastPart === "en") {
      diningParts[diningParts.length - 1] = lang;
      return `/${diningParts.join("/")}${suffix}`;
    }
    return `/${cleanHref}/${lang}${suffix}`;
  }

  const categories = ["women", "men", "perfumes", "skincare", "beauty", "makeup", "fashion", "designers", "dining"];
  const parts = cleanHref.split("/");
  const firstPart = parts[0];
  
  if (categories.includes(firstPart)) {
    cleanHref = `category/${cleanHref}`;
  }

  const partsList = cleanHref.split("/");
  const lastPart = partsList[partsList.length - 1];
  if (lastPart === "ar" || lastPart === "en") {
    partsList[partsList.length - 1] = lang;
    return `/${partsList.join("/")}${suffix}`;
  }
  return `/${cleanHref}/${lang}${suffix}`;
}

// Helper function to dynamically stretch Arabic cursive connections using Tatweel (\u0640)
function stretchArabicText(text: string, count: number = 2): string {
  if (!text) return "";
  const nonConnecting = new Set([
    'ا', 'أ', 'إ', 'آ', 'د', 'ذ', 'ر', 'ز', 'و', 'ة', 'ء'
  ]);
  let result = "";
  const tatweel = "\u0640";
  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    result += char;
    if (i < text.length - 1) {
      const nextChar = text[i + 1];
      const isCurrArabic = char.charCodeAt(0) >= 0x0600 && char.charCodeAt(0) <= 0x06FF;
      const isNextArabic = nextChar.charCodeAt(0) >= 0x0600 && nextChar.charCodeAt(0) <= 0x06FF;
      if (isCurrArabic && isNextArabic && !nonConnecting.has(char)) {
        result += tatweel.repeat(count);
      }
    }
  }
  return result;
}

const MotionBox = motion.create(Box);

// Custom graphical flag SVGs (renders pixel-perfect flags on Windows / Segoe UI)


interface SiteSettings {
  title?: string;
  primaryColor?: string;
  accentColor?: string;
}

interface SiteHeaderProps {
  settings?: SiteSettings;
  initialHeaderSettings?: any;
  onLangToggleStart?: () => void;
}

const headerTranslations = {
  en: {
    "Home": "Home",
    "Women": "Women",
    "Men": "Men",
    "Designers": "Designers",
    "Fashion": "Fashion",
    "Perfumes": "Perfumes",
    "Skincare": "Skincare",
    "Dining": "Dining",
    "Blogs": "Blogs",
    "About Us": "About Us",
    "Contact Us": "Contact Us",
    "Sign In / Register": "Sign In / Register",
    "Wishlist": "Wishlist",
    "Cart": "Cart",
    "Search...": "Search...",
    "Search Boulevard...": "Search Boulevard..."
  },
  ar: {
    "Home": "الرئيسية",
    "Women": "النساء",
    "Men": "الرجال",
    "Designers": "المصممون",
    "Fashion": "الأزياء",
    "Perfumes": "العطور",
    "Skincare": "العناية بالبشرة",
    "Dining": "المائدة والضيافة",
    "Blogs": "المدونة",
    "About Us": "من نحن",
    "Contact Us": "اتصل بنا",
    "Sign In / Register": "تسجيل الدخول / التسجيل",
    "Wishlist": "المفضلة",
    "Cart": "السلة",
    "Search...": "ابحث...",
    "Search Boulevard...": "ابحث في البوليفارد..."
  }
};

const brandSuggestions = [
  { id: "elie-saab", label: "Elie Saab" },
  { id: "gucci", label: "Gucci" },
  { id: "maxmara", label: "Max Mara" },
  { id: "prada", label: "Prada" },
  { id: "valentino", label: "Valentino" },
  { id: "ysl", label: "Saint Laurent" },
  { id: "calvin-klein", label: "Calvin Klein" },
  { id: "hugo-boss", label: "Hugo Boss" },
  { id: "giorgio-armani", label: "Giorgio Armani" },
  { id: "paul-shark", label: "Paul & Shark" },
  { id: "sandro", label: "Sandro" },
  { id: "editorial", label: "Editorial" },
  { id: "moje", label: "Moje" },
  { id: "adidas", label: "adidas" },
  { id: "skechers", label: "Skechers" },
  { id: "cartier", label: "Cartier" },
  { id: "lancome", label: "Lancôme" },
  { id: "jimmy-choo", label: "Jimmy Choo" },
  { id: "coach", label: "Coach" },
  { id: "loreal", label: "L'Oreal" },
  { id: "chloe", label: "Chloé" },
  { id: "atelier-rebul", label: "Atelier Rebul" },
  { id: "nean-com", label: "Nean.com" },
  { id: "acler", label: "Acler" },
  { id: "weekend-maxmara", label: "Weekend Max Mara" },
  { id: "persona-marina-rinaldi", label: "Persona by Marina Rinaldi" },
  { id: "max-and-co", label: "Max&Co" },
  { id: "puma", label: "Puma" },
  { id: "emporio-armani-ea7", label: "Emporio Armani EA7" },
  { id: "almais", label: "Almais" }
];

const brandLabels: Record<string, { en: string; ar: string }> = {
  "elie-saab": { en: "Elie Saab", ar: "إيلي صعب" },
  "gucci": { en: "Gucci", ar: "غوتشي" },
  "maxmara": { en: "Max Mara", ar: "ماكس مارا" },
  "prada": { en: "Prada", ar: "برادا" },
  "valentino": { en: "Valentino", ar: "فالنتينو" },
  "ysl": { en: "Saint Laurent", ar: "سان لوران" },
  "calvin-klein": { en: "Calvin Klein", ar: "كالفين كلاين" },
  "hugo-boss": { en: "Hugo Boss", ar: "هوغو بوس" },
  "giorgio-armani": { en: "Giorgio Armani", ar: "جورجيو أرماني" },
  "paul-shark": { en: "Paul & Shark", ar: "بول آند شارك" },
  "sandro": { en: "Sandro", ar: "ساندرو" },
  "editorial": { en: "Editorial", ar: "إيديتوريال" },
  "moje": { en: "Moje", ar: "موهي" },
  "adidas": { en: "Adidas", ar: "أديداس" },
  "skechers": { en: "Skechers", ar: "سكيتشرز" },
  "cartier": { en: "Cartier", ar: "كارتييه" },
  "lancome": { en: "Lancôme", ar: "لانكوم" },
  "jimmy-choo": { en: "Jimmy Choo", ar: "جيمي تشو" },
  "coach": { en: "Coach", ar: "كوتش" }
};

const defaultHeaderMenuItems = [
  {
    _key: "item-home",
    label: { en: "Home", ar: "الرئيسية" },
    href: "/",
    dropdownItems: []
  },
  {
    _key: "item-designers",
    label: { en: "Designers", ar: "المصممون" },
    href: "/brand/elie-saab",
    designerCategories: [
      {
        title: { en: "Luxury Fashion & Haute Couture", ar: "الأزياء الفاخرة والراقية" },
        brands: [
          { slug: { current: "elie-saab" }, title: "Elie Saab" },
          { slug: { current: "gucci" }, title: "Gucci" },
          { slug: { current: "maxmara" }, title: "Max Mara" },
          { slug: { current: "prada" }, title: "Prada" },
          { slug: { current: "valentino" }, title: "Valentino" },
          { slug: { current: "ysl" }, title: "YSL" }
        ]
      },
      {
        title: { en: "Contemporary & Premium Apparel", ar: "الملابس المعاصرة والمميزة" },
        brands: [
          { slug: { current: "calvin-klein" }, title: "Calvin Klein" },
          { slug: { current: "hugo-boss" }, title: "Hugo Boss" },
          { slug: { current: "giorgio-armani" }, title: "Giorgio Armani" },
          { slug: { current: "paul-shark" }, title: "Paul & Shark" },
          { slug: { current: "sandro" }, title: "Sandro" },
          { slug: { current: "editorial" }, title: "Editorial" }
        ]
      },
      {
        title: { en: "Independent & Creative Design", ar: "التصميم المستقل والإبداعي" },
        brands: [{ slug: { current: "moje" }, title: "Moje" }]
      },
      {
        title: { en: "Footwear & Athletic Lifestyle", ar: "الأحذية والأنشطة الرياضية" },
        brands: [
          { slug: { current: "adidas" }, title: "Adidas" },
          { slug: { current: "skechers" }, title: "Skechers" }
        ]
      },
      {
        title: { en: "Fine Jewelry & Luxury Timepieces", ar: "المجوهرات الراقية والساعات الفاخرة" },
        brands: [{ slug: { current: "cartier" }, title: "Cartier" }]
      },
      {
        title: { en: "Premium Beauty & Skincare", ar: "العناية بالبشرة والجمال الفاخر" },
        brands: [{ slug: { current: "lancome" }, title: "Lancôme" }]
      },
      {
        title: { en: "Luxury Accessories & Leather Goods", ar: "الإكسسوارات الفاخرة والمنتجات الجلدية" },
        brands: [
          { slug: { current: "jimmy-choo" }, title: "Jimmy Choo" },
          { slug: { current: "coach" }, title: "Coach" }
        ]
      }
    ],
    dropdownItems: []
  },
  {
    _key: "item-fashion",
    label: { en: "Fashion", ar: "الأزياء" },
    href: "/category/fashion",
    dropdownItems: [
      {
        _key: "fashion-women",
        label: { en: "Women", ar: "النساء" },
        href: "/category/fashion?sub=women"
      },
      {
        _key: "fashion-men",
        label: { en: "Men", ar: "الرجال" },
        href: "/category/fashion?sub=men"
      }
    ]
  },
  {
    _key: "item-perfumes",
    label: { en: "Perfumes", ar: "العطور" },
    href: "/category/perfumes",
    dropdownItems: [
      {
        _key: "perfumes-women",
        label: { en: "Women", ar: "النساء" },
        href: "/category/perfumes?sub=women"
      },
      {
        _key: "perfumes-men",
        label: { en: "Men", ar: "الرجال" },
        href: "/category/perfumes?sub=men"
      },
      {
        _key: "perfumes-unisex",
        label: { en: "Unisex", ar: "للجنسين" },
        href: "/category/perfumes?sub=unisex"
      }
    ]
  },
  {
    _key: "item-beauty",
    label: { en: "Beauty", ar: "الجمال" },
    href: "/category/beauty",
    dropdownItems: [
      {
        _key: "beauty-skincare",
        label: { en: "Skincare", ar: "العناية بالبشرة" },
        href: "/category/skincare",
        subItems: [
          { _key: "beauty-skincare-women", label: { en: "Women", ar: "النساء" }, href: "/category/skincare?sub=women" },
          { _key: "beauty-skincare-men", label: { en: "Men", ar: "الرجال" }, href: "/category/skincare?sub=men" }
        ]
      },
      {
        _key: "beauty-makeup",
        label: { en: "Make up", ar: "المكياج" },
        href: "/category/makeup",
        subItems: [
          { _key: "beauty-makeup-women", label: { en: "Women", ar: "النساء" }, href: "/category/makeup?sub=women" },
          { _key: "beauty-makeup-men", label: { en: "Men", ar: "الرجال" }, href: "/category/makeup?sub=men" }
        ]
      }
    ]
  },
  {
    _key: "item-dining",
    label: { en: "Dining", ar: "المطاعم" },
    href: "/dining",
    dropdownItems: [
      {
        _key: "dining-sera",
        label: { en: "Restaurant (SERA)", ar: "مطعم سيرا" },
        href: "/dining/sera"
      },
      {
        _key: "dining-espresso-lab",
        label: { en: "Café (The Espresso Lab)", ar: "ذا اسبريسو لاب" },
        href: "/dining/the-espresso-lab"
      }
    ]
  },
  {
    _key: "item-about",
    label: { en: "About Us", ar: "من نحن" },
    href: "/about",
    dropdownItems: []
  },
  {
    _key: "item-contact",
    label: { en: "Contact Us", ar: "اتصل بنا" },
    href: "/contact",
    dropdownItems: []
  }
];

function AnnouncementBar({ lang }: { lang: "ar" | "en" }) {
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const marqueeRef = useRef<HTMLDivElement | null>(null);
  const [marqueeSpeed, setMarqueeSpeed] = useState(400);

  const marqueeItems = useMemo(() => {
    const items: typeof announcements = [];
    for (let i = 0; i < 20; i++) {
      items.push(...announcements);
    }
    return items;
  }, [announcements]);

  useEffect(() => {
    getAnnouncements().then((data) => {
      if (data && data.length > 0) {
        setAnnouncements(
          data.map((item: any) => ({
            text: getLocalizedValue(item.text, lang),
            link: item.link || ""
          }))
        );
      } else {
        setAnnouncements([
          {
            text: lang === "ar"
              ? "شحن مجاني وإرجاع سهل لكافة أنحاء العالم على مجموعات مختارة"
              : "Free Worldwide Shipping & Returns on Selected Designer Collections",
            link: ""
          },
          {
            text: lang === "ar"
              ? "أول متجر أقسام فاخر في سوريا — على البوليفارد. للعالم."
              : "Syria's First Luxury Department Store — On Boulevard. For the world.",
            link: ""
          },
          {
            text: lang === "ar"
              ? "تسوق شخصي وحجز أتيلييه مجاني في صالون دمشق الخاص"
              : "Complimentary Personal Shopping & Private Atelier Bookings",
            link: ""
          }
        ]);
      }
    });
  }, [lang]);

  useEffect(() => {
    const container = marqueeRef.current;
    if (!container) return;

    const updateSpeed = () => {
      const totalWidth = container.scrollWidth;
      const duplicates = 20;
      const singleSetWidth = totalWidth / duplicates;
      const minSpeed = 80;
      const maxSpeed = 700;
      const normalizedSpeed = Math.max(
        minSpeed,
        Math.min(
          maxSpeed,
          Math.round(100 + announcements.length * 40 + singleSetWidth / 500)
        )
      );
      setMarqueeSpeed(normalizedSpeed);
    };

    updateSpeed();
    window.addEventListener("resize", updateSpeed);
    return () => window.removeEventListener("resize", updateSpeed);
  }, [announcements]);

  if (announcements.length === 0) return null;

  const isAr = lang === "ar";

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes marquee-header-scroll-left {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-50%, 0, 0); }
        }
        @keyframes marquee-header-scroll-right {
          0% { transform: translate3d(-50%, 0, 0); }
          100% { transform: translate3d(0, 0, 0); }
        }
        .marquee-header-container {
          display: flex;
          align-items: center;
          white-space: nowrap;
          width: max-content;
        }
        .marquee-header-container:hover {
          animation-play-state: paused;
        }
      `}} />
      <Box 
        component="div"
        dir="ltr"
        sx={{ 
          bgcolor: "#050505", 
          color: "#CB6116", 
          pb: 1.3, 
          pt: 1.9,
          borderBottom: "1px solid rgba(255,255,255,0.06)",
          position: "relative",
          minHeight: 38,
          overflow: "hidden",
          display: "flex",
          alignItems: "center"
        }}
      >
        <Box className="marquee-header-container" dir="ltr" ref={marqueeRef} sx={{ animation: `marquee-header-scroll-left ${marqueeSpeed}s linear infinite` }}>
          {marqueeItems.map((item, idx) => (
            <Box 
              key={idx} 
              sx={{ 
                display: "inline-flex", 
                alignItems: "center",
                mx: 3
              }}
            >
              {item.link ? (
                <Typography
                  component={Link}
                  href={item.link}
                  sx={{
                    fontFamily: '"Cairo", sans-serif',
                    fontSize: "13px",
                    fontWeight: 600,
                    letterSpacing: "0.06em",
                    textDecoration: "none",
                    color: "#ffffff",
                    "&:hover": { textDecoration: "underline" }
                  }}
                >
                  {item.text}
                </Typography>
              ) : (
                <Typography
                  sx={{
                    fontFamily: '"Cairo", sans-serif',
                    fontSize: "15px",
                    fontWeight: 600,
                    letterSpacing: "0.06em",
                    color: "#ffffff"
                  }}
                >
                  {item.text}
                </Typography>
              )}
              {/* Luxury Diamond Spacer */}
              <Box component="span" sx={{ color: "rgba(255, 255, 255, 0.28)", ml: 6, fontSize: 10 }}>
                ✦
              </Box>
            </Box>
          ))}
        </Box>
      </Box>
    </>
  );
}

interface SearchOptionProps {
  lang: "ar" | "en";
  isMobile?: boolean;
  searchActive: boolean;
  setSearchActive: (active: boolean) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  products: Product[];
  placeholderText?: string;
  departmentsHeading?: string;
  suggestedBrandsHeading?: string;
  matchingHeading?: string;
  departmentsList?: any[] | null;
  suggestedBrandsList?: any[] | null;
  allBrands?: any[] | null;
}

function SearchOption({
  lang,
  isMobile = false,
  searchActive,
  setSearchActive,
  searchQuery,
  setSearchQuery,
  products,
  placeholderText,
  departmentsHeading,
  suggestedBrandsHeading,
  matchingHeading,
  departmentsList,
  suggestedBrandsList,
  allBrands
}: SearchOptionProps) {
  const router = useRouter();

  const matchingBrands = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const query = searchQuery.toLowerCase();
    const sourceBrands = allBrands && allBrands.length > 0
      ? allBrands
      : getAllBrands().map(b => ({
          _id: b.id,
          title: b.name,
          titleAr: b.nameAr,
          slug: { current: b.id },
          image: null
        }));

    return sourceBrands.filter(b => {
      const nameEn = (b.title || "").toLowerCase();
      const nameAr = (b.titleAr || "");
      const slugStr = (b.slug?.current || "").toLowerCase();
      return nameEn.includes(query) || nameAr.includes(searchQuery) || slugStr.includes(query);
    }).slice(0, 3);
  }, [searchQuery, allBrands]);

  const matchingProducts = useMemo(() => {
    if (!searchQuery.trim()) return [];
    return products.filter(p => {
      const query = searchQuery.toLowerCase();
      const titleMatch = p.title.toLowerCase().includes(query) || p.titleAr?.includes(searchQuery);
      const brandMatch = p.brandId.toLowerCase().includes(query);
      const catMatch = p.category.toLowerCase().includes(query) || p.categoryAr?.includes(searchQuery);
      return titleMatch || brandMatch || catMatch;
    }).slice(0, 5);
  }, [searchQuery, products]);

  const handleLinkClick = () => {
    setSearchActive(false);
    setSearchQuery("");
  };

  const resolvedPlaceholder = placeholderText || (lang === "ar" ? "ابحث في البوليفارد..." : "Search...");
  const resolvedDepsHeading = departmentsHeading || (lang === "ar" ? "الأقسام المقتارة" : "Departments");
  const resolvedSuggestedHeading = suggestedBrandsHeading || (lang === "ar" ? "دور الفخامة" : "Suggested Brands");
  const resolvedMatchingHeading = matchingHeading || (lang === "ar" ? "النتائج المطابقة" : "Matching Pieces");

  const resolvedDeps = useMemo(() => {
    if (departmentsList && departmentsList.length > 0) {
      return departmentsList.map(item => {
        const lbl = lang === "ar" ? item.label?.ar || item.label?.en : item.label?.en || item.label?.ar;
        let hr = item.href || "/";
        if (hr !== "/" && !hr.startsWith("#")) {
          const parts = hr.split("/").filter(Boolean);
          if (parts[parts.length - 1] !== "ar" && parts[parts.length - 1] !== "en") {
            hr = `/${parts.join("/")}/${lang}`;
          }
        } else if (hr === "/") {
          hr = `/${lang}`;
        }
        return { label: lbl || "", href: hr };
      });
    }
    return [
      { label: lang === "ar" ? "العطور" : "Perfumes", href: `/category/perfumes/${lang}` },
      { label: lang === "ar" ? "العناية بالبشرة" : "Skincare", href: `/category/skincare/${lang}` }
    ];
  }, [departmentsList, lang]);

  const resolvedBrands = useMemo(() => {
    if (suggestedBrandsList && suggestedBrandsList.length > 0) {
      return suggestedBrandsList.map(item => {
        const brandId = item.slug?.current || item._id || "";
        let label = item.title;
        if (lang === "ar") {
          if (item.titleAr) {
            label = item.titleAr;
          } else {
            const local = getBrandById(brandId);
            if (local?.nameAr) {
              label = local.nameAr;
            }
          }
        }
        return {
          id: brandId,
          label: label
        };
      });
    }
    return brandSuggestions.map(item => {
      if (lang === "ar") {
        const local = getBrandById(item.id);
        if (local?.nameAr) {
          return { id: item.id, label: local.nameAr };
        }
      }
      return item;
    });
  }, [suggestedBrandsList, lang]);

  return (
    <Box sx={{ position: { xs: "static", sm: "relative" } }}>
      {searchActive && (
        <Box 
          onClick={handleLinkClick}
          sx={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 999,
            bgcolor: "rgba(0,0,0,0.45)",
            backdropFilter: "blur(2px)"
          }}
        />
      )}

      <Stack direction="row" alignItems="center" sx={{ position: "relative", zIndex: 1000, overflow: "hidden",gap: { xs: 0.5, sm: 0.5 } }}>
        <Box
          component="input"
          type="text"
          placeholder={resolvedPlaceholder}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onFocus={() => setSearchActive(true)}
          sx={{
            bgcolor: "rgba(255,255,255,0.06)",
            border: searchActive 
              ? "1px solid rgba(255,255,255,0.15)"
              : { xs: "none", sm: "1px solid rgba(255,255,255,0.15)" },
            color: "#ffffff",
            outline: "none",
            py: 0.8,
            fontSize: 12,
            fontFamily: '"Cairo", sans-serif',
            width: searchActive
              ? { xs: "90px", sm: "140px", md: "240px" } 
              : { xs: "0px", sm: "120px", md: "160px" },
            px: searchActive
              ? 1.5
              : { xs: 0, sm: 1.5 },
            transition: "width 0.4s ease, padding 0.4s ease, border-color 0.4s ease",
            borderRadius: 0,
            "&::placeholder": { color: "rgba(255,255,255,0.4)" }
          }}
        />
        <IconButton 
          onClick={() => {
            if (searchActive) {
              setSearchActive(false);
              setSearchQuery("");
            } else {
              setSearchActive(true);
            }
          }}
          sx={{ 
            color: "#CB6116", 
            p: { xs: 1.14, sm: 1.14 },
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: 0,
            ml: { xs: 0, sm: 0 },
            bgcolor: searchActive ? "rgba(255,255,255,0.1)" : "transparent"
          }}
        >
          {searchActive ? (
            <CloseIcon sx={{ fontSize: 18 }} />
          ) : (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          )}
        </IconButton>
      </Stack>

      <AnimatePresence>
        {searchActive && (
          <MotionBox
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            sx={{
              position: "absolute",
              top: "100%",
              right: { xs: 12, sm: lang === "ar" ? "auto" : 0 },
              left: { xs: 12, sm: lang === "ar" ? 0 : "auto" },
              width: { xs: "auto", sm: "360px", md: "420px" },
              maxHeight: "60vh",
              overflowY: "auto",
              bgcolor: "#FAF8F5", // Light background for search popover
              border: "1px solid rgba(0,0,0,0.08)",
              boxShadow: "0 20px 45px rgba(0,0,0,0.15)",
              p: 2,
              zIndex: 1000,
              color: "#111111", // Dark color text
              borderRadius: 0,
              textAlign: lang === "ar" ? "right" : "left"
            }}
          >
            {!searchQuery.trim() ? (
              <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}>
                <Box>
                  <Typography sx={{ fontSize: 10, fontWeight: 800, color: "#CB6116", textTransform: "uppercase", letterSpacing: lang === "ar" ? 0 : "0.15em", mb: 1.5, fontFamily: '"Cairo", sans-serif' }}>
                    {resolvedDepsHeading}
                  </Typography>
                  <Stack spacing={1} alignItems="flex-start">
                    {resolvedDeps.map((item, idx) => (
                      <Button
                        key={idx}
                        component={Link}
                        href={item.href}
                        onClick={handleLinkClick}
                        sx={{ color: "#111111", fontSize: 12, p: 0, minWidth: 0, fontFamily: '"Cairo", sans-serif', textTransform: "none", "&:hover": { color: "#CB6116" } }}
                      >
                        {item.label}
                      </Button>
                    ))}
                  </Stack>
                </Box>
                <Box>
                  <Typography sx={{ fontSize: 10, fontWeight: 800, color: "#CB6116", textTransform: "uppercase", letterSpacing: lang === "ar" ? 0 : "0.15em", mb: 1.5, fontFamily: '"Cairo", sans-serif' }}>
                    {resolvedSuggestedHeading}
                  </Typography>
                  <Stack spacing={1} alignItems="flex-start">
                    {resolvedBrands.map((item) => (
                      <Button
                        key={item.id}
                        component={Link}
                        href={`/brand/${item.id}/${lang}`}
                        onClick={handleLinkClick}
                        sx={{ color: "#111111", fontSize: 12, p: 0, minWidth: 0, fontFamily: '"Cairo", sans-serif', textTransform: "none", "&:hover": { color: "#CB6116" } }}
                      >
                        {item.label}
                      </Button>
                    ))}
                  </Stack>
                </Box>
              </Box>
            ) : (
              <Box>
                {/* 1. Matching Brands Section */}
                {matchingBrands.length > 0 && (
                  <Box sx={{ mb: 2.5 }}>
                    <Typography sx={{ fontSize: 10, fontWeight: 800, color: "#CB6116", textTransform: "uppercase", letterSpacing: lang === "ar" ? 0 : "0.15em", mb: 1.5, fontFamily: '"Cairo", sans-serif' }}>
                      {lang === "ar" ? "العلامات التجارية المطابقة" : "Matching Brands"}
                    </Typography>
                    <Stack spacing={1}>
                      {matchingBrands.map((b) => {
                        const brandId = b.slug?.current || b._id;
                        const brandName = lang === "ar" ? b.titleAr || b.title : b.title || b.titleAr;
                        const logoUrl = b.image?.asset?.url || "/brand/logo.png";
                        return (
                          <Link
                            key={brandId}
                            href={`/brand/${brandId}/${lang}`}
                            onClick={handleLinkClick}
                            style={{ textDecoration: "none", display: "block" }}
                          >
                            <Stack
                              direction="row"
                              spacing={2}
                              alignItems="center"
                              sx={{
                                p: 0.8,
                                "&:hover": { bgcolor: "rgba(203, 97, 22, 0.08)" },
                                transition: "background 0.2s"
                              }}
                            >
                              <Box
                                component="img"
                                src={logoUrl}
                                alt={brandName}
                                sx={{
                                  width: 40,
                                  height: 40,
                                  objectFit: "contain",
                                  p: 0.5,
                                  bgcolor: "#ffffff",
                                  border: "1px solid rgba(0,0,0,0.06)"
                                }}
                              />
                              <Box sx={{ textAlign: lang === "ar" ? "right" : "left" }}>
                                <Typography sx={{ fontSize: 12, fontWeight: 700, color: "#111111", lineHeight: 1.2 }}>
                                  {brandName}
                                </Typography>
                                <Typography sx={{ fontSize: 9, color: "#CB6116", textTransform: "uppercase", fontWeight: 700, letterSpacing: lang === "ar" ? 0 : "0.1em", mt: 0.3 }}>
                                  {lang === "ar" ? "علامة تجارية" : "Brand"}
                                </Typography>
                              </Box>
                            </Stack>
                          </Link>
                        );
                      })}
                    </Stack>
                  </Box>
                )}

                {/* 2. Matching Pieces Section */}
                <Typography sx={{ fontSize: 10, fontWeight: 800, color: "#CB6116", textTransform: "uppercase", letterSpacing: lang === "ar" ? 0 : "0.15em", mb: 1.5, fontFamily: '"Cairo", sans-serif' }}>
                  {resolvedMatchingHeading}
                </Typography>
                
                {matchingBrands.length === 0 && matchingProducts.length === 0 ? (
                  <Typography sx={{ color: "rgba(0,0,0,0.48)", fontSize: 12, py: 1, fontFamily: '"Cairo", sans-serif' }}>
                    {lang === "ar" ? "لم نجد أي نتائج تطابق بحثك..." : "No matching results found..."}
                  </Typography>
                ) : matchingProducts.length === 0 ? (
                  <Typography sx={{ color: "rgba(0,0,0,0.48)", fontSize: 12, py: 1, fontFamily: '"Cairo", sans-serif' }}>
                    {lang === "ar" ? "لم نجد أي قطع تطابق بحثك..." : "No matching pieces found..."}
                  </Typography>
                ) : (
                  <Stack spacing={1.5}>
                    {matchingProducts.map((p) => {
                      const title = lang === "ar" ? p.titleAr : p.title;
                      const cat = lang === "ar" ? p.categoryAr : p.category;
                      const brandObj = getBrandById(p.brandId);
                      const brandName = brandObj ? (lang === "ar" ? brandObj.nameAr : brandObj.name) : p.brandId.toUpperCase();
                      return (
                        <Link
                          key={p.id}
                          href={`/product/${p.id}/${lang}`}
                          onClick={handleLinkClick}
                          style={{ textDecoration: "none", display: "block" }}
                        >
                          <Stack 
                            direction="row" 
                            spacing={2} 
                            alignItems="center"
                            sx={{ 
                              p: 0.8, 
                              "&:hover": { bgcolor: "rgba(203, 97, 22, 0.08)" }, // Premium orange light hover color
                              transition: "background 0.2s"
                            }}
                          >
                            <Box 
                              component="img" 
                              src={p.imageUrl || "/brand/logo.png"} 
                              alt={title}
                              sx={{ 
                                width: 40, 
                                height: 40, 
                                objectFit: "cover", 
                                bgcolor: "#e5e5e5" 
                              }}
                            />
                            <Box sx={{ textAlign: lang === "ar" ? "right" : "left" }}>
                              <Typography sx={{ fontSize: 12, fontWeight: 700, color: "#111111", lineHeight: 1.2 }}>
                                {title}
                              </Typography>
                              <Typography sx={{ fontSize: 9, color: "#CB6116", textTransform: "uppercase", fontWeight: 700, letterSpacing: lang === "ar" ? 0 : "0.1em", mt: 0.3 }}>
                                {brandName} — {cat}
                              </Typography>
                            </Box>
                          </Stack>
                        </Link>
                      );
                    })}
                  </Stack>
                )}
              </Box>
            )}
          </MotionBox>
        )}
      </AnimatePresence>
    </Box>
  );
}

export default function SiteHeader({ settings, initialHeaderSettings, onLangToggleStart }: SiteHeaderProps) {
  const params = useParams();
  const pathname = usePathname();
  const router = useRouter();

  const lang = (pathname?.endsWith("/ar") || pathname?.includes("/ar/") ? "ar" : "en") as "en" | "ar";
  const normalizedPathname = pathname || (typeof window !== "undefined" ? window.location.pathname : "");
  const activeSectionPath = normalizedPathname.replace(/\/(en|ar)(\/|$)/, "/").replace(/\/+$/g, "") || "/";
  const isDesignersPage = normalizedPathname === "/designers" || normalizedPathname.startsWith("/designers/");
  const [open, setOpen] = useState(false);
  const [searchActive, setSearchActive] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [headerProducts, setHeaderProducts] = useState<Product[]>([]);
  const { setLoading } = useLoader();

  // Dropdown states for mega-menus
  const [activeDropdown, setActiveDropdown] = useState<number | null>(null);
  const [hoveredFashionCategory, setHoveredFashionCategory] = useState<"women-fashion" | "men-fashion" | null>(null);
  const [beautyHoveredSub, setBeautyHoveredSub] = useState<string | null>(null);
  const [sanityBrands, setSanityBrands] = useState<any[]>([]);
  const [headerMenuItems, setHeaderMenuItems] = useState<any[]>(() => initialHeaderSettings?.menuItems || []);
  const [expandedMobileItem, setExpandedMobileItem] = useState<number | null>(null);

  // Sanity header settings states
  const [logoTitle, setLogoTitle] = useState<{ en?: string; ar?: string } | null>(() => initialHeaderSettings?.logoTitle || null);
  const [logoSubtitle, setLogoSubtitle] = useState<{ en?: string; ar?: string } | null>(() => initialHeaderSettings?.logoSubtitle || null);
  const [logoLayout, setLogoLayout] = useState<string>(() => initialHeaderSettings?.logoLayout || "stacked");
  const [logoImageUrl, setLogoImageUrl] = useState<string | null>(() => initialHeaderSettings?.logoImage?.asset?.url || null);
  const [showSearch, setShowSearch] = useState<boolean>(() => initialHeaderSettings?.showSearch !== undefined ? initialHeaderSettings.showSearch : true);
  const [searchPlaceholder, setSearchPlaceholder] = useState<{ en?: string; ar?: string } | null>(() => initialHeaderSettings?.searchPlaceholder || null);
  const [showLanguageSwitcher, setShowLanguageSwitcher] = useState<boolean>(() => initialHeaderSettings?.showLanguageSwitcher !== undefined ? initialHeaderSettings.showLanguageSwitcher : true);
  const [languageSwitcherStyle, setLanguageSwitcherStyle] = useState<string>(() => initialHeaderSettings?.languageSwitcherStyle || "flag_and_text");
  const [showUserProfile, setShowUserProfile] = useState<boolean>(() => initialHeaderSettings?.showUserProfile !== undefined ? initialHeaderSettings.showUserProfile : true);
  const [userName, setUserName] = useState<string | null>(null);
  const [showUserMenu, setShowUserMenu] = useState<boolean>(false);
  const [searchDepartmentsHeading, setSearchDepartmentsHeading] = useState<{ en?: string; ar?: string } | null>(() => initialHeaderSettings?.searchDepartmentsHeading || null);
  const [searchSuggestedBrandsHeading, setSearchSuggestedBrandsHeading] = useState<{ en?: string; ar?: string } | null>(() => initialHeaderSettings?.searchSuggestedBrandsHeading || null);
  const [searchMatchingHeading, setSearchMatchingHeading] = useState<{ en?: string; ar?: string } | null>(() => initialHeaderSettings?.searchMatchingHeading || null);
  const [searchDepartments, setSearchDepartments] = useState<any[] | null>(() => initialHeaderSettings?.searchDepartments || null);
  const [searchSuggestedBrands, setSearchSuggestedBrands] = useState<any[] | null>(() => initialHeaderSettings?.searchSuggestedBrands || null);

  useEffect(() => {
    const cookiesList = document.cookie.split(";");
    const sessionCookie = cookiesList.find((c) => c.trim().startsWith("fg_session_user="));
    if (sessionCookie) {
      const nameVal = decodeURIComponent(sessionCookie.split("=")[1]);
      setUserName(nameVal);
    }
  }, []);

  const handleLogout = async () => {
    await logoutUser();
    setUserName(null);
    setShowUserMenu(false);
    window.location.reload();
  };

  useEffect(() => {
    const fetchHeaderData = async () => {
      try {
        const { sanityClient } = await import("@/lib/sanity");
        
        // Fetch brands
        const brandsData = await sanityClient.fetch(`*[_type == "brand" && isActive == true] {
          _id,
          title,
          titleAr,
          slug,
          image {
            asset-> {
              url
            }
          }
        }`);
        if (brandsData) {
          setSanityBrands(brandsData);
        }

        // Fetch header settings
        const headerData = await sanityClient.fetch(`*[_type == "header"][0] {
          logoTitle { en, ar },
          logoSubtitle { en, ar },
          logoLayout,
          logoImage {
            asset-> {
              _id,
              url
            }
          },
          showSearch,
          searchPlaceholder { en, ar },
          showLanguageSwitcher,
          languageSwitcherStyle,
          showUserProfile,
          searchDepartmentsHeading { en, ar },
          searchSuggestedBrandsHeading { en, ar },
          searchMatchingHeading { en, ar },
          searchDepartments[] {
            label { en, ar },
            href
          },
          searchSuggestedBrands[]-> {
            _id,
            title,
            titleAr,
            slug
          },
          menuItems[] {
            _key,
            label { en, ar },
            href,
            dropdownItems[] {
              _key,
              label { en, ar },
              href,
              subItems[] {
                _key,
                label { en, ar },
                href
              }
            },
            designerCategories[]-> {
              _id,
              title { en, ar },
              brands[]-> {
                _id,
                title,
                titleAr,
                slug,
                isActive
              }
            }
          }
        }`);
        if (headerData) {
          if (headerData.logoTitle) setLogoTitle(headerData.logoTitle);
          if (headerData.logoSubtitle) setLogoSubtitle(headerData.logoSubtitle);
          if (headerData.logoLayout) setLogoLayout(headerData.logoLayout);
          if (headerData.logoImage?.asset?.url) setLogoImageUrl(headerData.logoImage.asset.url);
          if (headerData.showSearch !== undefined) setShowSearch(headerData.showSearch);
          if (headerData.searchPlaceholder) setSearchPlaceholder(headerData.searchPlaceholder);
          if (headerData.showLanguageSwitcher !== undefined) setShowLanguageSwitcher(headerData.showLanguageSwitcher);
          if (headerData.languageSwitcherStyle) setLanguageSwitcherStyle(headerData.languageSwitcherStyle);
          if (headerData.showUserProfile !== undefined) setShowUserProfile(headerData.showUserProfile);
          if (headerData.searchDepartmentsHeading) setSearchDepartmentsHeading(headerData.searchDepartmentsHeading);
          if (headerData.searchSuggestedBrandsHeading) setSearchSuggestedBrandsHeading(headerData.searchSuggestedBrandsHeading);
          if (headerData.searchMatchingHeading) setSearchMatchingHeading(headerData.searchMatchingHeading);
          if (headerData.searchDepartments) setSearchDepartments(headerData.searchDepartments);
          if (headerData.searchSuggestedBrands) setSearchSuggestedBrands(headerData.searchSuggestedBrands);
          if (headerData.menuItems) setHeaderMenuItems(headerData.menuItems);
        }
      } catch (e) {
        console.error("Failed to fetch header data for navigation:", e);
      }
    };
    fetchHeaderData();
  }, []);

  const isLinkActive = (pathSegment: string) => {
    if (!pathname) return false;
    if (pathSegment === "home") {
      return pathname === `/${lang}` || pathname === "/";
    }
    return pathname.includes(`/${pathSegment}/`) || pathname.endsWith(`/${pathSegment}`) || pathname.includes(`/${pathSegment}?`) || pathname.includes(`/${pathSegment}#`);
  };

  const brandText = useMemo(() => {
    const rawTitle = lang === "ar" ? logoTitle?.ar || "فاشن غيت" : logoTitle?.en || "FASHION GATE";
    const explicitSubtitle = lang === "ar" ? logoSubtitle?.ar : logoSubtitle?.en;

    if (explicitSubtitle !== undefined && explicitSubtitle !== null && explicitSubtitle.trim() !== "") {
      return {
        primary: rawTitle,
        secondary: explicitSubtitle.trim()
      };
    }

    // Intelligent auto-separation if no explicit subtitle is provided
    if (lang === "ar") {
      if (rawTitle.includes("مول")) {
        const cleaned = rawTitle.replace(/مول/g, "").trim();
        return {
          primary: cleaned || "فاشن غيت",
          secondary: "مـــــول"
        };
      }
      return {
        primary: rawTitle,
        secondary: "مـــــول"
      };
    } else {
      const upper = rawTitle.toUpperCase();
      if (upper.includes("MALL")) {
        const cleaned = rawTitle.replace(/MALL/gi, "").trim();
        return {
          primary: cleaned || "FASHION GATE",
          secondary: "MALL"
        };
      }
      if (upper === "FASHION GATE") {
        return {
          primary: "FASHION GATE",
          secondary: "MALL"
        };
      }
      return {
        primary: rawTitle,
        secondary: ""
      };
    }
  }, [logoTitle, logoSubtitle, lang]);

  const isMenuItemActive = (item: any, isDesigners: boolean, isBeauty?: boolean) => {
    if (!activeSectionPath) return false;
    if (isDesigners && isDesignersPage) return true;

    const cleanPath = activeSectionPath;
    const cleanHref = item.href ? item.href.replace(/\/(en|ar)(\/|$)/, "") || "/" : "/";

    if (isBeauty && ["/category/beauty", "/category/skincare", "/category/makeup"].some((path) => cleanPath === path || cleanPath.startsWith(`${path}/`))) {
      return true;
    }

    if (cleanHref === "/") return cleanPath === "/";
    if (cleanHref.startsWith("/category/")) return cleanPath.startsWith(cleanHref);
    if (cleanHref.startsWith("/brand/")) return cleanPath.startsWith("/brand/");
    if (cleanHref.startsWith("/dining")) return cleanPath.startsWith("/dining") || cleanPath.startsWith("/category/dining");
    if (isDesigners) return cleanPath === "/designers" || cleanPath.startsWith("/designers/");
    return cleanPath === cleanHref || cleanPath.startsWith(cleanHref);
  };

  useEffect(() => {
    import("@/lib/productData").then((mod) => {
      setHeaderProducts(mod.products);
    }).catch(err => console.error("Failed to load header products", err));
  }, []);

  const t = (strKey: keyof typeof headerTranslations["en"]) => {
    return headerTranslations[lang][strKey] || strKey;
  };



  const handleMenuHover = (idx: number | null) => {
    setActiveDropdown(idx);
  };

  const getDesignerMenuCategories = (designerCats: any[]) => {
    if (!designerCats) return [];

    return designerCats.map(cat => ({
      title: {
        en: cat.title?.en || "",
        ar: cat.title?.ar || cat.title?.en || ""
      },
      brands: (cat.brands || [])
        .filter((b: any) => b.isActive !== false)
        .map((b: any) => {
          const brandId = b.slug?.current || b._id || "";
          let label = b.title;
          if (lang === "ar") {
            label = resolveBrandTitleAr(b.title, b.titleAr);
            if (label === b.title || !label) {
              const local = getBrandById(brandId);
              if (local?.nameAr) {
                label = local.nameAr;
              }
            }
          }
          return {
            id: brandId,
            label: label
          };
        })
    })).filter(cat => cat.brands.length > 0);
  };

  const renderDesignerCategoryCards = (cats: any[]) => {
    if (!cats) return [];
    return cats.map(cat => {
      const activeBrands = cat.brands || [];
      if (activeBrands.length > 0) {
        const catTitle = lang === "ar" ? cat.title.ar : cat.title.en;
        return (
          <Box
            key={catTitle}
            sx={{
              border: "1px solid rgba(0,0,0,0.08)",
              bgcolor: "#fff",
              p: { xs: 2, lg: 2.25 },
              minHeight: 0,
              breakInside: "avoid",
              mb: { xs: 1.5, lg: 1.75 }
            }}
          >
            <Typography sx={{ fontSize: 10, fontWeight: 800, color: "#CB6116", textTransform: "uppercase", letterSpacing: lang === "ar" ? 0 : "0.14em", mb: 1.6, fontFamily: '"Cairo", sans-serif' }}>
              {catTitle}
            </Typography>
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: activeBrands.length > 20 ? "repeat(3, minmax(0, 1fr))" : activeBrands.length > 7 ? "repeat(2, minmax(0, 1fr))" : "1fr",
                columnGap: { xs: 1.5, lg: 2.25 },
                rowGap: 0.9,
              }}
            >
              {activeBrands.map((b: any) => (
                <Typography
                  key={b.id}
                  component={Link}
                  href={`/brand/${b.id}/${lang}`}
                  onClick={() => setActiveDropdown(null)}
                  sx={{
                    color: "#333333",
                    textDecoration: "none",
                    fontSize: 12,
                    fontWeight: 500,
                    fontFamily: '"Cairo", sans-serif',
                    lineHeight: 1.3,
                    whiteSpace: "normal",
                    "&:hover": { color: "#CB6116", transform: lang === "ar" ? "translateX(-4px)" : "translateX(4px)" },
                    transition: "all 0.2s ease"
                  }}
                >
                  {b.label}
                </Typography>
              ))}
            </Box>
          </Box>
        );
      }
      return null;
    });
  };

  return (
    <>
      <Box 
        component="header"
        sx={{ 
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100, 
          bgcolor: "#050505",
          backgroundImage: 'url("/assets/headerbg.png")',
          backgroundSize: "cover",
          backgroundPosition: "center",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <AnnouncementBar lang={lang} />
        
        {/* ROW 1: Logo (Left), Search/Utilities (Right) */}
        <Stack 
          direction="row" 
          justifyContent="space-between" 
          alignItems="center" 
          sx={{ minHeight: 64, px: { xs: 1, sm: 2.5, md: 4 }, gap: { xs: 0.5, sm: 2 } }}
        >
          {/* Logo on the left */}
          <Box
            component={Link}
            href={`/${lang}`}
            sx={{
              display: "inline-flex",
              alignItems: "center",
              textDecoration: "none",
              cursor: "pointer",
              minWidth: 0,
              flexShrink: 1
            }}
          >
             <Stack 
               direction="row" 
               gap={{ xs: 0.8, sm: 1.2, md: 1.5 }} 
               alignItems="center" 
               sx={{ minWidth: 0 }}
             >
               <Box 
                 component="img" 
                 src={logoImageUrl || "/brand/logo.png"} 
                 alt="Fashion Gate" 
                 sx={{ 
                   height: { xs: 30, sm: 34, md: 38 }, 
                   width: "auto",
                   objectFit: "contain",
                   flexShrink: 0,
                   filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.35))"
                 }} 
               />
               {logoLayout === "inline" || !brandText.secondary ? (
                 <Typography 
                   sx={{ 
                     fontFamily: "var(--heading-font)", 
                     fontWeight: 600, 
                     fontSize: { xs: 14.5, sm: 16, md: 18.5 }, 
                     lineHeight: 1.1, 
                     textTransform: "uppercase", 
                     color: "#ffffff",
                     letterSpacing: lang === "ar" ? 0 : "0.08em",
                     whiteSpace: "nowrap",
                     display: "block",
                     textShadow: "0 1px 3px rgba(0,0,0,0.5)"
                   }}
                 >
                   {lang === "ar" ? stretchArabicText(brandText.primary, 1) : brandText.primary}
                 </Typography>
               ) : (
                 <Box 
                   sx={{ 
                     display: "flex", 
                     flexDirection: "column", 
                     justifyContent: "center",
                     alignItems: "flex-start",
                     textAlign: lang === "ar" ? "right" : "left",
                     minWidth: 0,
                     lineHeight: 1
                   }}
                 >
                   <Typography 
                     component="span"
                     sx={{ 
                       fontFamily: "var(--heading-font)", 
                       fontWeight: 600, 
                       fontSize: { xs: 16, sm: 19, md: 21 }, 
                       lineHeight: 1.15, 
                       textTransform: "uppercase", 
                       color: "#ffffff",
                       letterSpacing: lang === "ar" ? "0.01em" : "0.08em",
                       whiteSpace: "nowrap",
                       display: "block",
                       textAlign: lang === "ar" ? "right" : "left",
                       width: "100%",
                       textShadow: "0 1px 2px rgba(0,0,0,0.6)"
                     }}
                   >
                     {lang === "ar" ? stretchArabicText(brandText.primary, 1) : brandText.primary}
                   </Typography>
                   <Typography 
                     component="span"
                     sx={{ 
                       fontFamily: lang === "ar" ? '"Cairo", sans-serif' : 'var(--heading-font), serif', 
                       fontWeight: 500, 
                       fontSize: { xs: 9, sm: 12.5, md: 13 }, 
                       lineHeight: 1, 
                       textTransform: "uppercase", 
                       color: "#ffffff",
                       letterSpacing: lang === "ar" ? 0 : "0.32em",
                       whiteSpace: "nowrap",
                       display: "block",
                       textAlign: lang === "ar" ? "right" : "left",
                       width: "100%",
                       mt: { xs: 0.25, sm: 0.35 },
                       opacity: 0.95
                     }}
                   >
                     {brandText.secondary}
                   </Typography>
                 </Box>
               )}
             </Stack>
          </Box>

          {/* Search, Language Selector, User Profile Icon on the right */}
          <Stack direction="row" spacing={{ xs: 0.3, sm: 1.5, md: 2 }} alignItems="center" sx={{ flexShrink: 0 }}>
            {/* Search Option */}
            {showSearch && (
              <SearchOption 
                lang={lang} 
                searchActive={searchActive} 
                setSearchActive={setSearchActive} 
                searchQuery={searchQuery} 
                setSearchQuery={setSearchQuery} 
                products={headerProducts}
                placeholderText={lang === "ar" ? searchPlaceholder?.ar : searchPlaceholder?.en}
                departmentsHeading={lang === "ar" ? searchDepartmentsHeading?.ar : searchDepartmentsHeading?.en}
                suggestedBrandsHeading={lang === "ar" ? searchSuggestedBrandsHeading?.ar : searchSuggestedBrandsHeading?.en}
                matchingHeading={lang === "ar" ? searchMatchingHeading?.ar : searchMatchingHeading?.en}
                departmentsList={searchDepartments}
                suggestedBrandsList={searchSuggestedBrands}
                allBrands={sanityBrands}
              />
            )}

            {showLanguageSwitcher && (
              <Box sx={{ ml: { xs: "0px !important", sm: "inherit" } }}>
                <LanguageSwitcher 
                  currentLang={lang} 
                  onToggleStart={onLangToggleStart} 
                  styleVariant={languageSwitcherStyle}
                />
              </Box>
            )}

            {/* Profile Button */}
            {/* {showUserProfile && (
              <Box 
                onMouseLeave={() => setShowUserMenu(false)}
                sx={{ position: "relative" }}
              >
                {userName ? (
                  <>
                    <IconButton 
                      onClick={() => setShowUserMenu(!showUserMenu)}
                      sx={{ 
                        color: "#CB6116", 
                        p: 0.5,
                        width: 32,
                        height: 32,
                        borderRadius: "50%",
                        border: "1px solid #CB6116",
                        fontSize: 13,
                        fontWeight: 700,
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        transition: "transform 0.2s, color 0.2s",
                        "&:hover": { color: "#ffffff", borderColor: "#ffffff", transform: "scale(1.08)" }
                      }}
                    >
                      {userName.substring(0, 2).toUpperCase()}
                    </IconButton>
                    {showUserMenu && (
                      <Box 
                        sx={{
                          position: "absolute",
                          top: 40,
                          [lang === "ar" ? "left" : "right"]: 0,
                          width: 200,
                          bgcolor: "#111111",
                          border: "1px solid rgba(255,255,255,0.08)",
                          p: 2,
                          zIndex: 100,
                          boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
                          textAlign: lang === "ar" ? "right" : "left"
                        }}
                      >
                        <Typography sx={{ fontSize: 13, fontWeight: 700, color: "#ffffff", mb: 1, textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap" }}>
                          {userName}
                        </Typography>
                        <Divider sx={{ borderColor: "rgba(255,255,255,0.08)", my: 1 }} />
                        <Button 
                          fullWidth
                          size="small"
                          onClick={handleLogout}
                          sx={{ 
                            justifyContent: lang === "ar" ? "flex-start" : "flex-end",
                            color: "#CB6116", 
                            fontSize: 12, 
                            fontWeight: 700,
                            textTransform: "uppercase"
                          }}
                        >
                          {lang === "ar" ? "تسجيل الخروج" : "Sign Out"}
                        </Button>
                      </Box>
                    )}
                  </>
                ) : (
                  <Tooltip title={t("Sign In / Register")}>
                    <IconButton 
                      component={Link} 
                      href={`/login/${lang}`} 
                      sx={{ 
                        color: "#CB6116", 
                        p: 0.5,
                        display: { xs: "none", sm: "inline-flex" },
                        transition: "transform 0.2s, color 0.2s",
                        "&:hover": { color: "#ffffff", transform: "scale(1.08)" }
                      }}
                    >
                      <PersonOutlineIcon sx={{ fontSize: 22 }} />
                    </IconButton>
                  </Tooltip>
                )}
              </Box>
            )} */}

            {/* Mobile menu trigger */}
            <IconButton 
              onClick={() => setOpen(true)} 
              sx={{ 
                color: "#ffffff", 
                p: { xs: 0.5, sm: 0.8 },
                border: "1px solid rgba(255,255,255,0.08)",
                display: { xs: "inline-flex", lg: "none" }
              }}
            >
              <MenuIcon sx={{ fontSize: 20 }} />
            </IconButton>
          </Stack>
        </Stack>

        <Divider sx={{ borderColor: "rgba(255,255,255,0.08)" }} />

        {/* ROW 2: Navigation Bar (11 nav items centered) */}
        <Stack 
          direction="row" 
          justifyContent="center" 
          alignItems="center" 
          gap={{ xs: 1.5, sm: 2.5, md: 3.5 }}
          sx={{ 
            minHeight: 44, 
            px: 2, 
            display: { xs: "none", lg: "flex" },
            position: "relative"
          }}
        >
          {(() => {
            const activeMenuItems = headerMenuItems && headerMenuItems.length > 0 ? headerMenuItems : defaultHeaderMenuItems;

            return activeMenuItems.map((item, idx) => {
              const labelStr = lang === "ar" ? item.label?.ar || item.label?.en : item.label?.en || item.label?.ar;
              const normalizedLabel = `${item.label?.en || ""} ${item.label?.ar || ""} ${labelStr || ""}`.toLowerCase();
              const isDesigners = item.href?.includes("/designers") || item.href?.includes("designers") || normalizedLabel.includes("designer") || normalizedLabel.includes("مصمم");

              const hasCustomDropdown = Array.isArray(item.dropdownItems) && item.dropdownItems.length > 0;
              const hasDesignerCategories = Array.isArray(item.designerCategories) && item.designerCategories.length > 0;
              const hasDropdown = hasCustomDropdown || hasDesignerCategories;

              const finalHref = isDesigners ? `/designers/${lang}` : resolvePath(item.href, lang);
              const isCurrentActive = isMenuItemActive(item, isDesigners);

              // Check if any dropdown item has subItems (nested flyout)
              const hasSubDropdown = hasCustomDropdown && item.dropdownItems.some((d: any) => Array.isArray(d.subItems) && d.subItems.length > 0);
              const activeSubItem = hasSubDropdown
                ? item.dropdownItems.find((d: any, dIdx: number) => {
                    const dropKey = d._key || `${idx}-${dIdx}`;
                    return beautyHoveredSub === dropKey && Array.isArray(d.subItems) && d.subItems.length > 0;
                  }) || (beautyHoveredSub ? null : item.dropdownItems.find((d: any) => Array.isArray(d.subItems) && d.subItems.length > 0))
                : null;

              return (
                <Box
                  key={item._key || idx}
                  onMouseEnter={() => hasDropdown && handleMenuHover(idx)}
                  onMouseLeave={() => {
                    if (hasDropdown) {
                      handleMenuHover(null);
                      setBeautyHoveredSub(null);
                    }
                  }}
                  sx={{ display: "inline-block", height: "100%", position: "relative" }}
                >
                  <Button
                    component={Link}
                    href={finalHref}
                    className={`luxury-link${isCurrentActive ? " luxury-link-active" : ""}`}
                    onClick={(e: React.MouseEvent) => {
                      if (isDesigners) {
                        e.preventDefault();
                        e.stopPropagation();
                        setActiveDropdown(null);
                        router.push(finalHref);
                      }
                    }}
                    sx={{
                      color: isCurrentActive ? "#CB6116" : activeDropdown === idx ? "#ffffff" : "rgba(255,255,255,.76)",
                      px: 0,
                      minWidth: 0,
                      textTransform: "uppercase",
                      fontSize: 11,
                      fontWeight: 600,
                      letterSpacing: lang === "ar" ? 0 : "0.18em",
                      fontFamily: '"Cairo", sans-serif',
                      position: "relative",
                      zIndex: 130
                    }}
                  >
                    {labelStr}
                  </Button>

                  {hasDropdown && (
                    <AnimatePresence>
                      {activeDropdown === idx && (
                        <MotionBox
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                          transition={{ duration: 0.18 }}
                          onMouseEnter={() => setActiveDropdown(idx)}
                          onMouseLeave={() => { setActiveDropdown(null); setBeautyHoveredSub(null); }}
                          sx={
                            hasDesignerCategories && item.designerCategories.length > 2
                              ? {
                                  position: "fixed",
                                  top: { xs: 118, lg: 154 },
                                  left: "max(20px, calc((100vw - 1500px) / 2))",
                                  right: "max(20px, calc((100vw - 1500px) / 2))",
                                  width: "auto",
                                  bgcolor: "#ffffff",
                                  border: "1px solid rgba(0,0,0,0.08)",
                                  borderTop: "3px solid #CB6116",
                                  boxShadow: "0 25px 50px rgba(0,0,0,0.12)",
                                  p: { xs: 2, lg: 2.5 },
                                  zIndex: 99,
                                  textAlign: lang === "ar" ? "right" : "left",
                                  color: "#111111"
                                }
                              : hasSubDropdown
                              ? {
                                  position: "absolute",
                                  top: "100%",
                                  left: lang === "ar" ? "auto" : 0,
                                  right: lang === "ar" ? 0 : "auto",
                                  width: activeSubItem ? "315px" : "175px",
                                  bgcolor: "#ffffff",
                                  border: "1px solid rgba(0,0,0,0.1)",
                                  borderTop: "3px solid #CB6116",
                                  boxShadow: "0 12px 30px rgba(0,0,0,0.12)",
                                  borderRadius: 0,
                                  p: 0,
                                  zIndex: 99,
                                  textAlign: lang === "ar" ? "right" : "left",
                                  overflow: "hidden",
                                  transition: "width 0.18s cubic-bezier(0.4, 0, 0.2, 1)"
                                }
                              : {
                                  position: "absolute",
                                  top: "100%",
                                  left: lang === "ar" ? "auto" : 0,
                                  right: lang === "ar" ? 0 : "auto",
                                  width: "220px",
                                  bgcolor: "#ffffff",
                                  border: "1px solid rgba(0,0,0,0.08)",
                                  borderTop: "3px solid #CB6116",
                                  boxShadow: "0 15px 35px rgba(0,0,0,0.08)",
                                  p: 2.5,
                                  zIndex: 99,
                                  textAlign: lang === "ar" ? "right" : "left"
                                }
                          }
                        >
                          {hasCustomDropdown ? (
                            hasSubDropdown ? (
                              <Box
                                onMouseLeave={() => setBeautyHoveredSub(null)}
                                sx={{
                                  display: "flex",
                                  flexDirection: lang === "ar" ? "row-reverse" : "row",
                                  width: "100%"
                                }}
                              >
                                {/* Left main column */}
                                <Box sx={{ width: "175px", bgcolor: "#ffffff", py: 1.5 }}>
                                  {item.dropdownItems.map((dropItem: any, dIdx: number) => {
                                    const dropLabel = lang === "ar" ? dropItem.label?.ar || dropItem.label?.en : dropItem.label?.en || dropItem.label?.ar;
                                    const dropKey = dropItem._key || `${idx}-${dIdx}`;
                                    const hasSubs = Array.isArray(dropItem.subItems) && dropItem.subItems.length > 0;
                                    const isHovered = beautyHoveredSub
                                      ? beautyHoveredSub === dropKey
                                      : (activeSubItem ? (activeSubItem._key || `${idx}-0`) === dropKey : dIdx === 0);

                                    return (
                                      <Box
                                        key={dropKey}
                                        onMouseEnter={() => setBeautyHoveredSub(dropKey)}
                                        component={Link}
                                        href={resolvePath(dropItem.href, lang)}
                                        onClick={() => { setActiveDropdown(null); setBeautyHoveredSub(null); }}
                                        sx={{
                                          display: "flex",
                                          alignItems: "center",
                                          justifyContent: "space-between",
                                          px: 2.2,
                                          py: 1.2,
                                          textDecoration: "none",
                                          color: isHovered ? "#CB6116" : "#333333",
                                          bgcolor: "transparent",
                                          fontWeight: 600,
                                          fontSize: 12.5,
                                          textTransform: "capitalize",
                                          fontFamily: '"Cairo", sans-serif',
                                          "&:hover": {
                                            color: "#CB6116",
                                            transform: lang === "ar" ? "translateX(-4px)" : "translateX(4px)"
                                          },
                                          transition: "all 0.2s ease"
                                        }}
                                      >
                                        <span>{dropLabel}</span>
                                        {hasSubs && (
                                          <Box
                                            component="span"
                                            sx={{
                                              fontSize: 10,
                                              opacity: isHovered ? 1 : 0.45,
                                              color: isHovered ? "#CB6116" : "inherit",
                                              transform: isHovered ? (lang === "ar" ? "translateX(-2px)" : "translateX(2px)") : "none",
                                              transition: "all 0.2s ease"
                                            }}
                                          >
                                            {lang === "ar" ? "◀" : "▶"}
                                          </Box>
                                        )}
                                      </Box>
                                    );
                                  })}
                                </Box>

                                {/* Flyout column for sub-items */}
                                {activeSubItem && (
                                  <Box sx={{ width: "140px", flexShrink: 0, p: 1.2, bgcolor: "#ffffff", display: "flex", flexDirection: "column", justifyContent: "center", borderLeft: lang === "ar" ? "none" : "1px solid rgba(0,0,0,0.06)", borderRight: lang === "ar" ? "1px solid rgba(0,0,0,0.06)" : "none" }}>
                                    <AnimatePresence mode="wait">
                                      <MotionBox
                                        key={beautyHoveredSub || "active-sub"}
                                        initial={{ opacity: 0, x: lang === "ar" ? -6 : 6 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: lang === "ar" ? -6 : 6 }}
                                        transition={{ duration: 0.14 }}
                                      >
                                        <Stack spacing={1.5}>
                                          {activeSubItem.subItems.map((sub: any, sIdx: number) => {
                                            const subLabel = lang === "ar" ? sub.label?.ar || sub.label?.en : sub.label?.en || sub.label?.ar;
                                            return (
                                              <Typography
                                                key={sub._key || sIdx}
                                                component={Link}
                                                href={resolvePath(sub.href, lang)}
                                                onClick={() => { setActiveDropdown(null); setBeautyHoveredSub(null); }}
                                                sx={{
                                                  color: "#333333",
                                                  textDecoration: "none",
                                                  fontSize: 12.5,
                                                  fontWeight: 600,
                                                  textTransform: "capitalize",
                                                  fontFamily: '"Cairo", sans-serif',
                                                  px: 1,
                                                  py: 0.5,
                                                  display: "block",
                                                  transition: "all 0.2s ease",
                                                  "&:hover": {
                                                    color: "#CB6116",
                                                    transform: lang === "ar" ? "translateX(-4px)" : "translateX(4px)"
                                                  }
                                                }}
                                              >
                                                {subLabel}
                                              </Typography>
                                            );
                                          })}
                                        </Stack>
                                      </MotionBox>
                                    </AnimatePresence>
                                  </Box>
                                )}
                              </Box>
                            ) : (
                              <Stack spacing={2} sx={{ width: "100%" }}>
                                {item.dropdownItems.map((dropItem: any, dIdx: number) => {
                                  const dropLabel = lang === "ar" ? dropItem.label?.ar || dropItem.label?.en : dropItem.label?.en || dropItem.label?.ar;
                                  return (
                                    <Typography
                                      key={dropItem._key || dIdx}
                                      component={Link}
                                      href={resolvePath(dropItem.href, lang)}
                                      onClick={() => setActiveDropdown(null)}
                                      sx={{
                                        color: "#333333",
                                        textDecoration: "none",
                                        fontSize: 12.5,
                                        fontWeight: 600,
                                        textTransform: "capitalize",
                                        fontFamily: '"Cairo", sans-serif',
                                        "&:hover": { color: "#CB6116", transform: lang === "ar" ? "translateX(-4px)" : "translateX(4px)" },
                                        transition: "all 0.2s ease"
                                      }}
                                    >
                                      {dropLabel}
                                    </Typography>
                                  );
                                })}
                              </Stack>
                            )
                          ) : hasDesignerCategories && item.designerCategories.length > 2 ? (
                            (() => {
                              const categories = getDesignerMenuCategories(item.designerCategories);
                              return (
                                <Box
                                  sx={{
                                    columnCount: { xs: 1, sm: 2, lg: 3, xl: 4 },
                                    columnGap: { xs: 1.5, lg: 1.75 }
                                  }}
                                >
                                  {renderDesignerCategoryCards(categories)}
                                </Box>
                              );
                            })()
                          ) : hasDesignerCategories ? (
                            <Stack spacing={2.5} sx={{ width: "100%" }}>
                              {renderDesignerCategoryCards(getDesignerMenuCategories(item.designerCategories))}
                            </Stack>
                          ) : null}
                        </MotionBox>
                      )}
                    </AnimatePresence>
                  )}
                </Box>
              );
            });
          })()}
        </Stack>
      </Box>

      {/* Elegant Drawer Menu Overlay (Mobile) */}
      <Drawer
        anchor={lang === "ar" ? "right" : "left"}
        open={open}
        onClose={() => setOpen(false)}
        PaperProps={{
          sx: {
            width: "100%",
            maxWidth: 420,
            bgcolor: "#050505", // Luxury dark theme background (no grey!)
            boxShadow: "none",
            p: 4,
            display: "flex",
            flexDirection: "column",
            borderRight: lang === "en" ? "2px solid #CB6116" : "none",
            borderLeft: lang === "ar" ? "2px solid #CB6116" : "none"
          } 
        }}
      >
        <Stack spacing={4} sx={{ height: "100%", justifyContent: "space-between" }}>
          {/* Header Row */}
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Stack direction="row" gap={1.2} alignItems="center">
              <Box component="img" src={logoImageUrl || "/brand/logo.png"} alt="Fashion Gate" sx={{ height: 28, width: "auto" }} />
              <Box sx={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "flex-start", textAlign: lang === "ar" ? "right" : "left", lineHeight: 1 }}>
                <Typography sx={{ fontFamily: "var(--heading-font)", fontSize: 16, color: "#fff", fontWeight: 600, letterSpacing: lang === "ar" ? "0.01em" : "0.08em", lineHeight: 1.15, textTransform: "uppercase", textAlign: lang === "ar" ? "right" : "left", width: "100%" }}>
                  {lang === "ar" ? stretchArabicText(brandText.primary, 1) : brandText.primary}
                </Typography>
                {brandText.secondary && (
                  <Typography sx={{ fontFamily: lang === "ar" ? '"Cairo", sans-serif' : 'var(--heading-font), serif', fontSize: 9, color: "#ffffff", fontWeight: 500, letterSpacing: lang === "ar" ? 0 : "0.32em", mt: 0.2, lineHeight: 1, textTransform: "uppercase", textAlign: lang === "ar" ? "right" : "left", width: "100%" }}>
                    {brandText.secondary}
                  </Typography>
                )}
              </Box>
            </Stack>
            <IconButton onClick={() => setOpen(false)} sx={{ color: "#fff", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 0 }}>
              <CloseIcon sx={{ fontSize: 16 }} />
            </IconButton>
          </Stack>
          
          {/* Navigation Links */}
          <Stack spacing={3.2} sx={{ overflowY: "auto", py: 4, alignItems: "center" }}>
            {(() => {
              const activeMenuItems = headerMenuItems && headerMenuItems.length > 0 ? headerMenuItems : defaultHeaderMenuItems;

              return activeMenuItems.map((item, idx) => {
                const labelStr = lang === "ar" ? item.label?.ar || item.label?.en : item.label?.en || item.label?.ar;
                const normalizedLabel = `${item.label?.en || ""} ${item.label?.ar || ""} ${labelStr || ""}`.toLowerCase();
                const isDesigners = item.href?.includes("/designers") || item.href?.includes("designers") || normalizedLabel.includes("designer") || normalizedLabel.includes("مصمم");

                const hasCustomDropdown = Array.isArray(item.dropdownItems) && item.dropdownItems.length > 0;
                const hasDesignerCategories = Array.isArray(item.designerCategories) && item.designerCategories.length > 0;
                const hasDropdown = hasCustomDropdown || hasDesignerCategories;

                const finalHref = isDesigners ? `/designers/${lang}` : resolvePath(item.href, lang);

                const isExpanded = expandedMobileItem === idx;
                const isCurrentActive = isMenuItemActive(item, isDesigners);

                return (
                  <Stack key={item._key || idx} spacing={1.5} sx={{ width: "100%", alignItems: "center" }}>
                    <MuiLink
                      component={isDesigners || !hasDropdown ? Link : "span"}
                      href={isDesigners || !hasDropdown ? finalHref : undefined}
                      onClick={(e: React.MouseEvent) => {
                        if (hasDropdown && !isDesigners) {
                          e.preventDefault();
                          setExpandedMobileItem(isExpanded ? null : idx);
                        } else {
                          setOpen(false);
                        }
                      }}
                      sx={{
                        color: (isCurrentActive || isExpanded || activeDropdown === idx) ? "#CB6116" : "rgba(255,255,255,0.85)",
                        fontSize: 15,
                        fontWeight: 600,
                        textTransform: "uppercase",
                        letterSpacing: lang === "ar" ? 0 : "0.15em",
                        textDecoration: "none",
                        fontFamily: '"Cairo", sans-serif',
                        transition: "all 0.25s ease",
                        textAlign: "center",
                        cursor: "pointer",
                        "&:hover": { 
                          color: "#CB6116"
                        }
                      }}
                    >
                      {labelStr}
                    </MuiLink>
                    
                    {hasDropdown && (
                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.25, ease: "easeInOut" }}
                            style={{ overflow: "hidden", width: "100%" }}
                          >
                            <Stack spacing={2.5} sx={{ py: 2, px: 3, bgcolor: "rgba(255,255,255,0.03)", borderLeft: lang === "ar" ? "none" : "2px solid #CB6116", borderRight: lang === "ar" ? "2px solid #CB6116" : "none", width: "100%" }}>
                              {hasCustomDropdown ? (
                                <Stack spacing={2} sx={{ width: "100%", alignItems: "center" }}>
                                  {item.dropdownItems.map((dropItem: any, dIdx: number) => {
                                    const dropLabel = lang === "ar" ? dropItem.label?.ar || dropItem.label?.en : dropItem.label?.en || dropItem.label?.ar;
                                    const dropHref = resolvePath(dropItem.href, lang);
                                    const hasSubs = Array.isArray(dropItem.subItems) && dropItem.subItems.length > 0;

                                    if (hasSubs) {
                                      return (
                                        <Box key={dropItem._key || dIdx} sx={{ textAlign: "center", width: "100%" }}>
                                          <MuiLink
                                            component={Link}
                                            href={dropHref}
                                            onClick={() => setOpen(false)}
                                            sx={{
                                              color: "#CB6116",
                                              fontSize: 13,
                                              fontWeight: 700,
                                              textTransform: "capitalize",
                                              textDecoration: "none",
                                              display: "block",
                                              mb: 0.8,
                                              fontFamily: '"Cairo", sans-serif'
                                            }}
                                          >
                                            {dropLabel}
                                          </MuiLink>
                                          <Stack spacing={0.8} sx={{ alignItems: "center" }}>
                                            {dropItem.subItems.map((sub: any, sIdx: number) => {
                                              const subLabel = lang === "ar" ? sub.label?.ar || sub.label?.en : sub.label?.en || sub.label?.ar;
                                              const subHref = resolvePath(sub.href, lang);
                                              return (
                                                <MuiLink
                                                  key={sub._key || sIdx}
                                                  component={Link}
                                                  href={subHref}
                                                  onClick={() => setOpen(false)}
                                                  sx={{
                                                    color: "rgba(255,255,255,0.75)",
                                                    fontSize: 12.5,
                                                    textDecoration: "none",
                                                    fontFamily: '"Cairo", sans-serif',
                                                    "&:hover": { color: "#ffffff" }
                                                  }}
                                                >
                                                  {subLabel}
                                                </MuiLink>
                                              );
                                            })}
                                          </Stack>
                                        </Box>
                                      );
                                    }

                                    return (
                                      <MuiLink
                                        key={dropItem._key || dIdx}
                                        component={Link}
                                        href={dropHref}
                                        onClick={() => setOpen(false)}
                                        sx={{
                                          color: "rgba(255,255,255,0.75)",
                                          fontSize: 13,
                                          textDecoration: "none",
                                          fontFamily: '"Cairo", sans-serif',
                                          "&:hover": { color: "#ffffff" }
                                        }}
                                      >
                                        {dropLabel}
                                      </MuiLink>
                                    );
                                  })}
                                </Stack>
                              ) : hasDesignerCategories ? (
                                Array.isArray(item.designerCategories) && item.designerCategories.length > 0 && typeof item.designerCategories[0] === "object" && item.designerCategories[0].title ? (
                                  item.designerCategories.map((cat: any, catIdx: number) => {
                                    const catTitle = lang === "ar" ? cat.title?.ar || cat.title?.en : cat.title?.en || cat.title?.ar;
                                    if (!cat.brands || cat.brands.length === 0) return null;
                                    
                                    return (
                                      <Stack key={catIdx} spacing={1.2} sx={{ textAlign: lang === "ar" ? "right" : "left", width: "100%" }}>
                                        <Typography sx={{ color: "#CB6116", fontSize: 11, fontWeight: 700, letterSpacing: lang === "ar" ? 0 : "0.1em", textTransform: "uppercase", fontFamily: '"Cairo", sans-serif' }}>
                                          {catTitle}
                                        </Typography>
                                        <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1 }}>
                                          {cat.brands.map((brand: any, brandIdx: number) => {
                                            const brandTitle = lang === "ar" ? resolveBrandTitleAr(brand.title, brand.titleAr) : brand.title || brand.titleAr;
                                            const brandHref = `/brand/${brand.slug?.current || brand.slug}/${lang}`;
                                            
                                            return (
                                              <MuiLink
                                                key={brandIdx}
                                                component={Link}
                                                href={brandHref}
                                                onClick={() => setOpen(false)}
                                                sx={{
                                                  color: "rgba(255,255,255,0.65)",
                                                  fontSize: 13,
                                                  textDecoration: "none",
                                                  fontFamily: '"Cairo", sans-serif',
                                                  "&:hover": { color: "#ffffff" }
                                                }}
                                              >
                                                {brandTitle}
                                              </MuiLink>
                                            );
                                          })}
                                        </Box>
                                      </Stack>
                                    );
                                  })
                                ) : (
                                  <MuiLink
                                    component={Link}
                                    href={`/designers/${lang}`}
                                    onClick={() => setOpen(false)}
                                    sx={{
                                      color: "#CB6116",
                                      fontSize: 13,
                                      fontWeight: 700,
                                      textTransform: "uppercase",
                                      textDecoration: "none",
                                      fontFamily: '"Cairo", sans-serif'
                                    }}
                                  >
                                    {lang === "ar" ? "عرض جميع المصممين" : "VIEW ALL DESIGNERS"}
                                  </MuiLink>
                                )
                              ) : null}
                            </Stack>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    )}
                  </Stack>
                );
              });
            })()}
          </Stack>

          {/* Bottom Drawer Section (Sign In & Socials) */}
          <Stack spacing={2.5} sx={{ borderTop: "1px solid rgba(255,255,255,0.08)", pt: 3, mt: "auto" }}>
            {/* <Button
              component={Link}
              href={`/login/${lang}`}
              onClick={() => setOpen(false)}
              fullWidth
              sx={{
                color: "#ffffff",
                border: "1px solid rgba(255,255,255,0.15)",
                borderRadius: 0,
                py: 1,
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: lang === "ar" ? 0 : "0.15em",
                fontFamily: '"Cairo", sans-serif',
                "&:hover": { bgcolor: "rgba(255,255,255,0.05)" }
              }}
            >
              {t("Sign In / Register")}
            </Button> */}
          </Stack>
        </Stack>
      </Drawer>
    </>
  );
}
