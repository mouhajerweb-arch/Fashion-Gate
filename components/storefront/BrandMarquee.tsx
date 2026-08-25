"use client";

import { Box, Container, Typography } from "@mui/material";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useMemo } from "react";
import { getLocalizedValue, imageUrl } from "@/lib/sanity";
import { getAllBrands, getBrandById } from "@/lib/brandData";

const brandsList = [
  { 
    id: "elie-saab", 
    logo: (
      <svg viewBox="0 0 120 30" fill="currentColor">
        <text x="50%" y="22" fontFamily="'Helvetica Neue', Arial, sans-serif" fontSize="15" fontWeight="bold" letterSpacing="0.25em" textAnchor="middle">ELIE SAAB</text>
      </svg>
    )
  },
  { 
    id: "prada", 
    logo: (
      <svg viewBox="0 0 120 30" fill="currentColor">
        <text x="50%" y="22" fontFamily="'Didot', Bodoni, serif" fontSize="19" fontWeight="bold" letterSpacing="0.2em" textAnchor="middle">PRADA</text>
      </svg>
    )
  },
  { 
    id: "gucci", 
    logo: (
      <svg viewBox="0 0 120 30" fill="currentColor">
        <text x="50%" y="22" fontFamily="'Times New Roman', Times, serif" fontSize="19" fontWeight="bold" letterSpacing="0.22em" textAnchor="middle">GUCCI</text>
      </svg>
    )
  },
  { 
    id: "ysl", 
    logo: (
      <svg viewBox="0 0 140 30" fill="currentColor">
        <text x="50%" y="22" fontFamily="'Helvetica Neue', 'Arial', sans-serif" fontSize="15" fontWeight="bold" letterSpacing="0.28em" textAnchor="middle">SAINT LAURENT</text>
      </svg>
    )
  },
  { 
    id: "adidas", 
    logo: (
      <svg viewBox="0 0 120 30" fill="currentColor">
        <text x="50%" y="22" fontFamily="'Futura', 'Arial', sans-serif" fontSize="20" fontWeight="bold" letterSpacing="0.18em" textAnchor="middle">ADIDAS</text>
      </svg>
    )
  },
  { 
    id: "calvin-klein", 
    logo: (
      <svg viewBox="0 0 140 30" fill="currentColor">
        <text x="50%" y="22" fontFamily="'Helvetica Neue', 'Arial', sans-serif" fontSize="16" fontWeight="bold" letterSpacing="0.12em" textAnchor="middle">Calvin Klein</text>
      </svg>
    )
  },
  { 
    id: "skechers", 
    logo: (
      <svg viewBox="0 0 120 30" fill="currentColor">
        <text x="50%" y="22" fontFamily="'Futura', sans-serif" fontSize="18" fontWeight="900" letterSpacing="0.08em" textAnchor="middle">Skechers</text>
      </svg>
    )
  },
  { 
    id: "maxmara", 
    logo: (
      <svg viewBox="0 0 160 30" fill="currentColor">
        <text x="50%" y="22" fontFamily="'Times New Roman', Times, serif" fontSize="20" fontWeight="bold" letterSpacing="0.08em" textAnchor="middle">Max Mara</text>
      </svg>
    )
  },
  { 
    id: "editorial", 
    logo: (
      <svg viewBox="0 0 120 30" fill="currentColor">
        <text x="50%" y="22" fontFamily="'Didot', Bodoni, serif" fontSize="18" fontWeight="bold" letterSpacing="0.12em" textAnchor="middle">Editorial</text>
      </svg>
    )
  },
  { 
    id: "paul-shark", 
    logo: (
      <svg viewBox="0 0 160 30" fill="currentColor">
        <text x="50%" y="22" fontFamily="'Futura', sans-serif" fontSize="15" fontWeight="900" letterSpacing="0.08em" textAnchor="middle">Paul & Shark</text>
      </svg>
    )
  },
  { 
    id: "sandro", 
    logo: (
      <svg viewBox="0 0 120 30" fill="currentColor">
        <text x="50%" y="22" fontFamily="'Helvetica Neue', 'Arial', sans-serif" fontSize="18" fontWeight="bold" letterSpacing="0.08em" textAnchor="middle">Sandro</text>
      </svg>
    )
  },
  { 
    id: "moje", 
    logo: (
      <svg viewBox="0 0 100 30" fill="currentColor">
        <text x="50%" y="22" fontFamily="'Didot', 'Times New Roman', serif" fontSize="21" fontStyle="italic" fontWeight="bold" letterSpacing="0.06em" textAnchor="middle">Moje</text>
      </svg>
    )
  },
  { 
    id: "hugo-boss", 
    logo: (
      <svg viewBox="0 0 120 30" fill="currentColor">
        <text x="50%" y="22" fontFamily="'Helvetica Neue', Arial, sans-serif" fontSize="17" fontWeight="bold" letterSpacing="0.2em" textAnchor="middle">BOSS</text>
      </svg>
    )
  },
  { 
    id: "giorgio-armani", 
    logo: (
      <svg viewBox="0 0 140 30" fill="currentColor">
        <text x="50%" y="22" fontFamily="'Didot', Bodoni, serif" fontSize="14" fontWeight="bold" letterSpacing="0.22em" textAnchor="middle">GIORGIO ARMANI</text>
      </svg>
    )
  },
  { 
    id: "lancome", 
    logo: (
      <svg viewBox="0 0 120 30" fill="currentColor">
        <text x="50%" y="22" fontFamily="'Times New Roman', serif" fontSize="18" fontWeight="normal" letterSpacing="0.24em" textAnchor="middle">LANCÔME</text>
      </svg>
    )
  },
  { 
    id: "cartier", 
    logo: (
      <svg viewBox="0 0 100 30" fill="currentColor">
        <text x="50%" y="22" fontFamily="'Didot', Bodoni, serif" fontSize="18" fontStyle="italic" fontWeight="bold" letterSpacing="0.1em" textAnchor="middle">Cartier</text>
      </svg>
    )
  },
  { 
    id: "jimmy-choo", 
    logo: (
      <svg viewBox="0 0 140 30" fill="currentColor">
        <text x="50%" y="22" fontFamily="'Times New Roman', serif" fontSize="16" fontWeight="bold" letterSpacing="0.2em" textAnchor="middle">JIMMY CHOO</text>
      </svg>
    )
  },
  { 
    id: "coach", 
    logo: (
      <svg viewBox="0 0 100 30" fill="currentColor">
        <text x="50%" y="22" fontFamily="'Times New Roman', serif" fontSize="21" fontWeight="bold" letterSpacing="0.15em" textAnchor="middle">COACH</text>
      </svg>
    )
  },
  { 
    id: "valentino", 
    logo: (
      <svg viewBox="0 0 120 30" fill="currentColor">
        <text x="50%" y="22" fontFamily="'Times New Roman', serif" fontSize="21" fontWeight="bold" letterSpacing="0.18em" textAnchor="middle">VALENTINO</text>
      </svg>
    )
  },
  { 
    id: "chloe", 
    logo: (
      <svg viewBox="0 0 100 30" fill="currentColor">
        <text x="50%" y="22" fontFamily="'Century Gothic', sans-serif" fontSize="19" fontWeight="bold" letterSpacing="0.15em" textAnchor="middle">Chloé</text>
      </svg>
    )
  },
  {
    id: "loreal",
    logo: (
      <svg viewBox="0 0 120 30" fill="currentColor">
        <text x="50%" y="22" fontFamily="'Helvetica Neue', Arial, sans-serif" fontSize="18" fontWeight="500" letterSpacing="0.08em" textAnchor="middle">Loreal</text>
      </svg>
    )
  },
  {
    id: "atelier-rebul",
    logo: (
      <svg viewBox="0 0 160 30" fill="currentColor">
        <text x="50%" y="22" fontFamily="'Times New Roman', serif" fontSize="15" fontWeight="bold" letterSpacing="0.16em" textAnchor="middle">ATELIER REBUL</text>
      </svg>
    )
  },
  {
    id: "nean-com",
    logo: (
      <svg viewBox="0 0 120 30" fill="currentColor">
        <text x="50%" y="22" fontFamily="'Helvetica Neue', Arial, sans-serif" fontSize="18" fontWeight="500" letterSpacing="0.08em" textAnchor="middle">NEAN.COM</text>
      </svg>
    )
  },
  {
    id: "acler",
    logo: (
      <svg viewBox="0 0 100 30" fill="currentColor">
        <text x="50%" y="22" fontFamily="'Helvetica Neue', Arial, sans-serif" fontSize="22" fontWeight="500" letterSpacing="0.02em" textAnchor="middle">Acler</text>
      </svg>
    )
  },
  {
    id: "weekend-maxmara",
    logo: (
      <svg viewBox="0 0 170 30" fill="currentColor">
        <text x="50%" y="22" fontFamily="'Times New Roman', serif" fontSize="15" fontWeight="bold" letterSpacing="0.12em" textAnchor="middle">WEEKEND MAX MARA</text>
      </svg>
    )
  },
  {
    id: "persona-marina-rinaldi",
    logo: (
      <svg viewBox="0 0 180 30" fill="currentColor">
        <text x="50%" y="22" fontFamily="'Helvetica Neue', Arial, sans-serif" fontSize="13" fontWeight="600" letterSpacing="0.12em" textAnchor="middle">PERSONA</text>
      </svg>
    )
  },
  {
    id: "max-and-co",
    logo: (
      <svg viewBox="0 0 120 30" fill="currentColor">
        <text x="50%" y="22" fontFamily="'Helvetica Neue', Arial, sans-serif" fontSize="20" fontWeight="600" letterSpacing="0.08em" textAnchor="middle">MAX&CO</text>
      </svg>
    )
  },
  {
    id: "puma",
    logo: (
      <svg viewBox="0 0 100 30" fill="currentColor">
        <text x="50%" y="22" fontFamily="'Helvetica Neue', Arial, sans-serif" fontSize="22" fontWeight="800" letterSpacing="0.08em" textAnchor="middle">Puma</text>
      </svg>
    )
  },
  {
    id: "emporio-armani-ea7",
    logo: (
      <svg viewBox="0 0 160 30" fill="currentColor">
        <text x="50%" y="22" fontFamily="'Times New Roman', serif" fontSize="14" fontWeight="600" letterSpacing="0.12em" textAnchor="middle">EMPORIO ARMANI EA7</text>
      </svg>
    )
  },
  {
    id: "almais",
    logo: (
      <svg viewBox="0 0 110 30" fill="currentColor">
        <text x="50%" y="22" fontFamily="'Times New Roman', serif" fontSize="20" fontWeight="600" letterSpacing="0.16em" textAnchor="middle">ALMAIS</text>
      </svg>
    )
  }
];

export default function BrandMarquee({
  section,
  brands,
  lang: propLang
}: {
  section?: any;
  brands?: any[];
  lang?: "ar" | "en";
}) {
  const pathname = usePathname();
  const lang = propLang || ((pathname?.endsWith("/ar") || pathname?.includes("/ar/") ? "ar" : "en") as "ar" | "en");

  const unifiedBrands = useMemo(() => {
    const sourceBrands = (() => {
      const configured = Array.isArray(section?.brands) ? section.brands : [];
      const globalBrands = Array.isArray(brands) ? brands : [];
      const localFallback = getAllBrands().map((brand) => ({
        id: brand.id,
        title: brand.name,
        titleAr: brand.nameAr,
        slug: { current: brand.id },
        headline: { en: brand.headline, ar: brand.headlineAr },
        description: { en: brand.description, ar: brand.descriptionAr },
        bgImage: { asset: { url: brand.backdropUrl } },
        isActive: brand.isActive,
      }));

      const merged: any[] = [];
      const seen = new Set<string>();
      const disabled = new Set<string>();

      [...configured, ...globalBrands].forEach((brand) => {
        const slug = brand?.slug?.current || brand?.id || brand?._id;
        if (slug && brand?.isActive === false) {
          disabled.add(slug);
        }
      });

      const fallbackBrands = configured.length === 0 && globalBrands.length === 0 ? localFallback : [];

      [...configured, ...globalBrands, ...fallbackBrands].forEach((brand) => {
        const slug = brand?.slug?.current || brand?.id || brand?._id;
        if (!slug || seen.has(slug) || disabled.has(slug) || brand?.isActive === false) return;
        seen.add(slug);
        merged.push(brand);
      });

      return merged;
    })();

    if (sourceBrands.length) {
      return sourceBrands.map((b: any, index: number) => {
        const slugStr = b.slug?.current || b.id || "";
        const staticMatch = brandsList.find(s => s.id === slugStr);
        const local = getBrandById(slugStr);
        const localizedTitle = (lang === "ar" && b.titleAr) ? b.titleAr : b.title;

        let brandLogoNode: React.ReactNode = null;

        // Force to use default/English image (remove Arabic logo)
        const logoImage = b.image;
        if (logoImage) {
          try {
            const url = logoImage.asset?.url || imageUrl(logoImage).width(600).quality(100).url();

            if (url) {
              brandLogoNode = (
                <Box 
                  component="img" 
                  src={url} 
                  alt={localizedTitle} 
                  sx={{ 
                    height: "100% !important", 
                    width: "auto !important", 
                    objectFit: "contain",
                    opacity: 0.8,
                    mixBlendMode: "multiply",
                    transform: "scale(1.0) translateZ(0)",
                    transformOrigin: "center center",
                    transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
                    willChange: "transform, opacity",
                    "&:hover": {
                      opacity: 1,
                      transform: "scale(1.05) translateZ(0)"
                    }
                  }} 
                />
              );
            }
          } catch (e) {
            console.error("Failed to build brand logo image url in marquee:", e);
          }
        }

        return {
          id: slugStr || `brand-${index}`,
          title: localizedTitle || (lang === "ar" ? local?.nameAr : local?.name) || slugStr,
          size: b.size,
          scale: b.scale,
          logo: brandLogoNode || (staticMatch ? (
            staticMatch.logo
          ) : (
            <Typography sx={{ fontFamily: "var(--heading-font)", fontSize: 18, fontWeight: "bold", letterSpacing: "0.04em", textTransform: "none", whiteSpace: "nowrap" }}>
              {localizedTitle || (lang === "ar" ? local?.nameAr : local?.name) || slugStr}
            </Typography>
          ))
        };
      });
    }
    
    // Fallback: use static brandsList directly (do not construct Arabic SVG logos)
    return brandsList.map(item => {
      const local = getBrandById(item.id);
      const title = local ? (lang === "ar" ? local.nameAr : local.name) : item.id;
      return {
        id: item.id,
        title: title,
        size: (local as any)?.size || "medium",
        scale: (local as any)?.scale,
        logo: item.logo
      };
    });
  }, [section?.brands, brands, lang]);

  // Double/Triple the array to make the infinite loop seamless
  const scrollingItems = [...unifiedBrands, ...unifiedBrands, ...unifiedBrands];

  const fallbackT = {
    en: {
      eyebrow: "Refined Ateliers",
      title: "Joined Luxury Houses",
      desc: "Fashion Gate is proud to partner with the world's most prestigious design houses, bringing exclusive seasonal edits directly to Damascus."
    },
    ar: {
      eyebrow: "دور التصميم الراقية",
      title: "دور الفخامة المنضمة",
      desc: "تفخر بوابة الأزياء بالشراكة مع أرقى دور التصميم في العالم، حيث تقدم مجموعات حصرية مباشرة لدمشق."
    }
  }[lang];

  const t = {
    eyebrow: getLocalizedValue(section?.eyebrow, lang, fallbackT.eyebrow),
    title: getLocalizedValue(section?.headline, lang, fallbackT.title),
    desc: getLocalizedValue(section?.description, lang, fallbackT.desc)
  };

  return (
    <Box 
      component="section" 
      sx={{ 
        bgcolor: "#ffffff", 
        py: { xs: 12, md: 16 },
        borderTop: "1px solid rgba(0,0,0,0.06)",
        borderBottom: "1px solid rgba(0,0,0,0.06)",
        width: "100%",
        overflow: "hidden"
      }}
    >
      <Container maxWidth="xl">
        {/* Elegant Split Editorial Header */}
        <Box 
          sx={{ 
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "5fr 7fr" },
            gap: { xs: 4, md: 8 },
            alignItems: "center",
            textAlign: lang === "ar" ? "right" : "left",
            mb: { xs: 8, md: 10 },
            pb: 5,
            borderBottom: "1px solid rgba(0,0,0,0.05)"
          }}
        >
          {/* Left Column: Eyebrow + Title */}
          <Box>
            <Box sx={{ width: 40, height: 1, bgcolor: "primary.main", mb: 2, display: "block" }} />
            <Typography sx={{ color: "primary.main", textTransform: "uppercase", fontSize: 10, fontWeight: 800, letterSpacing: lang === "ar" ? 0 : "0.15em", mb: 1.5, fontFamily: '"Cairo", sans-serif' }}>
              {t.eyebrow}
            </Typography>
            <Typography sx={{ fontFamily: "var(--heading-font)", fontSize: { xs: 32, md: 44 }, fontWeight: 400, lineHeight:lang === "ar" ?  1.3 : 1.15, color: "#111111" }}>
              {t.title}
            </Typography>
          </Box>

          {/* Right Column: Editorial Paragraph */}
          <Box 
            sx={{ 
              borderLeft: lang === "ar" ? "none" : { md: "1px solid rgba(0,0,0,0.08)" },
              borderRight: lang === "ar" ? { md: "1px solid rgba(0,0,0,0.08)" } : "none",
              pl: lang === "ar" ? 0 : { md: 6 },
              pr: lang === "ar" ? { md: 6 } : 0,
              py: 1
            }}
          >
            <Typography sx={{ color: "rgba(0,0,0,0.55)", fontSize: { xs: 15, md: 17 }, lineHeight: 1.8, fontFamily: '"Cairo", sans-serif', fontWeight: 300 }}>
              {t.desc}
            </Typography>
          </Box>
        </Box>
      </Container>

      {/* CSS-based Hardware Accelerated Scrolling Marquee Container */}
      <Box 
        dir="ltr"
        sx={{ 
          width: "100%",
          overflow: "hidden",
          position: "relative",
          py: 3.5,
          bgcolor: "#ffffff",
          "&::before, &::after": {
            content: '""',
            position: "absolute",
            top: 0,
            bottom: 0,
            width: { xs: 40, md: 100 },
            zIndex: 2,
            pointerEvents: "none"
          },
          "&::before": {
            left: 0,
            background: "linear-gradient(to right, #ffffff, transparent)"
          },
          "&::after": {
            right: 0,
            background: "linear-gradient(to left, #ffffff, transparent)"
          }
        }}
      >
        {/* The scrolling track */}
        <Box 
          sx={{ 
            display: "flex",
            width: "max-content",
            alignItems: "center",
            gap: { xs: 16, md: 25 },
            animation: "scrollMarquee 150s linear infinite",
            "&:hover": {
              animationPlayState: "paused" // Pauses scroll on hover
            },
            "@keyframes scrollMarquee": {
              "0%": { transform: "translateX(0)" },
              "100%": { transform: "translateX(-33.333%)" } // Seamless jump point
            }
          }}
        >
          {scrollingItems.map((item: any, index: number) => {
            const finalScale = item.scale !== undefined && item.scale !== null ? Number(item.scale) : 3.0;
            const finalY = 0;
            const scaleDifference = Math.max(0, finalScale - 3.0);
            const extraSpace = scaleDifference * 24; // 24px extra spacing per unit scale increase above 3.0

            return (
              <Link
                key={`${item.id}-${index}`}
                href={`/brand/${item.id}/${lang}`}
                style={{ textDecoration: "none", display: "inline-block" }}
              >
                <Box
                  sx={{
                    height: { xs: 50, md: 54 },
                    maxWidth: { xs: 110, md: 170 },
                    width: "auto",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#222222",
                    opacity: 0.75,
                    cursor: "pointer",
                    transition: "all 0.35s ease",
                    mx: extraSpace > 0 ? { xs: `${extraSpace * 0.6}px`, md: `${extraSpace}px` } : 0,
                    "& svg": {
                      height: "100% !important",
                      width: "auto !important",
                      maxHeight: "100%",
                      maxWidth: "100%",
                      transform: `scale(${finalScale}) translateY(${finalY}px) translateZ(0)`,
                      transformOrigin: "center center",
                      transition: "transform 0.3s ease"
                    },
                    "& img": {
                      height: "100% !important",
                      width: "auto !important",
                      maxHeight: "100%",
                      maxWidth: "100%",
                      objectFit: "contain",
                      transform: `scale(${finalScale}) translateY(${finalY}px) translateZ(0)`,
                      transformOrigin: "center center",
                      transition: "transform 0.3s ease"
                    },
                    "&:hover": {
                      color: "#000000",
                      opacity: 1,
                      "& svg, & img": {
                        transform: `scale(${finalScale * 1.1}) translateY(${finalY}px) translateZ(0)`
                      }
                    }
                  }}
                >
                  {item.logo}
                </Box>
              </Link>
            );
          })}
        </Box>
      </Box>
    </Box>
  );
}
