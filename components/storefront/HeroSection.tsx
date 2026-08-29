"use client";

import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { Box, Button, Container, Stack, Typography } from "@mui/material";
import type { Section } from "@/lib/types";
import { imageUrl, getLocalizedValue } from "@/lib/sanity";
import Link from "next/link";
import Image from "next/image";


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

export default function HeroSection({
  section,
  t,
  lang,
}: {
  section: Section;
  t: (s?: string) => string;
  lang: "ar" | "en";
}) {
  console.log("HERO SECTION PROP IN COMPONENT:", JSON.stringify(section, null, 2));
  // Resolve background video or image URL dynamically
  const isVideoBg = section.bgType === "video" && (section.bgVideo?.asset?.url || section.video?.asset?.url);

  let bgImageUrl = "";
  if (section.bgImage?.asset) {
    try {
      bgImageUrl = imageUrl(section.bgImage).width(1920).auto("format").quality(85).url() || "";
    } catch (e) {
      console.error("Failed to parse section.bgImage url", e);
    }
  } else if (section.image?.asset) {
    try {
      bgImageUrl = imageUrl(section.image).width(1920).auto("format").quality(85).url() || "";
    } catch (e) {
      console.error("Failed to parse section.image url", e);
    }
  } else if (section.imageUrl) {
    bgImageUrl = section.imageUrl;
  }

  let bgImageUrlMobile = bgImageUrl;
  if (section.bgImageMobile?.asset) {
    try {
      bgImageUrlMobile = imageUrl(section.bgImageMobile).width(1000).auto("format").quality(85).url() || bgImageUrlMobile;
    } catch (e) {
      console.error("Failed to parse section.bgImageMobile url", e);
    }
  }


  // Resolve Headline dynamically
  const headlineRaw = getLocalizedValue(
    section.headline,
    lang,
    lang === "ar"
      ? (section.headlineAr || "بوابة الأزياء")
      : (section.headlineEn || "Fashion Gate")
  );

  // Normalize spaces
  const headlineText = headlineRaw ? headlineRaw.replace(/\s+/g, " ").trim() : "";

  // Split headline for elegance (keep "Fashion Gate Mall" in line 1, "Syria" in line 2)
  let headlinePart1 = headlineText;
  let headlinePart2 = "";

  if (lang === "ar") {
    const arSyriaRegex = /(?:سوريا|سورية)$/;
    if (arSyriaRegex.test(headlineText)) {
      headlinePart1 = headlineText.replace(arSyriaRegex, "").trim().replace(/،\s*$/, "").trim();
      headlinePart2 = headlineText.match(arSyriaRegex)?.[0] || "سوريا";
    }
    // Apply Kashida (Tatweel) letter stretching for elegant typography
    headlinePart1 = stretchArabicText(headlinePart1, 1);
    if (headlinePart2) {
      headlinePart2 = stretchArabicText(headlinePart2, 1);
    }
  } else {
    const enSyriaRegex = /Syria$/i;
    if (enSyriaRegex.test(headlineText)) {
      headlinePart1 = headlineText.replace(enSyriaRegex, "").trim().replace(/,\s*$/, "").trim();
      headlinePart2 = "Syria";
    }
  }

  // Resolve Subheadlines dynamically
  const subHeadlineLine1 = getLocalizedValue(
    section.subHeadlineLine1,
    lang,
    lang === "ar"
      ? (section.subHeadlineArLine1 || "أول متجر أقسام")
      : (section.subHeadlineEnLine1 || "Syria's first international")
  );

  const subHeadlineLine2 = getLocalizedValue(
    section.subHeadlineLine2,
    lang,
    lang === "ar"
      ? (section.subHeadlineArLine2 || "دولي فاخر في سوريا")
      : (section.subHeadlineEnLine2 || "luxury department store")
  );

  // Resolve Eyebrow dynamically
  const eyebrowText = getLocalizedValue(
    section.eyebrow,
    lang,
    lang === "ar"
      ? (section.eyebrowAr || "فاشن غيت بوليفارد")
      : (section.eyebrowEn || "Fashion Gate Boulevard")
  );

  // Resolve CTA Button dynamically
  const ctaLabel = getLocalizedValue(
    section.cta?.label,
    lang,
    lang === "ar"
      ? (section.cta?.labelAr || "من نحن")
      : (section.cta?.labelEn || section.ctaLabel || "About Us")
  );

  let ctaHref = section.ctaHref || `/about/${lang}`;
  if (section.cta) {
    if (section.cta.linkType === "internal") {
      const path = section.cta.internalLink || "/";
      ctaHref = path === "/" ? `/${lang}` : `${path}/${lang}`;
    } else {
      ctaHref = section.cta.externalLink || section.cta.href || `/about/${lang}`;
    }
  }
  const ctaType = section.cta?.type || "primary";

  return (
    <Box
      id={section.anchor || "arrival"}
      component="section"
      sx={{
        height: { xs: "calc(100svh - 115px)", md: "calc(100svh - 148px)" },
        minHeight: { xs: "calc(100svh - 115px)", md: "calc(100svh - 148px)" },
        position: "relative",
        overflow: "hidden",
        color: "#fff",
      }}
    >
      {/* Background Media Render */}
      {isVideoBg ? (
        <>
          <Box
            component="video"
            autoPlay
            loop
            muted
            playsInline
            src={section.bgVideo?.asset?.url || section.video?.asset?.url}
            sx={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
              filter: "brightness(0.86)",
              zIndex: 1,
              display: section.bgImageMobile?.asset ? { xs: "none", md: "block" } : "block"
            }}
          />
          {section.bgImageMobile?.asset && (
            <Box
              sx={{
                position: "absolute",
                inset: 0,
                filter: "brightness(0.86)",
                zIndex: 1,
                display: { xs: "block", md: "none" }
              }}
            >
              <Image
                src={bgImageUrlMobile}
                alt={headlineText || "Hero Background Mobile"}
                fill
                priority
                unoptimized
                style={{
                  objectFit: "cover",
                  objectPosition: section.mobileBgPosition || "63% center"
                }}
              />

            </Box>
          )}
        </>
      ) : (
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            filter: "brightness(0.86)",
            zIndex: 1,
          }}
        >
          {/* Desktop Background Image */}
          <Box
            sx={{
              display: { xs: "none", md: "block" },
              position: "absolute",
              inset: 0
            }}
          >
            <Image
              src={bgImageUrl}
              alt={headlineText || "Hero Background"}
              fill
              priority
              unoptimized
              style={{
                objectFit: "cover",
                objectPosition: "center"
              }}
            />
          </Box>
          {/* Mobile Background Image */}
          <Box
            sx={{
              display: { xs: "block", md: "none" },
              position: "absolute",
              inset: 0
            }}
          >
            <Image
              src={bgImageUrlMobile}
              alt={headlineText || "Hero Background Mobile"}
              fill
              priority
              unoptimized
              style={{
                objectFit: "cover",
                objectPosition: section.mobileBgPosition || "63% center"
              }}
            />

          </Box>
        </Box>
      )}


      {/* Dark Overlay */}
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          // backgroundColor: "rgba(0, 0, 0, 0.15)", 
          pointerEvents: "none",
          zIndex: 2,
        }}
      />

      {/* Typography Overlay Area */}
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          px: 3,
          textAlign: "center",
          pointerEvents: "none",
          zIndex: 10,
          marginTop: { xs: "0px", md: "100px" },
        }}
      >
        <Stack
          spacing={0.5}
          alignItems="flex-end"
          sx={{ maxWidth: "100%", width: "fit-content" }}
        >
          {/* Headline */}
          <Typography
            component="h1"
            className={lang === "ar" ? "animate-fade-in" : "animate-tracking"}
            sx={{
              fontFamily: "var(--heading-font)",
              fontSize: {
                xs: lang === "ar" ? "min(9.2vw, 2.4rem)" : "min(7.2vw, 2.4rem)",
                sm: "min(6.5vw, 4.2rem)",
                md: "min(6vw, 5.2rem)",
                lg: "6.5rem",
              },
              fontWeight:lang === "ar" ? 600 : 500,
              lineHeight: 0.9,
              textTransform: "uppercase",
              color: "#ffffff",
              letterSpacing: lang === "ar" ? "0 !important" : "0.06em",
              textShadow: "0 4px 25px rgba(0,0,0,0.5)",
              textAlign: "center",
              width: "100%",
              display:"inline-block"
            }}
          >
            {headlinePart2 ? (
              <>
                <Box component="span" sx={{ display: "block", lineHeight: 1.0, whiteSpace: { xs: "normal", sm: "nowrap" } }}>
                  {headlinePart1}
                </Box>
                <Box
                  component="span"
                  sx={{
                    display: "block",
                    fontSize: {
                      xs: lang === "ar" ? "0.7em" : "0.82em",
                      sm: "0.7em",
                      md: "0.7em",
                    },
                    fontWeight: 600,
                    letterSpacing: lang === "ar" ? "0 !important" : "0.15em",
                    opacity: 1,
                    mt: { xs: 0.5, sm: 1, md: 1.5 },
                    mr: lang === "ar" ? 0 : "-0.32em",
                    lineHeight: 1.1,
                    color: "#cb6116",
                    textShadow: "0 2px 15px rgba(0,0,0,0.85), 0 1px 3px rgba(0,0,0,0.9)"
                  }}
                >
                  {headlinePart2}
                </Box>
              </>
            ) : (
              headlineText
            )}
          </Typography>

          {/* Subheadline (Double Line) */}
          <Typography
            sx={{
              fontFamily: lang === "ar" ? '"DimaShekari", sans-serif' : '"Griphorium", "Griphosium", "Graphion", "Brush Script MT", cursive',
              fontSize: { xs: "1.25rem", sm: "min(2.5vw, 1.7rem)", md: "min(2.8vw, 2.3rem)" },
              color: "#ffffff",
              textTransform: "none",
              fontWeight: 400,
              alignSelf: lang === "ar" ? { xs: "flex-end", sm: "flex-end" } : "flex-end",
              mr: lang === "ar" ? { xs: 0, sm: "10rem !important" } : { xs: 1, md: 3 },
              mt: lang === "ar" ? "24px !important" : 1.2,
              lineHeight: lang === "ar" ? 1.3 : 1,
              textAlign: lang === "ar" ? { xs: "left", sm: "left" } : "right",
            }}
          >
            {lang === "ar" ? (
              <>
                <Box component="span" sx={{ marginLeft: { xs: "20px", sm: "70px" } }}>{subHeadlineLine1}</Box>
                <br />
                <Box component="span">{subHeadlineLine2}</Box>
              </>
            ) : (
              <>
                <Box component="span" sx={{ marginRight: { xs: 0, sm: "50px" } }}>{subHeadlineLine1}</Box>
                <br />
                <Box component="span">{subHeadlineLine2}</Box>
              </>
            )}
          </Typography>
        </Stack>
      </Box>

      {/* <Container
        maxWidth="xl"
        sx={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 12,
          pb: { xs: 3, md: 5 },
        }}
      >
        <Stack
          direction={{ xs: "column", md: "row" }}
          spacing={{ xs: 2.5, md: 3 }}
          alignItems={{ xs: "flex-start", md: "center" }}
          sx={{ width: "100%", justifyContent: "space-between" }}
        >
          <Typography
            className="animate-fade-in"
            sx={{
              maxWidth: 540,
              color: "rgba(255,255,255,.6)",
              fontSize: { xs: 10, md: 11 },
              letterSpacing: lang === "ar" ? 0 : "0.18em",
              lineHeight: 1.7,
              textTransform: "uppercase",
              fontFamily: '"Cairo", sans-serif',
            }}
          >
            {eyebrowText}
          </Typography>

          {ctaLabel && (
            <Button
              component={Link}
              href={ctaHref}
              endIcon={
                <ArrowForwardIcon
                  sx={{
                    mr: lang === "ar" ? 1 : 0,
                    ml: lang === "ar" ? 0 : 1,
                    transform: lang === "ar" ? "rotate(180deg)" : "none",
                  }}
                />
              }
              sx={{
                color: "#fff",
                border: ctaType === "link" ? "none" : "1px solid rgba(255,255,255,.28)",
                px: ctaType === "link" ? 1 : 4,
                py: ctaType === "link" ? 0.5 : 1.4,
                borderRadius: 0,
                textTransform: "none",
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: lang === "ar" ? 0 : "0.15em",
                pointerEvents: "auto",
                fontFamily: '"Cairo", sans-serif',
                transition: "all 0.3s ease",
                "&:hover": {
                  bgcolor: ctaType === "link" ? "transparent" : "#fff",
                  color: ctaType === "link" ? "primary.main" : "#050505",
                  borderColor: ctaType === "link" ? "none" : "#fff",
                },
              }}
            >
              {ctaLabel}
            </Button>
          )}
        </Stack>
      </Container> */}
    </Box>
  );
}
