"use client";

import { Box, Container, Stack, Typography } from "@mui/material";
import { motion } from "framer-motion";
import type { CollectionItem, Section } from "@/lib/types";
import { resolveImage } from "../Storefront";
import { getLocalizedValue } from "@/lib/sanity";

export default function CollectionsSection({ 
  section, 
  t, 
  lang 
}: { 
  section: Section; 
  t: (s?: string) => string; 
  lang: "ar" | "en"; 
}) {
  const fallbackCollections = [
    { title: "Designer Collections", headline: "Designer Collections", description: "A curated presentation of international fashion houses, avant-garde silhouettes, and seasonal runway selections for women and men.", imageUrl: "/brand/designer-collections.png" },
    { title: "Luxury Accessories & Leather Goods", headline: "Refined Details, Timeless Elegance", description: "Intimate displays of hand-finished leather accessories, fine timepieces, and bespoke pieces from the world's most distinguished creators.", imageUrl: "/brand/luxury-beauty.png" },
    { title: "MAKE UP", headline: "World-Renowned Beauty, Skincare & Perfume Houses", description: "An immersive destination at Fashion Gate Mall dedicated to the world's most prestigious cosmetic brands, advanced dermatological formulas, and rare signature scents. Experience tailored beauty consultations and discover exclusive seasonal collections curated for an elevated daily ritual.", imageUrl: "/brand/luxury-beauty.png" }
  ];
  const collections = (section.collections && section.collections.length > 0) 
    ? (section.collections as any[]) 
    : (fallbackCollections as any[]);

  // Resolve section localized fields using our helper
  const eyebrowText = getLocalizedValue(
    section.eyebrow,
    lang,
    lang === "ar" ? "الوجهات" : "The Departments"
  );

  const headlineText = getLocalizedValue(
    section.headline,
    lang,
    ""
  );

  const descriptionText = getLocalizedValue(
    section.description,
    lang,
    ""
  );

  return (
    <Box id={section.anchor} component="section" sx={{ py: { xs: 10, md: 16 }, bgcolor: "var(--fg-white)", color: "#111" }}>
      <Container maxWidth="xl">
        <Stack spacing={{ xs: 8, md: 12 }}>
          <Box sx={{ maxWidth: 840, textAlign: lang === "ar" ? "right" : "left" }}>
            <Typography sx={{ color: "primary.main", textTransform: "uppercase", fontSize: 12, fontWeight: 700, letterSpacing: lang === "ar" ? 0 : "0.18em", fontFamily: '"Cairo", sans-serif' }}>
              {eyebrowText}
            </Typography>
            <Typography sx={{ fontFamily: "var(--heading-font)", fontSize: { xs: 36, md: 54 }, fontWeight: 500, lineHeight: 1.15, mt: 1.5 }}>
              {headlineText}
            </Typography>
            <Typography sx={{ color: "rgba(0,0,0,.6)", fontSize: 16, lineHeight: 1.8, mt: 2, fontFamily: '"Cairo", sans-serif', maxWidth: 780 }}>
              {descriptionText}
            </Typography>
          </Box>
          
          <Stack spacing={{ xs: 8, md: 14 }}>
            {collections.map((item: CollectionItem, index) => {
              const image = resolveImage(item.coverImage, item.imageUrl);
              const isEven = index % 2 === 0;
              const isRtl = lang === "ar";
              const showReverse = isRtl ? isEven : !isEven;

              // Resolve item localized fields using our helper
              const itemTitle = getLocalizedValue(
                item.title,
                lang,
                isRtl ? (item.titleAr || "") : (item.titleEn || "")
              );

              const itemHeadline = getLocalizedValue(
                item.headline,
                lang,
                isRtl ? (item.headlineAr || "") : (item.headlineEn || "")
              );

              const itemDescription = getLocalizedValue(
                item.description,
                lang,
                isRtl ? (item.descriptionAr || "") : (item.descriptionEn || "")
              );

              return (
                <Box 
                  key={`${itemTitle}-${index}`}
                  sx={{ 
                    display: "flex", 
                    flexDirection: { xs: "column", md: showReverse ? "row-reverse" : "row" }, 
                    alignItems: "center",
                    gap: { xs: 4, md: 8, lg: 12 }
                  }}
                >
                  <Box 
                    sx={{ 
                      flex: 1.2, 
                      width: "100%",
                      aspectRatio: "16 / 11", 
                      overflow: "hidden",
                      boxShadow: "0 15px 35px rgba(0,0,0,0.06)",
                      border: "1px solid rgba(0,0,0,0.04)"
                    }}
                  >
                    <motion.img
                      initial={{ opacity: 0, scale: 1.03 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true, margin: "-100px" }}
                      transition={{ duration: 1, ease: "easeOut" }}
                      whileHover={{ scale: 1.03 }}
                      src={image}
                      alt={itemTitle}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        transition: "transform 0.8s cubic-bezier(0.25, 1, 0.5, 1)"
                      }}
                    />
                  </Box>

                  <Box 
                    sx={{ 
                      flex: 1, 
                      width: "100%",
                      display: "flex", 
                      flexDirection: "column",
                      justifyContent: "center",
                      textAlign: isRtl ? "right" : "left"
                    }}
                  >
                    <Typography 
                      sx={{ 
                        fontFamily: "var(--heading-font)", 
                        fontSize: { xs: 54, md: 80 }, 
                        fontWeight: 300, 
                        lineHeight: 1,
                        color: "rgba(203, 97, 22, 0.08)",
                        mb: -2,
                        userSelect: "none"
                      }}
                    >
                      {String(index + 1).padStart(2, "0")}
                    </Typography>

                    <Typography sx={{ color: "primary.main", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: lang === "ar" ? 0 : "0.15em", mb: 1, fontFamily: '"Cairo", sans-serif' }}>
                      {itemTitle}
                    </Typography>
                    <Typography sx={{ color: "#111111", fontFamily: "var(--heading-font)", fontSize: { xs: 28, md: 36 }, fontWeight: 500, mb: 2, lineHeight: 1.25 }}>
                      {itemHeadline}
                    </Typography>
                    <Typography sx={{ color: "rgba(0,0,0,0.65)", fontSize: 14, lineHeight: 1.8, fontFamily: '"Cairo", sans-serif', maxWidth: 480 }}>
                      {itemDescription}
                    </Typography>
                  </Box>
                </Box>
              );
            })}
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
}
