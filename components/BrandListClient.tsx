"use client";

import { useState, useEffect, useMemo } from "react";
import { Box, Container, Stack, Typography, Grid, InputBase, IconButton, createTheme, ThemeProvider, Divider } from "@mui/material";
import Link from "next/link";
import SearchIcon from "@mui/icons-material/Search";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { brands as fallbackBrands } from "@/lib/brandData";

const brandVectorLogos: Record<string, React.ReactNode> = {
  adidas: (
    <svg width="100%" height="32" viewBox="0 0 120 30" fill="currentColor">
      <text x="50%" y="22" fontFamily="'Futura', 'Helvetica Neue', 'Arial', sans-serif" fontSize="20" fontWeight="bold" letterSpacing="0.1em" textAnchor="middle">adidas</text>
    </svg>
  ),
  "calvin-klein": (
    <svg width="100%" height="32" viewBox="0 0 140 30" fill="currentColor">
      <text x="50%" y="22" fontFamily="'Futura', 'Helvetica Neue', 'Arial', sans-serif" fontSize="17" fontWeight="bold" letterSpacing="0.12em" textAnchor="middle">Calvin Klein</text>
    </svg>
  ),
  skechers: (
    <svg width="100%" height="32" viewBox="0 0 140 30" fill="currentColor">
      <text x="50%" y="22" fontFamily="'Arial Black', sans-serif" fontSize="18" fontWeight="900" letterSpacing="0.08em" textAnchor="middle">Skechers</text>
    </svg>
  ),
  "paul-shark": (
    <svg width="100%" height="32" viewBox="0 0 160 30" fill="currentColor">
      <text x="50%" y="22" fontFamily="'Futura', 'Arial Black', sans-serif" fontSize="16" fontWeight="900" letterSpacing="0.08em" textAnchor="middle">Paul & Shark</text>
    </svg>
  ),
  maxmara: (
    <svg width="100%" height="32" viewBox="0 0 120 30" fill="currentColor">
      <text x="50%" y="22" fontFamily="'Granjon', 'Garamond', serif" fontSize="21" fontWeight="bold" letterSpacing="0.08em" textAnchor="middle">Max Mara</text>
    </svg>
  ),
  editorial: (
    <svg width="100%" height="32" viewBox="0 0 120 30" fill="currentColor">
      <text x="50%" y="22" fontFamily='"Apple Garamond", "EB Garamond", "Cormorant Garamond", serif"' fontSize="18" fontWeight="bold" letterSpacing="0.12em" textAnchor="middle">Editorial</text>
    </svg>
  ),
  sandro: (
    <svg width="100%" height="32" viewBox="0 0 120 30" fill="currentColor">
      <text x="50%" y="22" fontFamily="'Futura', 'Helvetica Neue', 'Arial', sans-serif" fontSize="20" fontWeight="bold" letterSpacing="0.08em" textAnchor="middle">Sandro</text>
    </svg>
  ),
  moje: (
    <svg width="100%" height="32" viewBox="0 0 100 30" fill="currentColor">
      <text x="50%" y="22" fontFamily="'Didot', 'Times New Roman', serif" fontSize="21" fontStyle="italic" fontWeight="bold" letterSpacing="0.06em" textAnchor="middle">Moje</text>
    </svg>
  )
 
};

interface BrandListClientProps {
  initialBrands: any[];
  initialLang: "en" | "ar";
}

export default function BrandListClient({ initialBrands, initialLang }: BrandListClientProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const lang = initialLang;
  const [brands, setBrands] = useState<any[]>(initialBrands || []);

  useEffect(() => {
    if (!initialBrands || initialBrands.length === 0) {
      import("@/lib/sanity").then(({ getSanityBrands }) => {
        getSanityBrands().then((data) => {
          if (data && data.length > 0) {
            setBrands(data);
          }
        });
      });
    } else {
      setBrands(initialBrands);
    }
  }, [initialBrands]);

  const lightTheme = useMemo(() => createTheme({
    palette: {
      mode: "light",
      primary: { main: "#CB6116" },
      background: { default: "#FAF8F5", paper: "#ffffff" }
    },
    typography: {
      fontFamily: `"Cairo", sans-serif`
    }
  }), []);

  // Merge CMS brand entries with static fallback details to guarantee description, titles, and backgrounds
  const processedBrands = useMemo(() => {
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

    return list.map((sb: any) => {
      const fb = fallbackBrands.find((b) => b.id === sb.slug?.current);
      const name = sb.title || fb?.name || "";
      const nameAr = sb.titleAr || fb?.nameAr || name;
      
      const description = sb.description?.en || fb?.description || "";
      const descriptionAr = sb.description?.ar || fb?.descriptionAr || description;

      const headline = sb.headline?.en || fb?.headline || "";
      const headlineAr = sb.headline?.ar || fb?.headlineAr || headline;

      const logoUrl = sb.image?.asset?.url || null;
      const fallbackLogo = logoUrl;

      return {
        id: sb.slug?.current || sb._id,
        name: lang === "ar" ? nameAr : name,
        headline: lang === "ar" ? headlineAr : headline,
        description: lang === "ar" ? descriptionAr : description,
        logoUrl: fallbackLogo,
        bgImage: sb.bgImage?.asset?.url || fb?.backdropUrl || "/brand-pages/page_01.jpg"
      };
    });
  }, [brands, lang]);

  // Filter list by search criteria
  const filteredBrands = useMemo(() => {
    return processedBrands.filter((brand) =>
      brand.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      brand.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [processedBrands, searchQuery]);

  return (
    <ThemeProvider theme={lightTheme}>
      <Box sx={{ bgcolor: "#FAF8F5", minHeight: "100vh", color: "#111111", py: { xs: 8, md: 12 }, px: { xs: 2.5, sm: 4 } }}>
        <Container maxWidth="xl">
          {/* Header Block */}
          <Stack spacing={2.5} sx={{ mb: { xs: 6, md: 8 }, textAlign: lang === "ar" ? "right" : "left" }}>
            <Typography
              component="h1"
              sx={{
                fontSize: { xs: "2.4rem", md: "3.5rem" },
                fontFamily: "var(--heading-font)",
                fontWeight: 600,
                letterSpacing: "0.05em",
                textTransform: "uppercase",
                lineHeight: 1.1,
                color: "#111111"
              }}
            >
              {lang === "ar" ? "المصممين والعلامات التجارية" : "Designers & Brands"}
            </Typography>
            
            <Stack 
              direction={{ xs: "column", md: "row" }} 
              justifyContent="space-between" 
              alignItems={{ xs: "stretch", md: "flex-end" }}
              spacing={4}
            >
              <Typography
                sx={{
                  fontSize: { xs: 14, md: 15 },
                  color: "rgba(0,0,0,0.6)",
                  maxWidth: 650,
                  lineHeight: 1.6,
                  fontWeight: 350,
                  fontFamily: '"Cairo", sans-serif'
                }}
              >
                {lang === "ar"
                  ? "قائمة منسقة ومفصلة من بيوت الأزياء والعلامات التجارية العالمية الرائدة التي تشكل هوية فاشن غيت."
                  : "A curated directory of global fashion labels and designers defining the identity of Fashion Gate."}
              </Typography>

              {/* Minimalist Search Box */}
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  width: "100%",
                  maxWidth: 360,
                  bgcolor: "rgba(0, 0, 0, 0.02)",
                  borderBottom: "1.5px solid rgba(0, 0, 0, 0.12)",
                  px: 1.5,
                  py: 1,
                  transition: "border-color 0.3s ease",
                  "&:focus-within": {
                    borderColor: "#CB6116"
                  }
                }}
              >
                <InputBase
                  placeholder={lang === "ar" ? "ابحث عن علامة تجارية..." : "Search brands..."}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  dir={lang === "ar" ? "rtl" : "ltr"}
                  sx={{
                    flex: 1,
                    color: "#111111",
                    fontSize: 14.5,
                    fontFamily: '"Cairo", sans-serif'
                  }}
                />
                <IconButton sx={{ color: "rgba(0,0,0,0.54)", p: 0.5 }}>
                  <SearchIcon sx={{ fontSize: 20 }} />
                </IconButton>
              </Box>
            </Stack>
            <Divider sx={{ borderColor: "rgba(0,0,0,0.06)", mt: 2 }} />
          </Stack>

          {/* Elegant Brands Grid System */}
          <Grid container spacing={3} dir={lang === "ar" ? "rtl" : "ltr"}>
            {filteredBrands.map((brand) => (
              <Grid size={{ xs: 12, sm: 6, md: 4 }} key={brand.id}>
                <Link href={`/brand/${brand.id}/${lang}`} style={{ textDecoration: "none", color: "inherit" }}>
                  <Box
                    sx={{
                      bgcolor: "#ffffff",
                      border: "1px solid rgba(0,0,0,0.06)",
                      p: 4.5,
                      height: "260px",
                      minHeight: "200px",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                      alignItems: "center",
                      textAlign: "center",
                      transition: "all 0.4s cubic-bezier(0.25, 1, 0.5, 1)",
                      "&:hover": {
                        borderColor: "#CB6116",
                        boxShadow: "0 12px 30px rgba(203, 97, 22, 0.06)",
                        transform: "translateY(-4px)",
                        "& .brand-action-arrow": {
                          color: "#CB6116",
                          transform: lang === "ar" ? "translateX(-4px)" : "translateX(4px)"
                        }
                      }
                    }}
                  >
                    {/* Brand Identity / Logo */}
                    <Box sx={{ flexGrow: 1, display: "flex", alignItems: "center", justifyContent: "center", minHeight: 40, width: "100%", color: "#111111" }}>
                      {brand.logoUrl ? (
                        <Box
                          component="img"
                          src={brand.logoUrl}
                          alt={brand.name}
                          sx={{ maxHeight: 160, maxWidth: "80%", objectFit: "contain" }}
                        />
                      ) : (
                        brandVectorLogos[brand.id] || (
                          <Typography sx={{ fontSize: 18, fontWeight: 700, letterSpacing: "0.05em" }}>
                            {brand.name}
                          </Typography>
                        )
                      )}
                    </Box>

                    {/* Meta info */}
                    <Stack spacing={1} sx={{ mt: 2, width: "100%" }}>
                      <Typography
                        sx={{
                          fontSize: 14,
                          fontWeight: 600,
                          color: "#111111",
                          fontFamily: '"Cairo", sans-serif',
                          textTransform: "uppercase"
                        }}
                      >
                        {brand.name}
                      </Typography>
                      <Typography
                        sx={{
                          fontSize: 12.5,
                          color: "rgba(0,0,0,0.5)",
                          fontWeight: 300,
                          fontFamily: '"Cairo", sans-serif',
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap"
                        }}
                      >
                        {brand.headline || brand.description}
                      </Typography>
                    </Stack>

                    {/* Explore Link */}
                    <Stack
                      direction="row"
                      alignItems="center"
                      spacing={0.5}
                      className="brand-action-arrow"
                      sx={{
                        mt: 2.5,
                        color: "rgba(0,0,0,0.3)",
                        transition: "all 0.3s ease"
                      }}
                    >
                      <Typography sx={{ fontSize: 10.5, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.15em", fontFamily: '"Cairo", sans-serif' }}>
                        {lang === "ar" ? "تصفح المجموعة" : "Explore"}
                      </Typography>
                      {lang === "ar" ? <ArrowBackIcon sx={{ fontSize: 14 }} /> : <ArrowForwardIcon sx={{ fontSize: 14 }} />}
                    </Stack>
                  </Box>
                </Link>
              </Grid>
            ))}
          </Grid>

        </Container>
      </Box>
    </ThemeProvider>
  );
}
