"use client";

import { useEffect, useMemo, useState } from "react";
import { Box, Button, Typography, ThemeProvider, createTheme, Grid, Container, Stack } from "@mui/material";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
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
  const [fullscreenImg, setFullscreenImg] = useState<string | null>(null);

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

  const brandName = lang === "ar" ? (brand.titleAr || brand.title || brand.nameAr || brand.title) : (brand.title || brand.name || brand.titleAr);
  
  // Resolve Quote dynamically with custom brand fallbacks
  const quoteText = useMemo(() => {
    const cmsQuote = typeof brand.quote === "object" ? brand.quote?.[lang] : brand.quote;
    if (cmsQuote) return cmsQuote;
    
    const defaultQuotes: Record<string, { en: string; ar: string }> = {
      puma: {
        en: "Forever Faster is our mantra. More than fast, we are brave, confident, determined, and joyful.",
        ar: "الأسرع دائماً هو شعارنا. أكثر من مجرد سرعة، نحن شجعان، واثقون، مصممون، ومبتهجون."
      },
      gucci: {
        en: "Gucci is redefining a wholly modern approach to fashion, celebrating creativity, Italian craftsmanship, and innovation.",
        ar: "تُعيد غوتشي تعريف النهج الحديث كلياً للموضة، محتفيةً بالإبداع، والحرفية الإيطالية، والابتكار."
      },
      adidas: {
        en: "Through sport, we have the power to change lives. We push boundaries and shape the future of athletic culture.",
        ar: "من خلال الرياضة، نمتلك القوة لتغيير الحياة. نحن نتخطى الحدود ونشكل مستقبل الثقافة الرياضية."
      },
      "elie-saab": {
        en: "Magnifying femininity with beautiful craftsmanship, Elie Saab creates dreams of luxury, elegance, and sublime grace.",
        ar: "يعمل إيلي صعب على تعزيز الأنوثة بحرفية رائعة، مبتكراً أحلاماً من الفخامة والأناقة والنعومة السامية."
      },
      "calvin-klein": {
        en: "Calvin Klein is a global lifestyle brand that exemplifies bold, progressive ideals and a seductive, often minimal aesthetic.",
        ar: "كالفن كلاين هي علامة تجارية عالمية لأسلوب الحياة تجسد مُثلاً جريئة وتقدمية وجاذبية جمالية بسيطة."
      }
    };
    
    return defaultQuotes[brand.id]?.[lang] || (
      lang === "ar" 
        ? "احتضان التراث والحرفية لتقديم رقي خالد وفخامة معاصرة."
        : "Embracing heritage and craftsmanship to deliver timeless sophistication and modern luxury."
    );
  }, [brand.id, brand.quote, lang]);

  // Resolve Showcase Portrait (Left) and Landscape (Right, up to 6) Images
  const { portraitImgUrl, landscapeUrls, hasShowcaseImages } = useMemo(() => {
    const sanityPortrait = brand.showcasePortrait?.asset?.url;
    const sanityLandscapes = Array.isArray(brand.showcaseLandscape)
      ? brand.showcaseLandscape.map((img: any) => img?.asset?.url).filter(Boolean)
      : [];
      
    // Use CMS showcase images if either portrait or landscapes exist!
    if (sanityPortrait || sanityLandscapes.length > 0) {
      return {
        portraitImgUrl: sanityPortrait || "",
        landscapeUrls: sanityLandscapes.slice(0, 6),
        hasShowcaseImages: true
      };
    }
    
    // Fallback showcase dataset only for PUMA when no images are uploaded
    if (brand.id === "puma") {
      return {
        portraitImgUrl: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800&auto=format&fit=crop&q=80",
        landscapeUrls: [
          "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop&q=80",
          "https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=600&auto=format&fit=crop&q=80",
          "https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=600&auto=format&fit=crop&q=80",
          "https://images.unsplash.com/photo-1517649763962-0c623066013b?w=600&auto=format&fit=crop&q=80",
          "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&auto=format&fit=crop&q=80",
          "https://images.unsplash.com/photo-1486218119243-13883505764c?w=600&auto=format&fit=crop&q=80"
        ],
        hasShowcaseImages: true
      };
    }
    
    return {
      portraitImgUrl: "",
      landscapeUrls: [],
      hasShowcaseImages: false
    };
  }, [brand.id, brand.showcasePortrait, brand.showcaseLandscape]);


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

        {/* --- BRAND QUOTE SECTION --- */}
        <Box 
          sx={{ 
            bgcolor: "#090909", 
            py: { xs: 8, md: 12 }, 
            px: 4, 
            borderTop: "1px solid rgba(255, 255, 255, 0.05)",
            borderBottom: "1px solid rgba(255, 255, 255, 0.05)",
            textAlign: "center" 
          }}
        >
          <Container maxWidth="md">
            <Typography 
              sx={{ 
                color: "primary.main", 
                fontSize: { xs: "3rem", md: "4.5rem" }, 
                fontFamily: "var(--heading-font)", 
                lineHeight: 0.1,
                mb: 2 
              }}
            >
              “
            </Typography>
            <Typography 
              sx={{ 
                fontFamily: "var(--heading-font)", 
                fontSize: { xs: "1.45rem", md: "2.1rem" }, 
                fontWeight: 300, 
                fontStyle: "italic", 
                lineHeight: 1.6, 
                color: "rgba(255,255,255,0.9)",
                mb: 4
              }}
            >
              {quoteText}
            </Typography>
            <Typography 
              sx={{ 
                fontSize: 12, 
                fontWeight: 700, 
                letterSpacing: "0.2em", 
                textTransform: "uppercase", 
                color: "primary.main",
                fontFamily: '"Cairo", sans-serif'
              }}
            >
              — {brandName}
            </Typography>
          </Container>
        </Box>

        {/* --- BRAND SHOWCASE GALLERY SECTION (Light Mode) --- */}
        {hasShowcaseImages && (
          <Box sx={{ bgcolor: "#ffffff", py: { xs: 10, md: 14 }, px: { xs: 2, sm: 4, md: 8 } }}>
            <Container maxWidth="xl">
              <Stack alignItems="center" spacing={1.5} sx={{ mb: { xs: 6, md: 10 }, textAlign: "center" }}>
                <Typography 
                  sx={{ 
                    color: "primary.main", 
                    fontSize: 10.5, 
                    fontWeight: 800, 
                    letterSpacing: "0.3em", 
                    textTransform: "uppercase",
                    fontFamily: '"Cairo", sans-serif'
                  }}
                >
                  {lang === "ar" ? "معرض المجموعة" : "COLLECTION GALLERY"}
                </Typography>
                <Typography 
                  sx={{ 
                    fontFamily: "var(--heading-font)", 
                    fontSize: { xs: "2rem", md: "3rem" }, 
                    fontWeight: 400, 
                    color: "#050505" 
                  }}
                >
                  {lang === "ar" ? "إبداع وتصميم" : "Craftsmanship & Design"}
                </Typography>
                <Box sx={{ width: 40, height: 1.5, bgcolor: "primary.main", mt: 2 }} />
              </Stack>

              <Grid container spacing={4} alignItems="stretch">
                {/* Left Side: 1 Portrait Image */}
                {portraitImgUrl && (
                  <Grid size={{ xs: 12, md: landscapeUrls.length > 0 ? 4.5 : 12 }}>
                    <Box 
                      sx={{ 
                        position: "relative", 
                        width: "100%", 
                        height: { xs: "450px", sm: "600px", md: "100%" }, 
                        minHeight: { md: "650px" },
                        overflow: "hidden",
                        border: "1px solid rgba(0, 0, 0, 0.08)",
                        cursor: "pointer",
                        "& .hover-overlay": {
                          opacity: 0,
                          transform: "scale(0.85)"
                        },
                        "&:hover .hover-overlay": {
                          opacity: 1,
                          transform: "scale(1)"
                        },
                        "& .gallery-img": {
                          transition: "transform 0.5s ease"
                        },
                        "&:hover .gallery-img": {
                          transform: "scale(1.025)"
                        }
                      }}
                      onClick={() => setFullscreenImg(portraitImgUrl)}
                    >
                      <Image 
                        className="gallery-img"
                        src={portraitImgUrl} 
                        alt={`${brandName} Portrait`}
                        fill
                        sizes="(max-width: 900px) 100vw, 40vw"
                        style={{ objectFit: "cover" }}
                      />
                      {/* Hover Fullscreen Icon in Top-Right */}
                      <Box
                        className="hover-overlay"
                        sx={{
                          position: "absolute",
                          top: 16,
                          right: 16,
                          bgcolor: "rgba(0, 0, 0, 0.65)",
                          color: "#ffffff",
                          borderRadius: "50%",
                          width: 44,
                          height: 44,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
                          zIndex: 2,
                          "&:hover": {
                            bgcolor: "primary.main"
                          }
                        }}
                      >
                        <Box
                          component="svg"
                          viewBox="0 0 24 24"
                          sx={{
                            width: 20,
                            height: 20,
                            color: "#ffffff",
                            fill: "none",
                            stroke: "currentColor",
                            strokeWidth: 2,
                            strokeLinecap: "round",
                            strokeLinejoin: "round"
                          }}
                        >
                          <path d="M3 8V5a2 2 0 0 1 2-2h3" />
                          <path d="M16 3h3a2 2 0 0 1 2 2v3" />
                          <path d="M3 16v3a2 2 0 0 1 2 2h3" />
                          <path d="M16 21h3a2 2 0 0 1 2-2v-3" />
                        </Box>
                      </Box>
                    </Box>
                  </Grid>
                )}

                {/* Right Side: Up to 6 Landscape Images Grid */}
                {landscapeUrls.length > 0 && (
                  <Grid size={{ xs: 12, md: portraitImgUrl ? 7.5 : 12 }}>
                    <Grid container spacing={3}>
                      {landscapeUrls.map((imgUrl: string, i: number) => (
                        <Grid size={{ xs: 12, sm: portraitImgUrl ? 6 : 4 }} key={i}>
                          <Box 
                            sx={{ 
                              position: "relative", 
                              width: "100%", 
                              aspectRatio: "3/2",
                              overflow: "hidden",
                              border: "1px solid rgba(0, 0, 0, 0.08)",
                              cursor: "pointer",
                              "& .hover-overlay": {
                                opacity: 0,
                                transform: "scale(0.85)"
                              },
                              "&:hover .hover-overlay": {
                                opacity: 1,
                                transform: "scale(1)"
                              },
                              "& .gallery-img": {
                                transition: "transform 0.5s ease"
                              },
                              "&:hover .gallery-img": {
                                transform: "scale(1.025)"
                              }
                            }}
                            onClick={() => setFullscreenImg(imgUrl)}
                          >
                            <Image 
                              className="gallery-img"
                              src={imgUrl} 
                              alt={`${brandName} Showcase ${i + 1}`}
                              fill
                              sizes="(max-width: 600px) 100vw, (max-width: 900px) 50vw, 25vw"
                              style={{ objectFit: "cover" }}
                            />
                            {/* Hover Fullscreen Icon in Top-Right */}
                            <Box
                              className="hover-overlay"
                              sx={{
                                position: "absolute",
                                top: 14,
                                right: 14,
                                bgcolor: "rgba(0, 0, 0, 0.65)",
                                color: "#ffffff",
                                borderRadius: "50%",
                                width: 38,
                                height: 38,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
                                zIndex: 2,
                                "&:hover": {
                                  bgcolor: "primary.main"
                                }
                              }}
                            >
                              <Box
                                component="svg"
                                viewBox="0 0 24 24"
                                sx={{
                                  width: 18,
                                  height: 18,
                                  color: "#ffffff",
                                  fill: "none",
                                  stroke: "currentColor",
                                  strokeWidth: 2,
                                  strokeLinecap: "round",
                                  strokeLinejoin: "round"
                                }}
                              >
                                <path d="M3 8V5a2 2 0 0 1 2-2h3" />
                                <path d="M16 3h3a2 2 0 0 1 2 2v3" />
                                <path d="M3 16v3a2 2 0 0 1 2 2h3" />
                                <path d="M16 21h3a2 2 0 0 1 2-2v-3" />
                              </Box>
                            </Box>
                          </Box>
                        </Grid>
                      ))}
                    </Grid>
                  </Grid>
                )}
              </Grid>
            </Container>
          </Box>
        )}

        {/* --- FULLSCREEN LIGHTBOX MODAL --- */}
        {fullscreenImg && (
          <Box
            onClick={() => setFullscreenImg(null)}
            sx={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              bgcolor: "rgba(5, 5, 5, 0.95)",
              zIndex: 10000,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "zoom-out",
            }}
          >
            {/* Close Button */}
            <Box
              onClick={() => setFullscreenImg(null)}
              sx={{
                position: "absolute",
                top: 24,
                right: 24,
                color: "#ffffff",
                bgcolor: "rgba(255, 255, 255, 0.1)",
                borderRadius: "50%",
                width: 44,
                height: 44,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                transition: "background-color 0.3s",
                "&:hover": { bgcolor: "rgba(255, 255, 255, 0.2)" }
              }}
            >
              <Box
                component="svg"
                viewBox="0 0 24 24"
                sx={{
                  width: 20,
                  height: 20,
                  color: "#ffffff",
                  fill: "none",
                  stroke: "currentColor",
                  strokeWidth: 2,
                  strokeLinecap: "round",
                  strokeLinejoin: "round"
                }}
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </Box>
            </Box>

            {/* Main Preview Image */}
            <Box
              component="img"
              src={fullscreenImg}
              alt="Fullscreen Preview"
              sx={{
                maxWidth: "90vw",
                maxHeight: "90vh",
                objectFit: "contain",
                boxShadow: "0 20px 50px rgba(0,0,0,0.6)",
                userSelect: "none"
              }}
              onClick={(e) => e.stopPropagation()} // Prevent modal from closing when clicking image
            />
          </Box>
        )}


      </Box>
    </ThemeProvider>
  );
}
