"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  Box,
  Button,
  Container,
  InputBase,
  Stack,
  ThemeProvider,
  Typography,
  createTheme,
  Link as MuiLink
} from "@mui/material";
import Grid from "@mui/material/Grid";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import Link from "next/link";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";

import { getLocalizedValue } from "@/lib/sanity";

const MotionBox = motion.create(Box);

/* Design tokens — pulled directly from the site's globals.css / HeroSection / BoulevardSection */
const TK = {
  ivory: "#fbfaf8",
  cream: "#F7F2EC",
  charcoal: "#111111",
  copper: "#CB6116",
  copperDeep: "#9D430C",
  stone: "#B8AEA4",
  border: "rgba(0,0,0,0.06)",
  borderDark: "rgba(255,255,255,0.06)",
  heading: `var(--heading-font)`,
  body: `"Cairo", sans-serif`,
  cursive: `"Griphorium", "Griphosium", "Graphion", "Brush Script MT", cursive`,
  cursiveAr: `"DimaShekari", "Cairo", sans-serif`,
  ease: [0.25, 1, 0.5, 1] as [number, number, number, number],
};

interface ContactClientProps {
  initialLang: "ar" | "en";
  initialData?: any;
}

export default function ContactClient({ initialLang, initialData }: ContactClientProps) {
  const router = useRouter();
  const [lang, setLang] = useState<"en" | "ar">(initialLang);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => { setLang(initialLang); }, [initialLang]);
  const isAr = lang === "ar";

  const theme = useMemo(() => createTheme({
    palette: {
      mode: "light",
      primary: { main: TK.copper, dark: TK.copperDeep },
      background: { default: TK.ivory, paper: "#fff" },
      text: { primary: TK.charcoal, secondary: "rgba(0,0,0,0.54)" },
    },
    typography: { fontFamily: TK.body },
    shape: { borderRadius: 0 },
  }), []);

  /* ── translations ── */
  const tx = {
    en: {
      heroSub: "Syria's first luxury department store",
      heroTitle: "GET IN TOUCH",
      heroDesc: "We would love to hear from you",
      introText: "Whether you're seeking a private viewing, a bespoke consultation, or simply wish to learn more about our collections — our client advisory team at Fashion Gate Boulevard, Damascus, is here to assist you personally.",
      locationTitle: "Visit the Atelier",
      locationBody: "Fashion Gate Boulevard\nDamascus, Syria",
      hoursTitle: "Opening Hours",
      hoursBody: "Mon – Sat\n11:00 AM – 9:00 PM",
      emailTitle: "Email Us",
      emailBody: "concierge@fashiongate.sy",
      whatsappTitle: "WhatsApp",
      whatsappBody: "+963 930 000 000",
      whatsappCta: "Chat with Concierge",
      formCursive: "write to us",
      formTitle: "Send a Message",
      formSub: "A personal advisor will be in touch within 24 hours.",
      name: "Your Name",
      email: "Email Address",
      phone: "Phone (optional)",
      msg: "Your Message",
      send: "Send Message",
      okTitle: "Thank You",
      okBody: "We've received your message and will respond shortly.",
      okReset: "Send Another",
      mapHead: "Find the Atelier",
    },
    ar: {
      heroSub: "أول متجر أقسام دولي فاخر في سوريا",
      heroTitle: "تواصل معنا",
      heroDesc: "يسعدنا أن نسمع منك",
      introText: "سواء كنت تبحث عن معاينة خاصة، أو استشارة مخصصة، أو ترغب ببساطة في معرفة المزيد عن مجموعاتنا — فريقنا الاستشاري في فاشن غيت بوليفارد بدمشق جاهز لمساعدتك شخصياً.",
      locationTitle: "زُر الأتيليه",
      locationBody: "فاشن غيت بوليفارد\nدمشق، سوريا",
      hoursTitle: "ساعات العمل",
      hoursBody: "الاثنين – السبت\n١١:٠٠ ص – ٩:٠٠ م",
      emailTitle: "راسلنا",
      emailBody: "concierge@fashiongate.sy",
      whatsappTitle: "واتساب",
      whatsappBody: "+٩٦٣ ٩٣٠ ٠٠٠ ٠٠٠",
      whatsappCta: "تحدث مع الكونسيرج",
      formCursive: "راسلنا",
      formTitle: "أرسل رسالتك",
      formSub: "سيتواصل معك مستشار شخصي خلال ٢٤ ساعة.",
      name: "الاسم الكامل",
      email: "البريد الإلكتروني",
      phone: "الهاتف (اختياري)",
      msg: "رسالتك",
      send: "إرسال الرسالة",
      okTitle: "شكراً لك",
      okBody: "تم استلام رسالتك وسنتواصل معك قريباً.",
      okReset: "إرسال رسالة أخرى",
      mapHead: "موقع الأتيليه",
    },
  }[lang];

  const heroImageUrl = initialData?.heroImage?.asset?.url || "";
  const formImageUrl = initialData?.formImage?.asset?.url || "";
  const mapEmbedUrl = initialData?.mapEmbedUrl || "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d26615.11111111111!2d36.2750!3d33.5130!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1518e6dc413cc6a7%3A0x6b9745e5d31518f!2sDamascus%2C%20Syria!5e0!3m2!1sen!2s!4v1710000000000!5m2!1sen!2s";

  const t = {
    heroSub: tx.heroSub,
    heroTitle: getLocalizedValue(initialData?.headline || initialData?.title, lang, tx.heroTitle),
    heroDesc: getLocalizedValue(initialData?.subheadline || initialData?.heroCursive, lang, tx.heroDesc),
    introText: getLocalizedValue(initialData?.subtitle, lang, tx.introText),
    locationTitle: getLocalizedValue(initialData?.locationTitle, lang, tx.locationTitle),
    locationBody: getLocalizedValue(initialData?.addressValue, lang, tx.locationBody),
    hoursTitle: getLocalizedValue(initialData?.hoursTitle, lang, tx.hoursTitle),
    hoursBody: getLocalizedValue(initialData?.hoursValue, lang, tx.hoursBody),
    emailTitle: getLocalizedValue(initialData?.emailTitle, lang, tx.emailTitle),
    emailBody: initialData?.digitalValue || tx.emailBody,
    whatsappTitle: getLocalizedValue(initialData?.whatsappTitle, lang, tx.whatsappTitle),
    whatsappBody: initialData?.whatsappValue || tx.whatsappBody,
    whatsappLink: initialData?.whatsappLink || "https://wa.me/963930000000",
    whatsappCta: getLocalizedValue(initialData?.chatConcierge, lang, tx.whatsappCta),
    formCursive: getLocalizedValue(initialData?.formCursive, lang, tx.formCursive),
    formTitle: getLocalizedValue(initialData?.formTitle, lang, tx.formTitle),
    formSub: getLocalizedValue(initialData?.formSubtitle, lang, tx.formSub),
    name: getLocalizedValue(initialData?.fullNameLabel, lang, tx.name),
    email: getLocalizedValue(initialData?.emailLabel, lang, tx.email),
    phone: getLocalizedValue(initialData?.phoneLabel, lang, tx.phone),
    msg: getLocalizedValue(initialData?.msgLabel, lang, tx.msg),
    send: getLocalizedValue(initialData?.sendBtn, lang, tx.send),
    okTitle: getLocalizedValue(initialData?.successHeader, lang, tx.okTitle),
    okBody: getLocalizedValue(initialData?.successDesc, lang, tx.okBody),
    okReset: getLocalizedValue(initialData?.sendAnother, lang, tx.okReset),
    mapHead: getLocalizedValue(initialData?.mapTitle, lang, tx.mapHead),
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) return;
    setSubmitted(true);
  };

  return (
    <ThemeProvider theme={theme}>
      <Box dir={isAr ? "rtl" : "ltr"} sx={{ bgcolor: TK.ivory, color: TK.charcoal, minHeight: "100vh" }}>

        {/* ─────────────────────────────────────────────
            HERO — CINEMATIC FULLSCREEN  (matches HeroSection.tsx)
            Full-bleed bg, centred uppercase heading + cursive sub
            ───────────────────────────────────────────── */}
        <Box
          component="section"
          sx={{
            position: "relative",
            height: { xs: "52vh", sm: "55vh", md: "62vh" },
            minHeight: { xs: 360, md: 440 },
            overflow: "hidden",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#fff",
          }}
        >
          {/* bg image */}
          <Box
            sx={{
              position: "absolute",
              inset: 0,
              backgroundImage: `url(${heroImageUrl})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              filter: "brightness(0.72)",
              zIndex: 1,
            }}
          />

          {/* centre text */}
          <Box sx={{ position: "relative", zIndex: 10, textAlign: "center", px: 3 }}>
            <MotionBox
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: TK.ease }}
            >
              {/* Cursive subheadline — same pattern as HeroSection.tsx  */}
              <Typography
                sx={{
                  fontFamily: isAr ? TK.cursiveAr : TK.cursive,
                  fontSize: { xs: "1.15rem", sm: "1.5rem", md: "1.9rem" },
                  color: "#ffffff",
                  mb: { xs: 1, md: 1.5 },
                  fontWeight: 400,
                }}
              >
                {t.heroDesc}
              </Typography>

              {/* Serif uppercase title — same var(--heading-font) as HeroSection */}
              <Typography
                component="h1"
                sx={{
                  fontFamily: TK.heading,
                  fontSize: { xs: "2rem", sm: "3.2rem", md: "4.4rem", lg: "5.2rem" },
                  fontWeight: 500,
                  textTransform: "uppercase",
                  letterSpacing: isAr ? 0 : "0.06em",
                  lineHeight: 1,
                  color: "#ffffff",
                  textShadow: "0 4px 25px rgba(0,0,0,0.5)",
                }}
              >
                {t.heroTitle}
              </Typography>
            </MotionBox>
          </Box>
        </Box>

        {/* ─────────────────────────────────────────────
            INTRO TEXT — centred prose paragraph
            ───────────────────────────────────────────── */}
        <Box sx={{ py: { xs: 7, md: 10 } }}>
          <Container maxWidth="md">
            <MotionBox
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.55 }}
              sx={{ textAlign: "center" }}
            >
              <Typography
                sx={{
                  fontSize: { xs: 15, md: 17 },
                  lineHeight: 1.9,
                  color: "rgba(0,0,0,0.6)",
                  fontFamily: TK.body,
                  maxWidth: 660,
                  mx: "auto",
                }}
              >
                {t.introText}
              </Typography>
            </MotionBox>
          </Container>
        </Box>

        {/* ─────────────────────────────────────────────
            CONTACT DETAILS — 2×2 GRID with subtle borders
            ───────────────────────────────────────────── */}
        <Box sx={{ borderTop: `1px solid ${TK.border}`, borderBottom: `1px solid ${TK.border}` }}>
          <Container maxWidth="lg" disableGutters>
            <Grid container>
              {([
                { title: t.locationTitle, body: t.locationBody, href: undefined as string | undefined, cta: undefined as string | undefined },
                { title: t.hoursTitle, body: t.hoursBody, href: undefined, cta: undefined },
                { title: t.emailTitle, body: t.emailBody, href: `mailto:${t.emailBody}`, cta: undefined },
                // Hidden for now.
                // { title: t.whatsappTitle, body: t.whatsappBody, href: t.whatsappLink, cta: t.whatsappCta },
              ]).map((item, i) => (
                <Grid
                  key={i}
                  size={{ xs: 12, sm: 4 }}
                  sx={{
                    borderRight: { sm: i < 2 ? `1px solid ${TK.border}` : "none" },
                    borderBottom: { xs: i < 2 ? `1px solid ${TK.border}` : "none", sm: "none" },
                  }}
                >
                  <MotionBox
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-30px" }}
                    transition={{ duration: 0.45, delay: i * 0.06 }}
                    sx={{ p: { xs: 4, md: 5 } }}
                  >
                    <Typography
                      sx={{
                        fontFamily: TK.heading,
                        fontSize: { xs: 17, md: 18 },
                        fontWeight: 500,
                        color: TK.charcoal,
                        mb: 1.5,
                        textTransform: "capitalize",
                      }}
                    >
                      {item.title}
                    </Typography>

                    {item.href ? (
                      <MuiLink
                        href={item.href}
                        target={item.href.startsWith("http") ? "_blank" : undefined}
                        rel={item.href.startsWith("http") ? "noopener noreferrer" : undefined}
                        underline="none"
                        sx={{
                          fontSize: 14,
                          color: "rgba(0,0,0,0.6)",
                          fontFamily: TK.body,
                          lineHeight: 1.7,
                          whiteSpace: "pre-line",
                          display: "block",
                          transition: "color 0.2s",
                          "&:hover": { color: TK.copper },
                        }}
                      >
                        {item.body}
                      </MuiLink>
                    ) : (
                      <Typography
                        sx={{ fontSize: 14, color: "rgba(0,0,0,0.6)", fontFamily: TK.body, lineHeight: 1.7, whiteSpace: "pre-line" }}
                      >
                        {item.body}
                      </Typography>
                    )}

                    {item.cta && (
                      <Button
                        component="a"
                        href={t.whatsappLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        startIcon={<WhatsAppIcon sx={{ fontSize: "15px !important", color: "#25D366" }} />}
                        sx={{
                          mt: 2,
                          px: 0,
                          minWidth: 0,
                          fontSize: 13,
                          fontWeight: 600,
                          color: TK.copper,
                          fontFamily: TK.body,
                          textTransform: "none",
                          "&:hover": { bgcolor: "transparent", opacity: 0.75 },
                        }}
                      >
                        {item.cta}
                      </Button>
                    )}
                  </MotionBox>
                </Grid>
              ))}
            </Grid>
          </Container>
        </Box>

        {/* ─────────────────────────────────────────────
            FORM SECTION — image + form  (alternating layout)
            ───────────────────────────────────────────── */}
        <Box sx={{ py: { xs: 8, md: 14 } }}>
          <Container maxWidth="lg">
            <Grid
              container
              spacing={{ xs: 6, md: 0 }}
              direction={isAr ? "row-reverse" : "row"}
              alignItems="stretch"
            >
              {/* Image column */}
              <Grid size={{ xs: 12, md: 5 }}>
                <MotionBox
                  initial={{ opacity: 0, x: isAr ? 20 : -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ duration: 0.65, ease: TK.ease }}
                  sx={{
                    position: "relative",
                    height: { xs: 360, md: "100%" },
                    minHeight: { md: 580 },
                    overflow: "hidden",
                    "&:hover img": { transform: "scale(1.03)" },
                  }}
                >
                  <Box
                    component="img"
                    src={formImageUrl}
                    alt="Fashion Gate Private Client"
                    sx={{
                      position: "absolute",
                      inset: 0,
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      objectPosition: "center top",
                      transition: "transform 0.8s cubic-bezier(0.25, 1, 0.5, 1)",
                    }}
                  />
                </MotionBox>
              </Grid>

              {/* Form column */}
              <Grid size={{ xs: 12, md: 7 }}>
                <Box
                  sx={{
                    px: { xs: 0, md: 8, lg: 10 },
                    py: { xs: 2, md: 4 },
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    height: "100%",
                  }}
                >
                  <AnimatePresence mode="wait">
                    {!submitted ? (
                      <MotionBox
                        key="form"
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ duration: 0.4 }}
                      >
                        {/* Cursive lead-in */}
                        <Typography
                          sx={{
                            fontFamily: isAr ? TK.cursiveAr : TK.cursive,
                            fontSize: { xs: "1.3rem", md: "1.7rem" },
                            color: TK.copper,
                            mb: 0.5,
                          }}
                        >
                          {t.formCursive}
                        </Typography>

                        {/* Serif section heading */}
                        <Typography
                          variant="h2"
                          sx={{
                            fontFamily: TK.heading,
                            fontSize: { xs: "1.6rem", sm: "2rem", md: "2.4rem" },
                            fontWeight: 400,
                            color: TK.charcoal,
                            mb: 1,
                            textTransform: "capitalize",
                          }}
                        >
                          {t.formTitle}
                        </Typography>

                        <Typography sx={{ fontSize: 14, color: "rgba(0,0,0,0.5)", mb: 5, fontFamily: TK.body, lineHeight: 1.7 }}>
                          {t.formSub}
                        </Typography>

                        <form onSubmit={handleSubmit}>
                          <Stack spacing={3.5}>
                            {/* Name + Email side by side */}
                            <Grid container spacing={3}>
                              <Grid size={{ xs: 12, sm: 6 }}>
                                <FormField label={t.name} required value={name} onChange={setName} isAr={isAr} />
                              </Grid>
                              <Grid size={{ xs: 12, sm: 6 }}>
                                <FormField label={t.email} required type="email" value={email} onChange={setEmail} isAr={isAr} />
                              </Grid>
                            </Grid>

                            <FormField label={t.phone} value={phone} onChange={setPhone} placeholder="+963 ..." isAr={isAr} />
                            <FormField label={t.msg} required multiline value={message} onChange={setMessage} isAr={isAr} />

                            <Box>
                              <Button
                                type="submit"
                                endIcon={isAr ? <ArrowBackIcon sx={{ fontSize: "15px !important" }} /> : <ArrowForwardIcon sx={{ fontSize: "15px !important" }} />}
                                sx={{
                                  bgcolor: TK.charcoal,
                                  color: "#fff",
                                  px: 5,
                                  py: 1.5,
                                  fontSize: 12,
                                  fontWeight: 700,
                                  fontFamily: TK.body,
                                  letterSpacing: isAr ? 0 : "0.12em",
                                  textTransform: "uppercase",
                                  transition: "all 0.3s ease",
                                  "&:hover": {
                                    bgcolor: TK.copper,
                                    transform: "translateY(-1px)",
                                    boxShadow: "0 6px 18px rgba(203,97,22,0.18)",
                                  },
                                }}
                              >
                                {t.send}
                              </Button>
                            </Box>
                          </Stack>
                        </form>
                      </MotionBox>
                    ) : (
                      <MotionBox
                        key="ok"
                        initial={{ opacity: 0, scale: 0.97 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.35 }}
                        sx={{ textAlign: "center", py: 4 }}
                      >
                        <Box sx={{ width: 56, height: 56, borderRadius: "50%", bgcolor: "rgba(203,97,22,0.08)", display: "flex", alignItems: "center", justifyContent: "center", mx: "auto", mb: 2.5 }}>
                          <CheckCircleOutlineIcon sx={{ color: TK.copper, fontSize: 30 }} />
                        </Box>
                        <Typography sx={{ fontFamily: TK.heading, fontSize: 26, fontWeight: 400, color: TK.charcoal, mb: 1 }}>
                          {t.okTitle}
                        </Typography>
                        <Typography sx={{ fontSize: 14.5, color: "rgba(0,0,0,0.55)", lineHeight: 1.7, maxWidth: 360, mx: "auto", mb: 3.5, fontFamily: TK.body }}>
                          {t.okBody}
                        </Typography>
                        <Button
                          onClick={() => { setName(""); setEmail(""); setPhone(""); setMessage(""); setSubmitted(false); }}
                          sx={{
                            bgcolor: TK.charcoal, color: "#fff", px: 4, py: 1.3,
                            fontSize: 12, fontWeight: 700, fontFamily: TK.body, textTransform: "uppercase",
                            "&:hover": { bgcolor: TK.copper },
                          }}
                        >
                          {t.okReset}
                        </Button>
                      </MotionBox>
                    )}
                  </AnimatePresence>
                </Box>
              </Grid>
            </Grid>
          </Container>
        </Box>

        {/* ─────────────────────────────────────────────
            MAP — with serif title
            ───────────────────────────────────────────── */}
        <Box sx={{ borderTop: `1px solid ${TK.border}`, pb: 0 }}>
          <Box sx={{ textAlign: "center", py: { xs: 4, md: 5 } }}>
            <Typography
              sx={{
                fontFamily: TK.heading,
                fontSize: { xs: 18, md: 22 },
                fontWeight: 400,
                color: TK.charcoal,
                textTransform: "capitalize",
              }}
            >
              {t.mapHead}
            </Typography>
          </Box>
          <Box
            component="iframe"
            src={mapEmbedUrl}
            sx={{
              width: "100%",
              height: { xs: 320, md: 420 },
              border: "none",
              display: "block",
              filter: "grayscale(0.35) contrast(1.05)",
            }}
            allowFullScreen
            loading="lazy"
          />
        </Box>

      </Box>
    </ThemeProvider>
  );
}

/* ── FORM FIELD — extracted for clean JSX ── */
function FormField({ label, required, multiline, value, onChange, type, placeholder, isAr }: {
  label: string; required?: boolean; multiline?: boolean;
  value: string; onChange: (v: string) => void; type?: string; placeholder?: string; isAr?: boolean;
}) {
  const [focused, setFocused] = useState(false);
  return (
    <Stack spacing={0.6}>
      <Typography
        component="label"
        sx={{
          fontSize: 12,
          fontWeight: 600,
          color: focused ? TK.copper : "rgba(0,0,0,0.7)",
          fontFamily: TK.body,
          letterSpacing: isAr ? 0 : "0.02em",
          transition: "color 0.2s",
        }}
      >
        {label}{required && " *"}
      </Typography>
      <InputBase
        required={required}
        type={type}
        multiline={multiline}
        rows={multiline ? 5 : undefined}
        fullWidth
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        placeholder={placeholder}
        sx={{
          fontSize: 15,
          color: TK.charcoal,
          fontFamily: TK.body,
          ...(multiline
            ? { border: `1px solid ${focused ? TK.copper : "#e0dbd4"}`, p: 2, bgcolor: "#fdfcfa" }
            : { borderBottom: `1px solid ${focused ? TK.copper : "#e0dbd4"}`, pb: 1 }),
          transition: "border-color 0.25s ease",
        }}
      />
    </Stack>
  );
}
