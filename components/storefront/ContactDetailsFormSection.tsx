"use client";

import { useEffect, useState } from "react";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import { Box, Button, Container, InputBase, Link as MuiLink, Stack, Typography } from "@mui/material";
import Grid from "@mui/material/Grid";
import { AnimatePresence, motion } from "framer-motion";
import { submitContactInquiry } from "@/lib/contactInquiries";
import { getLocalizedValue } from "@/lib/sanity";

const MotionBox = motion.create(Box);

const TK = {
  ivory: "#fbfaf8",
  cream: "#F7F2EC",
  charcoal: "#111111",
  copper: "#CB6116",
  border: "rgba(0,0,0,0.06)",
  heading: "var(--heading-font)",
  body: '"Cairo", sans-serif',
  cursive: '"Griphorium", "Griphosium", "Graphion", "Brush Script MT", cursive',
  cursiveAr: '"DimaShekari", "Cairo", sans-serif',
  ease: [0.25, 1, 0.5, 1] as [number, number, number, number],
};

const fallbackText = {
  en: {
    locationTitle: "Visit the Atelier",
    locationBody: "Fashion Gate Boulevard\nDamascus, Syria",
    hoursTitle: "Opening Hours",
    hoursBody: "Mon - Sat\n11:00 AM - 9:00 PM",
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
    sending: "Sending...",
    okTitle: "Thank You",
    okBody: "We've received your message and will respond shortly.",
    okReset: "Send Another",
  },
  ar: {
    locationTitle: "زر الأتيليه",
    locationBody: "فاشن غيت بوليفارد\nدمشق، سوريا",
    hoursTitle: "ساعات العمل",
    hoursBody: "الاثنين - السبت\n11:00 ص - 9:00 م",
    emailTitle: "راسلنا",
    emailBody: "concierge@fashiongate.sy",
    whatsappTitle: "واتساب",
    whatsappBody: "+963 930 000 000",
    whatsappCta: "تحدث مع الكونسييرج",
    formCursive: "راسلنا",
    formTitle: "أرسل رسالتك",
    formSub: "سيتواصل معك مستشار شخصي خلال 24 ساعة.",
    name: "الاسم الكامل",
    email: "البريد الإلكتروني",
    phone: "الهاتف (اختياري)",
    msg: "رسالتك",
    send: "إرسال الرسالة",
    sending: "جار الإرسال...",
    okTitle: "شكرا لك",
    okBody: "تم استلام رسالتك وسنتواصل معك قريبا.",
    okReset: "إرسال رسالة أخرى",
  },
};

export default function ContactDetailsFormSection({
  lang,
  data,
  withOuterSpacing = false,
}: {
  lang: "en" | "ar";
  data?: any;
  withOuterSpacing?: boolean;
}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const isAr = lang === "ar";
  const tx = fallbackText[lang];

  const t = {
    locationTitle: getLocalizedValue(data?.locationTitle, lang, tx.locationTitle),
    locationBody: getLocalizedValue(data?.addressValue, lang, tx.locationBody),
    hoursTitle: getLocalizedValue(data?.hoursTitle, lang, tx.hoursTitle),
    hoursBody: getLocalizedValue(data?.hoursValue, lang, tx.hoursBody),
    emailTitle: getLocalizedValue(data?.emailTitle, lang, tx.emailTitle),
    emailBody: data?.digitalValue || tx.emailBody,
    whatsappTitle: getLocalizedValue(data?.whatsappTitle, lang, tx.whatsappTitle),
    whatsappBody: data?.whatsappValue || tx.whatsappBody,
    whatsappLink: data?.whatsappLink || "https://wa.me/963930000000",
    whatsappCta: getLocalizedValue(data?.chatConcierge, lang, tx.whatsappCta),
    formCursive: getLocalizedValue(data?.formCursive, lang, tx.formCursive),
    formTitle: getLocalizedValue(data?.formTitle, lang, tx.formTitle),
    formSub: getLocalizedValue(data?.formSubtitle, lang, tx.formSub),
    name: getLocalizedValue(data?.fullNameLabel, lang, tx.name),
    email: getLocalizedValue(data?.emailLabel, lang, tx.email),
    phone: getLocalizedValue(data?.phoneLabel, lang, tx.phone),
    msg: getLocalizedValue(data?.msgLabel, lang, tx.msg),
    send: getLocalizedValue(data?.sendBtn, lang, tx.send),
    okTitle: getLocalizedValue(data?.successHeader, lang, tx.okTitle),
    okBody: getLocalizedValue(data?.successDesc, lang, tx.okBody),
    okReset: getLocalizedValue(data?.sendAnother, lang, tx.okReset),
  };
  const formImageUrl = data?.formImage?.asset?.url || "/brand/hero-woman.jpg";

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!name || !email || !message || submitting) return;
    setSubmitting(true);
    setError("");
    try {
      await submitContactInquiry({ name, email, phone, message, language: lang, source: "contact-details-form-section" });
      setSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to send your message right now.");
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    if (!submitted) return;

    const timer = window.setTimeout(() => {
      setName("");
      setEmail("");
      setPhone("");
      setMessage("");
      setError("");
      setSubmitted(false);
    }, 5000);

    return () => window.clearTimeout(timer);
  }, [submitted]);

  return (
    <Box
      component="section"
      sx={{
        bgcolor: TK.ivory,
        color: TK.charcoal,
        py: withOuterSpacing ? { xs: 6, md: 9 } : 0,
        borderTop: withOuterSpacing ? "1px solid rgba(0,0,0,0.04)" : "none",
      }}
    >
      <Container maxWidth="xl" sx={{ px: { xs: 2, sm: 3, md: 4 } }}>
        <Box
          sx={{
            bgcolor: "#fff",
            border: `1px solid ${TK.border}`,
            boxShadow: withOuterSpacing ? "0 24px 70px rgba(17,17,17,0.06)" : "none",
            overflow: "hidden",
          }}
        >
          <Box sx={{ borderBottom: `1px solid ${TK.border}` }}>
            <Grid container>
              {[
                { title: t.locationTitle, body: t.locationBody, href: undefined as string | undefined, cta: undefined as string | undefined },
                { title: t.hoursTitle, body: t.hoursBody, href: undefined, cta: undefined },
                { title: t.emailTitle, body: t.emailBody, href: `mailto:${t.emailBody}`, cta: undefined },
                // Hidden for now.
                // { title: t.whatsappTitle, body: t.whatsappBody, href: t.whatsappLink, cta: t.whatsappCta },
              ].map((item, i) => (
                <Grid
                  key={item.title}
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
                    sx={{ p: { xs: 3.25, md: 4.5 } }}
                  >
                    <Typography sx={{ fontFamily: TK.heading, fontSize: { xs: 17, md: 18 }, fontWeight: 500, mb: 1.5, textTransform: "capitalize" }}>
                      {item.title}
                    </Typography>
                    {item.href ? (
                      <MuiLink href={item.href} target={item.href.startsWith("http") ? "_blank" : undefined} rel={item.href.startsWith("http") ? "noopener noreferrer" : undefined} underline="none" sx={{ fontSize: 14, color: "rgba(0,0,0,0.6)", fontFamily: TK.body, lineHeight: 1.7, whiteSpace: "pre-line", display: "block", "&:hover": { color: TK.copper } }}>
                        {item.body}
                      </MuiLink>
                    ) : (
                      <Typography sx={{ fontSize: 14, color: "rgba(0,0,0,0.6)", fontFamily: TK.body, lineHeight: 1.7, whiteSpace: "pre-line" }}>
                        {item.body}
                      </Typography>
                    )}
                    {item.cta && (
                      <Button component="a" href={t.whatsappLink} target="_blank" rel="noopener noreferrer" startIcon={<WhatsAppIcon sx={{ fontSize: "15px !important", color: "#25D366" }} />} sx={{ mt: 2, px: 0, minWidth: 0, fontSize: 13, fontWeight: 600, color: TK.copper, fontFamily: TK.body, textTransform: "none", "&:hover": { bgcolor: "transparent", opacity: 0.75 } }}>
                        {item.cta}
                      </Button>
                    )}
                  </MotionBox>
                </Grid>
              ))}
            </Grid>
          </Box>

          <Box sx={{ py: { xs: 6, md: 9 } }}>
            <Container maxWidth="lg">
              <Grid container spacing={{ xs: 5, md: 0 }} direction={isAr ? "row-reverse" : "row"} alignItems="stretch">
                <Grid size={{ xs: 12, md: 5 }}>
                  <MotionBox initial={{ opacity: 0, x: isAr ? 20 : -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, margin: "-40px" }} transition={{ duration: 0.65, ease: TK.ease }} sx={{ position: "relative", height: { xs: 320, md: "100%" }, minHeight: { md: 560 }, overflow: "hidden", "&:hover img": { transform: "scale(1.03)" } }}>
                    <Box component="img" src={formImageUrl} alt="Fashion Gate Private Client" sx={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "center top", transition: "transform 0.8s cubic-bezier(0.25, 1, 0.5, 1)" }} />
                  </MotionBox>
                </Grid>
                <Grid size={{ xs: 12, md: 7 }}>
                  <Box sx={{ px: { xs: 0, md: 8, lg: 10 }, py: { xs: 1, md: 4 }, display: "flex", flexDirection: "column", justifyContent: "center", height: "100%" }}>
                    <AnimatePresence mode="wait">
                      {!submitted ? (
                        <MotionBox key="form" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.4 }}>
                          <Typography sx={{ fontFamily: isAr ? TK.cursiveAr : TK.cursive, fontSize: { xs: "1.3rem", md: "1.7rem" }, color: TK.copper, mb: 0.5 }}>
                            {t.formCursive}
                          </Typography>
                          <Typography variant="h2" sx={{ fontFamily: TK.heading, fontSize: { xs: "1.6rem", sm: "2rem", md: "2.4rem" }, fontWeight: 400, mb: 1, textTransform: "capitalize" }}>
                            {t.formTitle}
                          </Typography>
                          <Typography sx={{ fontSize: 14, color: "rgba(0,0,0,0.5)", mb: 5, fontFamily: TK.body, lineHeight: 1.7 }}>
                            {t.formSub}
                          </Typography>
                          <form onSubmit={handleSubmit}>
                            <Stack spacing={3.5}>
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
                              {error && <Typography role="alert" sx={{ fontSize: 13, color: "#9D1C0C", fontFamily: TK.body }}>{error}</Typography>}
                              <Box>
                                <Button type="submit" disabled={submitting} endIcon={!submitting && (isAr ? <ArrowBackIcon sx={{ fontSize: "15px !important" }} /> : <ArrowForwardIcon sx={{ fontSize: "15px !important" }} />)} sx={{ bgcolor: TK.charcoal, color: "#fff", px: 5, py: 1.5, fontSize: 12, fontWeight: 700, fontFamily: TK.body, letterSpacing: isAr ? 0 : "0.12em", textTransform: "uppercase", "& .MuiButton-endIcon": { ml: isAr ? 0 : 1, mr: isAr ? 1 : 0 }, "&:hover": { bgcolor: TK.copper, transform: "translateY(-1px)", boxShadow: "0 6px 18px rgba(203,97,22,0.18)" }, "&.Mui-disabled": { bgcolor: "rgba(0,0,0,0.28)", color: "#fff" } }}>
                                  {submitting ? tx.sending : t.send}
                                </Button>
                              </Box>
                            </Stack>
                          </form>
                        </MotionBox>
                      ) : (
                        <MotionBox key="ok" initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.35 }} sx={{ textAlign: "center", py: 4 }}>
                          <Box sx={{ width: 56, height: 56, borderRadius: "50%", bgcolor: "rgba(203,97,22,0.08)", display: "flex", alignItems: "center", justifyContent: "center", mx: "auto", mb: 2.5 }}>
                            <CheckCircleOutlineIcon sx={{ color: TK.copper, fontSize: 30 }} />
                          </Box>
                          <Typography sx={{ fontFamily: TK.heading, fontSize: 26, fontWeight: 400, mb: 1 }}>{t.okTitle}</Typography>
                          <Typography sx={{ fontSize: 14.5, color: "rgba(0,0,0,0.55)", lineHeight: 1.7, maxWidth: 360, mx: "auto", mb: 3.5, fontFamily: TK.body }}>
                            {t.okBody}
                          </Typography>
                        </MotionBox>
                      )}
                    </AnimatePresence>
                  </Box>
                </Grid>
              </Grid>
            </Container>
          </Box>
        </Box>
      </Container>
    </Box>
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
    <Stack spacing={0.6}>
      <Typography component="label" sx={{ fontSize: 12, fontWeight: 600, color: focused ? TK.copper : "rgba(0,0,0,0.7)", fontFamily: TK.body, letterSpacing: isAr ? 0 : "0.02em", transition: "color 0.2s" }}>
        {label}{required && " *"}
      </Typography>
      <InputBase
        required={required}
        type={type}
        multiline={multiline}
        rows={multiline ? 5 : undefined}
        fullWidth
        value={value}
        onChange={(event) => onChange(event.target.value)}
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
