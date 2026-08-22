"use client";

import { useMemo, useState } from "react";
import { Box, Container, Stack, Typography, Grid, InputBase, Button, Chip, Divider } from "@mui/material";
import Link from "next/link";
import SearchIcon from "@mui/icons-material/Search";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { brands as fallbackBrands } from "@/lib/brandData";

interface DesignersClientProps {
  pageData: any;
  categories: any[];
  initialLang: "en" | "ar";
}

interface PreparedBrand {
  id: string;
  name: string;
  nameEn: string;
  headline: string;
  description: string;
  logoUrl: string | null;
  imageUrl: string;
}

const fallbackCategoryConfig = [
  {
    title: { en: "Luxury Fashion & Haute Couture", ar: "الأزياء الفاخرة والهوت كوتور" },
    brandIds: ["elie-saab", "gucci", "maxmara", "prada", "valentino", "ysl"],
    image: "/brand/hero-look-01.jpg",
  },
  {
    title: { en: "Contemporary & Premium Apparel", ar: "الأزياء المعاصرة والراقية" },
    brandIds: ["calvin-klein", "hugo-boss", "giorgio-armani", "paul-shark", "sandro", "editorial"],
    image: "/brand/hero-look-04.jpg",
  },
  {
    title: { en: "Independent & Creative Design", ar: "التصميم المستقل والإبداعي" },
    brandIds: ["moje"],
    image: "/brand/modern-sophistication.png",
  },
  {
    title: { en: "Footwear & Athletic Lifestyle", ar: "الأحذية وأسلوب الحياة الرياضي" },
    brandIds: ["adidas", "skechers"],
    image: "/brand/designer-collections.png",
  },
  {
    title: { en: "Jewelry, Beauty & Accessories", ar: "المجوهرات والجمال والإكسسوارات" },
    brandIds: ["cartier", "lancome", "jimmy-choo", "coach"],
    image: "/brand/luxury-beauty.png",
  },
];

function localize(value: any, lang: "en" | "ar", fallback = "") {
  if (!value) return fallback;
  if (typeof value === "string") return value;
  return value[lang] || value.en || value.ar || fallback;
}

function normalizeBrand(raw: any, lang: "en" | "ar") {
  const id = raw?.slug?.current || raw?.id || raw?._id || "";
  const fallback = fallbackBrands.find((brand) => brand.id === id);
  const nameEn = raw?.title || fallback?.name || id;
  const nameAr = raw?.titleAr || fallback?.nameAr || nameEn;

  return {
    id,
    name: lang === "ar" ? nameAr : nameEn,
    nameEn,
    headline: localize(raw?.headline, lang, lang === "ar" ? fallback?.headlineAr || "" : fallback?.headline || ""),
    description: localize(raw?.description, lang, lang === "ar" ? fallback?.descriptionAr || "" : fallback?.description || ""),
    logoUrl: raw?.image?.asset?.url || raw?.imageAr?.asset?.url || null,
    imageUrl: raw?.cardImage?.asset?.url || raw?.bgImage?.asset?.url || fallback?.backdropUrl || "/brand-pages/page_01.jpg",
  };
}

export default function DesignersClient({ pageData, categories, initialLang }: DesignersClientProps) {
  const lang = initialLang;
  const isAr = lang === "ar";
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");

  const preparedCategories = useMemo(() => {
    const cmsCategories = Array.isArray(categories) && categories.length > 0
      ? categories
          .filter((category) => Array.isArray(category.brands) && category.brands.length > 0)
          .map((category, index) => ({
            id: category._id || `category-${index}`,
            title: category.title,
            image: category.sectionImage?.asset?.url || category.brands?.[0]?.cardImage?.asset?.url || category.brands?.[0]?.bgImage?.asset?.url || fallbackCategoryConfig[index % fallbackCategoryConfig.length].image,
            brands: category.brands.map((brand: any) => normalizeBrand(brand, lang)),
          }))
      : fallbackCategoryConfig.map((category, index) => ({
          id: `fallback-${index}`,
          title: category.title,
          image: category.image,
          brands: category.brandIds
            .map((id) => fallbackBrands.find((brand) => brand.id === id))
            .filter(Boolean)
            .map((brand) => normalizeBrand({ ...brand, slug: { current: brand?.id } }, lang)),
        }));

    const seen = new Set<string>();
    return cmsCategories.filter((category) => {
      const key = `${category.id || ""}-${localize(category.title, "en", "").toLowerCase().trim()}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }, [categories, lang]);

  const selectedCategory = useMemo(
    () => preparedCategories.find((category) => category.id === activeCategory) || null,
    [activeCategory, preparedCategories]
  );

  const selectedCategoryBrands = useMemo(
    () => (selectedCategory ? selectedCategory.brands : []),
    [selectedCategory]
  );

  const filteredCategories = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return preparedCategories
      .filter((category) => activeCategory === "all" || category.id === activeCategory)
      .map((category) => ({
        ...category,
        brands: category.brands.filter((brand: PreparedBrand) =>
          !normalizedQuery ||
          brand.name.toLowerCase().includes(normalizedQuery) ||
          brand.nameEn.toLowerCase().includes(normalizedQuery) ||
          brand.headline.toLowerCase().includes(normalizedQuery)
        ),
      }))
      .filter((category) => category.brands.length > 0);
  }, [activeCategory, preparedCategories, query]);

  const copy = {
    eyebrow: localize(pageData?.eyebrow, lang, isAr ? "دليل المصممين" : "Designer Directory"),
    title: localize(pageData?.title, lang, isAr ? "المصممون والعلامات المختارة" : "Designers & Curated Brands"),
    description: localize(
      pageData?.description,
      lang,
      isAr
        ? "اكتشف دور الأزياء والعلامات الفاخرة عبر أقسام منسقة تجمع الأزياء، الجمال، الإكسسوارات، وأسلوب الحياة."
        : "Explore luxury houses and contemporary labels through curated categories spanning fashion, beauty, accessories, and lifestyle."
    ),
    categoriesHeading: localize(pageData?.categoriesHeading, lang, isAr ? "تصفح حسب الفئة" : "Browse by Category"),
    featuredHeading: localize(pageData?.featuredBrandsHeading, lang, isAr ? "العلامات المميزة" : "Featured Houses"),
    search: isAr ? "ابحث عن مصمم أو علامة..." : "Search designers or brands...",
    all: isAr ? "الكل" : "All",
    explore: isAr ? "استكشف العلامة" : "Explore Brand",
  };
  const resolvedSearchPlaceholder = localize(pageData?.searchPlaceholder, lang, copy.search);
  const resolvedAllLabel = localize(pageData?.allCategoriesLabel, lang, copy.all);
  const resolvedExploreLabel = localize(pageData?.exploreBrandLabel, lang, copy.explore);
  const heroImagePosition = pageData?.heroImagePosition || "72% center";
  const heroImagePositionMobile = pageData?.heroImagePositionMobile || heroImagePosition;

  return (
    <Box dir={isAr ? "rtl" : "ltr"} sx={{ bgcolor: "#FAF8F5", color: "#111", minHeight: "100vh" }}>
      <Box
        sx={{
          position: "relative",
          minHeight: { xs: 540, md: "calc(100svh - 148px)" },
          display: "flex",
          alignItems: "flex-end",
          overflow: "hidden",
          bgcolor: "#090807",
          color: "#fff",
        }}
      >
        <Box
          component="img"
          src={pageData?.heroImage?.asset?.url || "/brand/hero-woman-wide.png"}
          alt=""
          sx={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: {
              xs: heroImagePositionMobile,
              sm: heroImagePositionMobile,
              md: heroImagePosition,
            },
            opacity: 0.62,
          }}
        />
        <Box sx={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.78) 82%)" }} />
        <Container maxWidth="xl" sx={{ position: "relative", pb: { xs: 6, md: 9 }, pt: 18 }}>
          <Stack spacing={3} sx={{ maxWidth: 760, textAlign: isAr ? "right" : "left" }}>
            <Typography sx={{ color: "#CB6116", fontSize: 12, fontWeight: 800, letterSpacing: isAr ? 0 : "0.22em", textTransform: "uppercase" }}>
              {copy.eyebrow}
            </Typography>
            <Typography component="h1" sx={{ fontFamily: "var(--heading-font)", fontSize: { xs: "3rem", md: "5.6rem" }, lineHeight: 0.95, fontWeight: 600, letterSpacing: 0 }}>
              {copy.title}
            </Typography>
            <Typography sx={{ maxWidth: 620, color: "rgba(255,255,255,0.78)", fontSize: { xs: 15, md: 17 }, lineHeight: 1.8, fontFamily: '"Cairo", sans-serif' }}>
              {copy.description}
            </Typography>
          </Stack>
        </Container>
      </Box>

      <Container maxWidth="xl" sx={{ py: { xs: 5, md: 8 } }}>
        <Stack spacing={4}>
          <Stack direction={{ xs: "column", md: "row" }} justifyContent="space-between" alignItems={{ xs: "stretch", md: "flex-end" }} spacing={3}>
            <Box>
              <Typography sx={{ color: "#CB6116", fontSize: 12, fontWeight: 800, letterSpacing: isAr ? 0 : "0.18em", textTransform: "uppercase", mb: 1 }}>
                {copy.categoriesHeading}
              </Typography>
              <Typography component="h2" sx={{ fontFamily: "var(--heading-font)", fontSize: { xs: "2rem", md: "3rem" }, lineHeight: 1.05 }}>
                {copy.featuredHeading}
              </Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", width: "100%", maxWidth: 390, borderBottom: "1px solid rgba(0,0,0,0.18)", px: 1, py: 1 }}>
              <InputBase value={query} onChange={(event) => setQuery(event.target.value)} placeholder={resolvedSearchPlaceholder} sx={{ flex: 1, fontFamily: '"Cairo", sans-serif', fontSize: 14 }} />
              <SearchIcon sx={{ color: "rgba(0,0,0,0.45)", fontSize: 20 }} />
            </Box>
          </Stack>

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "repeat(2, minmax(0, 1fr))",
                sm: "repeat(3, minmax(0, 1fr))",
                md: "repeat(4, minmax(0, 1fr))",
              },
              gap: 1,
              alignItems: "stretch",
            }}
          >
            <Chip
              label={resolvedAllLabel}
              onClick={() => setActiveCategory("all")}
              sx={{
                borderRadius: 0,
                bgcolor: activeCategory === "all" ? "#111" : "#fff",
                color: activeCategory === "all" ? "#fff" : "#111",
                border: "1px solid rgba(0,0,0,0.08)",
                width: "100%",
                height: 38,
                justifyContent: "center",
                transition: "background-color 0.2s ease, color 0.2s ease, border-color 0.2s ease",
                "&:hover": {
                  bgcolor: activeCategory === "all" ? "#111" : "#F4EFEA",
                  color: activeCategory === "all" ? "#fff" : "#111",
                  borderColor: activeCategory === "all" ? "#111" : "rgba(203,97,22,0.32)",
                },
                "& .MuiChip-label": {
                  display: "block",
                  width: "100%",
                  px: 1,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  textAlign: "center",
                  fontSize: 12,
                  color: "inherit",
                },
              }}
            />
            {preparedCategories.map((category) => (
              <Chip
                key={category.id}
                label={localize(category.title, lang)}
                onClick={() => setActiveCategory(category.id)}
                sx={{
                  borderRadius: 0,
                  bgcolor: activeCategory === category.id ? "#111" : "#fff",
                  color: activeCategory === category.id ? "#fff" : "#111",
                  border: "1px solid rgba(0,0,0,0.08)",
                  width: "100%",
                  height: 38,
                  justifyContent: "center",
                  transition: "background-color 0.2s ease, color 0.2s ease, border-color 0.2s ease",
                  "&:hover": {
                    bgcolor: activeCategory === category.id ? "#111" : "#F4EFEA",
                    color: activeCategory === category.id ? "#fff" : "#111",
                    borderColor: activeCategory === category.id ? "#111" : "rgba(203,97,22,0.32)",
                  },
                  "& .MuiChip-label": {
                    display: "block",
                    width: "100%",
                    px: 1,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    textAlign: "center",
                    fontSize: 13,
                    color: "inherit",
                  },
                }}
              />
            ))}
          </Box>

          {activeCategory !== "all" && selectedCategoryBrands.length > 0 && (
            <Grid container spacing={2.5}>
              {selectedCategoryBrands.map((brand: PreparedBrand) => (
                <Grid size={{ xs: 6, md: 2 }} key={brand.id}>
                  <Box sx={{ bgcolor: "#fff", height: 120, border: "1px solid rgba(0,0,0,0.06)", display: "flex", alignItems: "center", justifyContent: "center", px: 2 }}>
                    {brand.logoUrl ? (
                      <Box component="img" src={brand.logoUrl} alt={brand.name} sx={{ maxWidth: "86%", maxHeight: 76, objectFit: "contain" }} />
                    ) : (
                      <Typography sx={{ fontWeight: 800, textAlign: "center", letterSpacing: "0.06em", textTransform: "uppercase" }}>{brand.name}</Typography>
                    )}
                  </Box>
                </Grid>
              ))}
            </Grid>
          )}

          {activeCategory !== "all" && <Divider sx={{ borderColor: "rgba(0,0,0,0.08)" }} />}

          <Stack spacing={{ xs: 5, md: 7 }}>
            {filteredCategories.map((category) => (
              <Box key={category.id}>
                <Grid container spacing={3}>
                  <Grid size={{ xs: 12, md: 4 }}>
                    <Box sx={{ position: "sticky", top: 110 }}>
                      <Box component="img" src={category.image} alt="" sx={{ width: "100%", aspectRatio: "4 / 5", objectFit: "cover", display: "block" }} />
                      <Typography sx={{ mt: 2, fontFamily: "var(--heading-font)", fontSize: { xs: "1.8rem", md: "2.4rem" }, lineHeight: 1.05 }}>
                        {localize(category.title, lang)}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid size={{ xs: 12, md: 8 }}>
                    <Grid container spacing={2}>
                      {category.brands.map((brand: PreparedBrand) => (
                        <Grid size={{ xs: 12, sm: 6 }} key={brand.id}>
                          <Box
                            component={Link}
                            href={`/brand/${brand.id}/${lang}`}
                            sx={{
                              minHeight: 330,
                              textDecoration: "none",
                              color: "inherit",
                              bgcolor: "#fff",
                              border: "1px solid rgba(0,0,0,0.06)",
                              display: "flex",
                              flexDirection: "column",
                              overflow: "hidden",
                              transition: "transform 0.3s ease, border-color 0.3s ease",
                              "&:hover": { transform: "translateY(-4px)", borderColor: "#CB6116" },
                            }}
                          >
                            <Box sx={{ position: "relative", aspectRatio: "16 / 10", bgcolor: "#111", overflow: "hidden" }}>
                              <Box component="img" src={brand.imageUrl} alt="" sx={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.68 }} />
                              <Box sx={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", px: 3 }}>
                                {brand.logoUrl ? (
                                  <Box component="img" src={brand.logoUrl} alt={brand.name} sx={{ maxWidth: 180, maxHeight: 180, objectFit: "contain", filter: "brightness(0) invert(1)" }} />
                                ) : (
                                  <Typography sx={{ color: "#fff", fontSize: 18, fontWeight: 800, textAlign: "center", letterSpacing: "0.08em", textTransform: "uppercase" }}>{brand.name}</Typography>
                                )}
                              </Box>
                            </Box>
                            <Stack spacing={1.4} sx={{ p: 3, flex: 1 }}>
                              <Typography sx={{ fontSize: 18, fontWeight: 800, fontFamily: '"Cairo", sans-serif' }}>{brand.name}</Typography>
                              <Typography sx={{ color: "rgba(0,0,0,0.58)", fontSize: 13.5, lineHeight: 1.7, fontFamily: '"Cairo", sans-serif', display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                                {brand.headline || brand.description}
                              </Typography>
                              <Button endIcon={!isAr ? <ArrowForwardIcon /> : undefined} startIcon={isAr ? <ArrowBackIcon /> : undefined} sx={{ mt: "auto", alignSelf: isAr ? "flex-end" : "flex-start", color: "#CB6116", px: 0, fontWeight: 800, fontSize: 11, letterSpacing: isAr ? 0 : "0.12em" }}>
                                {resolvedExploreLabel}
                              </Button>
                            </Stack>
                          </Box>
                        </Grid>
                      ))}
                    </Grid>
                  </Grid>
                </Grid>
              </Box>
            ))}
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
}
