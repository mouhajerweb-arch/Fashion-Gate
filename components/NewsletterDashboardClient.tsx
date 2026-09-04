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

type CampaignForm = {
  campaignId: string;
  title: string;
  subject: string;
  previewText: string;
  heroImageUrl: string;
  heroImageAssetId: string;
  body: string;
  ctaLabel: string;
  ctaUrl: string;
  testEmail: string;
};

const initialForm: CampaignForm = {
  campaignId: "",
  title: "",
  subject: "",
  previewText: "",
  heroImageUrl: "",
  heroImageAssetId: "",
  body: "",
  ctaLabel: "",
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

export default function NewsletterDashboardClient() {
  const [token, setToken] = useState("");
  const [accessToken, setAccessToken] = useState("");
  const [stats, setStats] = useState<Stats | null>(null);
  const [drafts, setDrafts] = useState<CampaignDraft[]>([]);
  const [libraryTab, setLibraryTab] = useState<"drafts" | "sent">("drafts");
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
      heroImageUrl: draft.heroImageUrl,
      heroImageAssetId: draft.heroImageAssetId,
      body: draft.body,
      ctaLabel: draft.ctaLabel,
      ctaUrl: draft.ctaUrl,
    }));
    setStatus({ type: "info", message: "Draft loaded into editor." });
  }

  function startNewDraft() {
    setForm((current) => ({ ...initialForm, testEmail: current.testEmail }));
    setStatus({ type: "info", message: "New draft started." });
  }

  function campaignPayload() {
    return {
      campaignId: form.campaignId,
      title: form.title,
      subject: form.subject,
      previewText: form.previewText,
      heroImageUrl: form.heroImageUrl,
      heroImageAssetId: form.heroImageAssetId,
      body: form.body,
      ctaLabel: form.ctaLabel,
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

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#f7f3ee", color: "#111111", py: { xs: 4, md: 7 } }}>
      <Container maxWidth="lg">
        <Stack spacing={4}>
          <Box>
            <Typography sx={{ fontSize: 12, fontWeight: 800, letterSpacing: "0.22em", color: "#CB6116", textTransform: "uppercase" }}>
              Fashion Gate Mall
            </Typography>
            <Typography sx={{ mt: 1, fontFamily: "var(--font-cormorant), Georgia, serif", fontSize: { xs: 42, md: 64 }, lineHeight: 0.95 }}>
              Newsletter Dashboard
            </Typography>
            <Typography sx={{ mt: 2, maxWidth: 680, color: "rgba(0,0,0,0.58)", lineHeight: 1.8 }}>
              Create polished updates, send a test email for approval, then send the campaign to subscribed users only.
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
                  {loadingAction === "otp" ? "Generating Token..." : "Generate Token to Support Email"}
                </Button>
              </Grid>
              <Grid size={{ xs: 12, md: 4 }}>
                <TextField
                  fullWidth
                  label="Access Token"
                  value={accessToken}
                  onChange={(event) => setAccessToken(event.target.value.toUpperCase().slice(0, 16))}
                  helperText={token ? "Verified in this browser." : "Paste the token from support inbox."}
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
                  {loadingAction === "verify" ? "Verifying..." : "Verify"}
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
              ["Subscribed", stats?.subscribed ?? "-"],
              ["Unsubscribed", stats?.unsubscribed ?? "-"],
              ["Sent Campaigns", stats?.sentCampaigns ?? "-"],
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
                      Campaign Library
                    </Typography>
                    <Typography sx={{ mt: 0.5, fontSize: 13, color: "rgba(0,0,0,0.55)" }}>
                      Select a saved draft or sent campaign.
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
                  <Tab value="drafts" label={`Drafts (${drafts.filter((draft) => draft.status !== "sent").length})`} />
                  <Tab value="sent" label={`Sent (${drafts.filter((draft) => draft.status === "sent").length})`} />
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
                      {libraryTab === "sent" ? "No sent campaigns yet." : "No drafts yet."}
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
                    Campaign Editor
                  </Typography>
                  <Typography sx={{ mt: 0.5, fontSize: 13, color: "rgba(0,0,0,0.55)" }}>
                    {form.campaignId ? "Editing saved draft" : "Creating new draft"}
                  </Typography>
                </Box>
                <Button disabled={disabled} startIcon={<AddOutlinedIcon />} variant="outlined" onClick={startNewDraft} sx={{ borderRadius: 0 }}>
                  New Draft
                </Button>
              </Stack>
              <Grid container spacing={2.5}>
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField fullWidth label="Newsletter Title" value={form.title} onChange={(event) => updateField("title", event.target.value)} />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField fullWidth label="Email Subject" value={form.subject} onChange={(event) => updateField("subject", event.target.value)} />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <TextField fullWidth label="Preview Text" value={form.previewText} onChange={(event) => updateField("previewText", event.target.value)} inputProps={{ maxLength: 180 }} />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <Stack spacing={1.5}>
                    <TextField
                      fullWidth
                      label="Hero Image URL"
                      value={form.heroImageUrl}
                      onChange={(event) => updateField("heroImageUrl", event.target.value)}
                      helperText="Upload an image or paste a public URL. Email inboxes cannot render local computer paths."
                    />
                    <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5} alignItems={{ xs: "stretch", sm: "center" }}>
                      <Button
                        component="label"
                        disabled={disabled}
                        startIcon={<UploadFileOutlinedIcon />}
                        variant="outlined"
                        sx={{ borderRadius: 0, alignSelf: { xs: "stretch", sm: "flex-start" } }}
                      >
                        {loadingAction === "upload" ? "Uploading..." : "Upload Image"}
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
                <Grid size={{ xs: 12 }}>
                  <TextField
                    fullWidth
                    multiline
                    minRows={9}
                    label="Newsletter Body"
                    value={form.body}
                    onChange={(event) => updateField("body", event.target.value)}
                    helperText="Use blank lines to separate paragraphs."
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField fullWidth label="CTA Label" value={form.ctaLabel} onChange={(event) => updateField("ctaLabel", event.target.value)} />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField fullWidth label="CTA URL" value={form.ctaUrl} onChange={(event) => updateField("ctaUrl", event.target.value)} />
                </Grid>
              </Grid>

              <Divider />

              <Grid container spacing={2} alignItems="center">
                <Grid size={{ xs: 12, md: 5 }}>
                  <TextField fullWidth label="Test Email" type="email" value={form.testEmail} onChange={(event) => updateField("testEmail", event.target.value)} />
                </Grid>
                <Grid size={{ xs: 12, md: 7 }}>
                  <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5}>
                    <Button disabled={disabled} startIcon={<SaveOutlinedIcon />} variant="outlined" onClick={() => runAction("save")} sx={{ borderRadius: 0 }}>
                      Save Draft
                    </Button>
                    <Button disabled={disabled} startIcon={<MarkEmailReadOutlinedIcon />} variant="outlined" onClick={() => runAction("test")} sx={{ borderRadius: 0 }}>
                      Send Test
                    </Button>
                    <Button disabled={sendDisabled} startIcon={<SendOutlinedIcon />} variant="contained" onClick={scheduleSend} sx={{ borderRadius: 0, bgcolor: "#111111", "&:hover": { bgcolor: "#CB6116" } }}>
                      {pendingSendSeconds > 0 ? `Sending in ${pendingSendSeconds}s` : "Send to Subscribers"}
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
                        Undo Send
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
                Verification Required
              </Typography>
              <Typography sx={{ mt: 1.5, fontFamily: "var(--font-cormorant), Georgia, serif", fontSize: { xs: 34, md: 46 }, lineHeight: 1 }}>
                Generate token to continue
              </Typography>
              <Typography sx={{ mt: 2, mx: "auto", maxWidth: 520, color: "rgba(0,0,0,0.58)", lineHeight: 1.8 }}>
                The newsletter editor, drafts, image upload, and send options will appear after support email token verification.
              </Typography>
            </Paper>
          )}
        </Stack>
      </Container>
    </Box>
  );
}
