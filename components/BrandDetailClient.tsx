"use client";

import { useEffect, useMemo, useState } from "react";
import { Box, Button, Typography, ThemeProvider, createTheme } from "@mui/material";
import { useRouter } from "next/navigation";
import Link from "next/link";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

import { Brand } from "@/lib/brandData";


const brandVectorLogos: Record<string, React.ReactNode> = {
  adidas: (
    <svg width="220" height="50" viewBox="0 0 120 30" fill="currentColor">
      <text x="50%" y="22" fontFamily="'Futura', 'Helvetica Neue', 'Arial', sans-serif" fontSize="20" fontWeight="bold" letterSpacing="0.1em" textAnchor="middle">adidas</text>
    </svg>
  ),
  "calvin-klein": (
    <svg width="280" height="50" viewBox="0 0 140 30" fill="currentColor">
      <text x="50%" y="22" fontFamily="'Futura', 'Helvetica Neue', 'Arial', sans-serif" fontSize="17" fontWeight="bold" letterSpacing="0.12em" textAnchor="middle">Calvin Klein</text>
    </svg>
  ),
  skechers: (
    <svg width="260" height="50" viewBox="0 0 140 30" fill="currentColor">
      <text x="50%" y="22" fontFamily="'Arial Black', sans-serif" fontSize="18" fontWeight="900" letterSpacing="0.08em" textAnchor="middle">Skechers</text>
    </svg>
  ),
  "paul-shark": (
    <svg width="340" height="50" viewBox="0 0 160 30" fill="currentColor">
      <text x="50%" y="22" fontFamily="'Futura', 'Arial Black', sans-serif" fontSize="16" fontWeight="900" letterSpacing="0.08em" textAnchor="middle">Paul & Shark</text>
    </svg>
  ),
  maxmara: (
    <svg width="260" height="50" viewBox="0 0 120 30" fill="currentColor">
      <text x="50%" y="22" fontFamily="'Granjon', 'Garamond', serif" fontSize="21" fontWeight="bold" letterSpacing="0.08em" textAnchor="middle">Max Mara</text>
    </svg>
  ),
  editorial: (
    <svg width="260" height="50" viewBox="0 0 120 30" fill="currentColor">
      <text x="50%" y="22" fontFamily='"Apple Garamond", "EB Garamond", "Cormorant Garamond", serif"' fontSize="18" fontWeight="bold" letterSpacing="0.12em" textAnchor="middle">Editorial</text>
    </svg>
  ),
  sandro: (
    <svg width="240" height="50" viewBox="0 0 120 30" fill="currentColor">
      <text x="50%" y="22" fontFamily="'Futura', 'Helvetica Neue', 'Arial', sans-serif" fontSize="20" fontWeight="bold" letterSpacing="0.08em" textAnchor="middle">Sandro</text>
    </svg>
  ),
  moje: (
    <svg width="180" height="50" viewBox="0 0 100 30" fill="currentColor">
      <text x="50%" y="22" fontFamily="'Didot', 'Times New Roman', serif" fontSize="21" fontStyle="italic" fontWeight="bold" letterSpacing="0.06em" textAnchor="middle">Moje</text>
    </svg>
  )
};

export default function BrandDetailClient({
  brand,
  initialLang,
  settings
}: { 
  brand: any; 
  initialLang: "ar" | "en";
  settings?: { primaryColor?: string; accentColor?: string };
}) {
  const router = useRouter();
  const [lang, setLang] = useState<"en" | "ar">(initialLang);

  const theme = useMemo(() => createTheme({
    palette: {
      mode: "dark",
      primary: { main: settings?.primaryColor || "#CB6116", dark: "#9D430C" },
      secondary: { main: settings?.accentColor || "#D06010" }
    },
    typography: {
      fontFamily: `"Cairo", sans-serif`,
      button: { fontWeight: 800 }
    },
    shape: { borderRadius: 0 }
  }), [settings?.primaryColor, settings?.accentColor]);

  // Scroll to top on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      window.scrollTo(0, 0);
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    }, 50);
    return () => clearTimeout(timer);
  }, []);

  const handleLangToggle = () => {
    const nextLang = lang === "ar" ? "en" : "ar";
    setLang(nextLang);
    router.replace(`/brand/${brand.id}/${nextLang}`);
  };

  const bgUrl = brand.bgImage?.asset?.url || brand.backdropUrl || "/assets/headerbg.png";
  const headlineText = (typeof brand.headline === "object" ? brand.headline?.[lang] : brand.headline) || "";
  const descriptionText = (typeof brand.description === "object" ? brand.description?.[lang] : brand.description) || "";
  const logoUrl = brand.image?.asset?.url;
  const buttonText = (typeof brand.buttonText === "object" ? brand.buttonText?.[lang] : brand.buttonText) || "";
  const buttonLink = brand.buttonLink || "";

  return (
    <ThemeProvider theme={theme}>
      <Box 
        dir={lang === "ar" ? "rtl" : "ltr"}
        sx={{ 
          bgcolor: "#050505", 
          color: "#ffffff", 
          minHeight: "100vh", 
          display: "flex", 
          flexDirection: "column" 
        }}
      >

        
        {/* Immersive Brand Hero Container */}
        <Box 
          sx={{ 
            flexGrow: 1, 
            minHeight: { xs: "calc(100vh - 102px)", md: "calc(100vh - 102px)" },
            position: "relative",
            display: { xs: "block", md: "flex" }, // Block on mobile, flex on desktop
            flexDirection: { md: "row" },
            overflow: "hidden"
          }}
        >
          {/* Brand Background Image Box (Left-aligned on desktop, relative with clipPath on mobile for parallax) */}
          <Box
            sx={{
              position: { xs: "relative", md: "absolute" },
              top: 0,
              left: 0,
              bottom: { xs: "auto", md: 0 },
              width: { xs: "100%", md: "calc(100% - 460px)", lg: "calc(100% - 540px)" },
              height: { xs: "40vh", md: "100%" },
              clipPath: "inset(0)", // Clips the fixed child to this box boundary
              zIndex: 0
            }}
          >
            <Box
              sx={{
                position: "fixed",
                top: 0,
                left: 0,
                width: { xs: "100%", md: "calc(100% - 460px)", lg: "calc(100% - 540px)" },
                height: "100%",
                backgroundImage: `url('${bgUrl}')`,
                backgroundSize: "cover",
                backgroundPosition: "center 25%",
                zIndex: 0
              }}
            />
            {/* Dark wash overlay over the image - fixed to stay aligned with the image */}
            <Box 
              sx={{
                position: "fixed",
                top: 0,
                left: 0,
                width: { xs: "100%", md: "calc(100% - 460px)", lg: "calc(100% - 540px)" },
                height: "100%",
                background: "linear-gradient(to top, rgba(5,5,5,0.85) 0%, rgba(5,5,5,0.2) 60%, rgba(5,5,5,0.05) 100%)",
                zIndex: 1
              }}
            />
          </Box>

          {/* Absolute positioned Back Button floating on the left side of the page */}
          <Box 
            sx={{ 
              position: "absolute", 
              top: 32, 
              left: 32,
              right: "auto",
              zIndex: 10 
            }}
          >
            <Button
              component={Link}
              href={`/${lang}`}
              sx={{
                color: "#ffffff",
                border: "1px solid rgba(255,255,255,0.28)",
                borderRadius: 0, // Rectangular normal mode
                px: 3.5,
                py: 1.4,
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                fontFamily: '"Cairo", sans-serif',
                bgcolor: "rgba(5,5,5,0.65)",
                display: "flex",
                alignItems: "center",
                gap: "12px", // Elegant gap between icon and text
                transition: "all 0.3s ease",
                "&:hover": {
                  border: "1px solid #ffffff",
                  bgcolor: "#ffffff",
                  color: "#050505",
                  transform: "translateY(-2px)"
                }
              }}
            >
              {lang === "en" ? (
                <>
                  <ArrowBackIcon sx={{ fontSize: 14 }} />
                  <span>Home</span>
                </>
              ) : (
                <>
                  <span>الرئيسية</span>
                  <ArrowBackIcon sx={{ transform: "scaleX(-1)", fontSize: 14 }} />
                </>
              )}
            </Button>
          </Box>

          {/* Solid Side Panel: Right-aligned on desktop, flows over image when scrolling on mobile */}
          <Box 
            sx={{ 
              position: { xs: "relative", md: "absolute" },
              top: 0,
              bottom: 0,
              right: 0,
              left: "auto",
              width: { xs: "100%", md: "460px", lg: "540px" },
              bgcolor: "#090909",
              borderLeft: { xs: "none", md: "1px solid rgba(255, 255, 255, 0.08)" },
              borderTop: { xs: "1px solid rgba(255, 255, 255, 0.08)", md: "none" },
              p: { xs: 4, sm: 6, md: 8 },
              pt: { xs: 6, sm: 8, md: 8 },
              textAlign: lang === "ar" ? "right" : "left",
              alignItems: "flex-start", // Start is Right in RTL, Left in LTR
              height: { xs: "auto", md: "100%" },
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              zIndex: 2, 
              boxShadow: { xs: "0 -20px 40px rgba(0,0,0,0.6)", md: "none" }
            }}
          >
            {/* Eyebrow tag */}
            <Typography
              sx={{
                color: "primary.main",
                fontSize: 11,
                fontWeight: 750,
                letterSpacing: "0.25em",
                textTransform: "uppercase",
                mb: 2,
                fontFamily: '"Cairo", sans-serif'
              }}
            >
              {lang === "ar" ? "شريك فاشن غيت" : "FASHION GATE PARTNER"}
            </Typography>

            {/* Brand Logo (Bigger Size, Inverted white, Aligned to Start based on text direction) */}
            <Box 
              sx={{ 
                color: "#ffffff", 
                mb: 0, 
                display: "flex", 
                justifyContent: "flex-start", // Start is Right in RTL, Left in LTR
                width: "100%"
              }}
            >
              {logoUrl ? (
                <Box 
                  component="img" 
                  src={logoUrl} 
                  alt={(lang === "ar" && brand.titleAr) ? brand.titleAr : brand.title} 
                  sx={{ 
                    height: { xs: 140, md: 140 }, 
                    width: "auto", 
                    objectFit: "contain",
                    filter: "invert(1)",
                    mixBlendMode: "screen"
                  }} 
                />
              ) : (
                brandVectorLogos[brand.id] || (
                  <Typography sx={{ fontFamily: "var(--heading-font)", fontSize: { xs: 28, md: 36 }, fontWeight: 600, letterSpacing: "0.2em", textTransform: "uppercase" }}>
                    {lang === "ar" ? brand.titleAr || brand.nameAr || brand.title : brand.title || brand.name}
                  </Typography>
                )
              )}
            </Box>

            {/* Headline */}
            <Typography 
              sx={{ 
                fontFamily: "var(--heading-font)", 
                fontSize: { xs: "1.8rem", sm: "2.2rem", md: "2.8rem" }, 
                fontWeight: 500, 
                lineHeight: 1.25, 
                mb: 3,
                color: "#ffffff",
                letterSpacing: "0.02em"
              }}
            >
              {headlineText}
            </Typography>

            {/* Accent divider line */}
            <Box sx={{ width: 50, height: 1.5, bgcolor: "primary.main", mb: 3.5 }} />

            {/* Description */}
            <Typography 
              sx={{ 
                color: "rgba(255,255,255,0.76)", 
                fontSize: { xs: 14, md: 15 }, 
                lineHeight: 1.85, 
                fontFamily: '"Cairo", sans-serif',
                fontWeight: 300,
                maxWidth: 460,
                mb: buttonText && buttonLink ? 4 : 0
              }}
            >
              {descriptionText}
            </Typography>

            {/* Custom CTA Button */}
            {/* {buttonText && buttonLink && (
              <Button
                component={Link}
                href={buttonLink}
                sx={{
                  color: "#ffffff",
                  border: "1px solid rgba(255,255,255,0.28)",
                  borderRadius: 0,
                  px: 4,
                  py: 1.5,
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                  fontFamily: '"Cairo", sans-serif',
                  bgcolor: "primary.main",
                  display: "inline-flex",
                  alignItems: "center",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    border: "1px solid #ffffff",
                    bgcolor: "#ffffff",
                    color: "#050505",
                    transform: "translateY(-2px)"
                  }
                }}
              >
                {buttonText}
              </Button>
            )} */}
          </Box>
        </Box>

      </Box>
    </ThemeProvider>
  );
}
