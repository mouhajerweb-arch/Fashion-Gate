"use client";

import { usePathname } from "next/navigation";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import CookieConsent from "@/components/CookieConsent";
import { useEffect, useState, useMemo } from "react";
import { getHomepageData } from "@/lib/sanity";
import { fallbackSettings } from "@/lib/fallbackData";
import { ThemeProvider, createTheme, Box } from "@mui/material";

export default function LayoutWrapper({ children, initialSettings }: { children: React.ReactNode; initialSettings?: any }) {
  const pathname = usePathname();
  const [settings, setSettings] = useState<any>(() => {
    return initialSettings ? { ...fallbackSettings, ...initialSettings } : fallbackSettings;
  });

  useEffect(() => {
    if (!initialSettings) {
      getHomepageData().then(data => {
        if (data?.settings) {
          setSettings({ ...fallbackSettings, ...data.settings });
        }
      }).catch(err => console.error("Error loading header settings:", err));
    }
  }, [initialSettings]);

  const theme = useMemo(() => createTheme({
    palette: {
      primary: { main: settings.primaryColor || "#CB6116", dark: "#9D430C" },
      secondary: { main: settings.accentColor || "#D06010" }
    },
    typography: {
       fontFamily: `"Cairo", sans-serif`,
       button: { fontWeight: 800 }
     },
     shape: { borderRadius: 0 }
   }), [settings.accentColor, settings.primaryColor]);

  const isAuthOrStudio = pathname?.includes("/login") || pathname?.includes("/studio");
  const isVilamore = pathname?.includes("/dining/vilamore");
  const isEspressoLab = pathname?.includes("/dining/the-espresso-lab");

  if (isAuthOrStudio) {
    return <>{children}</>;
  }

  const lang = (pathname?.endsWith("/ar") || pathname?.includes("/ar/") ? "ar" : "en") as "en" | "ar";

  if (isVilamore || isEspressoLab) {
    return (
      <ThemeProvider theme={theme}>
        <div dir={lang === "ar" ? "rtl" : "ltr"} style={{ width: "100%" }}>
          <main style={{ width: "100%" }}>
            {children}
          </main>
          <SiteFooter />
          <CookieConsent lang={lang} settings={settings.cookieConsent} />
        </div>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <div dir={lang === "ar" ? "rtl" : "ltr"} style={{ width: "100%" }}>
        <SiteHeader settings={settings} />
        <Box 
          component="main" 
          sx={{ 
            width: "100%", 
            pt: { xs: "115px", md: "148px" }
          }}
        >
          {children}
        </Box>
        <SiteFooter />
        <CookieConsent lang={lang} settings={settings.cookieConsent} />
      </div>
    </ThemeProvider>
  );
}
