"use client";

import React from "react";
import { Button } from "@mui/material";
import { usePathname, useRouter } from "next/navigation";
import { useLoader } from "@/components/LoaderProvider";

const EnglandFlag = () => (
  <svg width="24" height="16" viewBox="0 0 18 13" style={{ display: "inline-block", verticalAlign: "middle" }}>
    <rect width="18" height="13" fill="#ffffff" />
    <rect x="8.2" width="1.6" height="13" fill="#cf142b" />
    <rect y="5.7" width="18" height="1.6" fill="#cf142b" />
  </svg>
);

const SyriaFlag = () => (
  <img 
    src="/assets/Syrian-flag.svg" 
    alt="Syria Flag" 
    style={{ display: "inline-block", verticalAlign: "middle", width: 26, height: 20 }}
  />
);

const UnitedKingdomFlag = () => (
  <img 
    src="/assets/United-Kingdom-flag.svg" 
    alt="United Kingdom Flag" 
    style={{ display: "inline-block", verticalAlign: "middle", width: 26, height: 20 }}
  />
);

interface LanguageSwitcherProps {
  currentLang: "en" | "ar";
  onToggleStart?: () => void;
  color?: string;
  hoverColor?: string;
}

export default function LanguageSwitcher({
  currentLang,
  onToggleStart,
  color = "#ffffff",
  hoverColor = "#CB6116",
}: LanguageSwitcherProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { setLoading } = useLoader();

  const handleLangToggle = () => {
    if (typeof window === "undefined") return;
    const nextLang = currentLang === "ar" ? "en" : "ar";
    setLoading(true, false, nextLang);
    if (onToggleStart) {
      onToggleStart();
    }
    setTimeout(() => {
      let nextPath = pathname;
      if (pathname.endsWith("/en")) {
        nextPath = pathname.substring(0, pathname.length - 3) + "/ar";
      } else if (pathname.endsWith("/ar")) {
        nextPath = pathname.substring(0, pathname.length - 3) + "/en";
      } else if (pathname === "/en" || pathname === "/ar" || pathname === "/") {
        nextPath = `/${nextLang}`;
      } else {
        nextPath = pathname.replace(/\/(ar|en)$/, `/${nextLang}`);
      }
      const searchParamsString = window.location.search || "";
      const hashString = window.location.hash || "";
      router.push(nextPath + searchParamsString + hashString);
    }, 180);
  };

  return (
    <Button 
      onClick={handleLangToggle}
      startIcon={currentLang === "ar" ? <UnitedKingdomFlag /> : <SyriaFlag />}
      sx={{ 
        color: color, 
        textTransform: "uppercase", 
        fontSize: 12, 
        fontWeight: 600, 
        letterSpacing: "0.1em",
        px: { xs: 0.6, sm: 1.5 },
        py: 0.5,
        border: "none",
        borderRadius: 0,
        fontFamily: '"Cairo", sans-serif',
        display: "inline-flex",
        alignItems: "center",
        gap: { xs: 0.4, sm: 1 },
        minWidth: 0,
        "& .MuiButton-startIcon": {
          margin: 0,
          display: "flex",
          alignItems: "center"
        },
        "&:hover": {
          color: hoverColor,
          bgcolor: "transparent"
        }
      }}
    >
      {currentLang === "ar" ? "EN" : "AR"}
    </Button>
  );
}
