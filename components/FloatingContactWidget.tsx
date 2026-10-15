"use client";

import { useEffect, useMemo, useState } from "react";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import CloseIcon from "@mui/icons-material/Close";
import { Box, Button, IconButton, InputBase, Stack, Tooltip, Typography } from "@mui/material";
import Grid from "@mui/material/Grid";
import { AnimatePresence, motion } from "framer-motion";
import { MdOutlineSupportAgent } from "react-icons/md";
import { submitContactInquiry } from "@/lib/contactInquiries";
import { getContactPageData, getLocalizedValue } from "@/lib/sanity";

const MotionBox = motion.create(Box);

const TK = {
  ivory: "#fbfaf8",
  cream: "#F7F2EC",
  charcoal: "#111111",
  copper: "#CB6116",
  copperDeep: "#9D430C",
  border: "rgba(0,0,0,0.08)",
  heading: "var(--heading-font)",
  body: '"Cairo", sans-serif',
  cursive: '"Griphorium", "Griphosium", "Graphion", "Brush Script MT", cursive',
  cursiveAr: '"DimaShekari", "Cairo", sans-serif',
};

function resolveImagePosition(pos: string | number | undefined | null, fallback: string): string {
  if (pos === undefined || pos === null) return fallback;
  const str = String(pos).trim();
  if (!str) return fallback;

  // Single number or percentage e.g. "25" or "25%"
  if (/^\d+(\.\d+)?%?$/.test(str)) {
    const num = str.replace("%", "");
    return `center ${num}%`;
  }

  // Two numbers e.g. "50 25" or "50% 25"
  if (/^\d+(\.\d+)?%?\s+\d+(\.\d+)?%?$/.test(str)) {
    const parts = str.split(/\s+/).map((p) => (p.endsWith("%") ? p : `${p}%`));
    return parts.join(" ");
  }

  // Named horizontal + vertical number e.g. "center 25" or "center 25%"
  if (/^(left|center|right)\s+\d+(\.\d+)?%?$/i.test(str)) {
    const parts = str.split(/\s+/);
    const y = parts[1].endsWith("%") ? parts[1] : `${parts[1]}%`;
    return `${parts[0]} ${y}`;
  }

  return str;
}

const copy = {
  en: {
    label: "Get in touch",
    title: "Send a Message",
    cursive: "write to us",
    sub: "A personal advisor will be in touch within 24 hours.",
    name: "Your Name",
    email: "Email Address",
    phone: "Phone (optional)",
    msg: "Your Message",
    send: "Send Message",
    sending: "Sending...",
    okTitle: "Thank You",
    okBody: "We've received your message and will respond shortly.",
    okReset: "Send Another",
    error: "Something went wrong. Please try again.",
  },
  ar: {
    label: "تواصل معنا",
    title: "أرسل رسالتك",
    cursive: "راسلنا",
    sub: "سيتواصل معك مستشار شخصي خلال 24 ساعة.",
    name: "الاسم الكامل",
    email: "البريد الإلكتروني",
    phone: "الهاتف (اختياري)",
    msg: "رسالتك",
    send: "إرسال الرسالة",
    sending: "جار الإرسال...",
    okTitle: "شكرا لك",
    okBody: "تم استلام رسالتك وسنتواصل معك قريبا.",
    okReset: "إرسال رسالة أخرى",
    error: "حدث خطأ ما. يرجى المحاولة مرة أخرى.",
  },
};

export default function FloatingContactWidget({ lang }: { lang: "en" | "ar" }) {
  const [open, setOpen] = useState(false);
  const [data, setData] = useState<any>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [closeCountdown, setCloseCountdown] = useState(4);
  const isAr = lang === "ar";
  const tx = copy[lang];

  useEffect(() => {
    getContactPageData().then(setData).catch((err) => console.error("Error loading floating contact data:", err));
  }, []);

  useEffect(() => {
    if (!submitted) return;

    setCloseCountdown(4);
    const interval = window.setInterval(() => {
      setCloseCountdown((value) => Math.max(value - 1, 0));
    }, 1000);
    const timer = window.setTimeout(() => {
      setOpen(false);
      reset();
    }, 4000);

    return () => {
      window.clearInterval(interval);
      window.clearTimeout(timer);
    };
  }, [submitted]);

  const t = useMemo(() => ({
    label: tx.label,
    title: getLocalizedValue(data?.formTitle, lang, tx.title),
    cursive: getLocalizedValue(data?.formCursive, lang, tx.cursive),
    sub: getLocalizedValue(data?.formSubtitle, lang, tx.sub),
    name: getLocalizedValue(data?.fullNameLabel, lang, tx.name),
    email: getLocalizedValue(data?.emailLabel, lang, tx.email),
    phone: getLocalizedValue(data?.phoneLabel, lang, tx.phone),
    msg: getLocalizedValue(data?.msgLabel, lang, tx.msg),
    send: getLocalizedValue(data?.sendBtn, lang, tx.send),
    okTitle: getLocalizedValue(data?.successHeader, lang, tx.okTitle),
    okBody: getLocalizedValue(data?.successDesc, lang, tx.okBody),
    okReset: getLocalizedValue(data?.sendAnother, lang, tx.okReset),
  }), [data, lang, tx]);

  const mobileImagePosition = useMemo(() => {
    return resolveImagePosition(
      data?.formImagePositionMobile || data?.formImagePosition,
      data?.formImage?.hotspot
        ? `${Math.round(data.formImage.hotspot.x * 100)}% ${Math.round(data.formImage.hotspot.y * 100)}%`
        : "center 3%"
    );
  }, [data]);

  const desktopImagePosition = useMemo(() => {
    return resolveImagePosition(
      data?.formImagePosition,
      data?.formImage?.hotspot
        ? `${Math.round(data.formImage.hotspot.x * 100)}% ${Math.round(data.formImage.hotspot.y * 100)}%`
        : "center top"
    );
  }, [data]);

  const reset = () => {
    setName("");
    setEmail("");
    setPhone("");
    setMessage("");
    setSubmitted(false);
    setCloseCountdown(4);
    setError("");
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!name || !email || !message || submitting) return;
    setSubmitting(true);
    setError("");
    try {
      await submitContactInquiry({ name, email, phone, message, language: lang, source: "floating-contact-widget" });
      setSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : tx.error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <AnimatePresence>
        {open && (
          <MotionBox
            key="contact-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            dir={isAr ? "rtl" : "ltr"}
            onClick={() => setOpen(false)}
            sx={{
              position: "fixed",
              inset: 0,
              zIndex: 1300,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              p: { xs: 2, sm: 3, md: 4 },
              bgcolor: "rgba(17,17,17,0.46)",
              backdropFilter: "blur(8px)",
            }}
          >
            <MotionBox
              role="dialog"
              aria-modal="true"
              aria-label={t.label}
              onClick={(event) => event.stopPropagation()}
              initial={{ opacity: 0, y: 28, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 18, scale: 0.97 }}
              transition={{ duration: 0.34, ease: [0.25, 1, 0.5, 1] }}
              sx={{
                width: "min(920px, 100%)",
                maxHeight: { xs: "calc(100vh - 24px)", sm: "calc(100vh - 48px)" },
                bgcolor: "#f7f2ec",
                border: "none",
                boxShadow: "0 34px 110px rgba(0,0,0,0.5)",
                overflow: "hidden",
                position: "relative",
                borderRadius: 0,
              }}
            >
              <IconButton 
                aria-label="Close contact form" 
                onClick={() => setOpen(false)} 
                sx={{ 
                  position: "absolute", 
                  top: { xs: 12, sm: 18 }, 
                  right: isAr ? "auto" : { xs: 12, sm: 18 }, 
                  left: isAr ? { xs: 12, sm: 18 } : "auto", 
                  zIndex: 10, 
                  width: { xs: 34, sm: 38 }, 
                  height: { xs: 34, sm: 38 }, 
                  bgcolor: { xs: "rgba(0,0,0,0.52)", sm: "rgba(244,239,232,0.88)" }, 
                  color: { xs: "#ffffff", sm: TK.charcoal }, 
                  border: { xs: "1px solid rgba(255,255,255,0.25)", sm: "1px solid rgba(17,17,17,0.08)" }, 
                  backdropFilter: "blur(10px)", 
                  borderRadius: "50%",
                  boxShadow: "0 4px 14px rgba(0,0,0,0.25)",
                  transition: "all 0.2s ease",
                  "&:hover": { 
                    bgcolor: { xs: "rgba(0,0,0,0.8)", sm: "#fff" },
                    transform: "scale(1.08)"
                  } 
                }}
              >
                <CloseIcon sx={{ fontSize: { xs: 18, sm: 20 } }} />
              </IconButton>

              <Grid container sx={{ maxHeight: { xs: "calc(100vh - 24px)", sm: "calc(100vh - 48px)" } }}>
                <Grid size={{ xs: 12, md: 5 }}>
                  <Box sx={{ position: "relative", height: { xs: 180, sm: 215, md: "100%" }, minHeight: { md: 590 }, overflow: "hidden", bgcolor: "#080808" }}>
                    <Box 
                      component="img" 
                      src={data?.formImage?.asset?.url || "/brand-pages/contact_bg.png"} 
                      alt="" 
                      sx={{ 
                        width: "100%", 
                        height: "100%", 
                        objectFit: "cover", 
                        objectPosition: { xs: mobileImagePosition, sm: mobileImagePosition, md: desktopImagePosition }, 
                        display: "block", 
                        opacity: 1, 
                        filter: "contrast(1.02)" 
                      }} 
                    />
                    {/* Top gradient for close button contrast on mobile */}
                    <Box sx={{ position: "absolute", top: 0, left: 0, right: 0, height: 70, background: "linear-gradient(to bottom, rgba(0,0,0,0.55) 0%, transparent 100%)", display: { xs: "block", md: "none" }, pointerEvents: "none" }} />
                    {/* Desktop horizontal dark gradient for text readability (no white layer) */}
                    <Box sx={{ position: "absolute", inset: 0, display: { xs: "none", md: "block" }, background: "linear-gradient(90deg, rgba(0,0,0,0.22) 0%, rgba(0,0,0,0) 50%)", pointerEvents: "none" }} />
                    {/* Desktop inset fine border - hidden on mobile to avoid cutting model face */}
                    <Box sx={{ position: "absolute", inset: { sm: 14 }, border: "1px solid rgba(255,255,255,0.28)", display: { xs: "none", md: "block" }, pointerEvents: "none" }} />
                    {/* Desktop text overlay */}
                    <Box sx={{ position: "absolute", left: 28, right: 28, bottom: 28, color: "#fff", display: { xs: "none", md: "block" } }}>
                      <Typography sx={{ fontFamily: isAr ? TK.cursiveAr : TK.cursive, fontSize: { sm: "1.45rem", md: "1.7rem" }, color: "#fff", mb: 0.5 }}>
                        {t.cursive}
                      </Typography>
                      <Typography sx={{ fontFamily: TK.heading, fontSize: { sm: "1.8rem", md: "2.18rem" }, fontWeight: 400, lineHeight: 1.05 }}>
                        {t.title}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
                <Grid size={{ xs: 12, md: 7 }}>
                  <Box sx={{ maxHeight: { xs: "calc(100vh - 204px)", sm: "calc(100vh - 263px)", md: "calc(100vh - 56px)" }, overflowY: "auto", WebkitOverflowScrolling: "touch", p: { xs: 2.5, sm: 4, md: 6 }, bgcolor: "#f7f2ec", backgroundImage: "linear-gradient(135deg, rgba(255,255,255,0.72), rgba(255,255,255,0.16))" }}>
                    {!submitted ? (
                      <form onSubmit={handleSubmit}>
                        <Box sx={{ mb: { xs: 2.2, md: 4.25 }, pr: isAr ? 0 : { xs: 2, sm: 5 }, pl: isAr ? { xs: 2, sm: 5 } : 0 }}>
                          <Box sx={{ width: 44, height: 2, bgcolor: TK.copper, mb: 1.6 }} />
                          <Typography sx={{ display: { xs: "block", md: "none" }, fontFamily: isAr ? TK.cursiveAr : TK.cursive, fontSize: { xs: "1.2rem", sm: "1.35rem" }, color: TK.copper, mb: 0.3 }}>
                            {t.cursive}
                          </Typography>
                          <Typography sx={{ display: { xs: "block", md: "none" }, fontFamily: TK.heading, fontSize: { xs: "1.55rem", sm: "1.9rem" }, fontWeight: 400, lineHeight: 1.12, mb: 0.8, color: TK.charcoal }}>
                            {t.title}
                          </Typography>
                          <Typography sx={{ display: { xs: "none", md: "block" }, fontFamily: TK.heading, fontSize: "2rem", fontWeight: 400, lineHeight: 1.08, mb: 1 }}>
                            {t.label}
                          </Typography>
                          <Typography sx={{ fontSize: { xs: 12.5, sm: 14 }, color: "rgba(0,0,0,0.58)", lineHeight: 1.65, fontFamily: TK.body, maxWidth: 460 }}>
                            {t.sub}
                          </Typography>
                        </Box>

                        <Stack spacing={{ xs: 1.8, sm: 2.5 }}>
                          <input
                            aria-hidden="true"
                            autoComplete="off"
                            name="companyWebsite"
                            tabIndex={-1}
                            type="text"
                            value=""
                            readOnly
                            style={{ display: "none" }}
                          />
                          <Grid container spacing={{ xs: 1.8, sm: 2.5 }}>
                            <Grid size={{ xs: 12, sm: 6 }}>
                              <FormField label={t.name} required value={name} onChange={setName} isAr={isAr} />
                            </Grid>
                            <Grid size={{ xs: 12, sm: 6 }}>
                              <FormField label={t.email} required type="email" value={email} onChange={setEmail} isAr={isAr} />
                            </Grid>
                          </Grid>
                          <FormField label={t.phone} value={phone} onChange={setPhone} placeholder="+963 ..." isAr={isAr} />
                          <FormField label={t.msg} required multiline value={message} onChange={setMessage} isAr={isAr} />
                          {error && <Typography role="alert" sx={{ fontSize: 13, color: "#9D1C0C", fontFamily: TK.body }}>{error}</Typography>}
                          <Button 
                            type="submit" 
                            disabled={submitting} 
                            endIcon={!submitting && (isAr ? <ArrowBackIcon sx={{ fontSize: "15px !important" }} /> : <ArrowForwardIcon sx={{ fontSize: "15px !important" }} />)} 
                            sx={{ 
                              alignSelf: { xs: "stretch", sm: "flex-start" }, 
                              width: { xs: "100%", sm: "auto" },
                              justifyContent: "center",
                              bgcolor: TK.charcoal, 
                              color: "#fff", 
                              px: { xs: 3.5, sm: 5 }, 
                              py: 1.45, 
                              minHeight: 46, 
                              fontSize: 12, 
                              fontWeight: 800, 
                              fontFamily: TK.body, 
                              letterSpacing: isAr ? 0 : "0.1em", 
                              textTransform: "uppercase", 
                              borderRadius: 0,
                              boxShadow: "0 14px 30px rgba(17,17,17,0.2)", 
                              "& .MuiButton-endIcon": { ml: isAr ? 0 : 1, mr: isAr ? 1 : 0 }, 
                              "&:hover": { bgcolor: TK.copperDeep, transform: "translateY(-1px)", boxShadow: "0 16px 34px rgba(157,67,12,0.22)" }, 
                              "&.Mui-disabled": { bgcolor: "rgba(0,0,0,0.28)", color: "#fff" } 
                            }}
                          >
                            {submitting ? tx.sending : t.send}
                          </Button>
                        </Stack>
                      </form>
                    ) : (
                      <Box sx={{ textAlign: "center", py: { xs: 6, md: 12 }, px: 1 }}>
                        <Box sx={{ width: 64, height: 64, borderRadius: "50%", bgcolor: "rgba(203,97,22,0.08)", border: "1px solid rgba(203,97,22,0.22)", display: "flex", alignItems: "center", justifyContent: "center", mx: "auto", mb: 2.5 }}>
                          <CheckCircleOutlineIcon sx={{ color: TK.copper, fontSize: 34 }} />
                        </Box>
                        <Typography sx={{ fontFamily: TK.heading, fontSize: { xs: 28, md: 34 }, fontWeight: 400, mb: 1 }}>{t.okTitle}</Typography>
                        <Typography sx={{ fontSize: 14.5, color: "rgba(0,0,0,0.55)", lineHeight: 1.75, maxWidth: 360, mx: "auto", mb: 3.5, fontFamily: TK.body }}>{t.okBody}</Typography>
                        <Box sx={{ display: "inline-flex", alignItems: "center", gap: 1.2, mb: 3.5, px: 2, py: 1, borderTop: "1px solid rgba(203,97,22,0.24)", borderBottom: "1px solid rgba(203,97,22,0.24)" }}>
                          <Typography sx={{ fontFamily: TK.body, fontSize: 11, fontWeight: 700, color: "rgba(0,0,0,0.5)", letterSpacing: isAr ? 0 : "0.08em", textTransform: "uppercase" }}>
                            {isAr ? "سيغلق خلال" : "Closing in"}
                          </Typography>
                          <Box sx={{ width: 28, height: 28, display: "grid", placeItems: "center", position: "relative", overflow: "hidden" }}>
                            <AnimatePresence mode="popLayout">
                              <MotionBox
                                key={closeCountdown}
                                initial={{ opacity: 0, y: 10, scale: 0.88 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: -10, scale: 0.88 }}
                                transition={{ duration: 0.28, ease: [0.25, 1, 0.5, 1] }}
                                sx={{ position: "absolute", fontFamily: TK.heading, fontSize: 24, lineHeight: 1, color: TK.copper }}
                              >
                                {closeCountdown}
                              </MotionBox>
                            </AnimatePresence>
                          </Box>
                        </Box>
                      </Box>
                    )}
                  </Box>
                </Grid>
              </Grid>
            </MotionBox>
          </MotionBox>
        )}
      </AnimatePresence>

      <MotionBox 
        animate={open ? { scale: 0, opacity: 0 } : { scale: 1, opacity: 1, y: [0, -8, 0] }} 
        transition={open ? { duration: 0.18 } : { duration: 1.9, repeat: Infinity, repeatDelay: 1.2, ease: "easeInOut" }} 
        sx={{ 
          position: "fixed", 
          right: isAr ? "auto" : { xs: 16, sm: 24 }, 
          left: isAr ? { xs: 16, sm: 24 } : "auto", 
          bottom: { xs: 22, sm: 28 }, 
          zIndex: 1301,
          display: open ? "none" : "block",
          pointerEvents: open ? "none" : "auto"
        }}
      >
        <Tooltip title={t.label} placement="left" arrow>
          <IconButton aria-label={t.label} onClick={() => setOpen(true)} sx={{ width: 58, height: 58, bgcolor: TK.charcoal, color: "#fff", border: "1px solid rgba(255,255,255,0.2)", boxShadow: "0 14px 34px rgba(17,17,17,0.28)", "&:hover": { bgcolor: TK.copperDeep, boxShadow: "0 16px 38px rgba(157,67,12,0.32)" } }}>
            <MdOutlineSupportAgent size={28} />
          </IconButton>
        </Tooltip>
      </MotionBox>
    </>
  );
}

function FormField({ label, required, multiline, value, onChange, type, placeholder, isAr }: {
  label: string;
  required?: boolean;
  multiline?: boolean;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  placeholder?: string;
  isAr?: boolean;
}) {
  const [focused, setFocused] = useState(false);

  return (
    <Stack spacing={0.55}>
      <Typography component="label" sx={{ fontSize: 12, fontWeight: 600, color: focused ? TK.copper : "rgba(0,0,0,0.7)", fontFamily: TK.body, letterSpacing: isAr ? 0 : "0.02em" }}>
        {label}{required && " *"}
      </Typography>
      <InputBase
        required={required}
        type={type}
        multiline={multiline}
        rows={multiline ? 4 : undefined}
        fullWidth
        value={value}
        onChange={(event) => onChange(event.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        placeholder={placeholder}
        sx={{
          fontSize: 14.5,
          color: TK.charcoal,
          fontFamily: TK.body,
          ...(multiline
            ? { border: `1px solid ${focused ? TK.copper : "rgba(17,17,17,0.12)"}`, p: 1.5, bgcolor: "rgba(255,255,255,0.52)", minHeight: 112, borderRadius: 0 }
            : { borderBottom: `1px solid ${focused ? TK.copper : "rgba(17,17,17,0.18)"}`, pb: 0.95, bgcolor: "rgba(255,255,255,0.18)", borderRadius: 0 }),
          transition: "border-color 0.22s ease, background-color 0.22s ease",
          "&:hover": {
            bgcolor: multiline ? "rgba(255,255,255,0.68)" : "rgba(255,255,255,0.3)",
          },
        }}
      />
    </Stack>
  );
}
