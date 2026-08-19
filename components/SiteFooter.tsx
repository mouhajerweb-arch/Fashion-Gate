"use client";

import { useEffect, useState } from "react";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import {
  SiTiktok,
  SiInstagram,
  SiFacebook,
  SiWhatsapp,
  SiYoutube,
  SiPinterest,
  SiSnapchat,
  SiX
} from "react-icons/si";
import { Box, Button, Container, IconButton, InputBase, Stack, Typography } from "@mui/material";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import { getFooterSettings, getLocalizedValue } from "@/lib/sanity";
import Tooltip from "./Tooltip";

export function resolvePath(href: string, lang: "ar" | "en") {
  if (!href || href === "/" || href.trim() === "") return `/${lang}`;
  if (href.startsWith("#")) return `/${lang}${href}`;
  if (href.startsWith("http://") || href.startsWith("https://")) return href;

  let cleanHref = href.replace(/^\/+|\/+$/g, "");
  if (cleanHref === "") return `/${lang}`;

  if (cleanHref === "designers" || cleanHref === "category/designers" || cleanHref.includes("designers")) {
    return `/brand/${lang}`;
  }

  const categories = ["women", "men", "perfumes", "skincare", "dining", "fashion", "designers"];
  const parts = cleanHref.split("/");
  const firstPart = parts[0];
  
  if (categories.includes(firstPart)) {
    cleanHref = `category/${cleanHref}`;
  }

  const partsList = cleanHref.split("/");
  const lastPart = partsList[partsList.length - 1];
  if (lastPart !== "ar" && lastPart !== "en") {
    return `/${cleanHref}/${lang}`;
  }
  return `/${cleanHref}`;
}

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

export default function SiteFooter() {
  const pathname = usePathname();
  const lang = (pathname?.endsWith("/ar") || pathname?.includes("/ar/") ? "ar" : "en") as "en" | "ar";
  
  const [settings, setSettings] = useState<any>(null);

  useEffect(() => {
    getFooterSettings().then((data) => {
      if (data) {
        setSettings(data);
      }
    });
  }, []);

  const description = getLocalizedValue(
    settings?.description,
    lang,
    lang === "ar"
      ? "أول وجهة للمتاجر الكبرى الفاخرة في سوريا. دمج الملابس الراقية، الجمال المنسق، والتسوق الحصري تحت رؤية معمارية حديثة."
      : "Syria's first luxury department destination. Integrating fine apparel, curated beauty, and bespoke boutique shopping under a modern architectural vision."
  );

  const exploreTitle = getLocalizedValue(
    settings?.exploreTitle,
    lang,
    lang === "ar" ? "استكشف" : "Explore"
  );

  const updatesTitle = getLocalizedValue(
    settings?.updatesTitle,
    lang,
    lang === "ar" ? "تحديثات مخصصة" : "Bespoke Updates"
  );

  const subscribeText = getLocalizedValue(
    settings?.subscribeText,
    lang,
    lang === "ar"
      ? "اشترك لتلقي الدعوات الخاصة، وإطلاق المجموعات الموسمية، وملاحظات مجلة الأتيلييه."
      : "Subscribe to receive private invitations, seasonal collection launches, and atelier journal notes."
  );

  const emailPlaceholder = getLocalizedValue(
    settings?.emailPlaceholder,
    lang,
    lang === "ar" ? "البريد الإلكتروني" : "Email address"
  );

  const copyrightText = getLocalizedValue(
    settings?.copyright,
    lang,
    lang === "ar" ? "جميع الحقوق محفوظة." : "All rights reserved."
  );
  const appVersion = process.env.NEXT_PUBLIC_APP_VERSION;

  const facebookUrl = settings?.facebookUrl || "#";
  const instagramUrl = settings?.instagramUrl || "#";
  const whatsAppUrl = settings?.whatsAppUrl || "#";
  const floatingWhatsAppUrl = settings?.floatingWhatsAppUrl || "#";
  const tiktokUrl = settings?.tiktokUrl || "#";
  const youtubeUrl = settings?.youtubeUrl || "#";
  const pinterestUrl = settings?.pinterestUrl || "#";
  const snapchatUrl = settings?.snapchatUrl || "#";
  const xUrl = settings?.xUrl || "#";

  // Resolve Quick Links
  const rawLinks = settings?.links || [
    { label: { en: "Home", ar: "الرئيسية" }, href: "" },
    { label: { en: "Women", ar: "سيدات" }, href: "#women" },
    { label: { en: "Men", ar: "رجال" }, href: "#men" },
    { label: { en: "Beauty", ar: "جمال" }, href: "#beauty" },
    { label: { en: "Home & Deco", ar: "منزل وديكور" }, href: "#home-deco" },
    { label: { en: "The Boulevard", ar: "البوليفارد" }, href: "#boulevard" },
    { label: { en: "Brand", ar: "العلامة" }, href: "about" },
    { label: { en: "Blogs", ar: "المدونة" }, href: "blogs" },
    { label: { en: "Contact", ar: "اتصل بنا" }, href: "contact" },
    { label: { en: "Atelier", ar: "الأتيلييه" }, href: "about" }
  ];

  const links = rawLinks
    .filter((link: any) => link.isEnabled !== false) // Skip disabled links
    .sort((a: any, b: any) => (a.order || 0) - (b.order || 0)) // Sort by display order
    .map((link: any) => ({
      label: getLocalizedValue(link.label, lang),
      href: link.href || ""
    }));

  // Append Terms and Conditions and Privacy Policy only if they are not already defined in the CMS list
  const hasTerms = rawLinks.some((link: any) => link.href === "terms" || link.href === "/terms");
  const hasPrivacy = rawLinks.some((link: any) => link.href === "privacy" || link.href === "/privacy");

  if (!hasTerms) {
    links.push({
      label: lang === "ar" ? "الشروط والأحكام" : "Terms & Conditions",
      href: "terms"
    });
  }

  if (!hasPrivacy) {
    links.push({
      label: lang === "ar" ? "سياسة الخصوصية" : "Privacy Policy",
      href: "privacy"
    });
  }

  return (
    <Box
      component="footer"
      dir={lang === "ar" ? "rtl" : "ltr"}
      sx={{
        bgcolor: "#FAF8F5",
        color: "#111111",
        borderTop: "1px solid rgba(0,0,0,0.06)",
        position: "relative",
        overflow: "hidden"
      }}
    >
      <Container maxWidth="xl" sx={{ pt: { xs: 8, md: 10 }, pb: { xs: 10, sm: 3 } }}>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "1.2fr 0.8fr 1fr" },
            gap: { xs: 5, md: 8 },
            alignItems: "start",
            pb: 6,
            borderBottom: "1px solid rgba(0,0,0,0.06)"
          }}
        >
          {/* Brand Info Column */}
          <Stack spacing={3} sx={{ textAlign: lang === "ar" ? "right" : "left" }}>
            <Stack direction="row" alignItems="center" sx={{ justifyContent: "flex-start", gap: lang === "ar" ? "12px" : "12px" }}>
              <Box
                sx={{
                  width: 48,
                  height: 48,
                  display: "grid",
                  placeItems: "center",
                  bgcolor: "#111111",
                  borderRadius: 0
                }}
              >
                <Box component="img" src="/brand/logo.png" alt="Fashion Gate" sx={{ width: 28, height: "auto" }} />
              </Box>
              <Stack spacing={0.1} sx={{ textAlign: lang === "ar" ? "right" : "left" }}>
                <Typography sx={{ fontFamily: "var(--heading-font)", fontSize: 20, fontWeight: 600, color: "#111111", lineHeight:lang === "ar" ?  1.3 : 1 }}>
                  {stretchArabicText(lang === "ar" ? "فاشن غيت" : "Fashion Gate", 2)}
                </Typography>
                 <Typography sx={{ color: "primary.main", fontSize: 9, fontWeight: 800, letterSpacing: lang === "ar" ? 0 : "0.2em", textTransform: "uppercase" }}>
                  {lang === "ar" ? "بوليفارد دمشق" : "Boulevard Damascus"}
                </Typography>
              </Stack>
            </Stack>

            <Typography sx={{ color: "rgba(0,0,0,0.6)", fontSize: 14.5, lineHeight: 1.8, maxWidth: 360, fontFamily: '"Cairo", sans-serif' }}>
              {description}
            </Typography>
          </Stack>

          {/* Quick Links Column */}
          <Stack spacing={2.5} sx={{ textAlign: lang === "ar" ? "right" : "left" }}>
            <Typography sx={{ color: "#111111", fontSize: 12, fontWeight: 800, letterSpacing: lang === "ar" ? 0 : "0.15em", textTransform: "uppercase", fontFamily: '"Cairo", sans-serif' }}>
              {exploreTitle}
            </Typography>
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 1.5
              }}
            >
              {links.map((link: any, index: number) => {
                 const destination = resolvePath(link.href, lang);

                return (
                  <Typography
                    key={index}
                    component={Link}
                    href={destination}
                    sx={{
                      color: "rgba(0,0,0,0.6)",
                      fontSize: 13.5,
                      textDecoration: "none",
                      fontWeight: 500,
                      transition: "color 0.3s ease",
                      fontFamily: '"Cairo", sans-serif',
                      "&:hover": { color: "primary.main" }
                    }}
                  >
                    {link.label}
                  </Typography>
                );
              })}
            </Box>
          </Stack>

          {/* Newsletter Column */}
          <Stack spacing={2.5} sx={{ textAlign: lang === "ar" ? "right" : "left" }}>
            <Typography sx={{ color: "#111111", fontSize: 12, fontWeight: 800, letterSpacing: lang === "ar" ? 0 : "0.15em", textTransform: "uppercase", fontFamily: '"Cairo", sans-serif' }}>
              {updatesTitle}
            </Typography>
            <Typography sx={{ color: "rgba(0,0,0,0.6)", fontSize: 14, lineHeight: 1.6, fontFamily: '"Cairo", sans-serif' }}>
              {subscribeText}
            </Typography>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                width: "100%",
                borderBottom: "1.5px solid rgba(0,0,0,0.16)",
                py: 0.6
              }}
            >
              <InputBase
                placeholder={emailPlaceholder}
                sx={{
                  flex: 1,
                  px: 0.5,
                  fontSize: 14,
                  color: "#111111",
                  fontFamily: '"Cairo", sans-serif',
                  "& input::placeholder": { color: "rgba(0,0,0,0.42)", opacity: 1 }
                }}
              />
              <IconButton sx={{ color: "#111111", p: 0.5, "&:hover": { color: "primary.main" }, transform: lang === "ar" ? "rotate(180deg)" : "none" }}>
                <ArrowForwardIcon sx={{ fontSize: 18 }} />
              </IconButton>
            </Box>
          </Stack>
        </Box>

        {/* Bottom Bar */}
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={3}
          justifyContent="space-between"
          alignItems="center"
          sx={{ pt: 4, pb: 2 }}
        >
          <Typography
            sx={{
              color: "rgba(0,0,0,0.48)",
              fontSize: 12.5,
              fontFamily: '"Cairo", sans-serif'
            }}
          >
            © {new Date().getFullYear()} {lang === "ar" ? "فاشن غيت مول" : "Fashion Gate Mall"}. {copyrightText}
            {appVersion && (
              <Box
                component="span"
                sx={{
                  color: "#FAF8F5",
                  userSelect: "text",
                  ml: lang === "ar" ? 0 : 1,
                  mr: lang === "ar" ? 1 : 0
                }}
              >
                v{appVersion}
              </Box>
            )}
          </Typography>

          {/* Social Links */}
          <Box
            sx={{
              display: "flex",
              gap: 0,
              flexWrap: "wrap",
              justifyContent: "center",
              // Shift social icons inward to prevent overlap with the floating WhatsApp button
              pr: lang === "en" ? { xs: 0, sm: 10 } : 0,
              pl: lang === "ar" ? { xs: 0, sm: 10 } : 0
            }}
          >
            {instagramUrl && instagramUrl !== "#" && (
              <Tooltip title={lang === "ar" ? "إنستغرام" : "Instagram"}>
                <IconButton
                  href={instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{
                    width: 38,
                    height: 38,
                    color: "rgba(0,0,0,0.56)",
                    bgcolor: "transparent",
                    transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
                    "&:hover": { 
                      color: "primary.main", 
                      bgcolor: "rgba(197, 160, 89, 0.08)", 
                      transform: "translateY(-4px)" 
                    }
                  }}
                >
                  <SiInstagram style={{ fontSize: 18 }} />
                </IconButton>
              </Tooltip>
            )}
            {facebookUrl && facebookUrl !== "#" && (
              <Tooltip title={lang === "ar" ? "فيسبوك" : "Facebook"}>
                <IconButton
                  href={facebookUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{
                    width: 38,
                    height: 38,
                    color: "rgba(0,0,0,0.56)",
                    bgcolor: "transparent",
                    transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
                    "&:hover": { 
                      color: "primary.main", 
                      bgcolor: "rgba(197, 160, 89, 0.08)", 
                      transform: "translateY(-4px)" 
                    }
                  }}
                >
                  <SiFacebook style={{ fontSize: 18 }} />
                </IconButton>
              </Tooltip>
            )}
            {whatsAppUrl && whatsAppUrl !== "#" && (
              <Tooltip title={lang === "ar" ? "واتساب" : "WhatsApp"}>
                <IconButton
                  href={whatsAppUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{
                    width: 38,
                    height: 38,
                    color: "rgba(0,0,0,0.56)",
                    bgcolor: "transparent",
                    transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
                    "&:hover": { 
                      color: "primary.main", 
                      bgcolor: "rgba(197, 160, 89, 0.08)", 
                      transform: "translateY(-4px)" 
                    }
                  }}
                >
                  <SiWhatsapp style={{ fontSize: 18 }} />
                </IconButton>
              </Tooltip>
            )}
            {tiktokUrl && tiktokUrl !== "#" && (
              <Tooltip title={lang === "ar" ? "تيك توك" : "TikTok"}>
                <IconButton
                  href={tiktokUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{
                    width: 38,
                    height: 38,
                    color: "rgba(0,0,0,0.56)",
                    bgcolor: "transparent",
                    transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
                    "&:hover": { 
                      color: "primary.main", 
                      bgcolor: "rgba(197, 160, 89, 0.08)", 
                      transform: "translateY(-4px)" 
                    }
                  }}
                >
                  <SiTiktok style={{ fontSize: 17 }} />
                </IconButton>
              </Tooltip>
            )}
            {youtubeUrl && youtubeUrl !== "#" && (
              <Tooltip title={lang === "ar" ? "يوتيوب" : "YouTube"}>
                <IconButton
                  href={youtubeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{
                    width: 38,
                    height: 38,
                    color: "rgba(0,0,0,0.56)",
                    bgcolor: "transparent",
                    transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
                    "&:hover": { 
                      color: "primary.main", 
                      bgcolor: "rgba(197, 160, 89, 0.08)", 
                      transform: "translateY(-4px)" 
                    }
                  }}
                >
                  <SiYoutube style={{ fontSize: 18 }} />
                </IconButton>
              </Tooltip>
            )}
            {pinterestUrl && pinterestUrl !== "#" && (
              <Tooltip title={lang === "ar" ? "بينتيريست" : "Pinterest"}>
                <IconButton
                  href={pinterestUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{
                    width: 38,
                    height: 38,
                    color: "rgba(0,0,0,0.56)",
                    bgcolor: "transparent",
                    transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
                    "&:hover": { 
                      color: "primary.main", 
                      bgcolor: "rgba(197, 160, 89, 0.08)", 
                      transform: "translateY(-4px)" 
                    }
                  }}
                >
                  <SiPinterest style={{ fontSize: 18 }} />
                </IconButton>
              </Tooltip>
            )}
            {snapchatUrl && snapchatUrl !== "#" && (
              <Tooltip title={lang === "ar" ? "سناب شات" : "Snapchat"}>
                <IconButton
                  href={snapchatUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{
                    width: 38,
                    height: 38,
                    color: "rgba(0,0,0,0.56)",
                    bgcolor: "transparent",
                    transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
                    "&:hover": { 
                      color: "primary.main", 
                      bgcolor: "rgba(197, 160, 89, 0.08)", 
                      transform: "translateY(-4px)" 
                    }
                  }}
                >
                  <SiSnapchat style={{ fontSize: 18 }} />
                </IconButton>
              </Tooltip>
            )}
            {xUrl && xUrl !== "#" && (
              <Tooltip title={lang === "ar" ? "إكس (تويتر)" : "X (Twitter)"}>
                <IconButton
                  href={xUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{
                    width: 38,
                    height: 38,
                    color: "rgba(0,0,0,0.56)",
                    bgcolor: "transparent",
                    transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
                    "&:hover": { 
                      color: "primary.main", 
                      bgcolor: "rgba(197, 160, 89, 0.08)", 
                      transform: "translateY(-4px)" 
                    }
                  }}
                >
                  <SiX style={{ fontSize: 15 }} />
                </IconButton>
              </Tooltip>
            )}
          </Box>
        </Stack>
      </Container>

      {/* Sleek Floating WhatsApp Button */}
      {/* <IconButton
        href={floatingWhatsAppUrl}
        aria-label="WhatsApp"
        sx={{
          position: "fixed",
          right: lang === "ar" ? "auto" : { xs: 16, md: 24 },
          left: lang === "ar" ? { xs: 16, md: 24 } : "auto",
          bottom: { xs: 16, md: 24 },
          zIndex: 90,
          bgcolor: "#111111",
          color: "#ffffff",
          width: 50,
          height: 50,
          border: "1px solid rgba(255,255,255,0.08)",
          boxShadow: "0 12px 30px rgba(0,0,0,0.16)",
          transition: "all 0.3s ease",
          "&:hover": { bgcolor: "primary.main", transform: "translateY(-2px)" }
        }}
      >
        <SiWhatsapp style={{ fontSize: 22 }} />
      </IconButton> */}
    </Box>
  );
}
