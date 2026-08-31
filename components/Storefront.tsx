"use client";

import { useMemo, useState, useEffect } from "react";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import CloseIcon from "@mui/icons-material/Close";
import MenuIcon from "@mui/icons-material/Menu";
import NorthEastIcon from "@mui/icons-material/NorthEast";
import { Box, Button, Container, Drawer, IconButton, Stack, ThemeProvider, Tooltip, Typography, createTheme } from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import { imageUrl, getAnnouncements, getLocalizedValue, getContactPageData } from "@/lib/sanity";
import type { CollectionItem, MediaItem, SanityImage, Section, SiteSettings } from "@/lib/types";
import Link from "next/link";
import { useParams, useRouter, usePathname } from "next/navigation";
import { products, type Product } from "@/lib/productData";
import { useLoader } from "@/components/LoaderProvider";
import dynamic from "next/dynamic";
import HeroSection from "./storefront/HeroSection";

const FaqSection = dynamic(() => import("./storefront/FaqSection"), { ssr: true });
const ManifestoSection = dynamic(() => import("./storefront/ManifestoSection"), { ssr: true });
const CarouselSection = dynamic(() => import("./storefront/CarouselSection"), { ssr: true });
const CollectionsSection = dynamic(() => import("./storefront/CollectionsSection"), { ssr: true });
const CategoryProductSections = dynamic(() => import("./storefront/CategoryProductSections"), { ssr: true });
const LookbookSection = dynamic(() => import("./storefront/LookbookSection"), { ssr: true });
const BoulevardSelectionSection = dynamic(() => import("./storefront/BoulevardSelectionSection"), { ssr: true });
const EditorialSection = dynamic(() => import("./storefront/EditorialSection"), { ssr: true });
const AtelierShowcaseSection = dynamic(() => import("./storefront/AtelierShowcaseSection"), { ssr: true });
const BrandMarquee = dynamic(() => import("./storefront/BrandMarquee"), { ssr: true });
const ContactDetailsFormSection = dynamic(() => import("./storefront/ContactDetailsFormSection"), { ssr: true });


const MotionBox = motion.create(Box);

export const shopNavigation = [
  // { label: "Women", anchor: "#women" },
  // { label: "Men", anchor: "#men" },
  { label: "Beauty", anchor: "#beauty" },
  { label: "Home & Deco", anchor: "#home-deco" },
  { label: "Brand", anchor: "#brand" }
];

export const shopCategories = [
  {
    id: "women",
    label: "Women",
    eyebrow: "Designer Wardrobe",
    headline: "Edited silhouettes for her.",
    description: "Refined dresses, silk separates, coats, and tailored pieces arranged for an easier boutique-style shopping path.",
    productIds: ["chanel-tweed-jacket", "prada-oversized-wool-coat", "gucci-floral-silk-scarf", "dior-bar-jacket"]
  },
  {
    id: "men",
    label: "Men",
    eyebrow: "Menswear Edit",
    headline: "Sharp everyday luxury.",
    description: "Polos, tailoring, sportswear, and structured outerwear grouped so men can move directly from category to product.",
    productIds: ["ysl-tuxedo-suit", "adidas-y3-sneakers", "adidas-originals-track-jacket", "prada-nylon-backpack"]
  },
  {
    id: "beauty",
    label: "Beauty",
    eyebrow: "Beauty & Accessories",
    headline: "Scent, skin, and finishing accents.",
    description: "Perfume, bags, watches, footwear, and leather accessories brought together as a premium beauty and accessory destination.",
    productIds: ["chanel-no5-perfume", "dior-sauvage-elixir", "hermes-birkin-30", "chanel-classic-flap-bag", "prada-galleria-tote", "gucci-marmont-shoulder-bag", "gucci-horsebit-loafers", "ysl-sac-de-jour", "hermes-h-hour-watch"]
  },
  {
    id: "home-deco",
    label: "Home & Deco",
    eyebrow: "Gourmet & Gifting",
    headline: "Objects of taste for home and gifting.",
    description: "Fine porcelain and lifestyle decor pieces sourced from the world's most prestigious luxury houses.",
    productIds: ["hermes-porcelain-plate"]
  }
];

// Translation mapping from English fallbacks to Arabic
const stringMap: Record<string, string> = {
  // Navigation / UI Controls
  "Women": "النساء",
  "Men": "الرجال",
  "Beauty": "الجمال",
  "Home & Deco": "المنزل والديكور",
  "Brand": "العلامة التجارية",
  "Blogs": "المدونة",
  "Explore": "استكشف",
  "Read the manifesto": "اقرأ البيان",
  "Menu": "القائمة",
  "On Boulevard. For the world.": "على البوليفارد. للعالم.",
  
  // Hero Section
  "Fashion Gate Boulevard": "بوليفارد بوابة الأزياء",
  "Syria has never had a luxury department store of this scale. A single address where fashion, taste and culture converge.": 
    "لم تشهد سوريا من قبل متجراً للمنتجات الفاخرة بهذا الحجم. عنوان واحد حيث تلتقي الموضة والذوق والثقافة.",
  "Read manifesto": "اقرأ البيان",
  
  // Manifesto Section
  "Manifesto": "البيان",
  "Syria has never had a luxury department store of this scale. Fashion Gate Boulevard is not just a business. It is the reopening of Syria to the world through fashion.":
    "لم تشهد سوريا من قبل متجراً للمنتجات الفاخرة بهذا الحجم. بوليفارد بوابة الأزياء ليس مجرد عمل تجاري. إنه إعادة فتح سوريا للعالم من خلال الموضة.",
  
  // Carousel Section
  "Not a store. Not a mall. A destination.": "ليس مجرد متجر. ليس مركزاً تجارياً. وجهة.",
  "Explore curated seasonal edits, signature silhouettes, and international designer collections that define the Fashion Gate experience.":
    "استكشف إصدارات موسمية منسقة، وتصاميم مميزة، ومجموعات مصممين عالميين تحدد تجربة بوابة الأزياء.",
  "The Autumn Edit": "إصدار الخريف",
  "A curation of timeless silhouettes, crafted in premium silks and warm cashmeres designed for the modern woman.":
    "مجموعة مختارة من التصاميم الكلاسيكية، المصنوعة من الحرير الفاخر والكشمير الدافئ المصمم للمرأة العصرية.",
  "Modern Sophistication": "رقي عصري",
  "Effortless elegance meeting structured tailoring. Discover pieces that redefine classic design for daily luxury.":
    "أناقة عفوية تلتقي مع التفصيل المتقن. اكتشف القطع التي تعيد تعريف التصميم الكلاسيكي للفخامة اليومية.",
  "Signature Accents": "لمسات مميزة",
  "Exquisite bags and finely polished accessories that complete the definitive Fashion Gate statement.":
    "حقائب رائعة وإكسسوارات مصقولة بدقة تكمل المظهر المميز لبوابة الأزياء.",
    
  // Collections Section
  "The Departments": "الأقسام",
  "Multiple Worlds. One Architectural Vision.": "عوالم متعددة. رؤية معمارية واحدة.",
  "Fashion Gate Boulevard unites international fashion designer collections, luxury accessories, premium beauty, and gourmet foods under a single architectural vision.":
    "يوحد بوليفارد بوابة الأزياء بين مجموعات مصممي الأزياء العالميين، والإكسسوارات الفاخرة، ومستحضرات التجميل الراقية، والأطعمة الشهية تحت رؤية معمارية واحدة.",
  "Designer Collections": "مجموعات المصممين",
  "A curated presentation of international fashion houses, avant-garde silhouettes, and seasonal runway selections for women and men.":
    "عرض منسق لدور الأزياء العالمية والتصاميم المبتكرة وتشكيلات منصات العرض الموسمية للنساء والرجال.",
  "Beauty & Accessories": "الجمال والإكسسوارات",
  "Luxury Accessories & Beauty": "الإكسسوارات الفاخرة والجمال",
  "Intimate displays of rare scents, advanced skincare, and hand-finished leather accessories from the world's most refined makers.":
    "عروض مخصصة للعطور النادرة ومنتجات العناية بالبشرة المتقدمة والإكسسوارات الجلدية المصنوعة يدوياً من أرقى المصنعين في العالم.",
  "Gourmet & Fine Foods": "الأطعمة الفاخرة والحلويات",
  "Gourmet & Gifting": "المأكولات الشهية والهدايا الفاخرة",
  "An exquisite selection of curated gourmet foods, artisanal confectioneries, and luxury gift hampers sourced from the world's most prestigious makers.":
    "تشكيلة رائعة من الأطعمة الشهية المنسقة، والحلويات الحرفية، وسلال الهدايا الفاخرة المستوردة من أرقى المصنعين في العالم.",
    
  // Lookbook Section
  "Curated Pieces": "قطع مختارة",
  "Explore Piece": "استكشف القطعة",
  "Explore a singular gallery of signature items, where architectural geometry meets tactile luxury from Damascus to the world.":
    "استكشف معرضاً فريداً من القطع المتميزة، حيث تلتقي الهندسة المعمارية بالفخامة الحسية من دمشق إلى العالم.",
    
  // Brand Section
  "Heritage & Craftsmanship": "التراث والمهارة الحرفية",
  "The Pinnacle of Syrian Luxury Shopping": "قمة تسوق الفخامة السورية",
  "Fashion Gate brings together the world's most renowned haute couture houses, bespoke local ateliers, and curations of fine design. Housed in the prestigious Boulevard district, we offer an immersive luxury journey that connects the heritage of Silk Road craftsmanship with contemporary global style.":
    "تجمع بوابة الأزياء (فاشن غيت) بين أشهر دور الأزياء العالمية، وأرقى الأتيليهات المحلية المصممة خصيصاً، ومجموعات منتقاة من التصميم الفاخر. في قلب حي البوليفارد المرموق، نقدم رحلة فاخرة غامرة تربط بين تراث طريق الحرير الحرفي والأسلوب العالمي المعاصر.",
};

export function resolveImage(source?: SanityImage, fallback?: string) {
  if (source?.asset?._ref || source?.asset?._id) {
    return imageUrl(source).url() || "";
  }
  if (fallback && !fallback.startsWith("/brand-pages/") && !fallback.startsWith("/brand/") && !fallback.startsWith("/assets/")) {
    return fallback;
  }
  return "";
}

export function imageLayer(url: string) {
  return `linear-gradient(180deg, rgba(0,0,0,.08), rgba(0,0,0,.68)), url(${url})`;
}

function BrandMark({ settings, light = false, lang }: { settings: SiteSettings; light?: boolean; lang: "ar" | "en" }) {
  const textColor = light ? "#111111" : "#ffffff";
  const subColor = light ? "rgba(0,0,0,.54)" : "rgba(255,255,255,.68)";

  return (
    <Box
      component={Link}
      href={`/${lang}#arrival`}
      sx={{
        display: "inline-flex",
        alignItems: "center",
        textDecoration: "none",
        cursor: "pointer"
      }}
    >
      <Stack direction="row" gap={lang === "ar" ? 3.5 : 2} alignItems="center">
        <Box 
          component="img" 
          src="/brand/logo.png" 
          alt={settings.title || "Fashion Gate"} 
          sx={{ 
            height: { xs: 34, md: 44 }, 
            width: "auto",
            objectFit: "contain",
            filter: light ? "brightness(0)" : "none"
          }} 
        />
        <Stack spacing={0.1} alignItems="flex-start" sx={{ display: { xs: "none", sm: "flex" } }}>
          <Typography 
            sx={{ 
              fontFamily: "var(--heading-font)", 
              fontWeight: 600, 
              fontSize: { xs: 14, md: 17 }, 
              lineHeight: 1, 
              textTransform: "uppercase", 
              color: textColor,
              letterSpacing: "0.08em"
            }}
          >
            Fashion Gate
          </Typography>
          <Typography 
            sx={{ 
              fontSize: 8, 
              letterSpacing: "0.1em", 
              textTransform: "uppercase", 
              color: subColor 
            }}
          >
            On Boulevard. For the world.
          </Typography>
        </Stack>
      </Stack>
    </Box>
  );
}

function AnnouncementBar({ lang }: { lang: "ar" | "en" }) {
  const [announcements, setAnnouncements] = useState<any[]>([]);

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

  if (announcements.length === 0) return null;

  // Duplicate items sufficiently to cover screen width and ensure seamless loops
  const marqueeItems = [];
  for (let i = 0; i < 20; i++) {
    marqueeItems.push(...announcements);
  }

  const isAr = lang === "ar";

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes marquee-storefront-scroll-left {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-50%, 0, 0); }
        }
        @keyframes marquee-storefront-scroll-right {
          0% { transform: translate3d(-50%, 0, 0); }
          100% { transform: translate3d(0, 0, 0); }
        }
        .marquee-storefront-container {
          display: flex;
          align-items: center;
          white-space: nowrap;
          width: max-content;
          animation: marquee-storefront-scroll-left 175s linear infinite;
        }
        .marquee-storefront-container:hover {
          animation-play-state: paused;
        }
      `}} />
      <Box 
        component="div"
        dir="ltr"
        sx={{ 
          bgcolor: "#050505", 
          color: "#f37e2b", 
          py: 0.9, 
          borderBottom: "1px solid rgba(255,255,255,0.06)",
          position: "relative",
          minHeight: 45,
          overflow: "hidden",
          display: "flex",
          alignItems: "center"
        }}
      >
        <Box className="marquee-storefront-container" dir="ltr">
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
                    fontSize: "13px",
                    fontWeight: 600,
                    letterSpacing: "0.06em",
                    color: "#ffffff"
                  }}
                >
                  {item.text}
                </Typography>
              )}
              {/* Luxury Diamond Spacer */}
              <Box component="span" sx={{ color: "rgba(255, 255, 255, 0.28)", ml: 6, fontSize: 13 }}>
                ✦
              </Box>
            </Box>
          ))}
        </Box>
      </Box>
    </>
  );
}

function FloatingMenu({ settings, lang, setLang, t, isLangTransitioning }: { settings: SiteSettings; lang: "ar" | "en"; setLang: () => void; t: (s?: string) => string; isLangTransitioning: boolean }) {
  const [open, setOpen] = useState(false);
  const nav = shopNavigation;

  const menuDescriptions: Record<string, { en: string; ar: string }> = {
    "Women": { en: "Seasonal silhouettes & tailoring", ar: "تصاميم موسمية وخياطة راقية" },
    "Men": { en: "Timeless cuts & modern fits", ar: "قصات خالدة ومقاسات عصرية" },
    "Beauty": { en: "Curated scents & skin care", ar: "عطور منسقة وعناية بالبشرة" },
    "Home & Deco": { en: "Artisanal objects & furniture", ar: "تحف فنية وأثاث راقٍ" },
    "Brand": { en: "Our heritage & design manifesto", ar: "تراثنا وبيان التصميم الخاص بنا" },
    "Blogs": { en: "Refined journal notes & case studies", ar: "ملاحظات الجريدة ودراسات الحالة" }
  };

  return (
    <>
      <Box 
        component="header"
        sx={{ 
          display: "none",
          position: "sticky",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100, 
          bgcolor: "#050505",
          backgroundImage: 'url("/assets/headerbg.png")',
          backgroundSize: "cover",
          backgroundPosition: "center",
          borderBottom: "none",
          boxShadow: "none"
        }}
      >
        <AnnouncementBar lang={lang} />
        <Stack direction="row" alignItems="center" sx={{ minHeight: { xs: 64, md: 74 }, px: { xs: 2.5, md: 4 } }}>
          {/* Left navigation */}
          <Stack 
            direction="row" 
            gap={lang === "ar" ? 4.5 : 3.5} 
            alignItems="center" 
            sx={{ 
              flex: 1, 
              display: { xs: "none", lg: "flex" },
              pr: lang === "ar" ? 0 : 8,
              pl: lang === "ar" ? 8 : 0
            }}
          >
            {/* <Button href="#women" className="luxury-link" sx={{ color: "rgba(255,255,255,.76)", px: 0, minWidth: 0, textTransform: "uppercase", fontSize: 11, fontWeight: 600, letterSpacing: "0.18em", fontFamily: '"Cairo", sans-serif' }}>
              {t("Women")}
            </Button>
            <Button href="#men" className="luxury-link" sx={{ color: "rgba(255,255,255,.76)", px: 0, minWidth: 0, textTransform: "uppercase", fontSize: 11, fontWeight: 600, letterSpacing: "0.18em", fontFamily: '"Cairo", sans-serif' }}>
              {t("Men")}
            </Button> */}
            <Button href="#beauty" className="luxury-link" sx={{ color: "rgba(255,255,255,.76)", px: 0, minWidth: 0, textTransform: "uppercase", fontSize: 11, fontWeight: 600, letterSpacing: "0.18em", fontFamily: '"Cairo", sans-serif' }}>
              {t("Beauty")}
            </Button>
          </Stack>
          
          {/* Centered Brand Name & Logo */}
          <Box sx={{ flex: { xs: 1, lg: "none" }, position: { lg: "absolute" }, left: { lg: "50%" }, transform: { lg: "translateX(-50%)" } }}>
            <BrandMark settings={settings} lang={lang} />
          </Box>

          {/* Right navigation */}
          <Stack 
            direction="row" 
            gap={lang === "ar" ? 4.5 : 3.5} 
            justifyContent="flex-end" 
            alignItems="center" 
            sx={{ 
              flex: 1, 
              display: { xs: "none", lg: "flex" },
              pl: lang === "ar" ? 0 : 8,
              pr: lang === "ar" ? 8 : 0
            }}
          >
            <Button href="#home-deco" className="luxury-link" sx={{ color: "rgba(255,255,255,.76)", px: 0, minWidth: 0, textTransform: "uppercase", fontSize: 11, fontWeight: 600, letterSpacing: "0.18em", fontFamily: '"Cairo", sans-serif' }}>
              {t("Home & Deco")}
            </Button>
            <Button href="#brand" className="luxury-link" sx={{ color: "rgba(255,255,255,.76)", px: 0, minWidth: 0, textTransform: "uppercase", fontSize: 11, fontWeight: 600, letterSpacing: "0.18em", fontFamily: '"Cairo", sans-serif' }}>
              {t("Brand")}
            </Button>
            <Button component={Link} href={`/blogs/${lang}`} className="luxury-link" sx={{ color: "rgba(255,255,255,.76)", px: 0, minWidth: 0, textTransform: "uppercase", fontSize: 11, fontWeight: 600, letterSpacing: "0.18em", fontFamily: '"Cairo", sans-serif' }}>
              {t("Blogs")}
            </Button>
            
            {/* Language Selector */}
            <Button 
              onClick={setLang}
              disabled={isLangTransitioning}
              sx={{ 
                color: "primary.main", 
                textTransform: "uppercase", 
                fontSize: 11, 
                fontWeight: 800, 
                letterSpacing: "0.15em",
                px: 1.5,
                py: 0.5,
                border: "1px solid",
                borderColor: "primary.main",
                borderRadius: 0,
                fontFamily: '"Cairo", sans-serif',
                transition: "all 0.25s ease-in-out",
                opacity: isLangTransitioning ? 0.55 : 1,
                transform: isLangTransitioning ? "scale(0.96)" : "scale(1)",
                cursor: isLangTransitioning ? "wait" : "pointer",
                "&:hover": {
                  bgcolor: "rgba(203, 97, 22, 0.08)",
                  borderColor: "primary.main"
                }
              }}
            >
              {lang === "ar" ? "En" : "Ar"}
            </Button>

            <Button 
              href="#women" 
              endIcon={<NorthEastIcon sx={{ fontSize: 12, mr: lang === "ar" ? 1 : 0, ml: lang === "ar" ? 0 : 1 }} />} 
              sx={{ 
                color: "rgba(255,255,255,.76)", 
                border: "1px solid rgba(255,255,255,.18)", 
                borderRadius: 0, 
                fontSize: 11, 
                fontWeight: 600, 
                letterSpacing: "0.15em", 
                px: 2.2, 
                py: 0.6,
                fontFamily: '"Cairo", sans-serif',
                transition: "all 0.3s ease",
                "&:hover": {
                  borderColor: "#fff",
                  color: "#fff"
                }
              }}
            >
              {t("Explore")}
            </Button>
          </Stack>

          {/* Mobile Header elements */}
          <Stack direction="row" spacing={1.5} alignItems="center" sx={{ display: { xs: "flex", lg: "none" }, ml: "auto" }}>
            <Button 
              onClick={setLang}
              disabled={isLangTransitioning}
              size="small"
              sx={{ 
                color: "primary.main", 
                textTransform: "uppercase", 
                fontSize: 10, 
                fontWeight: 800, 
                letterSpacing: "0.15em",
                px: 1.2,
                py: 0.4,
                minWidth: 0,
                border: "1px solid",
                borderColor: "primary.main",
                borderRadius: 0,
                fontFamily: '"Cairo", sans-serif',
                transition: "all 0.25s ease-in-out",
                opacity: isLangTransitioning ? 0.55 : 1,
                transform: isLangTransitioning ? "scale(0.96)" : "scale(1)",
                cursor: isLangTransitioning ? "wait" : "pointer"
              }}
            >
              {lang === "ar" ? "EN" : "AR"}
            </Button>

            <Tooltip title={t("Menu")}>
              <IconButton onClick={() => setOpen(true)} sx={{ color: "#fff", borderLeft: "1px solid rgba(255,255,255,.1)", pl: 2, borderRadius: 0, width: 44, height: 44 }}>
                <MenuIcon />
              </IconButton>
            </Tooltip>
          </Stack>
        </Stack>
      </Box>

      {/* Fullscreen Mobile Menu Overlay */}
      <Drawer 
        anchor="top" 
        open={open} 
        onClose={() => setOpen(false)} 
        PaperProps={{ 
          sx: { 
            width: "100vw",
            height: "100vh",
            bgcolor: "#050505", 
            backgroundImage: "radial-gradient(circle at 80% 15%, rgba(203, 97, 22, 0.12) 0%, transparent 60%)",
            color: "#fff", 
            p: { xs: 3, md: 6 },
            border: "none",
            display: "flex",
            flexDirection: "column"
          } 
        }}
      >
        <Stack spacing={5} sx={{ height: "100%", justifyContent: "space-between" }}>
          {/* Top Bar inside Overlay */}
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <BrandMark settings={settings} lang={lang} />
            <IconButton onClick={() => setOpen(false)} sx={{ color: "#fff", border: "1px solid rgba(255,255,255,0.1)", p: 1, borderRadius: "50%" }}>
              <CloseIcon sx={{ fontSize: 20 }} />
            </IconButton>
          </Stack>
          
          {/* Centered Editorial Menu List */}
          <Stack spacing={{ xs: 2.5, sm: 3 }} sx={{ my: "auto", px: { xs: 1, sm: 4 } }}>
            {nav.map((item) => {
              const label = item.label || "";
              const desc = label ? (menuDescriptions[label]?.[lang] || "") : "";
              return (
                <Stack 
                  key={label} 
                  spacing={0.5} 
                  sx={{ 
                    borderBottom: "1px solid rgba(255,255,255,0.05)", 
                    pb: 1.5,
                    alignItems: lang === "ar" ? "flex-end" : "flex-start" 
                  }}
                >
                  <Button 
                    href={item.anchor || "#"} 
                    onClick={() => setOpen(false)} 
                    endIcon={lang === "en" && <NorthEastIcon sx={{ fontSize: 16, opacity: 0.4 }} />} 
                    startIcon={lang === "ar" && <NorthEastIcon sx={{ fontSize: 16, opacity: 0.4, transform: "scaleX(-1)" }} />}
                    sx={{ 
                      p: 0,
                      color: "rgba(255,255,255,0.9)", 
                      fontSize: { xs: 24, sm: 32 }, 
                      fontWeight: 500,
                      fontFamily: "var(--heading-font)",
                      textTransform: "none",
                      letterSpacing: "0.02em",
                      textAlign: lang === "ar" ? "right" : "left",
                      "&:hover": {
                        color: "primary.main",
                        transform: lang === "ar" ? "translateX(-6px)" : "translateX(6px)"
                      },
                      transition: "transform 0.3s ease, color 0.3s ease"
                    }}
                  >
                    {t(item.label)}
                  </Button>
                  {desc && (
                    <Typography sx={{ color: "rgba(255,255,255,0.42)", fontSize: { xs: 11, sm: 12.5 }, fontFamily: '"Cairo", sans-serif', letterSpacing: "0.05em" }}>
                      {desc}
                    </Typography>
                  )}
                </Stack>
              );
            })}
            
            {/* Blogs Link */}
            <Stack 
              spacing={0.5} 
              sx={{ 
                borderBottom: "1px solid rgba(255,255,255,0.05)", 
                pb: 1.5,
                alignItems: lang === "ar" ? "flex-end" : "flex-start" 
              }}
            >
              <Button 
                component={Link}
                href={`/blogs/${lang}`} 
                onClick={() => setOpen(false)} 
                endIcon={lang === "en" && <NorthEastIcon sx={{ fontSize: 16, opacity: 0.4 }} />} 
                startIcon={lang === "ar" && <NorthEastIcon sx={{ fontSize: 16, opacity: 0.4, transform: "scaleX(-1)" }} />}
                sx={{ 
                  p: 0,
                  color: "rgba(255,255,255,0.9)", 
                  fontSize: { xs: 24, sm: 32 }, 
                  fontWeight: 500,
                  fontFamily: "var(--heading-font)",
                  textTransform: "none",
                  letterSpacing: "0.02em",
                  textAlign: lang === "ar" ? "right" : "left",
                  "&:hover": {
                    color: "primary.main",
                    transform: lang === "ar" ? "translateX(-6px)" : "translateX(6px)"
                  },
                  transition: "transform 0.3s ease, color 0.3s ease"
                }}
              >
                {t("Blogs")}
              </Button>
              <Typography sx={{ color: "rgba(255,255,255,0.42)", fontSize: { xs: 11, sm: 12.5 }, fontFamily: '"Cairo", sans-serif', letterSpacing: "0.05em" }}>
                {menuDescriptions["Blogs"]?.[lang] || ""}
              </Typography>
            </Stack>

            {/* Contact Link */}
            <Stack 
              spacing={0.5} 
              sx={{ 
                borderBottom: "1px solid rgba(255,255,255,0.05)", 
                pb: 1.5,
                alignItems: lang === "ar" ? "flex-end" : "flex-start" 
              }}
            >
              <Button 
                component={Link}
                href={`/contact/${lang}`} 
                onClick={() => setOpen(false)} 
                endIcon={lang === "en" && <NorthEastIcon sx={{ fontSize: 16, opacity: 0.4 }} />} 
                startIcon={lang === "ar" && <NorthEastIcon sx={{ fontSize: 16, opacity: 0.4, transform: "scaleX(-1)" }} />}
                sx={{ 
                  p: 0,
                  color: "rgba(255,255,255,0.9)", 
                  fontSize: { xs: 24, sm: 32 }, 
                  fontWeight: 500,
                  fontFamily: "var(--heading-font)",
                  textTransform: "none",
                  letterSpacing: "0.02em",
                  textAlign: lang === "ar" ? "right" : "left",
                  "&:hover": {
                    color: "primary.main",
                    transform: lang === "ar" ? "translateX(-6px)" : "translateX(6px)"
                  },
                  transition: "transform 0.3s ease, color 0.3s ease"
                }}
              >
                {lang === "ar" ? "اتصل بنا" : "Contact"}
              </Button>
              <Typography sx={{ color: "rgba(255,255,255,0.42)", fontSize: { xs: 11, sm: 12.5 }, fontFamily: '"Cairo", sans-serif', letterSpacing: "0.05em" }}>
                {lang === "ar" ? "تواصل مع مستشارنا الخاص" : "Connect with our private concierge"}
              </Typography>
            </Stack>
          </Stack>
          
          {/* Bottom Overlay Info */}
          <Typography sx={{ color: "rgba(255,255,255,.36)", fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", textAlign: "center", fontFamily: '"Cairo", sans-serif' }}>
            {t("On Boulevard. For the world.")}
          </Typography>
        </Stack>
      </Drawer>
    </>
  );
}

function SectionRenderer({ 
  section, 
  t, 
  lang,
  brands
}: { 
  section: Section; 
  t: (s?: string) => string; 
  lang: "ar" | "en"; 
  brands?: any[];
}) {
  const type = section.type || (section._type && section._type.replace("Section", ""));
  
  if (type === "hero") return <HeroSection section={section} t={t} lang={lang} />;
  if (type === "brandMarquee") return <BrandMarquee section={section} lang={lang} brands={brands} />;
  if (type === "manifesto") return <ManifestoSection section={section} t={t} lang={lang} />;
  if (type === "collections") return <CollectionsSection section={section} t={t} lang={lang} />;
  // if (type === "lookbook") return <LookbookSection section={section} t={t} lang={lang} brands={brands} />;
  if (type === "boulevard" || type === "boulevard-selection" || type === "boulevardSelection") return <BoulevardSelectionSection section={section} t={t} lang={lang} />;
  if (type === "carousel") return <CarouselSection section={section} t={t} lang={lang} />;
  if (type === "editorial") return <EditorialSection section={section} t={t} lang={lang} />;
  // if (type === "atelierShowcase" || type === "atelierShowcaseSection") return <AtelierShowcaseSection section={section} t={t} lang={lang} />;
  return null;
}

export default function Storefront({ 
  settings, 
  sections,
  brands,
  initialLang
}: { 
  settings: SiteSettings; 
  sections: Section[];
  brands?: any[];
  initialLang: "ar" | "en";
}) {
  const params = useParams();
  const router = useRouter();
  const pathname = usePathname();
  
  const [lang, setLang] = useState<"ar" | "en">(initialLang);
  const [isLangTransitioning, setIsLangTransitioning] = useState(false);
  const [contactSectionData, setContactSectionData] = useState<any>(null);

  useEffect(() => {
    if (pathname) {
      const nextLang = (pathname.endsWith("/ar") || pathname.includes("/ar/") ? "ar" : "en") as "ar" | "en";
      setLang(nextLang);
    }
  }, [pathname]);

  useEffect(() => {
    setIsLangTransitioning(false);
  }, [lang]);

  useEffect(() => {
    getContactPageData()
      .then((data) => {
        if (data) setContactSectionData(data);
      })
      .catch((err) => console.error("Failed to load homepage contact section:", err));
  }, []);

  const { setLoading } = useLoader();

  const handleLangToggle = () => {
    if (isLangTransitioning) return;

    const nextLang = lang === "ar" ? "en" : "ar";
    setLoading(true, false, nextLang);
    setIsLangTransitioning(true);
    setTimeout(() => {
      router.push(`/${nextLang}`);
    }, 180);
  };

  // Translation function using the mapping list
  const t = (str?: string) => {
    if (!str) return "";
    if (lang === "en") return str;
    return stringMap[str.trim()] || str;
  };

  // Sync browser language and direction dynamically
  useEffect(() => {
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = lang;
  }, [lang]);

  const theme = useMemo(() => createTheme({
    palette: {
      mode: "dark",
      primary: { main: settings.primaryColor || "#CB6116", dark: "#9D430C" },
      secondary: { main: settings.accentColor || "#D06010" }
    },
    typography: {
      fontFamily: `var(--font-cairo), "Cairo", sans-serif`, // Strictly Cairo for body and UI layout as mentioned in PDF settings
      button: { fontWeight: 800 }
    },
    shape: { borderRadius: 0 }
  }), [settings.accentColor, settings.primaryColor]);

  return (
    <ThemeProvider theme={theme}>
      <Box 
        dir={lang === "ar" ? "rtl" : "ltr"} 
        sx={{ 
          bgcolor: "var(--fg-white)", 
          color: "#111", 
          minHeight: "100vh"
        }}
      >
        <Box>
          {sections.map((section, index) => {
            if (!section || section.enabled === false) return null;
            const type = section.type || (section._type && section._type.replace("Section", ""));
            return (
              <Box key={section._id || `${type}-${index}`}>
                <SectionRenderer 
                  section={section} 
                  t={t} 
                  lang={lang} 
                  brands={brands}
                />
              </Box>
            );
          })}
          <ContactDetailsFormSection lang={lang} data={contactSectionData} withOuterSpacing />
        </Box>
      </Box>
    </ThemeProvider>
  );
}
