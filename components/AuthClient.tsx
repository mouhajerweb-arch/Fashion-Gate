"use client";

import React, { useState, useMemo, useEffect } from "react";
import { 
  Box, 
  Container, 
  Typography, 
  TextField, 
  Button, 
  Stack, 
  IconButton,
  createTheme,
  ThemeProvider,
  InputAdornment
} from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

import { useLoader } from "@/components/LoaderProvider";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { loginUser } from "@/app/actions/auth";

const MotionBox = motion.create(Box);



interface AuthClientProps {
  initialLang: "ar" | "en";
  sanityData?: any;
}

export default function AuthClient({ initialLang, sanityData }: AuthClientProps) {
  const router = useRouter();
  const { setLoading } = useLoader();
  
  const [lang, setLang] = useState<"en" | "ar">(initialLang);
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [showPassword, setShowPassword] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  
  // Form states
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    setLang(initialLang);
    setIsTransitioning(false);
  }, [initialLang]);

  const theme = useMemo(() => createTheme({
    palette: {
      mode: "dark",
      primary: { main: "#CB6116" },
      background: { default: "#050505", paper: "rgba(10, 10, 10, 0.72)" }
    },
    typography: {
      fontFamily: `"Cairo", sans-serif`,
      button: { fontWeight: 700, letterSpacing: lang === "ar" ? 0 : "0.15em" }
    },
    shape: { borderRadius: 0 }
  }), []);

  // Helper to resolve localized string from Sanity, or fallback to defaults
  const getLabel = (field: string, fallbackEn: string, fallbackAr: string) => {
    if (sanityData && sanityData[field]) {
      const val = sanityData[field][lang] || sanityData[field]["en"];
      if (val) return val;
    }
    return lang === "en" ? fallbackEn : fallbackAr;
  };

  const t = {
    loginTitle: getLabel("loginTitle", "Sign In", "تسجيل الدخول"),
    signupTitle: getLabel("signupTitle", "Create Account", "إنشاء حساب"),
    welcomeBack: getLabel("welcomeBack", "Welcome back to the Boulevard", "مرحباً بك مجدداً في البوليفارد"),
    welcomeNew: getLabel("welcomeNew", "Join Syria's first luxury department store", "انضم لأول متجر أزياء فاخر في سوريا"),
    email: getLabel("emailLabel", "Email Address", "البريد الإلكتروني"),
    password: getLabel("passwordLabel", "Password", "كلمة المرور"),
    confirmPassword: getLabel("confirmPasswordLabel", "Confirm Password", "تأكيد كلمة المرور"),
    name: getLabel("nameLabel", "Full Name", "الاسم الكامل"),
    loginBtn: getLabel("loginBtn", "Sign In", "دخول"),
    signupBtn: getLabel("signupBtn", "Create Account", "إنشاء الحساب"),
    haveAccount: getLabel("haveAccount", "Already have an account? Sign In", "لديك حساب بالفعل؟ سجل دخولك"),
    noAccount: getLabel("noAccount", "New to Fashion Gate? Create Account", "جديد في بوابة الأزياء؟ أنشئ حساباً"),
    backHome: getLabel("backHome", "Back to Boulevard", "العودة إلى البوليفارد"),
    successMsg: getLabel("successMsg", "Authenticating...", "جاري التحقق...")
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === "signup" && password !== confirmPassword) {
      alert(lang === "ar" ? "كلمتا المرور غير متطابقتين" : "Passwords do not match");
      return;
    }
    
    setLoading(true);
    try {
      await loginUser(mode === "signup" ? name : "", email);
      router.push(`/${lang}`);
    } catch (err) {
      console.error("Auth error", err);
      alert(lang === "ar" ? "فشل التحقق، يرجى المحاولة مرة أخرى" : "Authentication failed, please try again");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Box 
        dir={lang === "ar" ? "rtl" : "ltr"}
        sx={{ 
          bgcolor: "#050505", 
          color: "#ffffff", 
          minHeight: "100vh", 
          display: "flex", 
          flexDirection: "column",
          position: "relative"
        }}
      >
        {/* Floating Language Switcher Container (Top Corner) */}
        <Box 
          sx={{ 
            position: "absolute", 
            top: 24, 
            [lang === "ar" ? "left" : "right"]: 24, 
            zIndex: 10,
            opacity: isTransitioning ? 0 : 1,
            transition: "opacity 0.2s ease-in-out"
          }}
        >
          <LanguageSwitcher 
            currentLang={lang} 
            onToggleStart={() => setIsTransitioning(true)} 
          />
        </Box>
        
        {/* Centered Login / Sign Up Form Card */}
        <Box 
          sx={{ 
            flexGrow: 1, 
            display: "flex", 
            alignItems: "center", 
            justifyContent: "center", 
            py: { xs: 8, md: 12 },
            px: 3,
            position: "relative",
            overflow: "hidden",
            backgroundImage: `url('${sanityData?.bgImage?.asset?.url || "/assets/headerbg.png"}')`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            opacity: isTransitioning ? 0 : 1,
            transition: "opacity 0.25s ease-in-out"
          }}
        >
          {/* Radial dark background wash */}
          <Box 
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: "radial-gradient(circle at center, rgba(203, 97, 22, 0.08) 0%, rgba(5,5,5,0.92) 80%)",
              zIndex: 1
            }}
          />

          <MotionBox
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            sx={{
              position: "relative",
              zIndex: 2,
              width: "100%",
              maxWidth: 440,
              bgcolor: "rgba(10, 10, 10, 0.72)",
              backdropFilter: "blur(12px)",
              border: "1px solid rgba(255,255,255,0.06)",
              p: { xs: 4, md: 5.5 },
              textAlign: lang === "ar" ? "right" : "left"
            }}
          >
            <Stack spacing={1.5} sx={{ mb: 4, textAlign: "center" }}>
              <Typography sx={{ fontFamily: "var(--heading-font)", fontSize: { xs: 26, md: 32 }, fontWeight: 500, letterSpacing: lang === "ar" ? 0 : "0.05em" }}>
                {mode === "login" ? t.loginTitle : t.signupTitle}
              </Typography>
              <Typography sx={{ color: "rgba(255,255,255,0.48)", fontSize: 13, fontFamily: '"Cairo", sans-serif' }}>
                {mode === "login" ? t.welcomeBack : t.welcomeNew}
              </Typography>
            </Stack>

            <Box component="form" onSubmit={handleSubmit} dir={lang === "ar" ? "rtl" : "ltr"}>
              <Stack spacing={3}>
                {mode === "signup" && (
                  <TextField
                    fullWidth
                    label={t.name}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    variant="outlined"
                    required
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 0,
                        bgcolor: "rgba(255,255,255,0.03)"
                      }
                    }}
                  />
                )}

                <TextField
                  fullWidth
                  label={t.email}
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  variant="outlined"
                  required
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 0,
                      bgcolor: "rgba(255,255,255,0.03)"
                    }
                  }}
                />

                <TextField
                  fullWidth
                  label={t.password}
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  variant="outlined"
                  required
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                          sx={{ color: "rgba(255,255,255,0.4)" }}
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    )
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 0,
                      bgcolor: "rgba(255,255,255,0.03)"
                    }
                  }}
                />

                {mode === "signup" && (
                  <TextField
                    fullWidth
                    label={t.confirmPassword}
                    type={showPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    variant="outlined"
                    required
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 0,
                        bgcolor: "rgba(255,255,255,0.03)"
                      }
                    }}
                  />
                )}

                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{
                    bgcolor: "#CB6116",
                    color: "#ffffff",
                    py: 1.6,
                    borderRadius: 0,
                    fontSize: 12,
                    mt: 2,
                    "&:hover": { bgcolor: "#9D430C" }
                  }}
                >
                  {mode === "login" ? t.loginBtn : t.signupBtn}
                </Button>
              </Stack>
            </Box>

            {/* Form Switch Link */}
            <Box sx={{ mt: 4, textAlign: "center" }}>
              <Button
                onClick={() => {
                  setMode(mode === "login" ? "signup" : "login");
                  setName("");
                  setEmail("");
                  setPassword("");
                  setConfirmPassword("");
                }}
                sx={{ 
                  color: "rgba(255,255,255,0.54)", 
                  textTransform: "none", 
                  fontSize: 12,
                  "&:hover": { color: "#CB6116", bgcolor: "transparent" }
                }}
              >
                {mode === "login" ? t.noAccount : t.haveAccount}
              </Button>
            </Box>

            {/* Back Home Link */}
            <Stack direction="row" justifyContent="center" sx={{ mt: 3 }}>
              <Button
                component={Link}
                href={`/${lang}`}
                startIcon={lang === "en" ? <ArrowBackIcon sx={{ fontSize: 14 }} /> : undefined}
                endIcon={lang === "ar" ? <ArrowForwardIcon sx={{ fontSize: 14 }} /> : undefined}
                sx={{
                  color: "rgba(255,255,255,0.4)",
                  fontSize: 11,
                  letterSpacing: lang === "ar" ? 0 : "0.1em",
                  textTransform: "uppercase",
                  "&:hover": { color: "#CB6116", bgcolor: "transparent" }
                }}
              >
                {t.backHome}
              </Button>
            </Stack>
          </MotionBox>
        </Box>
      </Box>
    </ThemeProvider>
  );
}
