"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Container,
  Divider,
  Grid,
  Paper,
  Stack,
  Tab,
  Tabs,
  TextField,
  Typography,
} from "@mui/material";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import SaveOutlinedIcon from "@mui/icons-material/SaveOutlined";
import SendOutlinedIcon from "@mui/icons-material/SendOutlined";
import MarkEmailReadOutlinedIcon from "@mui/icons-material/MarkEmailReadOutlined";
import UploadFileOutlinedIcon from "@mui/icons-material/UploadFileOutlined";
import UndoOutlinedIcon from "@mui/icons-material/UndoOutlined";
import LockOpenOutlinedIcon from "@mui/icons-material/LockOpenOutlined";

type Stats = {
  subscribed: number;
  unsubscribed: number;
  sentCampaigns: number;
};

type LocalizedText = {
  ar?: string;
  en?: string;
};

type DashboardSettings = Record<string, LocalizedText | string | undefined>;

type CampaignForm = {
  campaignId: string;
  title: string;
  subject: string;
  previewText: string;
  titleAr: string;
  titleEn: string;
  subjectAr: string;
  subjectEn: string;
  previewTextAr: string;
  previewTextEn: string;
  heroImageUrl: string;
  heroImageAssetId: string;
  body: string;
  bodyAr: string;
  bodyEn: string;
  ctaLabel: string;
  ctaLabelAr: string;
  ctaLabelEn: string;
  ctaUrl: string;
  testEmail: string;
};

const initialForm: CampaignForm = {
  campaignId: "",
  title: "",
  subject: "",
  previewText: "",
  titleAr: "",
  titleEn: "",
  subjectAr: "",
  subjectEn: "",
  previewTextAr: "",
  previewTextEn: "",
  heroImageUrl: "",
  heroImageAssetId: "",
  body: "",
  bodyAr: "",
  bodyEn: "",
  ctaLabel: "",
  ctaLabelAr: "",
  ctaLabelEn: "",
  ctaUrl: "",
  testEmail: "",
};

type CampaignDraft = Omit<CampaignForm, "testEmail"> & {
  id: string;
  status: string;
  updatedAt: string;
  sentAt: string;
};

function getStoredToken() {
  if (typeof window === "undefined") return "";
  return window.localStorage.getItem("fg_newsletter_admin_session") || "";
}

function getLocalized(settings: DashboardSettings | null, key: string, lang: "ar" | "en", fallback: string) {
  const value = settings?.[key];
  if (value && typeof value === "object") {
    return value[lang] || value.en || value.ar || fallback;
  }
  return fallback;
}

function containsArabic(value?: string) {
  return /[\u0600-\u06FF]/.test(value || "");
}

function englishOnly(value?: string) {
  return containsArabic(value) ? "" : value || "";
}

export default function NewsletterDashboardClient({ initialLanguage = "en" }: { initialLanguage?: "ar" | "en" }) {
  const [token, setToken] = useState("");
  const [accessToken, setAccessToken] = useState("");
  const [stats, setStats] = useState<Stats | null>(null);
  const [dashboardSettings, setDashboardSettings] = useState<DashboardSettings | null>(null);
  const [drafts, setDrafts] = useState<CampaignDraft[]>([]);
  const [libraryTab, setLibraryTab] = useState<"drafts" | "sent">("drafts");
  const [pageLang] = useState<"ar" | "en">(initialLanguage);
  const [editorLang, setEditorLang] = useState<"ar" | "en">(initialLanguage);
  const [form, setForm] = useState<CampaignForm>(initialForm);
  const [status, setStatus] = useState<{ type: "success" | "error" | "info"; message: string } | null>(null);
  const [loadingAction, setLoadingAction] = useState<"stats" | "save" | "test" | "send" | "upload" | "otp" | "verify" | null>(null);
  const [pendingSendSeconds, setPendingSendSeconds] = useState(0);
  const sendTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const sendIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const headers = useMemo(
    () => ({
      "Content-Type": "application/json",
      "x-newsletter-admin-session": token,
    }),
    [token]
  );

  const filteredDrafts = useMemo(
    () => drafts.filter((draft) => (libraryTab === "sent" ? draft.status === "sent" : draft.status !== "sent")),
    [drafts, libraryTab]
  );

  useEffect(() => {
    const savedToken = getStoredToken();
    if (savedToken) {
      setToken(savedToken);
    }
    fetch("/api/newsletter/settings")
      .then((response) => response.json())
      .then((data) => {
        if (data?.success) setDashboardSettings(data.settings || null);
      })
      .catch(() => undefined);
  }, []);

  useEffect(() => {
    if (!token) return;
    void loadStats();
    void loadDrafts();
  }, [token]);

  useEffect(() => {
    return () => {
      if (sendTimeoutRef.current) clearTimeout(sendTimeoutRef.current);
      if (sendIntervalRef.current) clearInterval(sendIntervalRef.current);
    };
  }, []);

  async function loadStats() {
    setLoadingAction("stats");
    try {
      const response = await fetch("/api/newsletter/admin/stats", { headers });
      const data = await response.json();
      if (!response.ok || !data.success) throw new Error(data.message || "Unable to load stats.");
      setStats(data.stats);
    } catch (error) {
      setStatus({ type: "error", message: error instanceof Error ? error.message : "Unable to load stats." });
    } finally {
      setLoadingAction(null);
    }
  }

  async function loadDrafts() {
    try {
      const response = await fetch("/api/newsletter/admin/campaigns", { headers });
      const data = await response.json();
      if (!response.ok || !data.success) throw new Error(data.message || "Unable to load drafts.");
      setDrafts(data.campaigns || []);
    } catch (error) {
      setStatus({ type: "error", message: error instanceof Error ? error.message : "Unable to load drafts." });
    }
  }

  async function requestAccessToken() {
    setLoadingAction("otp");
    setStatus(null);
    try {
      const response = await fetch("/api/newsletter/admin/request-otp", { method: "POST" });
      const data = await response.json();
      if (!response.ok || !data.success) throw new Error(data.message || "Unable to send access token.");
      setStatus({ type: "success", message: data.message });
    } catch (error) {
      setStatus({ type: "error", message: error instanceof Error ? error.message : "Unable to send access token." });
    } finally {
      setLoadingAction(null);
    }
  }

  async function verifyAccessToken() {
    const tokenValue = accessToken.trim().toUpperCase();
    if (!/^FGM-[A-Z0-9]{12}$/.test(tokenValue)) {
      setStatus({ type: "error", message: "Enter the access token from support email." });
      return;
    }

    setLoadingAction("verify");
    setStatus(null);
    try {
      const response = await fetch("/api/newsletter/admin/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: tokenValue }),
      });
      const data = await response.json();
      if (!response.ok || !data.success) throw new Error(data.message || "Unable to verify access token.");
      window.localStorage.setItem("fg_newsletter_admin_session", data.sessionToken);
      setToken(data.sessionToken);
      setAccessToken("");
      setStatus({ type: "success", message: "Dashboard unlocked." });
    } catch (error) {
      setStatus({ type: "error", message: error instanceof Error ? error.message : "Unable to verify access token." });
    } finally {
      setLoadingAction(null);
    }
  }

  function updateField(field: keyof CampaignForm, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function loadDraft(draft: CampaignDraft) {
    setForm((current) => ({
      ...current,
      campaignId: draft.id,
      title: draft.title,
      subject: draft.subject,
      previewText: draft.previewText,
      titleAr: draft.titleAr || "",
      titleEn: englishOnly(draft.titleEn),
      subjectAr: draft.subjectAr || "",
      subjectEn: englishOnly(draft.subjectEn),
      previewTextAr: draft.previewTextAr || "",
      previewTextEn: englishOnly(draft.previewTextEn),
      heroImageUrl: draft.heroImageUrl,
      heroImageAssetId: draft.heroImageAssetId,
      body: draft.body,
      bodyAr: draft.bodyAr || "",
      bodyEn: englishOnly(draft.bodyEn),
      ctaLabel: draft.ctaLabel,
      ctaLabelAr: draft.ctaLabelAr || "",
      ctaLabelEn: englishOnly(draft.ctaLabelEn),
      ctaUrl: draft.ctaUrl,
    }));
    setStatus({ type: "info", message: "Draft loaded into editor." });
  }

  function startNewDraft() {
    setForm((current) => ({ ...initialForm, testEmail: current.testEmail }));
    setStatus({ type: "info", message: "New draft started." });
  }

  function campaignPayload() {
    const title = form.titleEn || form.titleAr || form.title;
    const subject = form.subjectEn || form.subjectAr || form.subject;
    const previewText = form.previewTextEn || form.previewTextAr || form.previewText;
    const body = form.bodyEn || form.bodyAr || form.body;
    const ctaLabel = form.ctaLabelEn || form.ctaLabelAr || form.ctaLabel;

    return {
      campaignId: form.campaignId,
      title,
      subject,
      previewText,
      titleAr: form.titleAr,
      titleEn: englishOnly(form.titleEn),
      subjectAr: form.subjectAr,
      subjectEn: englishOnly(form.subjectEn),
      previewTextAr: form.previewTextAr,
      previewTextEn: englishOnly(form.previewTextEn),
      heroImageUrl: form.heroImageUrl,
      heroImageAssetId: form.heroImageAssetId,
      body,
      bodyAr: form.bodyAr,
      bodyEn: englishOnly(form.bodyEn),
      ctaLabel,
      ctaLabelAr: form.ctaLabelAr,
      ctaLabelEn: englishOnly(form.ctaLabelEn),
      ctaUrl: form.ctaUrl,
    };
  }

  function clearPendingSend() {
    if (sendTimeoutRef.current) {
      clearTimeout(sendTimeoutRef.current);
      sendTimeoutRef.current = null;
    }
    if (sendIntervalRef.current) {
      clearInterval(sendIntervalRef.current);
      sendIntervalRef.current = null;
    }
    setPendingSendSeconds(0);
  }

  async function runAction(action: "save" | "test" | "send") {
    setLoadingAction(action);
    setStatus(null);

    const endpoint =
      action === "save"
        ? "/api/newsletter/admin/campaigns"
        : action === "test"
          ? "/api/newsletter/admin/send-test"
          : "/api/newsletter/admin/send";

    const body =
      action === "test"
        ? { ...campaignPayload(), testEmail: form.testEmail }
        : campaignPayload();

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers,
        body: JSON.stringify(body),
      });
      const data = await response.json();
      if (!response.ok || !data.success) throw new Error(data.message || "Action failed.");
      setStatus({ type: "success", message: data.message });
      if (action === "save" && data.campaignId) {
        setForm((current) => ({ ...current, campaignId: data.campaignId }));
      }
      if (action === "send") {
        setForm((current) => ({ ...initialForm, testEmail: current.testEmail }));
        setLibraryTab("sent");
      }
      if (action === "send" || action === "save") {
        await loadStats();
        await loadDrafts();
      }
    } catch (error) {
      setStatus({ type: "error", message: error instanceof Error ? error.message : "Action failed." });
    } finally {
      setLoadingAction(null);
    }
  }

  function scheduleSend() {
    if (disabled || pendingSendSeconds > 0) return;

    setPendingSendSeconds(5);
    setStatus({ type: "info", message: "Newsletter send scheduled. You have 5 seconds to undo." });

    sendIntervalRef.current = setInterval(() => {
      setPendingSendSeconds((seconds) => {
        if (seconds <= 1) {
          if (sendIntervalRef.current) {
            clearInterval(sendIntervalRef.current);
            sendIntervalRef.current = null;
          }
          return 0;
        }
        return seconds - 1;
      });
    }, 1000);

    sendTimeoutRef.current = setTimeout(() => {
      clearPendingSend();
      void runAction("send");
    }, 5000);
  }

  function undoSend() {
    clearPendingSend();
    setStatus({ type: "info", message: "Newsletter send cancelled." });
  }

  async function uploadImage(file?: File) {
    if (!file) return;
    if (!token) {
      setStatus({ type: "error", message: "Unlock the dashboard before uploading images." });
      return;
    }

    setLoadingAction("upload");
    setStatus(null);

    const formData = new FormData();
    formData.append("image", file);

    try {
      const response = await fetch("/api/newsletter/admin/upload-image", {
        method: "POST",
        headers: {
          "x-newsletter-admin-session": token,
        },
        body: formData,
      });
      const data = await response.json();
      if (!response.ok || !data.success) throw new Error(data.message || "Unable to upload image.");
      setForm((current) => ({
        ...current,
        heroImageUrl: data.imageUrl,
        heroImageAssetId: data.assetId || "",
      }));
      setStatus({ type: "success", message: "Image uploaded and added to the newsletter." });
    } catch (error) {
      setStatus({ type: "error", message: error instanceof Error ? error.message : "Unable to upload image." });
    } finally {
      setLoadingAction(null);
    }
  }

  const disabled = !token || loadingAction !== null;
  const sendDisabled = disabled || pendingSendSeconds > 0;
  const uiLang = pageLang;
  const dashboardCopy = {
    eyebrow: getLocalized(dashboardSettings, "dashboardEyebrow", uiLang, uiLang === "ar" ? "فاشن غيت مول" : "Fashion Gate Mall"),
    title: getLocalized(dashboardSettings, "dashboardTitle", uiLang, uiLang === "ar" ? "لوحة النشرة البريدية" : "Newsletter Dashboard"),
    intro: getLocalized(
      dashboardSettings,
      "dashboardIntro",
      uiLang,
      uiLang === "ar"
        ? "أنشئ تحديثات أنيقة، أرسل بريداً تجريبياً للمراجعة، ثم أرسل الحملة للمشتركين فقط."
        : "Create polished updates, send a test email for approval, then send the campaign to subscribed users only."
    ),
    libraryTitle: getLocalized(dashboardSettings, "dashboardLibraryTitle", uiLang, uiLang === "ar" ? "مكتبة الحملات" : "Campaign Library"),
    libraryIntro: getLocalized(dashboardSettings, "dashboardLibraryIntro", uiLang, uiLang === "ar" ? "اختر مسودة محفوظة أو حملة مرسلة." : "Select a saved draft or sent campaign."),
    editorTitle: getLocalized(dashboardSettings, "dashboardEditorTitle", uiLang, uiLang === "ar" ? "محرر الحملة" : "Campaign Editor"),
    creatingDraft: getLocalized(dashboardSettings, "dashboardCreatingDraft", uiLang, uiLang === "ar" ? "إنشاء مسودة جديدة" : "Creating new draft"),
    editingDraft: getLocalized(dashboardSettings, "dashboardEditingDraft", uiLang, uiLang === "ar" ? "تعديل مسودة محفوظة" : "Editing saved draft"),
    newDraft: getLocalized(dashboardSettings, "dashboardNewDraft", uiLang, uiLang === "ar" ? "مسودة جديدة" : "New Draft"),
    draftsTab: getLocalized(dashboardSettings, "dashboardDraftsTab", uiLang, uiLang === "ar" ? "المسودات" : "Drafts"),
    sentTab: getLocalized(dashboardSettings, "dashboardSentTab", uiLang, uiLang === "ar" ? "المرسلة" : "Sent"),
  };
  const text = {
    generateToken: uiLang === "ar" ? "إرسال رمز الدخول إلى بريد الدعم" : "Generate Token to Support Email",
    generatingToken: uiLang === "ar" ? "جاري إرسال الرمز..." : "Generating Token...",
    accessToken: uiLang === "ar" ? "رمز الدخول" : "Access Token",
    verified: uiLang === "ar" ? "تم التحقق في هذا المتصفح." : "Verified in this browser.",
    pasteToken: uiLang === "ar" ? "ألصق الرمز من بريد الدعم." : "Paste the token from support inbox.",
    verify: uiLang === "ar" ? "تحقق" : "Verify",
    verifying: uiLang === "ar" ? "جاري التحقق..." : "Verifying...",
    testEmail: uiLang === "ar" ? "بريد الاختبار" : "Test Email",
    saveDraft: uiLang === "ar" ? "حفظ المسودة" : "Save Draft",
    sendTest: uiLang === "ar" ? "إرسال اختبار" : "Send Test",
    sendSubscribers: uiLang === "ar" ? "إرسال للمشتركين" : "Send to Subscribers",
    sendingIn: uiLang === "ar" ? "الإرسال خلال" : "Sending in",
    undoSend: uiLang === "ar" ? "إلغاء الإرسال" : "Undo Send",
    verificationRequired: uiLang === "ar" ? "التحقق مطلوب" : "Verification Required",
    generateToContinue: uiLang === "ar" ? "أرسل الرمز للمتابعة" : "Generate token to continue",
    lockedIntro:
      uiLang === "ar"
        ? "سيظهر محرر النشرة والمسودات ورفع الصور وخيارات الإرسال بعد التحقق من رمز بريد الدعم."
        : "The newsletter editor, drafts, image upload, and send options will appear after support email token verification.",
  };
  const rtlFieldSx = {
    "& .MuiInputBase-input, & .MuiInputBase-inputMultiline": {
      textAlign: "right",
      pt: 2.25,
    },
    "& .MuiInputLabel-root": {
      left: "auto",
      right: 14,
      px: 0.75,
      bgcolor: "#fffdfa",
      transform: "translate(0, -9px) scale(0.75)",
      transformOrigin: "top right",
      zIndex: 1,
      pointerEvents: "none",
    },
    "& .MuiOutlinedInput-root": { direction: "rtl" },
    "& .MuiOutlinedInput-notchedOutline legend": {
      display: "none",
    },
    "& .MuiFormHelperText-root": { textAlign: "right" },
  };

  return (
    <Box dir={uiLang === "ar" ? "rtl" : "ltr"} sx={{ minHeight: "100vh", bgcolor: "#f7f3ee", color: "#111111", py: { xs: 4, md: 7 } }}>
      <Container maxWidth="lg">
        <Stack spacing={4}>
          <Box>
            <Typography sx={{ fontSize: 12, fontWeight: 800, letterSpacing: "0.22em", color: "#CB6116", textTransform: "uppercase" }}>
              {dashboardCopy.eyebrow}
            </Typography>
            <Typography sx={{ mt: 1, fontFamily: "var(--font-cormorant), Georgia, serif", fontSize: { xs: 42, md: 64 }, lineHeight: 0.95 }}>
              {dashboardCopy.title}
            </Typography>
            <Typography sx={{ mt: 2, maxWidth: 680, color: "rgba(0,0,0,0.58)", lineHeight: 1.8 }}>
              {dashboardCopy.intro}
            </Typography>
          </Box>

          <Paper elevation={0} sx={{ p: { xs: 2.5, md: 3.5 }, borderRadius: 0, border: "1px solid #e3d9cf", bgcolor: "#fffdfa" }}>
            <Grid container spacing={2} alignItems="flex-start">
              <Grid size={{ xs: 12, md: 5 }}>
                <Button
                  fullWidth
                  variant="contained"
                  startIcon={<LockOpenOutlinedIcon />}
                  onClick={requestAccessToken}
                  disabled={loadingAction !== null}
                  sx={{
                    minHeight: 56,
                    bgcolor: "#111111",
                    borderRadius: 0,
                    boxShadow: "0 14px 30px rgba(17,17,17,0.16)",
                    "&:hover": { bgcolor: "#CB6116" },
                  }}
                >
                  {loadingAction === "otp" ? text.generatingToken : text.generateToken}
                </Button>
              </Grid>
              <Grid size={{ xs: 12, md: 4 }}>
                <TextField
                  fullWidth
                  label={text.accessToken}
                  value={accessToken}
                  onChange={(event) => setAccessToken(event.target.value.toUpperCase().slice(0, 16))}
                  helperText={token ? text.verified : text.pasteToken}
                  sx={uiLang === "ar" ? rtlFieldSx : undefined}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 3 }}>
                <Button
                  fullWidth
                  variant="outlined"
                  onClick={verifyAccessToken}
                  disabled={loadingAction !== null || !accessToken}
                  sx={{
                    minHeight: 56,
                    borderRadius: 0,
                  }}
                >
                  {loadingAction === "verify" ? text.verifying : text.verify}
                </Button>
              </Grid>
            </Grid>
          </Paper>

          {status ? (
            <Alert
              severity={status.type}
              onClose={() => setStatus(null)}
              action={
                pendingSendSeconds > 0 ? (
                  <Button
                    color="inherit"
                    size="small"
                    startIcon={<UndoOutlinedIcon />}
                    onClick={undoSend}
                    sx={{ borderRadius: 0, fontWeight: 800 }}
                  >
                    Undo
                  </Button>
                ) : undefined
              }
              sx={{
                borderRadius: 0,
                alignItems: "center",
                border: "1px solid",
                borderColor:
                  status.type === "success"
                    ? "rgba(47,107,63,0.18)"
                    : status.type === "error"
                      ? "rgba(157,28,12,0.18)"
                      : "rgba(203,97,22,0.18)",
              }}
            >
              {status.message}
            </Alert>
          ) : null}

          {token ? (
            <>
          <Grid container spacing={2}>
            {[
              [uiLang === "ar" ? "المشتركون" : "Subscribed", stats?.subscribed ?? "-"],
              [uiLang === "ar" ? "إلغاء الاشتراك" : "Unsubscribed", stats?.unsubscribed ?? "-"],
              [uiLang === "ar" ? "الحملات المرسلة" : "Sent Campaigns", stats?.sentCampaigns ?? "-"],
            ].map(([label, value]) => (
              <Grid size={{ xs: 12, md: 4 }} key={label}>
                <Paper elevation={0} sx={{ p: 3, borderRadius: 0, border: "1px solid #e3d9cf", bgcolor: "#fffdfa" }}>
                  <Typography sx={{ fontSize: 11, fontWeight: 800, letterSpacing: "0.18em", color: "#8a7e73", textTransform: "uppercase" }}>
                    {label}
                  </Typography>
                  <Typography sx={{ mt: 1, fontFamily: "var(--font-cormorant), Georgia, serif", fontSize: 44, lineHeight: 1 }}>
                    {value}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>

          <Grid container spacing={3} alignItems="flex-start">
            <Grid size={{ xs: 12, md: 4 }}>
              <Paper elevation={0} sx={{ p: { xs: 2.5, md: 3 }, borderRadius: 0, border: "1px solid #e3d9cf", bgcolor: "#fffdfa" }}>
                <Stack direction="row" spacing={1.5} alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
                  <Box>
                    <Typography sx={{ fontSize: 11, fontWeight: 800, letterSpacing: "0.18em", color: "#8a7e73", textTransform: "uppercase" }}>
                      {dashboardCopy.libraryTitle}
                    </Typography>
                    <Typography sx={{ mt: 0.5, fontSize: 13, color: "rgba(0,0,0,0.55)" }}>
                      {dashboardCopy.libraryIntro}
                    </Typography>
                  </Box>
                  <Button
                    aria-label="New draft"
                    disabled={disabled}
                    onClick={startNewDraft}
                    sx={{ minWidth: 44, height: 44, borderRadius: 0, color: "#111111", border: "1px solid #ded2c8" }}
                  >
                    <AddOutlinedIcon />
                  </Button>
                </Stack>

                <Tabs
                  value={libraryTab}
                  onChange={(_, value: "drafts" | "sent") => setLibraryTab(value)}
                  sx={{
                    minHeight: 42,
                    mb: 2,
                    borderBottom: "1px solid #eadfd5",
                    "& .MuiTab-root": {
                      minHeight: 42,
                      fontSize: 11,
                      fontWeight: 800,
                      letterSpacing: "0.12em",
                      color: "#8a7e73",
                    },
                    "& .Mui-selected": { color: "#111111 !important" },
                    "& .MuiTabs-indicator": { bgcolor: "#CB6116" },
                  }}
                >
                  <Tab value="drafts" label={`${dashboardCopy.draftsTab} (${drafts.filter((draft) => draft.status !== "sent").length})`} />
                  <Tab value="sent" label={`${dashboardCopy.sentTab} (${drafts.filter((draft) => draft.status === "sent").length})`} />
                </Tabs>

                <Stack spacing={1.25} sx={{ maxHeight: 520, overflowY: "auto", pr: 0.5 }}>
                  {filteredDrafts.length ? (
                    filteredDrafts.map((draft) => {
                      const active = form.campaignId === draft.id;
                      return (
                        <Button
                          key={draft.id}
                          disabled={!token}
                          onClick={() => loadDraft(draft)}
                          sx={{
                            display: "block",
                            width: "100%",
                            borderRadius: 0,
                            textAlign: "left",
                            p: 1.75,
                            color: "#111111",
                            border: active ? "1px solid #CB6116" : "1px solid #eadfd5",
                            bgcolor: active ? "rgba(203,97,22,0.07)" : "#ffffff",
                            textTransform: "none",
                            "&:hover": { bgcolor: "rgba(203,97,22,0.06)" },
                          }}
                        >
                          <Typography sx={{ fontSize: 14, fontWeight: 700, lineHeight: 1.35 }}>
                            {draft.title}
                          </Typography>
                          <Typography sx={{ mt: 0.5, fontSize: 12, color: "rgba(0,0,0,0.56)", lineHeight: 1.45 }}>
                            {draft.subject || "No subject yet"}
                          </Typography>
                          <Typography sx={{ mt: 1, fontSize: 10, fontWeight: 800, letterSpacing: "0.14em", color: draft.status === "sent" ? "#2f6b3f" : "#8a7e73", textTransform: "uppercase" }}>
                            {draft.status}
                          </Typography>
                        </Button>
                      );
                    })
                  ) : (
                    <Typography sx={{ py: 4, textAlign: "center", color: "rgba(0,0,0,0.48)", fontSize: 13 }}>
                      {libraryTab === "sent"
                        ? uiLang === "ar" ? "لا توجد حملات مرسلة بعد." : "No sent campaigns yet."
                        : uiLang === "ar" ? "لا توجد مسودات بعد." : "No drafts yet."}
                    </Typography>
                  )}
                </Stack>
              </Paper>
            </Grid>

            <Grid size={{ xs: 12, md: 8 }}>
          <Paper elevation={0} sx={{ p: { xs: 2.5, md: 4 }, borderRadius: 0, border: "1px solid #e3d9cf", bgcolor: "#fffdfa" }}>
            <Stack spacing={3}>
              <Stack direction={{ xs: "column", sm: "row" }} justifyContent="space-between" spacing={1.5}>
                <Box>
                  <Typography sx={{ fontSize: 11, fontWeight: 800, letterSpacing: "0.18em", color: "#8a7e73", textTransform: "uppercase" }}>
                    {dashboardCopy.editorTitle}
                  </Typography>
                  <Typography sx={{ mt: 0.5, fontSize: 13, color: "rgba(0,0,0,0.55)" }}>
                    {form.campaignId ? dashboardCopy.editingDraft : dashboardCopy.creatingDraft}
                  </Typography>
                </Box>
                <Button disabled={disabled} startIcon={<AddOutlinedIcon />} variant="outlined" onClick={startNewDraft} sx={{ borderRadius: 0 }}>
                  {dashboardCopy.newDraft}
                </Button>
              </Stack>
              <Tabs
                value={editorLang}
                onChange={(_, value: "ar" | "en") => setEditorLang(value)}
                sx={{
                  minHeight: 44,
                  borderBottom: "1px solid #eadfd5",
                  "& .MuiTab-root": {
                    minHeight: 44,
                    fontSize: 11,
                    fontWeight: 900,
                    letterSpacing: "0.12em",
                    color: "#8a7e73",
                  },
                  "& .Mui-selected": { color: "#111111 !important" },
                  "& .MuiTabs-indicator": { bgcolor: "#CB6116" },
                }}
              >
                <Tab value="ar" label="العربية" />
                <Tab value="en" label="English" />
              </Tabs>
              <Grid container spacing={2.5}>
                {editorLang === "ar" ? (
                  <>
                    <Grid size={{ xs: 12 }}>
                      <TextField
                        fullWidth
                        label="عنوان النشرة"
                        placeholder="مثال: افتتاح علامات جديدة في فاشن غيت مول"
                        dir="rtl"
                        sx={rtlFieldSx}
                        inputProps={{ dir: "rtl" }}
                        value={form.titleAr}
                        onChange={(event) => updateField("titleAr", event.target.value)}
                      />
                    </Grid>
                    <Grid size={{ xs: 12 }}>
                      <TextField
                        fullWidth
                        label="موضوع البريد الإلكتروني"
                        placeholder="مثال: دعوة خاصة لاكتشاف أحدث الإطلاقات"
                        dir="rtl"
                        sx={rtlFieldSx}
                        inputProps={{ dir: "rtl" }}
                        value={form.subjectAr}
                        onChange={(event) => updateField("subjectAr", event.target.value)}
                      />
                    </Grid>
                    <Grid size={{ xs: 12 }}>
                      <TextField
                        fullWidth
                        label="نص المعاينة"
                        placeholder="نص قصير يظهر بجانب عنوان البريد في صندوق الوارد"
                        dir="rtl"
                        sx={rtlFieldSx}
                        value={form.previewTextAr}
                        onChange={(event) => updateField("previewTextAr", event.target.value)}
                        inputProps={{ maxLength: 180, dir: "rtl" }}
                      />
                    </Grid>
                  </>
                ) : (
                  <>
                    <Grid size={{ xs: 12 }}>
                      <TextField
                        fullWidth
                        label="Newsletter Title"
                        placeholder="Example: New brands have arrived at Fashion Gate Mall"
                        value={form.titleEn}
                        onChange={(event) => updateField("titleEn", event.target.value)}
                      />
                    </Grid>
                    <Grid size={{ xs: 12 }}>
                      <TextField
                        fullWidth
                        label="Email Subject"
                        placeholder="Example: A private invitation to explore our latest launches"
                        value={form.subjectEn}
                        onChange={(event) => updateField("subjectEn", event.target.value)}
                      />
                    </Grid>
                    <Grid size={{ xs: 12 }}>
                      <TextField
                        fullWidth
                        label="Preview Text"
                        placeholder="A short line shown beside the subject in the inbox"
                        value={form.previewTextEn}
                        onChange={(event) => updateField("previewTextEn", event.target.value)}
                        inputProps={{ maxLength: 180 }}
                      />
                    </Grid>
                  </>
                )}
                <Grid size={{ xs: 12 }}>
                  <Stack spacing={1.5}>
                    <TextField
                      fullWidth
                      label={editorLang === "ar" ? "رابط صورة الغلاف المشتركة" : "Shared Hero Image URL"}
                      placeholder={editorLang === "ar" ? "صورة واحدة تظهر في النسخة العربية والإنجليزية" : "One image used for both Arabic and English"}
                      value={form.heroImageUrl}
                      onChange={(event) => updateField("heroImageUrl", event.target.value)}
                      helperText={editorLang === "ar" ? "هذه الصورة مشتركة للحملة كاملة. ارفع صورة أو استخدم رابطاً عاماً." : "This image is shared across the whole campaign. Upload an image or paste a public URL."}
                      dir={editorLang === "ar" ? "rtl" : "ltr"}
                      sx={editorLang === "ar" ? rtlFieldSx : undefined}
                      inputProps={{ dir: "ltr" }}
                    />
                    <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5} alignItems={{ xs: "stretch", sm: "center" }}>
                      <Button
                        component="label"
                        disabled={disabled}
                        startIcon={<UploadFileOutlinedIcon />}
                        variant="outlined"
                        sx={{ borderRadius: 0, alignSelf: { xs: "stretch", sm: "flex-start" } }}
                      >
                        {loadingAction === "upload" ? (editorLang === "ar" ? "جاري الرفع..." : "Uploading...") : editorLang === "ar" ? "رفع صورة" : "Upload Image"}
                        <input
                          hidden
                          type="file"
                          accept="image/jpeg,image/png,image/webp,image/gif"
                          onChange={(event) => {
                            void uploadImage(event.target.files?.[0]);
                            event.target.value = "";
                          }}
                        />
                      </Button>
                      {form.heroImageUrl ? (
                        <Box
                          component="img"
                          src={form.heroImageUrl}
                          alt=""
                          sx={{
                            width: { xs: "100%", sm: 180 },
                            aspectRatio: "16 / 9",
                            objectFit: "cover",
                            border: "1px solid #e3d9cf",
                            bgcolor: "#ffffff",
                          }}
                        />
                      ) : null}
                    </Stack>
                  </Stack>
                </Grid>
                {editorLang === "ar" ? (
                  <>
                    <Grid size={{ xs: 12 }}>
                      <TextField
                        fullWidth
                        multiline
                        minRows={9}
                        label="محتوى النشرة"
                        placeholder="اكتب محتوى البريد باللغة العربية. اترك سطراً فارغاً بين الفقرات."
                        dir="rtl"
                        sx={rtlFieldSx}
                        inputProps={{ dir: "rtl" }}
                        value={form.bodyAr}
                        onChange={(event) => updateField("bodyAr", event.target.value)}
                        helperText="استخدم سطراً فارغاً للفصل بين الفقرات."
                      />
                    </Grid>
                    <Grid size={{ xs: 12 }}>
                      <TextField
                        fullWidth
                        label="نص زر الدعوة"
                        placeholder="مثال: اكتشف المزيد"
                        dir="rtl"
                        sx={rtlFieldSx}
                        inputProps={{ dir: "rtl" }}
                        value={form.ctaLabelAr}
                        onChange={(event) => updateField("ctaLabelAr", event.target.value)}
                      />
                    </Grid>
                  </>
                ) : (
                  <>
                    <Grid size={{ xs: 12 }}>
                      <TextField
                        fullWidth
                        multiline
                        minRows={9}
                        label="Newsletter Body"
                        placeholder="Write the English email content. Leave a blank line between paragraphs."
                        value={form.bodyEn}
                        onChange={(event) => updateField("bodyEn", event.target.value)}
                        helperText="Use blank lines to separate paragraphs."
                      />
                    </Grid>
                    <Grid size={{ xs: 12 }}>
                      <TextField
                        fullWidth
                        label="CTA Label"
                        placeholder="Example: Explore More"
                        value={form.ctaLabelEn}
                        onChange={(event) => updateField("ctaLabelEn", event.target.value)}
                      />
                    </Grid>
                  </>
                )}
                <Grid size={{ xs: 12 }}>
                  <TextField
                    fullWidth
                    label={editorLang === "ar" ? "رابط زر الدعوة" : "CTA URL"}
                    placeholder={editorLang === "ar" ? "مثال: https://fashiongatemall.com/ar" : "Example: https://fashiongatemall.com/en"}
                    value={form.ctaUrl}
                    onChange={(event) => updateField("ctaUrl", event.target.value)}
                    dir="ltr"
                  />
                </Grid>
              </Grid>

              <Divider />

              <Grid container spacing={2} alignItems="center">
                <Grid size={{ xs: 12, md: 5 }}>
                  <TextField fullWidth label={text.testEmail} type="email" value={form.testEmail} onChange={(event) => updateField("testEmail", event.target.value)} sx={uiLang === "ar" ? rtlFieldSx : undefined} />
                </Grid>
                <Grid size={{ xs: 12, md: 7 }}>
                  <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5}>
                    <Button disabled={disabled} startIcon={<SaveOutlinedIcon />} variant="outlined" onClick={() => runAction("save")} sx={{ borderRadius: 0 }}>
                      {text.saveDraft}
                    </Button>
                    <Button disabled={disabled} startIcon={<MarkEmailReadOutlinedIcon />} variant="outlined" onClick={() => runAction("test")} sx={{ borderRadius: 0 }}>
                      {text.sendTest}
                    </Button>
                    <Button disabled={sendDisabled} startIcon={<SendOutlinedIcon />} variant="contained" onClick={scheduleSend} sx={{ borderRadius: 0, bgcolor: "#111111", "&:hover": { bgcolor: "#CB6116" } }}>
                      {pendingSendSeconds > 0 ? `${text.sendingIn} ${pendingSendSeconds}s` : text.sendSubscribers}
                    </Button>
                    {pendingSendSeconds > 0 ? (
                      <Button
                        disabled={loadingAction !== null}
                        startIcon={<UndoOutlinedIcon />}
                        variant="contained"
                        onClick={undoSend}
                        sx={{
                          borderRadius: 0,
                          bgcolor: "#CB6116",
                          color: "#ffffff",
                          "&:hover": { bgcolor: "#9D430C" },
                        }}
                      >
                        {text.undoSend}
                      </Button>
                    ) : null}
                  </Stack>
                </Grid>
              </Grid>
            </Stack>
          </Paper>
            </Grid>
          </Grid>
            </>
          ) : (
            <Paper elevation={0} sx={{ p: { xs: 3, md: 5 }, borderRadius: 0, border: "1px solid #e3d9cf", bgcolor: "#fffdfa", textAlign: "center" }}>
              <Typography sx={{ fontSize: 11, fontWeight: 800, letterSpacing: "0.2em", color: "#8a7e73", textTransform: "uppercase" }}>
                {text.verificationRequired}
              </Typography>
              <Typography sx={{ mt: 1.5, fontFamily: "var(--font-cormorant), Georgia, serif", fontSize: { xs: 34, md: 46 }, lineHeight: 1 }}>
                {text.generateToContinue}
              </Typography>
              <Typography sx={{ mt: 2, mx: "auto", maxWidth: 520, color: "rgba(0,0,0,0.58)", lineHeight: 1.8 }}>
                {text.lockedIntro}
              </Typography>
            </Paper>
          )}
        </Stack>
      </Container>
    </Box>
  );
}
