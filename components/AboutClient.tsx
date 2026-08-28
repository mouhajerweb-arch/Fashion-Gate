"use client";

import { useEffect, useMemo, useState } from "react";
import { Box, Button, Container, Stack, Typography, ThemeProvider, createTheme, Divider, IconButton, Link as MuiLink } from "@mui/material";
import Grid from "@mui/material/Grid"; // Unified MUI v6 Grid
import { useRouter } from "next/navigation";
import Link from "next/link";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import CloseIcon from "@mui/icons-material/Close";
import FullscreenIcon from "@mui/icons-material/Fullscreen";

import { getLocalizedValue, getAboutPageData } from "@/lib/sanity";
import FaqSection from "@/components/storefront/FaqSection";

export default function AboutClient({ initialLang, initialData }: { initialLang: "en" | "ar"; initialData?: any }) {
  const router = useRouter();
  const [lang, setLang] = useState<"en" | "ar">(initialLang);
  const [pageData, setPageData] = useState<any>(initialData);
  const [videoOpen, setVideoOpen] = useState(false);
  const [isPlayingInline, setIsPlayingInline] = useState(false);

  // Fetch live CMS data on client mount and scroll to top
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
    router.replace(`/about/${nextLang}`);
  };

  const theme = useMemo(() => createTheme({
    palette: {
      mode: "light",
      primary: { main: "#CB6116", dark: "#9D430C" },
      secondary: { main: "#D06010" },
      background: { default: "#FAF8F5", paper: "#ffffff" }
    },
    typography: {
      fontFamily: `"Cairo", sans-serif`,
      button: { fontWeight: 800 }
    },
    shape: { borderRadius: 0 }
  }), []);

  const fallbackData = {
    en: {
      title: "About Fashion Gate",
      eyebrow: "Damascus Boulevard Showroom",
      headline: "Syria’s Premier Luxury Retail Destination",
      p1: "Fashion Gate is Syria’s premier luxury retail destination, bringing together the world of international fashion, beauty, and lifestyle in one distinguished environment.",
      p2: "Located at Damascus Boulevard, one of Syria’s emerging premium commercial and tourism destinations, Fashion Gate introduces a new concept of luxury shopping built around elegance, discovery, and exceptional experiences.",
      p3: "Inspired by the world’s most renowned luxury destinations, Fashion Gate offers a carefully curated selection of fashion, beauty, and lifestyle collections, bringing together exceptional brands and memorable experiences under one roof.",
      p4: "From timeless fashion and accessories to beauty, lifestyle products, and exclusive in-store experiences, Fashion Gate celebrates individuality, craftsmanship, and modern luxury. Every detail has been thoughtfully designed to create an atmosphere where customers can explore, connect, and enjoy an elevated shopping experience.",
      p5: "More than just a shopping destination, Fashion Gate is a place where fashion, culture, and hospitality come together. With its elegant interiors, curated spaces, and signature coffee shop, it offers visitors a welcoming environment to relax, discover new collections, and enjoy moments beyond traditional retail.",
      p6: "As part of Damascus Boulevard’s vision to create a vibrant destination for commerce, tourism, and lifestyle, Fashion Gate represents a new chapter for luxury retail in Damascus. It aims to become a destination where fashion enthusiasts, families, and visitors can experience quality, elegance, and exceptional service.",
      p7: "At Fashion Gate, luxury is not only about the brands we present. It is about the experience we create, the atmosphere we offer, and the memories our customers take with them.",
      
      visionTitle: "Our Vision",
      visionText: "Our vision is to establish Fashion Gate as Syria’s leading luxury lifestyle destination by bringing together international fashion, exceptional service, and a unique customer experience. We aim to create a place where fashion, culture, and lifestyle meet, offering customers an inspiring destination to discover, experience, and celebrate modern luxury.",
      
      commitmentTitle: "Our Commitment",
      commitmentText: "At Fashion Gate, we are committed to delivering excellence in every detail. From our carefully selected collections to our thoughtfully designed spaces and personalized service, we strive to create an experience built on quality, elegance, and trust. Every visit to Fashion Gate is designed to be more than a shopping experience. It is an opportunity to discover a world of style, inspiration, and luxury.",

      videoTitle: "THE ATELIER EXPERIENCE",
      videoSubtitle: "Explore our spatial design walkthrough"
    },
    ar: {
      title: "عن فاشن غيت",
      eyebrow: "معرض بوليفارد دمشق",
      headline: "القمة المطلقة للفخامة والتسوق في سوريا",
      p1: "فاشن غيت هي وجهة التجزئة الفاخرة الرائدة في سوريا، حيث تجمع بين عالم الموضة العالمية، الجمال، وأسلوب الحياة في بيئة واحدة متميزة.",
      p2: "تقع فاشن غيت في بوليفارد دمشق، وهو أحد الوجهات التجارية والسياحية الراقية الناشئة في سوريا، وتقدم مفهوماً جديداً للتسوق الفاخر القائم على الأناقة والاكتشاف والتجارب الاستثنائية.",
      p3: "مستوحاة من أشهر وجهات الفخامة في العالم، تقدم فاشن غيت تشكيلة منسقة بعناية من أزياء وجمال وأسلوب حياة، لتجمع العلامات التجارية الاستثنائية والتجارب التي لا تُنسى تحت سقف واحد.",
      p4: "من الأزياء والإكسسوارات الخالدة إلى منتجات الجمال وأسلوب الحياة والتجارب الحصرية داخل المتجر، تحتفل فاشن غيت بالفردية والحرفية والفخامة الحديثة. تم تصميم كل التفاصيل بعناية لخلق جو يمكن العملاء من الاكتشاف والاستمتاع بتجربة تسوق راقية.",
      p5: "أكثر من مجرد وجهة تسوق، فاشن غيت هي مكان تلتقي فيه الموضة والثقافة والضيافة. مع تصميماتها الداخلية الأنيقة، ومساحاتها المنسقة، ومقهى التوقيع الخاص بها، فإنها توفر للزوار بيئة ترحيبية للاسترخاء واكتشاف المجموعات الجديدة والاستمتاع بلحظات تتجاوز البيع بالتجزئة التقليدي.",
      p6: "كجزء من رؤية بوليفارد دمشق لخلق وجهة حيوية للتجارة والسياحة وأسلوب الحياة، تمثل فاشن غيت فصلاً جديداً لتجزئة الفخامة في دمشق. وتهدف إلى أن تصبح وجهة يمكن لعشاق الموضة والعائلات والزوار تجربة الجودة والأناقة والخدمة الاستثنائية.",
      p7: "في فاشن غيت، لا تقتصر الفخامة على العلامات التجارية التي نقدمها فحسب. بل تتعلق بالتجربة التي نخلقها، والأجواء التي نوفرها، والذكريات التي يأخذها عملاؤنا معهم.",
      
      visionTitle: "رؤيتنا",
      visionText: "تتمثل رؤيتنا في تأسيس فاشن غيت كوجهة رائدة لأسلوب الحياة الفاخر في سوريا من خلال الجمع بين الموضة العالمية، والخدمة الاستثنائية، وتجربة العملاء الفريدة. ونهدف إلى خلق مكان تلتقي فيه الموضة والثقافة وأسلوب الحياة، لنقدم للعملاء وجهة ملهمة لاكتشاف وتجربة والاحتفاء بالفخامة الحديثة.",
      
      commitmentTitle: "التزامنا",
      commitmentText: "في فاشن غيت، نحن ملتزمون بتقديم التميز في كل تفصيل. من مجموعاتنا المختارة بعناية إلى مساحاتنا المصممة بدقة والخدمة الشخصية، نسعى جاهدين لخلق تجربة مبنية على الجودة والأناقة والثقة. تم تصميم كل زيارة إلى فاشن غيت لتكون أكثر من مجرد تجربة تسوق؛ إنها فرصة لاكتشاف عالم من الأناقة والإلهام والفخامة.",

      videoTitle: "صالون فاشن غيت بوليفارد دمشق",
      videoSubtitle: "شاهد عرض المساحات والخدمات الخاصة"
    }
  }[lang];

  // Resolve values dynamically from live Sanity CMS data
  const data = pageData || initialData;
  const title = getLocalizedValue(data?.title, lang, fallbackData.title);
  const eyebrow = getLocalizedValue(data?.eyebrow, lang, fallbackData.eyebrow);
  const headline = getLocalizedValue(data?.headline, lang, fallbackData.headline);
  const p1 = getLocalizedValue(data?.p1, lang, fallbackData.p1);
  const p2 = getLocalizedValue(data?.p2, lang, fallbackData.p2);
  const p3 = getLocalizedValue(data?.p3, lang, fallbackData.p3);
  const p4 = getLocalizedValue(data?.p4, lang, fallbackData.p4);
  const p5 = getLocalizedValue(data?.p5, lang, fallbackData.p5);
  const p6 = getLocalizedValue(data?.p6, lang, fallbackData.p6);
  const p7 = getLocalizedValue(data?.p7, lang, fallbackData.p7);
  const visionTitle = getLocalizedValue(data?.visionTitle, lang, fallbackData.visionTitle);
  const visionText = getLocalizedValue(data?.visionText, lang, fallbackData.visionText);
  const commitmentTitle = getLocalizedValue(data?.commitmentTitle, lang, fallbackData.commitmentTitle);
  const commitmentText = getLocalizedValue(data?.commitmentText, lang, fallbackData.commitmentText);
  const videoTitle = getLocalizedValue(data?.videoTitle, lang, fallbackData.videoTitle);
  const videoSubtitle = getLocalizedValue(data?.videoSubtitle, lang, fallbackData.videoSubtitle);

  const heroImage = data?.heroImage?.asset?.url || "";
  const collageImage1 = data?.collageImage1?.asset?.url || "";
  const collageImage2 = data?.collageImage2?.asset?.url || "";
  console.log("About Page Images Debug:", { 
    collageImage1, 
    collageImage2, 
    rawImage1: data?.collageImage1, 
    rawImage2: data?.collageImage2,
    allDataKeys: data ? Object.keys(data) : null
  });
  const videoBgImage = data?.videoBgImage?.asset?.url || "";
  const videoSourceType = data?.videoSourceType || (data?.videoFile?.asset?.url ? "file" : "url");
  const videoFileUrl = data?.videoFile?.asset?.url;
  const videoUrl = data?.videoUrl || "https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1&mute=1";

  return (
    <ThemeProvider theme={theme}>
      <Box 
        dir={lang === "ar" ? "rtl" : "ltr"}
        sx={{ 
          bgcolor: "#FAF8F5", 
          color: "#111111", 
          minHeight: "100vh", 
          display: "flex", 
          flexDirection: "column" 
        }}
      >


        {/* SECTION 1: Pretty Light Mode Parallax Banner */}
        <Box 
          sx={{
            position: "relative",
            backgroundImage: `url('${heroImage}')`,
            backgroundAttachment: "fixed",
            backgroundSize: "cover",
            backgroundPosition: "center",
            py: { xs: 12, md: 22 },
            textAlign: "center",
            "&::before": {
              content: '""',
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              bgcolor: "rgba(250, 248, 245, 0.88)", // Premium light stone/champagne overlay
              zIndex: 1
            }
          }}
        >
          <Container maxWidth="lg" sx={{ position: "relative", zIndex: 2 }}>
            <Stack spacing={3} alignItems="center">
              <Typography sx={{ color: "primary.main", textTransform: "uppercase", fontSize: 13, fontWeight: 800, letterSpacing: lang === "ar" ? 0 : "0.3em", fontFamily: '"Cairo", sans-serif' }}>
                {eyebrow}
              </Typography>
              <Typography sx={{ fontFamily: "var(--heading-font)", fontSize: { xs: 34, sm: 48, md: 64 }, fontWeight: 500, lineHeight: 1.15, color: "#111111", maxWidth: 900 }}>
                {title}
              </Typography>
              <Divider sx={{ borderColor: "rgba(203, 97, 22, 0.2)", width: "80px", my: 2 }} />
              <Typography sx={{ color: "rgba(17, 17, 17, 0.8)", fontSize: 16, maxWidth: 680, fontFamily: '"Cairo", sans-serif', lineHeight: 1.6, fontWeight: 600 }}>
                {headline}
              </Typography>
            </Stack>
          </Container>
        </Box>

        {/* SECTION 2: Detailed Text & Collage Grid */}
        <Container maxWidth="xl" sx={{ py: { xs: 10, md: 16 } }}>
          <Grid container spacing={{ xs: 6, md: 10 }} alignItems="flex-start">
            
            {/* Narrative Content */}
            <Grid size={{ xs: 12, md: 7 }}>
              <Stack spacing={4} textAlign={lang === "ar" ? "right" : "left"}>
                
                <Box sx={{ borderLeft: lang === "en" ? "3px solid #CB6116" : "none", borderRight: lang === "ar" ? "3px solid #CB6116" : "none", px: 3 }}>
                  <Typography sx={{ fontSize: { xs: 18, md: 22 }, lineHeight: 1.7, fontWeight: 500, color: "#111111", fontFamily: '"Cairo", sans-serif' }}>
                    {p1}
                  </Typography>
                </Box>

                <Typography sx={{ fontSize: 15.5, lineHeight: 1.9, color: "rgba(17, 17, 17, 0.72)", fontFamily: '"Cairo", sans-serif' }}>
                  {p2}
                </Typography>

                <Typography sx={{ fontSize: 15.5, lineHeight: 1.9, color: "rgba(17, 17, 17, 0.72)", fontFamily: '"Cairo", sans-serif' }}>
                  {p3}
                </Typography>

                <Typography sx={{ fontSize: 15.5, lineHeight: 1.9, color: "rgba(17, 17, 17, 0.72)", fontFamily: '"Cairo", sans-serif' }}>
                  {p4}
                </Typography>

                <Typography sx={{ fontSize: 15.5, lineHeight: 1.9, color: "rgba(17, 17, 17, 0.72)", fontFamily: '"Cairo", sans-serif' }}>
                  {p5}
                </Typography>

                <Typography sx={{ fontSize: 15.5, lineHeight: 1.9, color: "rgba(17, 17, 17, 0.72)", fontFamily: '"Cairo", sans-serif' }}>
                  {p6}
                </Typography>

                <Typography sx={{ fontSize: 16, lineHeight: 1.8, fontWeight: 700, color: "primary.main", fontFamily: '"Cairo", sans-serif', fontStyle: "italic" }}>
                  {p7}
                </Typography>

              </Stack>
            </Grid>

            {/* Collage Column */}
            <Grid size={{ xs: 12, md: 5 }}>
              <Box sx={{ position: "relative", width: "100%", height: { xs: "360px", sm: "480px", md: "600px" } }}>
                {/* Main Vertical Image */}
                <Box 
                  sx={{
                    position: "absolute",
                    top: 0,
                    [lang === "ar" ? "right" : "left"]: 0,
                    width: "75%",
                    height: "85%",
                    bgcolor: "#eae5df",
                    boxShadow: "0 20px 45px rgba(0,0,0,0.08)",
                    border: "1px solid rgba(0,0,0,0.04)",
                    overflow: "hidden"
                  }}
                >
                  {collageImage1 && collageImage1 !== "" ? (
                    <Box 
                      component="img"
                      src={collageImage1}
                      alt="Luxury showroom display"
                      sx={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover"
                      }}
                    />
                  ) : null}
                </Box>
                
                {/* Overlapping Floating Image */}
                <Box 
                  sx={{
                    position: "absolute",
                    bottom: 0,
                    [lang === "ar" ? "left" : "right"]: 0,
                    width: "55%",
                    height: "55%",
                    bgcolor: "#f2ece4",
                    boxShadow: "0 30px 60px rgba(0,0,0,0.15)",
                    // border: "3px solid #FAF8F5",
                    zIndex: 2,
                    overflow: "hidden"
                  }}
                >
                  {collageImage2 && collageImage2 !== "" ? (
                    <Box 
                      component="img"
                      src={collageImage2}
                      alt="Atelier detail display"
                      sx={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover"
                      }}
                    />
                  ) : null}
                </Box>
              </Box>
            </Grid>

          </Grid>
        </Container>

        {/* SECTION 3: Video Atelier Section */}
        <Box sx={{ py: { xs: 10, md: 14 }, bgcolor: "#FAF8F5" }}>
          <Container maxWidth="xl">
            {/* Section Header */}
            <Stack spacing={1.5} alignItems="center" sx={{ textAlign: "center", mb: 5 }}>
              <Typography sx={{ color: "#CB6116", fontSize: 13, fontWeight: 700, letterSpacing: lang === "ar" ? 0 : "0.1em", textTransform: "uppercase", fontFamily: '"Cairo", sans-serif' }}>
                {lang === "ar" ? "معرض البوليفارد والتصميم" : "ATELIER & SPATIAL EXPERIENCE"}
              </Typography>
              <Typography sx={{ fontFamily: "var(--heading-font)", fontSize: { xs: 28, md: 40 }, fontWeight: 500, color: "#111111", letterSpacing: "0.02em" }}>
                {videoTitle}
              </Typography>
              <Divider sx={{ borderColor: "rgba(203, 97, 22, 0.3)", width: 60, my: 1 }} />
              <Typography sx={{ color: "rgba(17, 17, 17, 0.7)", fontSize: 15, fontFamily: '"Cairo", sans-serif', maxWidth: 640, lineHeight: 1.6 }}>
                {videoSubtitle}
              </Typography>
            </Stack>

            {/* Video Showcase Card Frame */}
            <Box 
              sx={{
                position: "relative",
                width: "100%",
                aspectRatio: "16 / 9",
                maxHeight: { xs: "380px", sm: "520px", md: "620px" },
                borderRadius: "2px",
                overflow: "hidden",
                bgcolor: "#0D0B0A",
                boxShadow: "0 25px 60px rgba(0,0,0,0.18)",
                border: "1px solid rgba(203, 97, 22, 0.25)",
                transition: "all 0.5s ease"
              }}
            >
              {isPlayingInline ? (
                /* INLINE ACTIVE VIDEO PLAYER */
                <Box sx={{ position: "relative", width: "100%", height: "100%", bgcolor: "#000" }}>
                  {/* Top Control Overlay inside Frame */}
                  <Box 
                    sx={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      right: 0,
                      p: 2,
                      background: "linear-gradient(to bottom, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0) 100%)",
                      zIndex: 10,
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center"
                    }}
                  >
                    <Typography sx={{ color: "#FFF", fontSize: 13, fontWeight: 600, letterSpacing: lang === "ar" ? 0 : "0.05em", fontFamily: '"Cairo", sans-serif' }}>
                      {videoTitle}
                    </Typography>

                    <Stack direction="row" spacing={1}>
                      <Button
                        size="small"
                        onClick={() => setVideoOpen(true)}
                        startIcon={<FullscreenIcon />}
                        sx={{
                          color: "#FFF",
                          borderColor: "rgba(255,255,255,0.3)",
                          bgcolor: "rgba(255,255,255,0.15)",
                          fontSize: 12,
                          px: 1.5,
                          "&:hover": { bgcolor: "rgba(255,255,255,0.3)" }
                        }}
                      >
                        {lang === "ar" ? "عرض كامل" : "Full View"}
                      </Button>
                      <IconButton 
                        onClick={() => setIsPlayingInline(false)}
                        sx={{ color: "#FFF", bgcolor: "rgba(255,255,255,0.2)", "&:hover": { bgcolor: "primary.main" } }}
                        size="small"
                      >
                        <CloseIcon fontSize="small" />
                      </IconButton>
                    </Stack>
                  </Box>

                  {/* Active Inline Player */}
                  {videoSourceType === "file" && videoFileUrl ? (
                    <video 
                      src={videoFileUrl} 
                      controls 
                      autoPlay 
                      playsInline 
                      style={{ width: "100%", height: "100%", objectFit: "contain" }}
                    />
                  ) : (
                    <iframe 
                      src={videoUrl.includes("autoplay=") ? videoUrl : `${videoUrl}${videoUrl.includes("?") ? "&" : "?"}autoplay=1&mute=0`} 
                      title="Atelier Video View" 
                      frameBorder="0" 
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                      allowFullScreen
                      style={{ width: "100%", height: "100%", border: "none" }}
                    />
                  )}
                </Box>
              ) : (
                /* ELEGANT COVER & PREVIEW OVERLAY */
                <Box 
                  sx={{
                    position: "relative",
                    width: "100%",
                    height: "100%",
                    backgroundImage: `url('${videoBgImage}')`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    "&::before": {
                      content: '""',
                      position: "absolute",
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      background: "linear-gradient(180deg, rgba(15, 12, 10, 0.25) 0%, rgba(15, 12, 10, 0.55) 100%)",
                      zIndex: 1,
                      transition: "background 0.4s ease"
                    },
                    "&:hover::before": {
                      background: "linear-gradient(180deg, rgba(15, 12, 10, 0.15) 0%, rgba(15, 12, 10, 0.45) 100%)"
                    }
                  }}
                  onClick={() => setIsPlayingInline(true)}
                >
                  <Stack spacing={2.5} alignItems="center" sx={{ position: "relative", zIndex: 2, textAlign: "center", px: 3 }}>
                    
                    {/* Animated Pulsing Play Button */}
                    <Box sx={{ position: "relative", display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
                      <Box 
                        sx={{
                          position: "absolute",
                          width: 96,
                          height: 96,
                          borderRadius: "50%",
                          border: "1.5px solid rgba(255, 255, 255, 0.5)",
                          animation: "pulseRing 2.2s infinite ease-out",
                          "@keyframes pulseRing": {
                            "0%": { transform: "scale(0.85)", opacity: 0.8 },
                            "100%": { transform: "scale(1.45)", opacity: 0 }
                          }
                        }}
                      />
                      <IconButton 
                        sx={{ 
                          background: "linear-gradient(135deg, #CB6116 0%, #9D430C 100%)", 
                          color: "#ffffff", 
                          width: 76, 
                          height: 76,
                          boxShadow: "0 12px 35px rgba(203, 97, 22, 0.45)",
                          transition: "all 0.35s ease",
                          "&:hover": { transform: "scale(1.12)", boxShadow: "0 16px 45px rgba(203, 97, 22, 0.6)" }
                        }}
                      >
                        <PlayArrowIcon sx={{ fontSize: 40, ml: lang === "ar" ? 0 : 0.4 }} />
                      </IconButton>
                    </Box>

                    {/* Clean Action Badge */}
                    <Box 
                      sx={{ 
                        display: "inline-flex", 
                        alignItems: "center", 
                        gap: 1.2, 
                        px: 3, 
                        py: 1.2, 
                        bgcolor: "rgba(255, 255, 255, 0.15)", 
                        backdropFilter: "blur(12px)", 
                        border: "1px solid rgba(255, 255, 255, 0.3)",
                        borderRadius: "24px",
                        transition: "all 0.3s ease",
                        boxShadow: "0 8px 24px rgba(0,0,0,0.2)",
                        "&:hover": { bgcolor: "rgba(255, 255, 255, 0.28)", transform: "translateY(-2px)" }
                      }}
                    >
                      <PlayArrowIcon sx={{ fontSize: 18, color: "#CB6116" }} />
                      <Typography sx={{ color: "#FFF", fontSize: 13, fontWeight: 700, letterSpacing: lang === "ar" ? 0 : "0.06em", fontFamily: '"Cairo", sans-serif' }}>
                        {lang === "ar" ? "تشغيل الفيديـو" : "PLAY VIDEO"}
                      </Typography>
                    </Box>

                  </Stack>
                </Box>
              )}
            </Box>
          </Container>
        </Box>

        {/* SECTION 4: Vision & Commitment Split Block */}
        <Container maxWidth="xl" sx={{ pb: { xs: 12, md: 18 }, pt: 10 }}>
          <Grid container spacing={4}>
            
            {/* Vision Card */}
            <Grid size={{ xs: 12, md: 6 }}>
              <Box 
                sx={{ 
                  bgcolor: "#ffffff", 
                  borderTop: "3px solid #CB6116", 
                  p: { xs: 5, md: 7 }, 
                  height: "100%",
                  boxShadow: "0 15px 35px rgba(0,0,0,0.04)",
                  textAlign: lang === "ar" ? "right" : "left"
                }}
              >
                <Stack spacing={3}>
                  <Typography sx={{ color: "primary.main", fontSize: 11, fontWeight: 800, letterSpacing: lang === "ar" ? 0 : "0.15em", textTransform: "uppercase", fontFamily: '"Cairo", sans-serif' }}>
                    I. {lang === "ar" ? "الاتجاه الاستراتيجي" : "STRATEGIC DIRECTION"}
                  </Typography>
                  <Typography sx={{ fontFamily: "var(--heading-font)", fontSize: { xs: 24, md: 32 }, fontWeight: 500, color: "#111111" }}>
                    {visionTitle}
                  </Typography>
                  <Typography sx={{ color: "rgba(17, 17, 17, 0.72)", fontSize: 15, lineHeight: 1.8, fontFamily: '"Cairo", sans-serif' }}>
                    {visionText}
                  </Typography>
                </Stack>
              </Box>
            </Grid>

            {/* Commitment Card */}
            <Grid size={{ xs: 12, md: 6 }}>
              <Box 
                sx={{ 
                  bgcolor: "#ffffff", 
                  borderTop: "3px solid #CB6116", 
                  p: { xs: 5, md: 7 }, 
                  height: "100%",
                  boxShadow: "0 15px 35px rgba(0,0,0,0.04)",
                  textAlign: lang === "ar" ? "right" : "left"
                }}
              >
                <Stack spacing={3}>
                  <Typography sx={{ color: "primary.main", fontSize: 11, fontWeight: 800, letterSpacing: lang === "ar" ? 0 : "0.15em", textTransform: "uppercase", fontFamily: '"Cairo", sans-serif' }}>
                    II. {lang === "ar" ? "ميثاق التميز" : "CHARTER OF EXCELLENCE"}
                  </Typography>
                  <Typography sx={{ fontFamily: "var(--heading-font)", fontSize: { xs: 24, md: 32 }, fontWeight: 500, color: "#111111" }}>
                    {commitmentTitle}
                  </Typography>
                  <Typography sx={{ color: "rgba(17, 17, 17, 0.72)", fontSize: 15, lineHeight: 1.8, fontFamily: '"Cairo", sans-serif' }}>
                    {commitmentText}
                  </Typography>
                </Stack>
              </Box>
            </Grid>

          </Grid>
        </Container>

        {/* Video Overlay Cinema Modal Popup */}
        {videoOpen && (
          <Box 
            sx={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              bgcolor: "rgba(10, 8, 6, 0.94)",
              backdropFilter: "blur(20px)",
              zIndex: 9999,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              p: { xs: 2, md: 4 }
            }}
          >
            {/* Top Modal Header */}
            <Box 
              sx={{ 
                position: "absolute", 
                top: 20, 
                left: 30, 
                right: 30, 
                display: "flex", 
                justifyContent: "space-between", 
                alignItems: "center",
                zIndex: 10
              }}
            >
              <Typography sx={{ color: "#CB6116", fontSize: 12, fontWeight: 800, letterSpacing: lang === "ar" ? 0 : "0.3em", textTransform: "uppercase", fontFamily: '"Cairo", sans-serif' }}>
                FASHION GATE CINEMA
              </Typography>
              <IconButton 
                onClick={() => setVideoOpen(false)}
                sx={{ 
                  color: "#FFF", 
                  bgcolor: "rgba(255,255,255,0.1)", 
                  border: "1px solid rgba(255,255,255,0.2)", 
                  borderRadius: "50%",
                  "&:hover": { bgcolor: "primary.main" }
                }}
              >
                <CloseIcon />
              </IconButton>
            </Box>
            
            {/* Video Container Box */}
            <Box 
              sx={{ 
                width: "100%", 
                maxWidth: "1040px", 
                position: "relative", 
                pt: "56.25%", 
                bgcolor: "#000",
                borderRadius: "4px",
                overflow: "hidden",
                boxShadow: "0 30px 80px rgba(0,0,0,0.8)",
                border: "1px solid rgba(203, 97, 22, 0.4)"
              }}
            >
              {videoSourceType === "file" && videoFileUrl ? (
                <video 
                  src={videoFileUrl} 
                  controls 
                  autoPlay 
                  playsInline 
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    objectFit: "contain"
                  }}
                />
              ) : (
                <iframe 
                  src={videoUrl.includes("autoplay=") ? videoUrl : `${videoUrl}${videoUrl.includes("?") ? "&" : "?"}autoplay=1&mute=0`} 
                  title="Atelier Video View" 
                  frameBorder="0" 
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                  allowFullScreen
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    border: "none"
                  }}
                />
              )}
            </Box>
          </Box>
        )}

        {/* SECTION: Frequently Asked Questions (FAQ) */}
        <FaqSection lang={lang} />

      </Box>
    </ThemeProvider>
  );
}
