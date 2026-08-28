"use client";

import { Box, Container, Stack, Typography } from "@mui/material";
import { getLocalizedValue } from "@/lib/sanity";
import { resolveImage } from "../Storefront";
import Image from "next/image";

export default function AtelierShowcaseSection({ 
  section,
  t, 
  lang 
}: { 
  section?: any;
  t?: (s?: string) => string; 
  lang: "ar" | "en"; 
}) {
  const eyebrowText = getLocalizedValue(
    section?.eyebrow,
    lang,
    lang === "ar" ? "الفضاء المعماري" : "The Atelier Space"
  );

  const headlineText = getLocalizedValue(
    section?.headline,
    lang,
    lang === "ar" ? "مساحات أتيلييه البوليفارد" : "Outlet architectural spaces"
  );

  const descriptionText = getLocalizedValue(
    section?.description,
    lang,
    lang === "ar" 
      ? "عش التجربة المادية الكامنة وراء أول وجهة تسوق فاخرة في سوريا. حوار منسق بين المهارة الحرفية الحجرية ومساحات العملاء الخاصة."
      : "Experience the physical concept behind Syria's first luxury shopping destination. A curated dialogue between stone craftsmanship and intimate client spaces."
  );

  // Left card fields
  const leftImage = resolveImage(section?.leftCard?.image, "");
  const leftEyebrow = getLocalizedValue(
    section?.leftCard?.eyebrow,
    lang,
    lang === "ar" ? "المنظور الخارجي" : "Exterior concept"
  );
  const leftTitle = getLocalizedValue(
    section?.leftCard?.title,
    lang,
    lang === "ar" ? "واجهة البوليفارد" : "The Boulevard facade"
  );
  const leftDesc = getLocalizedValue(
    section?.leftCard?.description,
    lang,
    lang === "ar"
      ? "دمج التفاصيل الحجرية التراثية مع خطوط التصميم العصرية، مما يخلق حضوراً لافتاً في قلب حي التسوق."
      : "Merging heritage masonry accents with structural glass lines, framing a prominent presence on the shopping avenue."
  );

  // Right card fields
  const rightImage = resolveImage(section?.rightCard?.image, "");
  const rightEyebrow = getLocalizedValue(
    section?.rightCard?.eyebrow,
    lang,
    lang === "ar" ? "المساحات الداخلية" : "Interior design"
  );
  const rightTitle = getLocalizedValue(
    section?.rightCard?.title,
    lang,
    lang === "ar" ? "صالونات العرض الخاصة" : "The private shopping salons"
  );
  const rightDesc = getLocalizedValue(
    section?.rightCard?.description,
    lang,
    lang === "ar"
      ? "أجنحة مخصصة ومصممة بمواد طبيعية دافئة لاستقبال العملاء في جلسات معينة هادئة واستشارات مخصصة."
      : "Intimate dressing suites finished in raw natural plaster, travertine and soft textiles, designed for private luxury consultations."
  );

  return (
    <Box component="section" id={section?.anchor || "boulevard"} sx={{ bgcolor: "#FAF8F5", color: "#111111", py: { xs: 10, md: 14 }, borderTop: "1px solid rgba(0,0,0,0.06)" }}>
      <Container maxWidth="xl">
        <Stack spacing={{ xs: 6, md: 8 }}>
          
          <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "0.9fr 1.1fr" }, gap: { xs: 3, md: 8 }, alignItems: "end" }}>
            <Box sx={{ textAlign: lang === "ar" ? "right" : "left" }}>
              <Typography sx={{ color: "primary.main", textTransform: "uppercase", fontSize: 11, fontWeight: 800, letterSpacing: lang === "ar" ? 0 : "0.2em", mb: 1.5, fontFamily: '"Cairo", sans-serif' }}>
                {eyebrowText}
              </Typography>
              <Typography sx={{ fontFamily: "var(--heading-font)", fontSize: { xs: 36, md: 58 }, lineHeight: 1.05, fontWeight: 500 }}>
                {headlineText}
              </Typography>
            </Box>
            <Typography sx={{ color: "rgba(0,0,0,0.62)", fontSize: 15, lineHeight: 1.8, maxWidth: 680, textAlign: lang === "ar" ? "right" : "left", fontFamily: '"Cairo", sans-serif' }}>
              {descriptionText}
            </Typography>
          </Box>

          <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" }, gap: { xs: 4, md: 6 } }}>
            {/* Left Card */}
            <Box 
              sx={{ 
                display: "flex", 
                flexDirection: "column", 
                border: "1px solid rgba(0,0,0,0.05)",
                bgcolor: "#ffffff",
                overflow: "hidden"
              }}
            >
              <Box 
                sx={{ 
                  aspectRatio: "16 / 11", 
                  overflow: "hidden", 
                  position: "relative",
                  "& img": {
                    transition: "transform 0.8s cubic-bezier(0.25, 1, 0.5, 1)"
                  },
                  "& img:hover": {
                    transform: "scale(1.03)"
                  }
                }}
              >
                <Image 
                  src={leftImage || "/brand/logo.png"}
                  alt={leftTitle}
                  fill
                  sizes="(max-width: 600px) 100vw, 50vw"
                  style={{ 
                    objectFit: "cover"
                  }}
                />
              </Box>
              <Stack spacing={1.5} sx={{ p: { xs: 3, md: 4 }, textAlign: lang === "ar" ? "right" : "left" }}>
                <Typography sx={{ color: "primary.main", fontSize: 10, fontWeight: 800, letterSpacing: lang === "ar" ? 0 : "0.14em", textTransform: "none", fontFamily: '"Cairo", sans-serif' }}>
                  {leftEyebrow}
                </Typography>
                <Typography sx={{ fontFamily: "var(--heading-font)", fontSize: 24, fontWeight: 500 }}>
                  {leftTitle}
                </Typography>
                <Typography sx={{ color: "rgba(0,0,0,0.58)", fontSize: 13.5, lineHeight: 1.6, fontFamily: '"Cairo", sans-serif' }}>
                  {leftDesc}
                </Typography>
              </Stack>
            </Box>

            {/* Right Card */}
            <Box 
              sx={{ 
                display: "flex", 
                flexDirection: "column", 
                border: "1px solid rgba(0,0,0,0.05)",
                bgcolor: "#ffffff",
                overflow: "hidden"
              }}
            >
              <Box 
                sx={{ 
                  aspectRatio: "16 / 11", 
                  overflow: "hidden", 
                  position: "relative",
                  "& img": {
                    transition: "transform 0.8s cubic-bezier(0.25, 1, 0.5, 1)"
                  },
                  "& img:hover": {
                    transform: "scale(1.03)"
                  }
                }}
              >
                <Image 
                  src={rightImage || "/brand/logo.png"}
                  alt={rightTitle}
                  fill
                  sizes="(max-width: 600px) 100vw, 50vw"
                  style={{ 
                    objectFit: "cover"
                  }}
                />
              </Box>
              <Stack spacing={1.5} sx={{ p: { xs: 3, md: 4 }, textAlign: lang === "ar" ? "right" : "left" }}>
                <Typography sx={{ color: "primary.main", fontSize: 10, fontWeight: 800, letterSpacing: lang === "ar" ? 0 : "0.14em", textTransform: "none", fontFamily: '"Cairo", sans-serif' }}>
                  {rightEyebrow}
                </Typography>
                <Typography sx={{ fontFamily: "var(--heading-font)", fontSize: 24, fontWeight: 500 }}>
                  {rightTitle}
                </Typography>
                <Typography sx={{ color: "rgba(0,0,0,0.58)", fontSize: 13.5, lineHeight: 1.6, fontFamily: '"Cairo", sans-serif' }}>
                  {rightDesc}
                </Typography>
              </Stack>
            </Box>
          </Box>
        </Stack>
      </Container>
    </Box>
  );
}
