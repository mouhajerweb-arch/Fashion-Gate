"use client";

import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Typography,
  Checkbox,
  FormControlLabel,
  Collapse,
  Stack,
  IconButton,
  Container,
} from "@mui/material";
import CookieIcon from "@mui/icons-material/Cookie";
import CloseIcon from "@mui/icons-material/Close";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";

interface CookieConsentProps {
  lang: "en" | "ar";
  settings?: {
    enabled?: boolean;
    message?: { en?: string; ar?: string };
    acceptAllText?: { en?: string; ar?: string };
    rejectAllText?: { en?: string; ar?: string };
    customizeText?: { en?: string; ar?: string };
    hidePreferencesText?: { en?: string; ar?: string };
    savePreferencesText?: { en?: string; ar?: string };
    necessaryLabel?: { en?: string; ar?: string };
    necessaryDesc?: { en?: string; ar?: string };
    analyticsLabel?: { en?: string; ar?: string };
    analyticsDesc?: { en?: string; ar?: string };
    marketingLabel?: { en?: string; ar?: string };
    marketingDesc?: { en?: string; ar?: string };
  };
}

export default function CookieConsent({ lang, settings }: CookieConsentProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [showPreferences, setShowPreferences] = useState(false);
  
  // Custom preferences states
  const [essential, setEssential] = useState(true); // Always true & disabled
  const [analytics, setAnalytics] = useState(true);
  const [marketing, setMarketing] = useState(true);

  useEffect(() => {
    // Check if consent has already been given permanently
    const consent = localStorage.getItem("fashiongate_cookie_consent");
    // Check if banner was closed in the current tab session
    const sessionClosed = sessionStorage.getItem("fashiongate_cookie_banner_closed");

    if (!consent && !sessionClosed) {
      const handleScroll = () => {
        // Activate banner after scrolling down approx. 700px (equivalent to scrolling past two sections)
        if (window.scrollY > 700) {
          setIsVisible(true);
          window.removeEventListener("scroll", handleScroll);
        }
      };

      window.addEventListener("scroll", handleScroll, { passive: true });
      return () => window.removeEventListener("scroll", handleScroll);
    }
  }, []);

  const handleAcceptAll = () => {
    const consentData = {
      essential: true,
      analytics: true,
      marketing: true,
      timestamp: new Date().toISOString(),
    };
    localStorage.setItem("fashiongate_cookie_consent", JSON.stringify(consentData));
    setIsVisible(false);
  };

  const handleRejectAll = () => {
    const consentData = {
      essential: true,
      analytics: false,
      marketing: false,
      timestamp: new Date().toISOString(),
    };
    localStorage.setItem("fashiongate_cookie_consent", JSON.stringify(consentData));
    setIsVisible(false);
  };

  const handleSavePreferences = () => {
    const consentData = {
      essential: true,
      analytics,
      marketing,
      timestamp: new Date().toISOString(),
    };
    localStorage.setItem("fashiongate_cookie_consent", JSON.stringify(consentData));
    setIsVisible(false);
  };

  // Close only for the current session/tab
  const handleCloseSession = () => {
    sessionStorage.setItem("fashiongate_cookie_banner_closed", "true");
    setIsVisible(false);
  };

  const isRtl = lang === "ar";
  const isEnabled = settings?.enabled !== false;

  if (!isVisible || !isEnabled) return null;

  // Localized string helper
  const getLocalized = (field: any, fallbackEn: string, fallbackAr: string) => {
    if (!field) return isRtl ? fallbackAr : fallbackEn;
    return isRtl ? (field.ar || fallbackAr) : (field.en || fallbackEn);
  };

  // Resolve copies dynamically from CMS settings
  const consentMessage = getLocalized(
    settings?.message,
    "We use cookies on this site to enhance your user experience. By your continued use of this site you accept our terms and condition.",
    "نستخدم ملفات تعريف الارتباط على هذا الموقع لتحسين تجربة المستخدم الخاصة بك. بمواصلة استخدامك لهذا الموقع، فإنك تقبل الشروط والأحكام الخاصة بنا."
  );
  const acceptAllLabel = getLocalized(settings?.acceptAllText, "Accept All", "قبول الكل");
  const rejectAllLabel = getLocalized(settings?.rejectAllText, "Reject All", "رفض الكل");
  const customizeLabel = getLocalized(settings?.customizeText, "Customize", "تخصيص الخيارات");
  const hidePreferencesLabel = getLocalized(settings?.hidePreferencesText, "Hide Preferences", "إخفاء التفضيلات");
  const savePreferencesLabel = getLocalized(settings?.savePreferencesText, "Save Preferences", "حفظ التفضيلات");

  const necessaryLabel = getLocalized(settings?.necessaryLabel, "Necessary (Always Required)", "ضرورية (مطلوبة دائماً)");
  const necessaryDesc = getLocalized(
    settings?.necessaryDesc,
    "Required for core security, language preferences, and essential navigation features.",
    "تُستخدم لتأمين الموقع وحفظ تفضيلات اللغة والخدمات الأساسية للكونسيرج."
  );

  const analyticsLabel = getLocalized(settings?.analyticsLabel, "Analytics & Performance", "التحليلات والأداء");
  const analyticsDesc = getLocalized(
    settings?.analyticsDesc,
    "Allows us to track traffic sources and understand which luxury boutique pages are visited most frequently.",
    "تساعدنا في تتبع عدد زيارات المتجر، وتحليل تفاعل الزوار مع العلامات التجارية الفاخرة."
  );

  const marketingLabel = getLocalized(settings?.marketingLabel, "Marketing & Personalization", "التسويق والتخصيص");
  const marketingDesc = getLocalized(
    settings?.marketingDesc,
    "Used to offer personalized notices regarding private trunk shows, store openings, and client events.",
    "تُستخدم لعرض اقتراحات مخصصة حول الفعاليات، وافتتاح العلامات الجديدة، والعروض الحصرية."
  );

  return (
    <Box
      sx={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        width: "100%",
        zIndex: 9999,
        bgcolor: "rgba(255, 255, 255, 0.98)",
        backdropFilter: "blur(20px)",
        // A premium brand color accent top border to catch attention
        borderTop: "3.5px solid #CB6116",
        boxShadow: "0 -15px 50px rgba(0, 0, 0, 0.08)",
        py: { xs: 2.5, md: 3 },
        // Add left padding to keep content clear of the bottom-left floating 'N' badge
        px: { xs: 2, sm: 3, md: 5 },
        color: "#111111",
        
        // Fluid transform transition instead of sudden mounting
        transform: isVisible ? "translateY(0)" : "translateY(100%)",
        opacity: isVisible ? 1 : 0,
        pointerEvents: isVisible ? "auto" : "none",
        transition: "transform 0.8s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1)",
      }}
      dir={isRtl ? "rtl" : "ltr"}
    >
      {/* Close button in the top corner of the banner */}
      <IconButton
        onClick={handleCloseSession}
        size="small"
        sx={{
          position: "absolute",
          top: 10,
          right: isRtl ? "auto" : 12,
          left: isRtl ? 12 : "auto",
          color: "rgba(0, 0, 0, 0.35)",
          transition: "all 0.2s ease",
          "&:hover": { 
            color: "#111111",
            bgcolor: "rgba(0, 0, 0, 0.05)"
          }
        }}
      >
        <CloseIcon sx={{ fontSize: 16 }} />
      </IconButton>

      <Container maxWidth="xl" disableGutters>
        <Stack spacing={2}>
          {/* Main content row */}
          <Stack
            direction={{ xs: "column", md: "row" }}
            justifyContent="space-between"
            alignItems={{ xs: "stretch", md: "center" }}
            sx={{ gap: { xs: 2, md: 3 } }}
          >
            {/* Left Column: Text & Icon */}
            <Stack direction="row" spacing={1.5} alignItems="flex-start" sx={{ flexGrow: 1, maxWidth: { md: "60%" }, minWidth: 0 }}>
              <CookieIcon sx={{ color: "primary.main", fontSize: 24, mt: 0.3 }} />
              <Stack spacing={0.5}>
                <Typography
                  sx={{
                    fontFamily: '"Cairo", sans-serif',
                    fontSize: 14.5,
                    fontWeight: 500,
                    lineHeight: 1.6,
                    color: "#111111",
                    textAlign: isRtl ? "right" : "left",
                  }}
                >
                  {consentMessage}
                </Typography>
              </Stack>
            </Stack>

            {/* Right Column: Actions */}
            <Stack
              direction={{ xs: "column", sm: "row" }}
              alignItems="center"
              sx={{ 
                width: { xs: "100%", md: "auto" }, 
                minWidth: { md: 420 },
                gap: { xs: 1, sm: 1.5, md: 2 }
              }}
            >
              <Button
                onClick={() => setShowPreferences(!showPreferences)}
                endIcon={
                  showPreferences ? (
                    <ExpandLessIcon sx={{ fontSize: 16 }} />
                  ) : (
                    <ExpandMoreIcon sx={{ fontSize: 16 }} />
                  )
                }
                sx={{
                  color: "rgba(0, 0, 0, 0.6)",
                  fontSize: 11,
                  fontWeight: 700,
                  textTransform: "uppercase",
                  fontFamily: '"Cairo", sans-serif',
                  letterSpacing: isRtl ? 0 : "0.05em",
                  whiteSpace: "nowrap",
                  width: { xs: "100%", sm: "auto" },
                  py: 1,
                  px: 2,
                  "&:hover": { color: "#111111", bgcolor: "rgba(0, 0, 0, 0.04)" },
                }}
              >
                {showPreferences ? hidePreferencesLabel : customizeLabel}
              </Button>

              <Button
                onClick={handleRejectAll}
                variant="outlined"
                sx={{
                  color: "#111111",
                  borderColor: "rgba(0, 0, 0, 0.15)",
                  fontWeight: 700,
                  fontSize: 11.5,
                  borderRadius: 0,
                  py: 1,
                  px: 3,
                  fontFamily: '"Cairo", sans-serif',
                  whiteSpace: "nowrap",
                  width: { xs: "100%", sm: "auto" },
                  minWidth: { sm: 118 },
                  "&:hover": {
                    borderColor: "#111111",
                    bgcolor: "rgba(0, 0, 0, 0.04)",
                  },
                }}
              >
                {rejectAllLabel}
              </Button>

              <Button
                onClick={handleAcceptAll}
                variant="contained"
                sx={{
                  bgcolor: "primary.main",
                  color: "#ffffff",
                  fontWeight: 700,
                  fontSize: 11.5,
                  borderRadius: 0,
                  py: 1,
                  px: 3,
                  fontFamily: '"Cairo", sans-serif',
                  whiteSpace: "nowrap",
                  width: { xs: "100%", sm: "auto" },
                  minWidth: { sm: 118 },
                  "&:hover": { bgcolor: "primary.dark" },
                }}
              >
                {acceptAllLabel}
              </Button>
            </Stack>
          </Stack>

          {/* Preferences Collapse Section */}
          <Collapse in={showPreferences}>
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr", md: "1fr 1fr 1fr" },
                gap: 3,
                pt: 2.5,
                pb: 1,
                borderTop: "1px solid rgba(0, 0, 0, 0.06)",
                mt: 1,
              }}
            >
              {/* Necessary Cookies */}
              <Stack spacing={0.5} sx={{ bgcolor: "rgba(0,0,0,0.015)", p: 2, border: "1px solid rgba(0,0,0,0.04)" }}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={essential}
                      disabled
                      sx={{
                        color: "primary.main",
                        "&.Mui-checked": { color: "primary.main" },
                        "&.Mui-disabled": { color: "rgba(203, 97, 22, 0.5)" },
                      }}
                    />
                  }
                  label={
                    <Typography sx={{ fontSize: 13, fontWeight: 700, fontFamily: '"Cairo", sans-serif', color: "#111111" }}>
                      {necessaryLabel}
                    </Typography>
                  }
                />
                <Typography
                  sx={{
                    fontSize: 11.5,
                    color: "rgba(0, 0, 0, 0.55)",
                    pl: isRtl ? 0 : 3.5,
                    pr: isRtl ? 3.5 : 0,
                    fontFamily: '"Cairo", sans-serif',
                    lineHeight: 1.5,
                  }}
                >
                  {necessaryDesc}
                </Typography>
              </Stack>

              {/* Analytics Cookies */}
              <Stack spacing={0.5} sx={{ bgcolor: "rgba(0,0,0,0.015)", p: 2, border: "1px solid rgba(0,0,0,0.04)" }}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={analytics}
                      onChange={(e) => setAnalytics(e.target.checked)}
                      sx={{
                        color: "rgba(0, 0, 0, 0.25)",
                        "&.Mui-checked": { color: "primary.main" },
                      }}
                    />
                  }
                  label={
                    <Typography sx={{ fontSize: 13, fontWeight: 700, fontFamily: '"Cairo", sans-serif', color: "#111111" }}>
                      {analyticsLabel}
                    </Typography>
                  }
                />
                <Typography
                  sx={{
                    fontSize: 11.5,
                    color: "rgba(0, 0, 0, 0.55)",
                    pl: isRtl ? 0 : 3.5,
                    pr: isRtl ? 3.5 : 0,
                    fontFamily: '"Cairo", sans-serif',
                    lineHeight: 1.5,
                  }}
                >
                  {analyticsDesc}
                </Typography>
              </Stack>

              {/* Marketing Cookies */}
              <Stack spacing={0.5} sx={{ bgcolor: "rgba(0,0,0,0.015)", p: 2, border: "1px solid rgba(0,0,0,0.04)" }}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={marketing}
                      onChange={(e) => setMarketing(e.target.checked)}
                      sx={{
                        color: "rgba(0, 0, 0, 0.25)",
                        "&.Mui-checked": { color: "primary.main" },
                      }}
                    />
                  }
                  label={
                    <Typography sx={{ fontSize: 13, fontWeight: 700, fontFamily: '"Cairo", sans-serif', color: "#111111" }}>
                      {marketingLabel}
                    </Typography>
                  }
                />
                <Typography
                  sx={{
                    fontSize: 11.5,
                    color: "rgba(0, 0, 0, 0.55)",
                    pl: isRtl ? 0 : 3.5,
                    pr: isRtl ? 3.5 : 0,
                    fontFamily: '"Cairo", sans-serif',
                    lineHeight: 1.5,
                  }}
                >
                  {marketingDesc}
                </Typography>
              </Stack>
            </Box>
            
            {/* Preferences Save Row */}
            <Stack direction="row" justifyContent="flex-end" sx={{ mt: 2 }}>
              <Button
                onClick={handleSavePreferences}
                variant="contained"
                sx={{
                  bgcolor: "primary.main",
                  color: "#ffffff",
                  fontWeight: 700,
                  fontSize: 12,
                  borderRadius: 0,
                  py: 1,
                  px: 4,
                  fontFamily: '"Cairo", sans-serif',
                  "&:hover": { bgcolor: "primary.dark" },
                }}
              >
                {savePreferencesLabel}
              </Button>
            </Stack>
          </Collapse>
        </Stack>
      </Container>
    </Box>
  );
}
