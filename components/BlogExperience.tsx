"use client";

import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import DiamondOutlinedIcon from "@mui/icons-material/DiamondOutlined";
import AutoStoriesOutlinedIcon from "@mui/icons-material/AutoStoriesOutlined";
import NorthEastIcon from "@mui/icons-material/NorthEast";
import { Box, Button, Container, Stack, ThemeProvider, Typography, createTheme } from "@mui/material";
import { motion } from "framer-motion";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import Image from "next/image";

import { blogPosts, featuredBlogPost, type BlogPost } from "@/lib/blogData";
import { getSanityBlogPosts } from "@/lib/sanity";

const MotionBox = motion.create(Box);

const formatMonth = (monthStr: string, isAr: boolean) => {
  if (!isAr) return monthStr;
  const monthMap: Record<string, string> = {
    January: "يناير",
    February: "فبراير",
    March: "مارس",
    April: "أبريل",
    May: "مايو",
    June: "يونيو",
    July: "يوليو",
    August: "أغسطس",
    September: "سبتمبر",
    October: "أكتوبر",
    November: "نوفمبر",
    December: "ديسمبر"
  };
  return monthMap[monthStr] || monthStr;
};

const formatCategoryName = (formatStr: string, isAr: boolean) => {
  if (!isAr) return formatStr;
  const formatMap: Record<string, string> = {
    "All": "الكل",
    "Blog post": "مقال",
    "Case study": "دراسة حالة",
    "Thought leadership": "رؤى قيادية"
  };
  return formatMap[formatStr] || formatStr;
};

export default function BlogExperience({ 
  initialPosts, 
  settings, 
  initialLang = "en" 
}: { 
  initialPosts?: BlogPost[]; 
  settings?: any; 
  initialLang?: "en" | "ar";
}) {
  const [posts, setPosts] = useState<any[]>(initialPosts && initialPosts.length > 0 ? initialPosts : []);
  const activePostsList = posts.length > 0 ? posts : ((initialPosts && initialPosts.length > 0) ? initialPosts : blogPosts);
  
  const featured = activePostsList[0] || featuredBlogPost;
  const featuredTitle = initialLang === "ar" ? featured.titleAr || featured.title : featured.title;
  const featuredExcerpt = initialLang === "ar" ? featured.excerptAr || featured.excerpt : featured.excerpt;
  const featuredContent = initialLang === "ar" ? (featured.contentAr && featured.contentAr.length > 0 ? featured.contentAr : featured.content) : featured.content;

  const [activeFormat, setActiveFormat] = useState("All");
  const [mounted, setMounted] = useState(false);
  const [isLangTransitioning, setIsLangTransitioning] = useState(false);

  useEffect(() => {
    setMounted(true);
    getSanityBlogPosts()
      .then((res) => {
        if (res && res.length > 0) {
          setPosts(res);
        }
      })
      .catch(console.error);
  }, []);

  const eyebrowText = initialLang === "ar" 
    ? (settings?.eyebrow?.ar || "مجلة بوابة الأزياء") 
    : (settings?.eyebrow?.en || "Fashion Gate Journal");

  const headlineText = initialLang === "ar" 
    ? (settings?.headline?.ar || "هندسة الفخامة") 
    : (settings?.headline?.en || "The Architecture of Luxury");

  const descriptionText = initialLang === "ar" 
    ? (settings?.description?.ar || "أفكار تصميم منقحة، ورؤى مشاريع الضيافة، والتطورات المعمارية التي تشكلت في وجهة تحريرية أنيقة.") 
    : (settings?.description?.en || "Refined design thinking, hospitality project insights, and architectural developments shaped into an elegant editorial destination.");

  const stat1Text = initialLang === "ar" 
    ? (settings?.stat1?.ar || "تركيز الفخامة") 
    : (settings?.stat1?.en || "Luxury Focus");

  const stat2Text = initialLang === "ar" 
    ? (settings?.stat2?.ar || "تنسيقات التحرير") 
    : (settings?.stat2?.en || "Editorial Edits");

  const stat3Text = initialLang === "ar" 
    ? (settings?.stat3?.ar || "١٢ مذكرة يومية") 
    : (settings?.stat3?.en || "12 Journal Notes");

  const editorialVisionEyebrow = initialLang === "ar"
    ? (settings?.editorialVision?.eyebrow?.ar || "Ø§Ù„Ø±Ø¤ÙŠØ© Ø§Ù„ØªØ­Ø±ÙŠØ±ÙŠØ©")
    : (settings?.editorialVision?.eyebrow?.en || "Editorial Vision");

  const editorialVisionQuote = initialLang === "ar"
    ? (settings?.editorialVision?.quote?.ar || '"Ù…Ø´Ø§Ø±ÙŠØ¹ Ø­Ù‚ÙŠÙ‚ÙŠØ© ØªØªØ±Ø¬Ù… Ø¥Ù„Ù‰ Ù…ØµØ¯Ø§Ù‚ÙŠØ©ØŒ ÙˆØ«Ù‚Ø© Ø§Ù„Ø¹Ù…Ù„Ø§Ø¡ØŒ ÙˆØ±Ø³ÙˆØ® Ø§Ù„Ø¹Ù„Ø§Ù…Ø© Ø§Ù„ØªØ¬Ø§Ø±ÙŠØ©."')
    : (settings?.editorialVision?.quote?.en || '"Real projects translated into search relevance, client trust, and brand authority."');

  const editorialVisionAttribution = initialLang === "ar"
    ? (settings?.editorialVision?.attribution?.ar || "ÙØ§Ø´Ù† ØºÙŠØª Ù…ÙˆÙ„")
    : (settings?.editorialVision?.attribution?.en || "Fashion Gate Mall");

  const theme = createTheme({
    palette: {
      mode: "dark",
      primary: { main: "#CB6116", dark: "#9D430C" },
      secondary: { main: "#D06010" }
    },
    typography: {
      fontFamily: `"Cairo", sans-serif`,
      button: { fontWeight: 700, textTransform: "uppercase" }
    },
    shape: { borderRadius: 0 }
  });

  const formats = ["All", "Blog post", "Case study", "Thought leadership"];

  // Filter posts based on format filter
  const gridPosts = activePostsList.length > 1 ? activePostsList.slice(1) : activePostsList;
  const filteredPosts = activeFormat === "All"
    ? gridPosts
    : gridPosts.filter(post => post.format === activeFormat);

  const isAr = initialLang === "ar";

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ bgcolor: "#FAF8F5", color: "#111111", minHeight: "100vh" }} dir={isAr ? "rtl" : "ltr"}>

        <Box 
          sx={{ 
            opacity: isLangTransitioning ? 0 : 1, 
            transition: "opacity 0.25s ease-in-out" 
          }}
        >

        {/* Clean Typographic Cover Hero */}
        <Box component="section" sx={{ pt: { xs: 8, md: 12 }, pb: { xs: 6, md: 8 } }}>
          <Container maxWidth="xl">
            <Stack spacing={4} alignItems="center" textAlign="center">
              <Typography sx={{ color: "primary.main", fontSize: 11, fontWeight: 800, letterSpacing: initialLang === "ar" ? 0 : "0.26em", textTransform: "none", fontFamily: '"Cairo", sans-serif' }}>
                {eyebrowText}
              </Typography>
              <Typography component="h1" sx={{ fontFamily: "var(--heading-font)", fontSize: { xs: "2.8rem", sm: "4.8rem", md: "6.5rem" }, fontWeight: 500, lineHeight: 1.1, color: "#111111", maxWidth: 960 }}>
                {headlineText}
              </Typography>
              <Typography sx={{ maxWidth: 620, color: "rgba(0,0,0,0.64)", fontSize: 15, lineHeight: 1.8, fontFamily: '"Cairo", sans-serif' }}>
                {descriptionText}
              </Typography>
              
              {/* Minimalist Stats Row */}
              <Stack direction="row" spacing={3} sx={{ color: "rgba(0,0,0,0.4)", fontSize: 11, fontWeight: 700, letterSpacing: initialLang === "ar" ? 0 : "0.15em", textTransform: "none", pt: 1 }}>
                <Typography sx={{ fontSize: "inherit", fontWeight: "inherit" }}>{stat1Text}</Typography>
                <Typography sx={{ fontSize: "inherit", fontWeight: "inherit" }}>•</Typography>
                <Typography sx={{ fontSize: "inherit", fontWeight: "inherit" }}>{stat2Text}</Typography>
                <Typography sx={{ fontSize: "inherit", fontWeight: "inherit" }}>•</Typography>
                <Typography sx={{ fontSize: "inherit", fontWeight: "inherit" }}>{stat3Text}</Typography>
              </Stack>
            </Stack>
          </Container>
        </Box>

        {/* Featured Editorial Article */}
        <Box id="journal" component="section" sx={{ pb: { xs: 8, md: 14 } }}>
          <Container maxWidth="xl">
            <Stack spacing={4}>
              {/* Giant Full-Width Cover Image */}
              <Box 
                sx={{ 
                  width: "100%", 
                  height: { xs: 300, sm: 450, md: 560 }, 
                  overflow: "hidden", 
                  position: "relative",
                  border: "1px solid rgba(0,0,0,0.06)",
                  "& img": {
                    transition: "transform 0.8s ease"
                  },
                  "& img:hover": {
                    transform: "scale(1.015)"
                  }
                }}
              >
                <Image 
                  src={featured.image || "/brand/logo.png"}
                  alt={featuredTitle}
                  fill
                  priority
                  sizes="(max-width: 600px) 100vw, (max-width: 1200px) 80vw, 1200px"
                  style={{ 
                    objectFit: "cover"
                  }}
                />
              </Box>

              {/* Centered Editorial Copy Column */}
              <Stack spacing={3} sx={{ maxWidth: 840, mx: "auto", px: { xs: 1, sm: 3 } }}>
                <Stack direction="row" spacing={1.5} alignItems="center">
                  <Typography sx={{ color: "primary.main", fontSize: 10.5, fontWeight: 800, letterSpacing: isAr ? 0 : "0.2em", textTransform: "none" }}>
                    {isAr ? "مقالة مميزة" : "Featured Article"}
                  </Typography>
                  <Typography sx={{ color: "rgba(0,0,0,0.3)", fontSize: 11.5 }}>/</Typography>
                  <Typography sx={{ color: "rgba(0,0,0,0.54)", fontSize: 11, fontWeight: 700, letterSpacing: isAr ? 0 : "0.15em", textTransform: "none" }}>
                    {formatMonth(featured.month, isAr)}
                  </Typography>
                </Stack>

                <Typography sx={{ fontFamily: "var(--heading-font)", fontSize: { xs: "2.2rem", sm: "3rem", md: "4.2rem" }, lineHeight: 1.1, color: "#111111", fontWeight: 500 }}>
                  {featuredTitle}
                </Typography>

                <Typography sx={{ color: "rgba(0,0,0,0.8)", fontSize: 16.5, lineHeight: 1.85, fontFamily: '"Cairo", sans-serif' }}>
                  {featuredExcerpt}
                </Typography>

                <Stack spacing={2} sx={{ borderTop: "1px solid rgba(0,0,0,0.06)", pt: 3 }}>
                  {featuredContent?.slice(0, 2).map((paragraph: any) => (
                    <Typography key={paragraph} sx={{ color: "rgba(0,0,0,0.62)", fontSize: 14.5, lineHeight: 1.85, fontFamily: '"Cairo", sans-serif' }}>
                      {paragraph}
                    </Typography>
                  ))}
                </Stack>

                <Button 
                  component={Link}
                  href={`/blogs/${featured.slug}/${initialLang}`}
                  endIcon={<ArrowForwardIcon sx={{ fontSize: 15, transform: isAr ? "scaleX(-1)" : "none" }} />} 
                  sx={{ 
                    color: "primary.main",
                    justifyContent: "flex-start",
                    alignSelf: "flex-start",
                    p: 0,
                    fontSize: 11.5, 
                    fontWeight: 800,
                    letterSpacing: isAr ? 0 : "0.15em",
                    borderBottom: "1.5px solid",
                    borderColor: "primary.main",
                    borderRadius: 0,
                    pb: 0.5,
                    mt: 1.5,
                    "&:hover": { bgcolor: "transparent", color: "#111111", borderColor: "#111111" }
                  }}
                >
                  {isAr ? "اقرأ المقال" : "Read Article"}
                </Button>
              </Stack>
            </Stack>
          </Container>
        </Box>

        {/* Filters and Grid List */}
        <Box component="section" sx={{ pb: { xs: 8, md: 14 }, borderTop: "1px solid rgba(0,0,0,0.06)", pt: { xs: 8, md: 10 } }}>
          <Container maxWidth="xl">
            <Stack spacing={6}>
              {/* Header & Filter Controls */}
              <Stack 
                direction={{ xs: "column", md: "row" }} 
                justifyContent="space-between" 
                spacing={3} 
                alignItems={{ xs: "flex-start", md: "flex-end" }}
              >
                <Stack spacing={1}>
                  <Typography sx={{ color: "primary.main", fontSize: 11, fontWeight: 800, letterSpacing: isAr ? 0 : "0.2em", textTransform: "none" }}>
                    {isAr ? "كتالوج المجلة" : "The Journal Catalog"}
                  </Typography>
                  <Typography sx={{ fontFamily: "var(--heading-font)", fontSize: { xs: "2.4rem", md: "3.8rem" }, lineHeight: 1.1, color: "#111111" }}>
                    {isAr ? "صياغة التصميم والهندسة" : "Refining Design & Engineering"}
                  </Typography>
                </Stack>

                {/* Filter Tags */}
                <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                  {formats.map((format) => {
                    const isSelected = activeFormat === format;
                    return (
                      <Button
                        key={format}
                        onClick={() => setActiveFormat(format)}
                        sx={{
                          px: 2,
                          py: 0.8,
                          border: "1px solid",
                          borderColor: isSelected ? "primary.main" : "rgba(0,0,0,0.08)",
                          color: isSelected ? "#ffffff" : "rgba(0,0,0,0.62)",
                          bgcolor: isSelected ? "primary.main" : "transparent",
                          fontSize: 10.5,
                          fontWeight: 700,
                          letterSpacing: isAr ? 0 : "0.12em",
                          borderRadius: 0,
                          transition: "all 0.3s ease",
                          "&:hover": {
                            bgcolor: isSelected ? "primary.main" : "rgba(0,0,0,0.03)",
                            borderColor: isSelected ? "primary.main" : "rgba(0,0,0,0.2)"
                          }
                        }}
                      >
                        {formatCategoryName(format, isAr)}
                      </Button>
                    );
                  })}
                </Stack>
              </Stack>

              {/* Clean, Readable Editorial Cards Grid */}
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)", md: "repeat(3, 1fr)" },
                  gap: { xs: 4, md: 5 }
                }}
              >
                {filteredPosts.map((post, index) => {
                  const postTitle = isAr ? post.titleAr || post.title : post.title;
                  const postExcerpt = isAr ? post.excerptAr || post.excerpt : post.excerpt;

                  return (
                    <Link
                      key={post.slug}
                      href={`/blogs/${post.slug}/${initialLang}`}
                      style={{ textDecoration: "none" }}
                    >
                      <MotionBox
                        initial={mounted ? { opacity: 0, y: 20 } : false}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-40px" }}
                        transition={{ duration: 0.5, delay: Math.min(index * 0.04, 0.2), ease: "easeOut" }}
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          bgcolor: "#ffffff",
                          border: "1px solid rgba(0,0,0,0.05)",
                          overflow: "hidden",
                          transition: "transform 0.4s ease, box-shadow 0.4s ease",
                          "&:hover": {
                            transform: "translateY(-4px)",
                            boxShadow: "0 18px 40px rgba(0,0,0,0.04)"
                          }
                        }}
                      >
                        <Box 
                          sx={{ 
                            aspectRatio: "16/10", 
                            overflow: "hidden", 
                            position: "relative",
                            "& img": {
                              transition: "transform 0.6s ease"
                            },
                            "& img:hover": {
                              transform: "scale(1.025)"
                            }
                          }}
                        >
                          <Image
                            src={post.image || "/brand/logo.png"}
                            alt={postTitle}
                            fill
                            sizes="(max-width: 600px) 100vw, (max-width: 960px) 50vw, 33vw"
                            style={{
                              objectFit: "cover"
                            }}
                          />
                        </Box>

                        {/* Card Content (Wholly underneath the image) */}
                        <Stack spacing={2} sx={{ p: 3, flexGrow: 1 }}>
                          <Stack direction="row" spacing={1.2} alignItems="center">
                            <Typography sx={{ color: "primary.main", fontSize: 10, fontWeight: 800, letterSpacing: isAr ? 0 : "0.14em", textTransform: "none" }}>
                              {formatCategoryName(post.format, isAr)}
                            </Typography>
                            <Typography sx={{ color: "rgba(0,0,0,0.22)", fontSize: 10 }}>•</Typography>
                            <Typography sx={{ color: "rgba(0,0,0,0.48)", fontSize: 10.5, fontWeight: 700, letterSpacing: isAr ? 0 : "0.15em", textTransform: "none" }}>
                              {formatMonth(post.month, isAr)}
                            </Typography>
                          </Stack>

                          <Typography sx={{ fontFamily: "var(--heading-font)", fontSize: 20, lineHeight: 1.25, fontWeight: 500, color: "#111111" }}>
                            {postTitle}
                          </Typography>

                          <Typography sx={{ color: "rgba(0,0,0,0.6)", fontSize: 13.5, lineHeight: 1.6, fontFamily: '"Cairo", sans-serif' }}>
                            {postExcerpt}
                          </Typography>

                          {post.audience && (
                            <Typography sx={{ color: "rgba(0,0,0,0.36)", fontSize: 10, letterSpacing: isAr ? 0 : "0.08em", textTransform: "none", mt: "auto", pt: 1.5, borderTop: "1px solid rgba(0,0,0,0.04)" }}>
                              {post.audience}
                            </Typography>
                          )}
                        </Stack>
                      </MotionBox>
                    </Link>
                  );
                })}
              </Box>
            </Stack>
          </Container>
        </Box>

        {/* Minimal Editorial Vision Callout */}
        <Box component="section" sx={{ bgcolor: "#F5EFEB", color: "#111111", py: { xs: 8, md: 10 }, borderTop: "1px solid rgba(0,0,0,0.05)" }}>
          <Container maxWidth="xl">
            <Stack spacing={2.5} alignItems="center" textAlign="center">
              <Typography sx={{ color: "primary.main", fontSize: 11, fontWeight: 800, letterSpacing: "0.22em", textTransform: "none" }}>
                {editorialVisionEyebrow}
              </Typography>
              <Typography sx={{ fontFamily: "var(--heading-font)", fontSize: { xs: "2rem", md: "3.2rem" }, lineHeight: 1.15, fontWeight: 500, maxWidth: 820 }}>
                {editorialVisionQuote}
              </Typography>
              <Typography sx={{ color: "rgba(0,0,0,0.48)", fontSize: 11, fontWeight: 700, letterSpacing: isAr ? 0 : "0.15em", textTransform: "none" }}>
                {editorialVisionAttribution}
              </Typography>
            </Stack>
          </Container>
        </Box>

        </Box>
      </Box>
    </ThemeProvider>
  );
}

