"use client";

import React, { useState, useRef, useEffect, useMemo } from "react";
import { imageUrl } from "@/lib/sanity";
import {
  Box,
  Container,
  Grid,
  Typography,
  Button,
  Stack,
  Divider,
  ThemeProvider,
  createTheme,
  Tabs,
  Tab,
  Card,
  CardMedia,
  CardContent,
  Drawer,
  IconButton
} from "@mui/material";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import Link from "next/link";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PhoneIcon from "@mui/icons-material/Phone";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import FormatQuoteIcon from "@mui/icons-material/FormatQuote";
import LanguageIcon from "@mui/icons-material/Language";

interface RestaurantDetailClientProps {
  restaurantId: string;
  lang: "en" | "ar";
  initialSanityData?: any;
}

// Fade-in-up variants for scroll animations
const fadeInUp = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.9, ease: [0.25, 1, 0.5, 1] as const } }
};

export default function RestaurantDetailClient({ restaurantId, lang, initialSanityData }: RestaurantDetailClientProps) {
  const isVilamore = restaurantId === "vilamore";
  const isAr = lang === "ar";
  const resolvedLogoUrl = initialSanityData?.headerLogo
    ? (typeof initialSanityData.headerLogo === 'string' ? initialSanityData.headerLogo : (initialSanityData.headerLogo.asset?.url || imageUrl(initialSanityData.headerLogo).url()))
    : (isVilamore ? "/brand/vilamore-logo.png" : "/brand/the-espresso-lab-logo.png");
  const accentColor = "#CB6116"; // Theme Orange
  const beigeBg = "#ECE4DE"; // Askim Warm Cream Beige
  const cardBg = "#FDFBF8"; // Soft cream paper card
  const charcoalText = "#2C2522"; // Warm charcoal instead of black

  // Tabs states
  const [vilamoreActiveTab, setVilamoreActiveTab] = useState(0);
  const [espressoActiveTab, setEspressoActiveTab] = useState(0);

  // Bespoke header states
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [headerScrolled, setHeaderScrolled] = useState(false);
  const [headerVisible, setHeaderVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  
  // Interactive tasting menu selection state
  const [activeMenuIndex, setActiveMenuIndex] = useState(0);

  // Section references for smooth scrolling (Askim navigation)
  const heroSectionRef = useRef<HTMLDivElement>(null);
  const menuSectionRef = useRef<HTMLDivElement>(null);
  const terraceSectionRef = useRef<HTMLDivElement>(null);
  const philosophySectionRef = useRef<HTMLDivElement>(null);
  const locationSectionRef = useRef<HTMLDivElement>(null);

  // Scroll references for horizontal scrollbars
  const vilamoreScrollRef = useRef<HTMLDivElement>(null);
  const espressoScrollRef = useRef<HTMLDivElement>(null);

  // Parallax Scroll Hooks
  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 800], [0, 250]);
  const heroOpacity = useTransform(scrollY, [0, 500], [1, 0]);

  // Scroll listener for sticky and collapsible header styling (Headroom Pattern)
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      if (currentScrollY > 80) {
        setHeaderScrolled(true);
        if (currentScrollY > lastScrollY) {
          setHeaderVisible(false);
        } else {
          setHeaderVisible(true);
        }
      } else {
        setHeaderScrolled(false);
        setHeaderVisible(true);
      }
      setLastScrollY(currentScrollY);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  const content = {
    en: {
      vilamoreTitle: "Vilamore Restaurant & Café",
      espressoTitle: "The Espresso Lab",
      espressoHeroTitle: "THE ART OF BREWING",
      espressoHeroSub: "Dubai-sourced single origin roasts, extracted to perfection in Damascus.",
      espressoStory: "Sourced directly from Dubai roasters, The Espresso Lab represents the absolute pinnacle of premium coffee culture in Syria. Our beans are selected from micro-lots in Brazil, Ethiopia, and Colombia, roasted to highlight rich cocoa and floral notes, and brewed with state-of-the-art temperature controls.",
      vilamoreHeroTitle: "WELCOME TO VILAMORE",
      vilamoreHeroSub: "Your Premier Dining Destination in the Boulevard, Damascus",
      discoverTitle: "Discover Vilamore",
      discoverDesc: "Under the golden vaults of Fashion Gate Syria, Vilamore welcomes you to a refined journey of flavors. We marry traditional Levantine ingredients with ancestral clay-oven baking and slow-roasted Turkish grills to curate a dining story meant to be shared.",
      exploreSpace: "Explore Courtyard",
      viewMenu: "View Menu",
      location: "Location & Hours",
      hours: "Operating Hours",
      contact: "Direct Line",
      vilamoreLocVal: "Ground Floor, Grand Promenade, Fashion Gate Syria",
      espressoLocVal: "First Floor, Luxury Terrace, Fashion Gate Syria",
      hoursVal: "Daily 8:00 AM - 12:00 AM",
      contactVal: "+963 11 9988 (Ext. Vilamore)",
      espressoContactVal: "+963 11 9988 (Ext. Espresso Lab)",
      dubaiRef: "Dubai Management: Inspired by Askim, Boulevard Heights, Downtown Dubai.",
      menuHeader: "Our Culinary Menu",
      ambianceHeader: "Terrace & Courtyard Ambiance",
      processHeader: "The Brew Process",
      menuTabs: ["Breakfast & Bakery", "Cold Mezza", "Hot Mezza & Pastries", "Charcoal Grills & Mains", "Levantine Desserts"],
      espressoMenuTabs: ["Specialty Coffee", "Specialty Beverages", "Decadent Desserts"],
      
      // Why Choose Vilamore panels
      panel1Title: "A Tantalizing Mix of Levantine Grills",
      panel1Desc: "Enjoy our signature spiced kebabs, seasoned with authentic Levantine spices and grilled over cherry-wood charcoal embers, served with hot clay-oven flatbread.",
      panel1Label: "Our Food",
      panel1Btn: "Explore Menu",
      
      panel2Title: "Stunning Arches, Captivating Courtyard Ambiance",
      panel2Desc: "Located on the Grand Promenade, our open-air courtyard offers a truly spectacular experience with aromatic jasmine arches, sound of water, and an atmosphere that perfectly matches your gathering.",
      panel2Label: "Our Courtyard",
      panel2Btn: "Explore Courtyard",
      
      panel3Title: "Preferred by Celebrities and the Elite",
      panel3Desc: "Renowned for its exceptional dining atmosphere and traditional luxury, Vilamore attracts distinguished guests, offering a perfect blend of exquisite Levant hospitality, heritage, and sophistication.",
      panel3Label: "Elite & Prestige",
      panel3Btn: "Learn More",
      
      panel4Title: "Experience the Elegance of Vilamore's Warm and Luxurious Interior",
      panel4Desc: "Step into Vilamore and immerse yourself in a space designed for comfort and heritage. With spacious archways, warm low lighting, stone alcoves, and a luxurious yet family-friendly atmosphere.",
      panel4Label: "Family Luxury",
      panel4Btn: "Discover More",

      // Quotes
      quoteNarrative: "Food is the ultimate gathering language of the Levant, bringing hearts together under the Damascus sky.",
      quoteMedallion: "A culinary haven in Damascus where heritage meets innovation.",
      quoteAesthetic: "Savor the scent of Damascus Jasmine and the crackle of natural embers.",
      
      // UI terms
      menuText: "MENU",
      closeText: "CLOSE",
      langToggleText: "العربية",
      storyHeading: "A Story of Jasmine & Embers",
      heritageTitle: "{t.heritageTitle}",
      experienceTitle: "{t.experienceTitle}",
      footerAddress: "Fashion Gate, Damascus, Syria",
      narrativeSubtitle: "THE TRADITION OF TASTE",

      menus: {
        breakfast: [],
        coldMezza: [],
        hotMezza: [],
        grills: [],
        desserts: []
      },
      espressoMenus: {
        coffee: [],
        beverages: [],
        espressoDesserts: []
      }
    },
    ar: {
      vilamoreTitle: "مطعم ومقهى فيلامور",
      espressoTitle: "ذا اسبريسو لاب",
      espressoHeroTitle: "فن تحضير القهوة المختصة",
      espressoHeroSub: "حبوب بن برازيلية مستوردة من دبي ومحضرة يدوياً بدقة عالية في دمشق.",
      espressoStory: "يستورد ذا اسبريسو لاب حبوب البن الفاخرة مباشرة من محامص دبي، ليمثل قمة ثقافة القهوة في سوريا. نختار حبوبنا من مزارع البرازيل وإثيوبيا وكولومبيا لتقديم فنجان غني بالنكهات والروائح العطرة.",
      vilamoreHeroTitle: "مرحباً بكم في فيلامور",
      vilamoreHeroSub: "وجهتكم الفاخرة لتناول الطعام في البوليفارد، دمشق",
      discoverTitle: "اكتشف فيلامور",
      discoverDesc: "تحت قباب فاشن غيت سوريا الذهبية، يرحب بكم فيلامور في رحلة نكهات استثنائية. نجمع بين المكونات الشامية التقليدية ومخبوزات الأفران الطينية والمشويات التركية المحضرة على الفحم لنروي قصة كرم ضيافة فريدة.",
      exploreSpace: "اكتشف الجلسات",
      viewMenu: "قائمة المأكولات",
      location: "الموقع وأوقات العمل",
      hours: "أوقات العمل",
      contact: "خط الاتصال المباشر",
      vilamoreLocVal: "الطابق الأرضي، الممشى الرئيسي، فاشن غيت مول سوريا",
      espressoLocVal: "الطابق الأول، التراس الفاخر، فاشن غيت مول سوريا",
      hoursVal: "يومياً من 8:00 صباحاً حتى 12:00 منتصف الليل",
      contactVal: "+963 11 9988 (تحويلة فيلامور)",
      espressoContactVal: "+963 11 9988 (تحويلة ذا اسبريسو لاب)",
      dubaiRef: "إدارة دبي: مستوحى من مطعم عاصكم، بوليفارد هايتس، وسط مدينة دبي.",
      menuHeader: "قائمتنا الشامية العريقة",
      ambianceHeader: "أجواء التراس والجلسات الخارجية",
      processHeader: "خطوات التحضير الفني للقهوة",
      menuTabs: ["الفطور والمخبوزات", "المزة والمقبلات الباردة", "المزة الساخنة والمعجنات", "المشويات الشامية والأطباق الرئيسية", "الحلويات الشرقية"],
      espressoMenuTabs: ["القهوة المختصة", "المشروبات الخاصة", "الحلويات الفاخرة"],
      
      // Why Choose Vilamore panels
      panel1Title: "مزيج يداعب الحواس من المشاوي الشامية",
      panel1Desc: "استمتع بأسياخ الكباب المتبلة ببهارات الشام العريقة، والمشوية على جمر خشب الكرز، تقدم مع خبز التنور الساخن مباشرة من فرن الطين.",
      panel1Label: "مأكولاتنا",
      panel1Btn: "استكشف القائمة",
      
      panel2Title: "عراقة العقود وأجواء التراس الساحرة",
      panel2Desc: "يقع تراسنا الخارجي في الممشى الرئيسي ليقدم تجربة استثنائية مع أقراص الياسمين الدمشقي الفواح، خرير المياه العذب، وأجواء عائلية راقية تلائم جميع مناسباتكم.",
      panel2Label: "تراس فيلامور",
      panel2Btn: "اكتشف الجلسات",
      
      panel3Title: "ملتقى النخبة والمشاهير في قلب دمشق",
      panel3Desc: "يشتهر فيلامور بضيافته الرفيعة وفخامته الأصيلة، حيث يستقطب كبار الزوار والشخصيات المرموقة، ليقدم لهم مزيجاً ساحراً من حسن الاستقبال السوري العريق والرقي المعاصر.",
      panel3Label: "النخبة والتميز",
      panel3Btn: "اقرأ المزيد",
      
      panel4Title: "فخامة التصميم الداخلي ودفء اللقاءات العائلية",
      panel4Desc: "ادخل إلى عالم فيلامور الواسع المصمم ليوفر الراحة والخصوصية؛ عقود حجرية دمشقية، إضاءة دافئة خافتة، وجلسات عائلية مريحة تحيي عبق التراث السوري العريق.",
      panel4Label: "الفخامة العائلية",
      panel4Btn: "اكتشف المزيد",

      // Quotes
      quoteNarrative: "الطعام هو اللغة المطلقة للشام، يجمع القلوب تحت ياسمين دمشق وفي دفء لياليها البديعة.",
      quoteMedallion: "واحة للطهي الراقي في دمشق تجمع بين عراقة الماضي وابتكار الحاضر.",
      quoteAesthetic: "استمتع بعبير الياسمين الدمشقي ودفء المشاوي الأصيلة على الجمر.",
      
      // UI terms
      menuText: "القائمة",
      closeText: "إغلاق",
      langToggleText: "English",
      storyHeading: "قصة الياسمين والجمر",
      heritageTitle: "عراقة النكهة الأصيلة",
      experienceTitle: "تجربة فيلامور الاستثنائية",
      footerAddress: "فاشن غيت، دمشق، سوريا",
      narrativeSubtitle: "أصالة المذاق الشامي",

      menus: {
        breakfast: [],
        coldMezza: [],
        hotMezza: [],
        grills: [],
        desserts: []
      },
      espressoMenus: {
        coffee: [],
        beverages: [],
        espressoDesserts: []
      }
    }
  };

  const baseT = content[lang] || content["en"];
  
  const getVal = (field: any, fallback: string) => {
    if (!field) return fallback;
    return typeof field === "object" ? (field[lang] || fallback) : field;
  };

  const t = {
    ...baseT,
    // Hero Section
    narrativeSubtitle: initialSanityData?.heroSub ? getVal(initialSanityData.heroSub, baseT.narrativeSubtitle) : baseT.narrativeSubtitle,
    heroTitle: initialSanityData?.heroTitle ? getVal(initialSanityData.heroTitle, isAr ? "فيلامور" : "VILAMORE") : (isAr ? "فيلامور" : "VILAMORE"),
    vilamoreHeroSub: initialSanityData?.heroSub ? getVal(initialSanityData.heroSub, baseT.vilamoreHeroSub) : baseT.vilamoreHeroSub,
    quoteAesthetic: initialSanityData?.heroQuote ? getVal(initialSanityData.heroQuote, baseT.quoteAesthetic) : baseT.quoteAesthetic,
    
    // About Section
    discoverTitle: initialSanityData?.aboutTitle ? getVal(initialSanityData.aboutTitle, baseT.discoverTitle) : baseT.discoverTitle,
    storyHeading: initialSanityData?.aboutSubtitle ? getVal(initialSanityData.aboutSubtitle, baseT.storyHeading) : baseT.storyHeading,
    quoteNarrative: initialSanityData?.aboutQuote ? getVal(initialSanityData.aboutQuote, baseT.quoteNarrative) : baseT.quoteNarrative,
    discoverDesc: initialSanityData?.aboutDesc ? getVal(initialSanityData.aboutDesc, baseT.discoverDesc) : baseT.discoverDesc,
    
    // Panels
    panel1Label: initialSanityData?.panels?.[0]?.label ? getVal(initialSanityData.panels[0].label, baseT.panel1Label) : baseT.panel1Label,
    panel1Title: initialSanityData?.panels?.[0]?.title ? getVal(initialSanityData.panels[0].title, baseT.panel1Title) : baseT.panel1Title,
    panel1Desc: initialSanityData?.panels?.[0]?.desc ? getVal(initialSanityData.panels[0].desc, baseT.panel1Desc) : baseT.panel1Desc,
    panel1Btn: initialSanityData?.panels?.[0]?.btnText ? getVal(initialSanityData.panels[0].btnText, baseT.panel1Btn) : baseT.panel1Btn,

    panel2Label: initialSanityData?.panels?.[1]?.label ? getVal(initialSanityData.panels[1].label, baseT.panel2Label) : baseT.panel2Label,
    panel2Title: initialSanityData?.panels?.[1]?.title ? getVal(initialSanityData.panels[1].title, baseT.panel2Title) : baseT.panel2Title,
    panel2Desc: initialSanityData?.panels?.[1]?.desc ? getVal(initialSanityData.panels[1].desc, baseT.panel2Desc) : baseT.panel2Desc,
    panel2Btn: initialSanityData?.panels?.[1]?.btnText ? getVal(initialSanityData.panels[1].btnText, baseT.panel2Btn) : baseT.panel2Btn,

    panel3Label: initialSanityData?.panels?.[2]?.label ? getVal(initialSanityData.panels[2].label, baseT.panel3Label) : baseT.panel3Label,
    panel3Title: initialSanityData?.panels?.[2]?.title ? getVal(initialSanityData.panels[2].title, baseT.panel3Title) : baseT.panel3Title,
    panel3Desc: initialSanityData?.panels?.[2]?.desc ? getVal(initialSanityData.panels[2].desc, baseT.panel3Desc) : baseT.panel3Desc,
    panel3Btn: initialSanityData?.panels?.[2]?.btnText ? getVal(initialSanityData.panels[2].btnText, baseT.panel3Btn) : baseT.panel3Btn,

    // Menu Section
    menuHeader: initialSanityData?.menuHeader ? getVal(initialSanityData.menuHeader, baseT.menuHeader) : baseT.menuHeader,
    menuTabs: initialSanityData?.menuTabs && initialSanityData.menuTabs.length > 0
      ? initialSanityData.menuTabs.map((tab: any, idx: number) => getVal(tab, baseT.menuTabs[idx] || ""))
      : baseT.menuTabs,

    // Location & Contact
    location: initialSanityData?.locationHeader ? getVal(initialSanityData.locationHeader, baseT.location) : baseT.location,
    hours: initialSanityData?.hoursTitle ? getVal(initialSanityData.hoursTitle, baseT.hours) : baseT.hours,
    hoursVal: initialSanityData?.hoursVal ? getVal(initialSanityData.hoursVal, baseT.hoursVal) : baseT.hoursVal,
    contact: initialSanityData?.contactTitle ? getVal(initialSanityData.contactTitle, baseT.contact) : baseT.contact,
    contactVal: initialSanityData?.contactVal ? getVal(initialSanityData.contactVal, baseT.contactVal) : baseT.contactVal,
    espressoContactVal: initialSanityData?.contactVal ? getVal(initialSanityData.contactVal, baseT.espressoContactVal) : baseT.espressoContactVal,
    espressoLocVal: initialSanityData?.addressVal ? getVal(initialSanityData.addressVal, baseT.espressoLocVal) : baseT.espressoLocVal,
    footerAddress: initialSanityData?.addressVal ? getVal(initialSanityData.addressVal, baseT.footerAddress) : baseT.footerAddress,
  };

  // Dynamic media resolvers
  const resolvedHeroBgImg = initialSanityData?.heroBgImage 
    ? (typeof initialSanityData.heroBgImage === 'string' ? initialSanityData.heroBgImage : (initialSanityData.heroBgImage.asset?.url || imageUrl(initialSanityData.heroBgImage).url()))
    : (isVilamore ? "/brand/vilamore-bg.jpg" : "/brand/the-espresso-lab-bg.jpg");
  const resolvedHeroBgType = initialSanityData?.heroBgType || "image";
  const resolvedHeroBgVideo = initialSanityData?.heroBgVideoUrl;

  const resolvedCollageImg1 = initialSanityData?.aboutImages?.[0]
    ? (typeof initialSanityData.aboutImages[0] === 'string' ? initialSanityData.aboutImages[0] : (initialSanityData.aboutImages[0].asset?.url || imageUrl(initialSanityData.aboutImages[0]).url()))
    : (isVilamore ? "/brand/vilamore-bg.jpg" : "/brand/the-espresso-lab-bg.jpg");
  const resolvedCollageImg2 = initialSanityData?.aboutImages?.[1]
    ? (typeof initialSanityData.aboutImages[1] === 'string' ? initialSanityData.aboutImages[1] : (initialSanityData.aboutImages[1].asset?.url || imageUrl(initialSanityData.aboutImages[1]).url()))
    : (isVilamore ? "/brand/vilamore-kebab.jpg" : "/brand/the-espresso-lab-flatwhite.jpg");
  const resolvedCollageImg3 = initialSanityData?.aboutImages?.[2]
    ? (typeof initialSanityData.aboutImages[2] === 'string' ? initialSanityData.aboutImages[2] : (initialSanityData.aboutImages[2].asset?.url || imageUrl(initialSanityData.aboutImages[2]).url()))
    : (isVilamore ? "/brand/hero-woman.jpg" : "/brand/the-espresso-lab-bg.jpg");

  const resolvedPanel1Img = initialSanityData?.panels?.[0]?.image
    ? (typeof initialSanityData.panels[0].image === 'string' ? initialSanityData.panels[0].image : (initialSanityData.panels[0].image.asset?.url || imageUrl(initialSanityData.panels[0].image).url()))
    : "/brand/vilamore-kebab.jpg";
  const resolvedPanel2Img = initialSanityData?.panels?.[1]?.image
    ? (typeof initialSanityData.panels[1].image === 'string' ? initialSanityData.panels[1].image : (initialSanityData.panels[1].image.asset?.url || imageUrl(initialSanityData.panels[1].image).url()))
    : "/brand/vilamore-bg.jpg";
  const resolvedPanel3Img = initialSanityData?.panels?.[2]?.image
    ? (typeof initialSanityData.panels[2].image === 'string' ? initialSanityData.panels[2].image : (initialSanityData.panels[2].image.asset?.url || imageUrl(initialSanityData.panels[2].image).url()))
    : "/brand/hero-woman.jpg";

  const handleScrollToSection = (ref: React.RefObject<HTMLDivElement | null>) => {
    if (ref.current) {
      ref.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    setDrawerOpen(false);
  };

  const resolvedHeaderLinks = useMemo(() => {
    if (initialSanityData?.headerLinks && initialSanityData.headerLinks.length > 0) {
      return initialSanityData.headerLinks.map((link: any) => {
        const title = isAr
          ? link.title?.ar || link.title?.en || ""
          : link.title?.en || link.title?.ar || "";
        const action = () => {
          if (link.linkType === "url") {
            let path = link.urlPath || "/";
            if (path === "/dining") {
              path = `/category/dining/${lang}`;
            } else if (path === "/" || path === "/home") {
              path = `/${lang}`;
            } else if (path.startsWith("/dining") && !path.endsWith("/ar") && !path.endsWith("/en")) {
              path = `${path}/${lang}`;
            }
            window.location.href = path;
          } else {
            const refMap: Record<string, React.RefObject<HTMLDivElement | null>> = {
              hero: heroSectionRef,
              about: philosophySectionRef,
              menu: menuSectionRef,
              gallery: terraceSectionRef,
              location: locationSectionRef
            };
            const ref = refMap[link.anchorSection];
            if (ref) {
              handleScrollToSection(ref);
            }
          }
          setDrawerOpen(false);
        };
        return { title, action };
      });
    }
    return [
      { title: isAr ? "العودة للرئيسية" : "Back to Mall Home", action: () => { window.location.href = lang === "ar" ? "/ar" : "/en"; } },
      { title: isAr ? (isVilamore ? "بداية الصفحة" : "الرئيسية") : (isVilamore ? "Restaurant Home" : "Café Home"), action: () => handleScrollToSection(heroSectionRef) },
      { title: isAr ? (isVilamore ? "قصتنا وعراقتنا" : "معايير التحميص") : (isVilamore ? "Our Story & Jasmine" : "Our Roastery Standards"), action: () => handleScrollToSection(philosophySectionRef) },
      { title: isAr ? (isVilamore ? "قائمة التذوق" : "قائمة القهوة") : (isVilamore ? "Our Tasting Menu" : "Our Brew Menu"), action: () => handleScrollToSection(menuSectionRef) },
      { title: isAr ? (isVilamore ? "الجلسات والأجواء" : "الأجواء والتقطير") : (isVilamore ? "Ambiance Space" : "Ambiance Space"), action: () => handleScrollToSection(terraceSectionRef) },
      { title: isAr ? "الموقع والاتصال" : "Location & Contact", action: () => handleScrollToSection(locationSectionRef) }
    ];
  }, [initialSanityData?.headerLinks, isAr, isVilamore, lang, heroSectionRef, philosophySectionRef, menuSectionRef, terraceSectionRef, locationSectionRef]);

  const scrollTerrace = (direction: "left" | "right", ref: React.RefObject<HTMLDivElement | null>) => {
    if (ref.current) {
      const scrollAmount = 380;
      ref.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth"
      });
    }
  };

  // Get active menu items lists helper
  const getVilamoreActiveMenuList = () => {
    if (initialSanityData?.menus && initialSanityData.menus.length > 0) {
      const filtered = initialSanityData.menus.filter((item: any) => item.categoryIndex === vilamoreActiveTab);
      if (filtered.length > 0) {
        return filtered.map((item: any) => ({
          name: getVal(item.name, ""),
          desc: getVal(item.desc, ""),
          price: getVal(item.price, "TBC"),
          tag: getVal(item.tag, ""),
          note: getVal(item.note, ""),
          image: item.image ? (typeof item.image === "string" ? item.image : (item.image.asset?.url || imageUrl(item.image).url())) : "/brand/logo.png"
        }));
      }
    }

    const menus = t.menus;
    if (vilamoreActiveTab === 0) return menus.breakfast;
    if (vilamoreActiveTab === 1) return menus.coldMezza;
    if (vilamoreActiveTab === 2) return menus.hotMezza;
    if (vilamoreActiveTab === 3) return menus.grills;
    return menus.desserts;
  };

  const getEspressoActiveMenuList = () => {
    if (initialSanityData?.menus && initialSanityData.menus.length > 0) {
      const filtered = initialSanityData.menus.filter((item: any) => item.categoryIndex === espressoActiveTab);
      if (filtered.length > 0) {
        return filtered.map((item: any) => ({
          name: getVal(item.name, ""),
          desc: getVal(item.desc, ""),
          price: getVal(item.price, "TBC"),
          tag: getVal(item.tag, ""),
          note: getVal(item.note, ""),
          image: item.image ? (typeof item.image === "string" ? item.image : (item.image.asset?.url || imageUrl(item.image).url())) : "/brand/logo.png"
        }));
      }
    }

    const menus = t.espressoMenus;
    if (espressoActiveTab === 0) return menus.coffee;
    if (espressoActiveTab === 1) return menus.beverages;
    return menus.espressoDesserts;
  };

  const activeMenuList = getVilamoreActiveMenuList();
  const activeEspressoMenuList = getEspressoActiveMenuList();

  // Helper to highlight key words in Orange (#CB6116)
  const highlightText = (text: string, wordsToHighlight: string[]) => {
    if (!text) return "";
    let elements: React.ReactNode[] = [];
    let currentText = text;
    
    // Sort words by length descending to prevent partial match issues
    const sortedWords = [...wordsToHighlight].sort((a, b) => b.length - a.length);
    
    // Simple regex-based replacement mapped to React nodes
    const escapedWords = sortedWords.map(w => w.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\$&'));
    if (escapedWords.length === 0) return text;
    
    const regex = new RegExp(`(${escapedWords.join('|')})`, 'g');
    const parts = text.split(regex);
    
    return parts.map((part, index) => {
      const isMatch = sortedWords.some(w => w.toLowerCase() === part.toLowerCase());
      return isMatch ? (
        <Box component="span" key={index} sx={{ color: accentColor, fontWeight: 800 }}>
          {part}
        </Box>
      ) : (
        part
      );
    });
  };

  // Words list to color in orange
  const highlightsList = [
    "Jasmine", "Embers", "Levantine", "Damascus", "Syrian", "Turkish", "Heritage", "Courtyard", "Flavors", "Hearts",
    "ياسمين دمشق", "الياسمين الدمشقي", "الجمر", "الشام", "الضيافة", "العائلة", "التنور", "المذاق", "القلوب", "فيلامور",
    "دقة", "فخامة", "تراث"
  ];

  // 1. VILAMORE DESIGN: ELEGANT PORTFOLIO WITH LIGHT THEME & BOLD ORANGE ACCENTS
  if (isVilamore) {
    const vilamoreTheme = createTheme({
      palette: {
        primary: { main: accentColor },
        background: { default: beigeBg, paper: cardBg },
        text: { primary: charcoalText, secondary: "rgba(44,37,34,0.7)" }
      },
      typography: {
        fontFamily: 'Cairo, sans-serif'
      }
    });


    const oppositeLang = isAr ? "en" : "ar";
    const oppositeLangPath = `/dining/vilamore/${oppositeLang}`;

    const backHref = useMemo(() => {
      const rawLink = initialSanityData?.backButtonLink || "/dining";
      if (rawLink === "/dining") {
        return `/category/dining/${lang}`;
      }
      if (rawLink === "/" || rawLink === "/home") {
        return `/${lang}`;
      }
      if (rawLink.startsWith("/dining") && !rawLink.endsWith("/ar") && !rawLink.endsWith("/en")) {
        return `${rawLink}/${lang}`;
      }
      return rawLink;
    }, [initialSanityData?.backButtonLink, lang]);

    const signatureDishes = [
      { 
        number: "01", 
        name: isAr ? "الفطور السوري التقليدي" : "Traditional Syrian Breakfast",
        desc: isAr ? "لبنة بلدية، جبنة حلوم مشوية، فتة حمص دافئة، زيتون سوري، عسل بري وقشطة، تقدم مع خبز التنور الطازج." : "Artisanal Labneh, grilled Halloumi cheese, warm chickpeas Fatteh, Syrian olives, wild honey, and clotted cream, served with clay-oven bread.",
        image: "/brand/hero-woman.jpg",
        sub: isAr ? "يومياً 8:30 ص - 12:30 م" : "Daily 8:30 AM - 12:30 PM",
        tag: isAr ? "توقيع الشيف" : "Signature",
        quote: isAr ? "«فطورنا الدمشقي يجمع العائلة حول مائدة المودة مع رائحة خبز التنور الطازج»" : "“Our Damascene breakfast gathers family around a table of warmth, smelling of fresh clay-oven bread.”"
      },
      { 
        number: "02", 
        name: isAr ? "حمص فيلامور المخملي" : "Vilamore Velvet Hummus",
        desc: isAr ? "حمص محلي مطحون مخفوق مع طحينة السمسم، عصير ليمون، زيت زيتون بكر ممتاز، ومزين بالصنوبر المحمص." : "Pureed local chickpeas whipped with sesame tahini paste, lemon juice, extra virgin olive oil, finished with toasted pine nuts.",
        image: "/brand/vilamore-bg.jpg",
        sub: isAr ? "مزة باردة" : "Cold Mezza",
        tag: isAr ? "نباتي" : "Vegan",
        quote: isAr ? "«نعومة الحمص المخملي الممزوج بزيت الزيتون المعصور على البارد تروي حكاية زيتوننا الشامي»" : "“The silkiness of whipped chickpeas finished with cold-pressed olive oil tells the tale of Levant olive orchards.”"
      },
      { 
        number: "03", 
        name: isAr ? "الكبة الشامية المقرمشة" : "Crispy Syrian Kibbeh",
        desc: isAr ? "أقراص برغل مقلية محشوة باللحم المفروم المتبل، البصل المشوي، الصنوبر المحمص، والبهارات الشامية." : "Golden-fried bulgur wheat shells filled with spiced minced lamb, roasted onions, toasted pine nuts, and Levant spices.",
        image: "/brand/hero-woman.jpg",
        sub: isAr ? "مزة ساخنة" : "Hot Mezza",
        tag: isAr ? "شعبية" : "Popular",
        quote: isAr ? "«سر كبتنا الدمشقية يكمن في قشرتها الرقيقة المقرمشة وحشوتها الغنية بالصنوبر المحمص»" : "“The secret of our Damascene Kibbeh lies in the paper-thin crispy crust and spiced minced meat rich in roasted pine nuts.”"
      },
      { 
        number: "04", 
        name: isAr ? "كباب فيلامور المتبل" : "Vilamore Spiced Kebab",
        desc: isAr ? "أسياخ لحم غنم مفروم متبل بالنعناع الطازج، البصل، والفلفل الحلبي، مشوية على الفحم وتقدم مع خبز الفحم." : "Charcoal-grilled minced lamb skewers seasoned with fresh mint, onion, and Aleppo pepper, served on fire-cooked flatbread with bulgur.",
        image: "/brand/vilamore-kebab.jpg",
        sub: isAr ? "على الجمر" : "Charcoal Grill",
        tag: isAr ? "الطلب الأكثر" : "Must Try",
        quote: isAr ? "«نشوي أسياخ الكباب على جمر السنديان ببطء لتكتسب تلك النكهة المدخنة التي تأسر القلوب»" : "“We grill our skewers slowly over oak wood embers to capture the deep smoky aroma that captures hearts.”"
      },
      { 
        number: "05", 
        name: isAr ? "الكنافة التركية الذهبية" : "Golden Turkish Kunafa",
        desc: isAr ? "عجينة كنافة مقرمشة مغطاة بالجبن الحلو المذاب، مسقية بقطر ماء الزهر، ومزينة بالفستق الحلبي." : "Crisp golden-brown shredded wheat pastry layered with sweet melted cheese, soaked in orange-blossom syrup, finished with pistachios.",
        image: "/brand/hero-unisex-perfume.jpg",
        sub: isAr ? "حلويات دافئة" : "Warm Dessert",
        tag: isAr ? "المفضلة" : "Bestseller",
        quote: isAr ? "«خيوط الكنافة الذهبية المقرمشة والجبن الساخن المذاب يحليان أمسيات دمشق العطرة»" : "“Crisp golden pastry threads and stretching hot cheese sweeten the scented evenings of Damascus.”"
      }
    ];

    return (
      <ThemeProvider theme={vilamoreTheme}>
        <Box sx={{ bgcolor: beigeBg, color: charcoalText, minHeight: "100vh", pb: 0, overflowX: "hidden", position: "relative" }}>
          
          {/* ==================== BESPOKE HEADER (ASKIM STYLE) ==================== */}
          
          {/* Desktop Fixed Navigation Buttons (Locks to sides, centered wordmark) */}
          <Box
            component={motion.div}
            animate={{ y: headerVisible ? 0 : -120 }}
            transition={{ type: "spring", stiffness: 100, damping: 18 }}
            sx={{
              display: { xs: "none", md: "block" },
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              height: "100px",
              zIndex: 999,
              bgcolor: headerScrolled ? "rgba(253, 251, 248, 0.95)" : "#fdfbf8f2",
              backdropFilter: headerScrolled ? "blur(12px)" : "none",
              borderBottom: headerScrolled ? "1px solid rgba(44, 37, 34, 0.08)" : "none",
              transition: "background-color 0.3s, border-bottom 0.3s, opacity 0.2s",
              opacity: drawerOpen ? 0 : 1,
              pointerEvents: drawerOpen ? "none" : "auto"
            }}
          >
            {/* Left side: MENU Drawer Button */}
            <Box
              component={motion.div}
              onClick={() => setDrawerOpen(true)}
              sx={{
                position: "absolute",
                top: "50%",
                left: { md: 16, lg: 60 },
                transform: "translateY(-50%)",
                zIndex: 999,
                bgcolor: accentColor,
                color: "#ffffff",
                border: "2px solid #ffffff",
                borderRadius: "16px",
                px: { md: 3, lg: 5 },
                py: { md: 1.5, lg: 2 },
                cursor: "pointer",
                boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
                display: "flex",
                alignItems: "center",
                gap: 1.5,
                transition: "background-color 0.2s, color 0.2s, border-color 0.2s",
                "&:hover": {
                  bgcolor: "#b0500e"
                }
              }}
            >
              <MenuIcon sx={{ fontSize: 20 }} />
              <Typography sx={{ fontFamily: "var(--heading-font)", fontWeight: 700, fontSize: { md: "0.95rem", lg: "1.1rem" }, letterSpacing: lang === "ar" ? 0 : "0.1em" }}>
                {t.menuText}
              </Typography>
            </Box>

            {/* Center Logo/Branding PNG */}
            <Box
              component={Link}
              href={lang === "ar" ? "/ar" : "/en"}
              sx={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                zIndex: 999
              }}
            >
              <Box 
                component="img" 
                src={resolvedLogoUrl} 
                alt="Logo" 
                sx={{ 
                  height: { 
                    md: `${initialSanityData?.logoHeight || 50}px` 
                  },
                  maxHeight: { md: "100px", lg: "140px" },
                  maxWidth: { md: "140px", lg: "220px" },
                  width: initialSanityData?.logoWidth ? `${initialSanityData.logoWidth}px` : "auto",
                  objectFit: "contain",
                  display: "block" 
                }} 
              />
            </Box>

            {/* Right side: Language Switch, HOME Button, & VISIT US Anchor with flex gap spacing */}
            <Stack
              direction="row"
              sx={{
                position: "absolute",
                top: "50%",
                right: { md: 16, lg: 60 },
                transform: "translateY(-50%)",
                zIndex: 999,
                display: "flex",
                flexDirection: "row",
                gap: { md: 1, lg: 2 },
                alignItems: "center"
              }}
            >
              {/* Back to Mall Home */}
              <Box
                component={Link}
                href={backHref}
                sx={{
                  bgcolor: cardBg,
                  color: charcoalText,
                  border: `1.5px solid ${charcoalText}`,
                  borderRadius: "16px",
                  px: { md: 2, lg: 4 },
                  py: { md: 1.2, lg: 1.8 },
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  boxShadow: "0 6px 18px rgba(0,0,0,0.06)",
                  fontFamily: "Cairo, sans-serif",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  fontSize: { md: "0.8rem", lg: "0.9rem" },
                  transition: "background-color 0.2s, color 0.2s, border-color 0.2s",
                  "&:hover": {
                    bgcolor: charcoalText,
                    color: cardBg
                  }
                }}
              >
                {getVal(initialSanityData?.backButtonLabel, isAr ? "الرئيسية" : "Back to Dining")}
              </Box>

              {/* Language Switch */}
              <Box
                component={Link}
                href={oppositeLangPath}
                sx={{
                  bgcolor: cardBg,
                  color: charcoalText,
                  border: `1.5px solid ${charcoalText}`,
                  borderRadius: "16px",
                  px: { md: 2, lg: 4 },
                  py: { md: 1.2, lg: 1.8 },
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: 1.5,
                  boxShadow: "0 6px 18px rgba(0,0,0,0.06)",
                  fontFamily: "Cairo, sans-serif",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  fontSize: { md: "0.8rem", lg: "0.9rem" },
                  transition: "background-color 0.2s, color 0.2s, border-color 0.2s",
                  "&:hover": {
                    bgcolor: charcoalText,
                    color: cardBg
                  }
                }}
              >
                <Box 
                  component="img" 
                  src={lang === "en" ? "https://flagcdn.com/w40/sy.png" : "https://flagcdn.com/w40/gb.png"} 
                  alt={lang === "en" ? "Syria Flag" : "UK Flag"}
                  sx={{ width: 22, height: 15, objectFit: "cover", borderRadius: "2px" }}
                />
                <Box component="span" sx={{ display: { md: "none", lg: "inline" } }}>
                  {t.langToggleText}
                </Box>
              </Box>

              {/* VISIT US Link */}
              <Box
                onClick={() => {
                  const link = initialSanityData?.visitUsButtonLink;
                  if (link && !link.startsWith("#")) {
                    window.location.href = link;
                  } else {
                    handleScrollToSection(locationSectionRef);
                  }
                }}
                sx={{
                  bgcolor: cardBg,
                  color: accentColor,
                  border: `2px solid ${accentColor}`,
                  borderRadius: "16px",
                  px: { md: 3, lg: 5 },
                  py: { md: 1.2, lg: 1.8 },
                  cursor: "pointer",
                  boxShadow: "0 6px 18px rgba(0,0,0,0.08)",
                  fontFamily: "var(--heading-font)",
                  fontWeight: 700,
                  fontSize: { md: "0.80rem", lg: "0.95rem" },
                  letterSpacing: "0.05em",
                  transition: "background-color 0.2s, color 0.2s, border-color 0.2s",
                  "&:hover": {
                    bgcolor: accentColor,
                    color: "#ffffff"
                  }
                }}
              >
                {getVal(initialSanityData?.visitUsButtonLabel, isAr ? "اتصل بنا" : "VISIT US")}
              </Box>
            </Stack>
          </Box>

          {/* Mobile Top Sticky Navigation Bar */}
          <Box
            component={motion.div}
            animate={{ y: headerVisible ? 0 : -80 }}
            transition={{ type: "spring", stiffness: 100, damping: 18 }}
            sx={{
              display: { xs: "flex", md: "none" },
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              zIndex: 1100,
              bgcolor: headerScrolled ? "rgba(253, 251, 248, 0.95)" : "rgba(253, 251, 248, 0.95)",
              backdropFilter: headerScrolled ? "blur(8px)" : "none",
              borderBottom: headerScrolled ? "1px solid rgba(44, 37, 34, 0.08)" : "none",
              justifyContent: "space-between",
              alignItems: "center",
              px: 2,
              py: 2,
              transition: "background-color 0.3s, border-bottom 0.3s, opacity 0.2s",
              opacity: drawerOpen ? 0 : 1,
              pointerEvents: drawerOpen ? "none" : "auto"
            }}
          >
            <IconButton 
              onClick={() => setDrawerOpen(true)} 
              sx={{ 
                color: "#000000", 
                // bgcolor: headerScrolled ? "rgba(44, 37, 34, 0.75)" : "rgba(44, 37, 34, 0.4)",
                borderRadius: "50%",
                width: 44,
                height: 44,
                zIndex: 10,
                transition: "background-color 0.3s, color 0.3s",
                "&:hover": {
                  bgcolor: accentColor
                }
              }}
            >
              <MenuIcon sx={{ fontSize: 24 }} />
            </IconButton>

            {/* Mobile Center Logo PNG */}
            <Box
              component={Link}
              href={lang === "ar" ? "/ar" : "/en"}
              sx={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}
            >
              <Box 
                component="img" 
                src={resolvedLogoUrl} 
                alt="Logo" 
                sx={{ 
                  height: `${initialSanityData?.logoHeightMobile || 60}px`,
                  maxHeight: "60px",
                  maxWidth: { xs: "90px", sm: "140px" },
                  width: "auto",
                  objectFit: "contain",
                  display: "block" 
                }} 
              />
            </Box>

            <Stack direction="row" spacing={1}>
              <Box
                component={Link}
                href={backHref}
                sx={{
                  bgcolor: cardBg,
                  color: charcoalText,
                  border: "1px solid rgba(44, 37, 34, 0.2)",
                  borderRadius: "8px",
                  px: { xs: 1, sm: 1.5 },
                  py: 0.6,
                  fontSize: "0.75rem",
                  fontWeight: 700,
                  fontFamily: "Cairo, sans-serif",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  minWidth: { xs: 32, sm: "auto" },
                  height: 32,
                  ml:lang === "ar" ? "8px !important" : 0,
                }}
              >
                <Box component="span" sx={{ display: { xs: "none", sm: "inline" } }}>
                  {getVal(initialSanityData?.backButtonLabel, isAr ? "الرئيسية" : "HOME")}
                </Box>
                <Box component="span" sx={{ display: { xs: "inline-flex", sm: "none" }, alignItems: "center" }}>
                  {lang === "ar" ? <ArrowForwardIcon sx={{ fontSize: 16 }} /> : <ArrowBackIcon sx={{ fontSize: 16 }} />}
                </Box>
              </Box>
              <Box
                component={Link}
                href={oppositeLangPath}
                sx={{
                  bgcolor: cardBg,
                  color: charcoalText,
                  border: "1px solid rgba(44, 37, 34, 0.2)",
                  borderRadius: "8px",
                  px: { xs: 1, sm: 1.5 },
                  py: 0.6,
                  fontSize: "0.75rem",
                  fontWeight: 700,
                  fontFamily: "Cairo, sans-serif",
                  display: "flex",
                  alignItems: "center",
                  gap: 0.5,
                  minWidth: { xs: 32, sm: "auto" },
                  height: 32
                }}
              >
                <Box 
                  component="img" 
                  src={lang === "en" ? "https://flagcdn.com/w40/sy.png" : "https://flagcdn.com/w40/gb.png"} 
                  alt={lang === "en" ? "Syria Flag" : "UK Flag"}
                  sx={{ width: 18, height: 12, objectFit: "cover", borderRadius: "1px" }}
                />
                <Box component="span" sx={{ display: { xs: "none", sm: "inline" } }}>
                  {t.langToggleText}
                </Box>
              </Box>
            </Stack>
          </Box>

          {/* Navigation drawer (Left slide-out Askim style menu) */}
          <Drawer
            anchor={isAr ? "right" : "left"}
            open={drawerOpen}
            onClose={() => setDrawerOpen(false)}
            PaperProps={{
              "data-lenis-prevent": "true",
              sx: {
                width: { xs: "100%", sm: "450px" },
                bgcolor: beigeBg,
                backgroundImage: "none",
                p: 5,
                display: "flex",
                flexDirection: "column",
                borderRight: isAr ? "none" : "1.5px solid rgba(44,37,34,0.1)",
                borderLeft: isAr ? "1.5px solid rgba(44,37,34,0.1)" : "none",
                zIndex: 10000,
                overflowY: "auto",
                maxHeight: "100vh"
              }
            }}
            sx={{ zIndex: 10000 }}
          >
            {/* Drawer Header */}
            <Stack direction="row" justifyContent="space-between" alignItems="center" >
              <Box component="img" src={resolvedLogoUrl} alt="Logo" sx={{ height: `${initialSanityData?.logoHeightMobile || 45}px`, objectFit: "contain" }} />
              <IconButton onClick={() => setDrawerOpen(false)} sx={{ color: charcoalText, zIndex: 10 }}>
                <CloseIcon sx={{ fontSize: 30 }} />
              </IconButton>
            </Stack>

            {/* Menu Links */}
            <Stack spacing={4} sx={{ my: "auto", py: 4 }}>
              {resolvedHeaderLinks.map((item: any, idx: number) => (
                <Box
                  key={idx}
                  component={motion.div}
                  onClick={item.action}
                  sx={{ cursor: "pointer", py: 1, borderBottom: "1px solid rgba(44,37,34,0.06)" }}
                >
                  <Typography
                    sx={{
                      fontFamily: "var(--heading-font)",
                      fontSize: "2.2rem",
                      fontWeight: 500,
                      color: charcoalText,
                      transition: "color 0.2s",
                      "&:hover": { color: accentColor }
                    }}
                  >
                    {item.title}
                  </Typography>
                </Box>
              ))}
            </Stack>


            {/* Drawer Footer Quote */}
            <Box sx={{ mt: "auto", pt: 5, borderTop: "1px solid rgba(44,37,34,0.08)" }}>
              <Typography sx={{ fontStyle: "italic", fontSize: "1.1rem", color: "rgba(44,37,34,0.7)", mb: 2, fontFamily: "var(--heading-font)" }}>
                {t.quoteMedallion}
              </Typography>
              <Typography sx={{ fontSize: "0.85rem", opacity: 0.6 }}>
                {t.footerAddress}
              </Typography>
            </Box>
          </Drawer>
{/* ==================== 1. SPLIT ASYMMETRIC HERO SECTION ==================== */}
          <Box
            ref={heroSectionRef}
            sx={{
              position: "relative",
              minHeight: "100vh",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              bgcolor: charcoalText,
              overflow: "hidden",
              py: { xs: 12, md: 15 }
            }}
          >
            {/* Parallax Background with Slow Zoom animation */}
            {resolvedHeroBgType === "video" && resolvedHeroBgVideo ? (
              <Box
                component="video"
                autoPlay
                loop
                muted
                playsInline
                src={resolvedHeroBgVideo}
                sx={{
                  position: "absolute",
                  inset: 0,
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  zIndex: 1
                }}
              />
            ) : (
              <Box
                component={motion.div}
                style={{ y: heroY, opacity: heroOpacity }}
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                sx={{
                  position: "absolute",
                  inset: 0,
                  backgroundImage: `url(${resolvedHeroBgImg})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center center",
                  zIndex: 1
                }}
              />
            )}

            {/* Darkened warm radial overlay to blend image and enhance contrast */}
            <Box
              sx={{
                position: "absolute",
                inset: 0,
                background: "radial-gradient(circle, rgba(0,0,0,0.4) 100%, rgba(0,0,0,0.48) 100%)",
                zIndex: 2
              }}
            />

            {/* Centered Content Container */}
            <Container
              maxWidth="md"
              sx={{
                position: "relative",
                zIndex: 3,
                px: { xs: 3, sm: 6 }
              }}
            >
              {/* Premium Direct Overlay Typography */}
              <Box
                component={motion.div}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.2, ease: "easeOut" }}
                sx={{
                  textAlign: "center",
                  maxWidth: "800px",
                  mx: "auto",
                  px: { xs: 1, sm: 3 }
                }}
              >
                <Typography
                  variant="overline"
                  sx={{
                    color: accentColor,
                    fontWeight: 900,
                    letterSpacing: "0.25em",
                    fontSize: { xs: "0.85rem", md: "1rem" },
                    mb: 2,
                    display: "block",
                    textShadow: "0 2px 8px rgba(0,0,0,0.7), 0 1px 3px rgba(0,0,0,0.8)"
                  }}
                >
                  {t.narrativeSubtitle}
                </Typography>

                <Typography
                  variant="h1"
                  sx={{
                    fontFamily: "var(--heading-font)",
                    fontWeight: 700,
                    textTransform: "uppercase",
                    fontSize: { xs: "3rem", sm: "4.5rem", md: "5.5rem" },
                    color: "#ffffff",
                    lineHeight: 1.1,
                    mb: 3,
                    textShadow: "0 4px 30px rgba(0,0,0,0.8), 0 2px 10px rgba(0,0,0,0.8)"
                  }}
                >
                  {t.heroTitle}
                </Typography>

                <Typography
                  sx={{
                    fontSize: { xs: 16, md: 19 },
                    lineHeight: 1.8,
                    color: "rgba(255, 255, 255, 0.95)",
                    mb: 4,
                    textShadow: "0 2px 12px rgba(0,0,0,0.85), 0 1px 4px rgba(0,0,0,0.85)"
                  }}
                >
                  {highlightText(t.vilamoreHeroSub, highlightsList)}
                </Typography>

                <Box
                  sx={{
                    width: "80px",
                    height: "2px",
                    bgcolor: accentColor,
                    mx: "auto",
                    my: 3,
                    boxShadow: "0 2px 8px rgba(0,0,0,0.5)"
                  }}
                />

                <Typography
                  sx={{
                    fontFamily: "var(--heading-font)",
                    fontStyle: "italic",
                    fontSize: { xs: "1.1rem", md: "1.35rem" },
                    color: "rgba(255, 255, 255, 0.9)",
                    px: { xs: 1, md: 4 },
                    textShadow: "0 2px 10px rgba(0,0,0,0.85)"
                  }}
                >
                  {t.quoteAesthetic}
                </Typography>
              </Box>
            </Container>
          </Box>
          
{/* ==================== 2. TILTED CATEGORY NAVIGATION COLLAGE CARD ==================== */}
          <Box sx={{ position: "relative", height: { xs: "120vh", md: "115vh", lg: "125vh" }, overflow: "hidden" }}>
            {/* Full-bleed high-end background image */}
            <Box
              sx={{
                position: "absolute",
                inset: 0,
                backgroundImage: 'url("/brand/vilamore-kebab.jpg")',
                backgroundSize: "cover",
                backgroundPosition: "center center"
              }}
            />
            {/* Glassmorphism masking */}
            <Box sx={{ position: "absolute", inset: 0, bg: "rgba(44,37,34,0.3)" }} />

            <Container maxWidth="lg" sx={{ height: "100%", display: "flex", alignItems: "center", zIndex: 3, position: "relative" }}>
              <Box
                component={motion.div}
                initial={{ opacity: 0, x: isAr ? 80 : -80, rotate: isAr ? 4 : -4 }}
                whileInView={{ opacity: 1, x: 0, rotate: isAr ? 6 : -6 }}
                viewport={{ once: true }}
                transition={{ duration: 1.2, ease: [0.25, 1, 0.5, 1] }}
                sx={{
                  bgcolor: beigeBg,
                  width: { xs: "95%", sm: "500px" },
                  mx: { xs: "auto", sm: 0 },
                  boxShadow: "0 30px 70px rgba(0,0,0,0.22)",
                  p: 1.5,
                  border: `1.5px solid ${accentColor}`,
                  transform: `rotate(${isAr ? 6 : -6}deg)`,
                  borderRadius: "24px",
                  overflow: "hidden"
                }}
              >
                {/* Inner double-bordered frame */}
                <Box sx={{ border: `1.5px solid ${accentColor}`, p: { xs: 4, sm: 6 }, bgcolor: cardBg, borderRadius: "16px" }}>
                  <Typography
                    variant="overline"
                    sx={{
                      color: accentColor,
                      fontWeight: 900,
                      letterSpacing: "0.2em",
                      display: "block",
                      mb: 2,
                      textAlign: "center",
                      fontSize: "0.85rem"
                    }}
                  >
                    {isAr ? "تجربة فيلامور" : "VILAMORE EXPERIENCE"}
                  </Typography>

                  <Typography
                    variant="h2"
                    sx={{
                      fontFamily: "var(--heading-font)",
                      fontWeight: 700,
                      fontSize: { xs: "2rem", sm: "2.8rem" },
                      textAlign: "center",
                      mb: 5,
                      color: charcoalText
                    }}
                  >
                    {t.storyHeading}
                  </Typography>

                  {/* Overlapping Hover Links list with slide-up fills */}
                  <Stack spacing={2.5}>
                    {[
                      { title: isAr ? "مأكولاتنا الفاخرة" : "Our Culinary Art", ref: menuSectionRef },
                      { title: isAr ? "جلسات الياسمين" : "Jasmine Courtyard", ref: terraceSectionRef },
                      { title: isAr ? "موقعنا والاتصال" : "Location & Hour Info", ref: locationSectionRef }
                    ].map((item, idx) => (
                      <Box
                        key={idx}
                        onClick={() => handleScrollToSection(item.ref)}
                        component={motion.div}
                        whileHover="hover"
                        sx={{
                          position: "relative",
                          border: `1.5px solid ${charcoalText}`,
                          borderRadius: "16px",
                          cursor: "pointer",
                          overflow: "hidden"
                        }}
                      >
                        {/* Slide-up Orange background fill */}
                        <Box
                          component={motion.div}
                          variants={{
                            hover: { y: 0 }
                          }}
                          initial={{ y: "100%" }}
                          transition={{ duration: 0.35, ease: "easeInOut" }}
                          sx={{
                            position: "absolute",
                            inset: 0,
                            bgcolor: accentColor,
                            zIndex: 1
                          }}
                        />

                        {/* Interactive Content */}
                        <Stack
                          direction="row"
                          justifyContent="space-between"
                          alignItems="center"
                          sx={{ px: 4, py: 2.5, position: "relative", zIndex: 2 }}
                        >
                          <Typography
                            component={motion.span}
                            variants={{
                              hover: { color: "#ffffff", x: isAr ? -5 : 5 }
                            }}
                            sx={{
                              fontFamily: "var(--heading-font)",
                              fontWeight: 700,
                              fontSize: { xs: "1.1rem", sm: "1.3rem" },
                              color: charcoalText,
                              transition: "color 0.25s, transform 0.25s"
                            }}
                          >
                            {item.title}
                          </Typography>
                          
                          <Box
                            component={motion.div}
                            variants={{
                              hover: { x: isAr ? -8 : 8, color: "#ffffff" }
                            }}
                            sx={{
                              color: accentColor,
                              display: "flex",
                              alignItems: "center",
                              transition: "color 0.25s, transform 0.25s"
                            }}
                          >
                            {isAr ? <ArrowBackIcon /> : <ArrowForwardIcon />}
                          </Box>
                        </Stack>
                      </Box>
                    ))}
                  </Stack>
                </Box>
              </Box>
            </Container>
          </Box>


          {/* ==================== 3. BRAND NARRATIVE & FLOATING PHOTO COLLAGE ==================== */}
          <Box ref={philosophySectionRef} sx={{ py: { xs: 12, md: 20 }, position: "relative" }}>
            <Container maxWidth="lg">
              <Grid container spacing={8} alignItems="center" dir={isAr ? "rtl" : "ltr"}>
                
                {/* Story block */}
                <Grid size={{ xs: 12, md: 6 }}>
                  <Typography variant="overline" sx={{ color: accentColor, fontWeight: 900, letterSpacing: "0.25em", fontSize: "0.9rem" }}>
                    {isAr ? "عراقة النكهة" : "THE HERITAGE OF FLAVOR"}
                  </Typography>
                  <Typography
                    variant="h2"
                    sx={{
                      fontFamily: "var(--heading-font)",
                      fontWeight: 700,
                      textTransform: "uppercase",
                      mt: 2,
                      mb: 4,
                      fontSize: { xs: "2.4rem", md: "4rem" },
                      lineHeight: 1.15,
                      color: charcoalText
                    }}
                  >
                    {t.discoverTitle}
                  </Typography>
                  
                  {/* Narrative paragraphs with color highlighted terms */}
                  <Typography sx={{ fontSize: 18, lineHeight: 2.1, color: "rgba(44,37,34,0.85)", mb: 4, textAlign: "justify" }}>
                    {highlightText(t.discoverDesc, highlightsList)}
                  </Typography>

                  {/* Elegant big quote display */}
                  <Box sx={{ borderLeft: isAr ? "none" : `3px solid ${accentColor}`, borderRight: isAr ? `3px solid ${accentColor}` : "none", pl: isAr ? 0 : 3, pr: isAr ? 3 : 0, py: 1, my: 4 }}>
                    <Typography
                      sx={{
                        fontFamily: "var(--heading-font)",
                        fontStyle: "italic",
                        fontSize: { xs: "1.5rem", sm: "1.9rem" },
                        lineHeight: 1.5,
                        color: charcoalText
                      }}
                    >
                      {highlightText(isAr ? t.quoteNarrative : t.quoteNarrative, highlightsList)}
                    </Typography>
                  </Box>
                </Grid>

                {/* Floating Photo Collage section */}
                <Grid size={{ xs: 12, md: 6 }}>
                  <Box sx={{ position: "relative", height: { xs: "480px", sm: "550px", md: "600px" }, mt: { xs: 4, md: 0 } }}>
                    <motion.div
                      initial="hidden"
                      whileInView="visible"
                      viewport={{ once: true, margin: "-100px" }}
                      variants={{
                        hidden: {},
                        visible: { transition: { staggerChildren: 0.25 } }
                      }}
                      style={{ width: "100%", height: "100%", position: "relative" }}
                    >
                      {/* Photo 1: Big Background (tilted -3deg) */}
                      <Box
                        component={motion.div}
                        variants={fadeInUp}
                        whileHover={{ scale: 1.02, rotate: -1, zIndex: 10 }}
                        sx={{
                          position: "absolute",
                          left: 0,
                          top: "2%",
                          width: { xs: "65%", sm: "60%" },
                          height: { xs: "60%", sm: "70%" },
                          boxShadow: "0 25px 50px rgba(44,37,34,0.18)",
                          zIndex: 2,
                          border: `6px solid ${cardBg}`,
                          transform: "rotate(-3deg)",
                          cursor: "zoom-in",
                          borderRadius: "20px",
                          overflow: "hidden"
                        }}
                      >
                        <Box component="img" src={resolvedCollageImg1} alt="Vilamore Courtyard" sx={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      </Box>

                      {/* Photo 2: Overlay Foreground (overlapping, tilted 4deg) */}
                      <Box
                        component={motion.div}
                        variants={fadeInUp}
                        whileHover={{ scale: 1.04, rotate: 2, zIndex: 10 }}
                        sx={{
                          position: "absolute",
                          right: 0,
                          top: "25%",
                          width: { xs: "55%", sm: "50%" },
                          height: { xs: "50%", sm: "60%" },
                          boxShadow: "0 30px 60px rgba(44,37,34,0.22)",
                          zIndex: 3,
                          border: `6px solid ${cardBg}`,
                          transform: "rotate(4deg)",
                          cursor: "zoom-in",
                          borderRadius: "20px",
                          overflow: "hidden"
                        }}
                      >
                        <Box component="img" src={resolvedCollageImg2} alt="Levantine Charcoal Grill" sx={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      </Box>

                      {/* Photo 3: Small Detail (bottom middle overlay, tilted -6deg) */}
                      <Box
                        component={motion.div}
                        variants={fadeInUp}
                        whileHover={{ scale: 1.05, rotate: -4, zIndex: 10 }}
                        sx={{
                          position: "absolute",
                          left: "15%",
                          bottom: "2%",
                          width: { xs: "45%", sm: "35%" },
                          height: { xs: "40%", sm: "40%" },
                          boxShadow: "0 20px 40px rgba(44,37,34,0.15)",
                          zIndex: 4,
                          border: `5px solid ${cardBg}`,
                          transform: "rotate(-6deg)",
                          display: "block",
                          cursor: "zoom-in",
                          borderRadius: "20px",
                          overflow: "hidden"
                        }}
                      >
                        <Box component="img" src={resolvedCollageImg3} alt="Vilamore Ambiance Detail" sx={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      </Box>
                    </motion.div>
                  </Box>
                </Grid>
              </Grid>
            </Container>
          </Box>


          {/* ==================== 4. WHY CHOOSE VILAMORE PORTFOLIO PANELS ==================== */}
          <Box sx={{ bgcolor: cardBg, py: { xs: 12, md: 18 }, borderY: "1.5px solid rgba(44,37,34,0.06)" }}>
            <Container maxWidth="lg">
              
              {/* Header */}
              <Box sx={{ textAlign: "center", mb: 12 }}>
                <Typography
                  variant="overline"
                  sx={{
                    color: accentColor,
                    fontWeight: 900,
                    letterSpacing: "0.3em",
                    fontSize: "0.9rem"
                  }}
                >
                   {isAr ? "اكتشف الفرق" : "DISCOVER THE DIFFERENCE"}
                </Typography>
                
                <Typography
                  variant="h2"
                  sx={{
                    fontFamily: "var(--heading-font)",
                    fontWeight: 700,
                    fontSize: { xs: "2.8rem", md: "4.5rem" },
                    color: charcoalText,
                    mt: 1
                  }}
                >
                  {t.panel4Label}
                </Typography>
              </Box>

              {/* Panel Rows (Alternating Layout) */}
              <Stack spacing={16}>
                
                {/* Panel 1: Our Food */}
                <Grid container spacing={8} alignItems="center" dir={isAr ? "rtl" : "ltr"}>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <Box
                      component={motion.div}
                      initial={{ opacity: 0, scale: 0.96 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true, margin: "-100px" }}
                      transition={{ duration: 1 }}
                      sx={{
                        p: 1.2,
                        bgcolor: accentColor,
                        transform: "rotate(-4deg)",
                        boxShadow: "0 25px 50px rgba(0,0,0,0.12)",
                        borderRadius: "24px",
                        overflow: "hidden"
                      }}
                    >
                      <Box sx={{ bgcolor: beigeBg, p: 2, borderRadius: "16px" }}>
                        <Box sx={{ overflow: "hidden", height: { xs: 300, sm: 400 }, borderRadius: "12px" }}>
                          <Box component="img" src={resolvedPanel1Img} alt="Culinary Specialty" sx={{ width: "100%", height: "100%", objectFit: "cover" }} />
                        </Box>
                        <Box sx={{ textAlign: "center", py: 1.5 }}>
                          <Typography sx={{ fontFamily: "var(--heading-font)", fontSize: "1.3rem", fontWeight: 700, color: charcoalText }}>
                            {t.panel1Label}
                          </Typography>
                        </Box>
                      </Box>
                    </Box>
                  </Grid>

                  <Grid size={{ xs: 12, md: 6 }}>
                    <Typography variant="overline" sx={{ color: accentColor, fontWeight: 900 }}>
                      {isAr ? "01 / فن الطهي" : "01 / GASTRONOMY"}
                    </Typography>
                    <Typography variant="h3" sx={{ fontFamily: "var(--heading-font)", fontSize: { xs: "1.8rem", sm: "2.5rem" }, fontWeight: 700, mt: 1, mb: 3 }}>
                      {t.panel1Title}
                    </Typography>
                    <Typography sx={{ fontSize: 16.5, lineHeight: 1.9, color: "rgba(44,37,34,0.78)", mb: 4 }}>
                      {highlightText(t.panel1Desc, highlightsList)}
                    </Typography>

                    {/* Rotated custom button with hover slide fill */}
                    <Box
                      onClick={() => handleScrollToSection(menuSectionRef)}
                      component={motion.button}
                      whileHover="hover"
                      sx={{
                        position: "relative",
                        bgcolor: "transparent",
                        border: `2px solid ${accentColor}`,
                        color: accentColor,
                        fontFamily: "var(--heading-font)",
                        fontWeight: 900,
                        fontSize: "1.1rem",
                        letterSpacing: "0.08em",
                        textTransform: "uppercase",
                        px: 6,
                        py: 2,
                        transform: "rotate(3deg)",
                        cursor: "pointer",
                        overflow: "hidden",
                        borderRadius: "16px",
                        "&:hover": { color: "#ffffff" }
                      }}
                    >
                      <Box
                        component={motion.div}
                        variants={{ hover: { y: 0 } }}
                        initial={{ y: "102%" }}
                        transition={{ duration: 0.3 }}
                        sx={{ position: "absolute", inset: 0, bgcolor: accentColor, zIndex: 1 }}
                      />
                      <Box component="span" sx={{ position: "relative", zIndex: 2, display: "flex", alignItems: "center", gap: 1, transition: "color 0.3s" }}>
                        <Typography sx={{ fontWeight: 800, fontFamily: "var(--heading-font)", color: "inherit" }}>{t.panel1Btn}</Typography>
                        {lang === "ar" ? <ArrowBackIcon sx={{ fontSize: 18 }} /> : <ArrowForwardIcon sx={{ fontSize: 18 }} />}
                      </Box>
                    </Box>
                  </Grid>
                </Grid>

                {/* Panel 2: Terrace Ambiance */}
                <Grid container spacing={8} alignItems="center" dir={isAr ? "ltr" : "rtl"}>
                  <Grid size={{ xs: 12, md: 6 }} dir={isAr ? "rtl" : "ltr"}>
                    <Box
                      component={motion.div}
                      initial={{ opacity: 0, scale: 0.96 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true, margin: "-100px" }}
                      transition={{ duration: 1 }}
                      sx={{
                        p: 1.2,
                        bgcolor: accentColor,
                        transform: "rotate(4deg)",
                        boxShadow: "0 25px 50px rgba(0,0,0,0.12)",
                        borderRadius: "24px",
                        overflow: "hidden"
                      }}
                    >
                      <Box sx={{ bgcolor: beigeBg, p: 2, borderRadius: "16px" }}>
                        <Box sx={{ overflow: "hidden", height: { xs: 300, sm: 400 }, borderRadius: "12px" }}>
                          <Box component="img" src={resolvedPanel2Img} alt="Courtyard View" sx={{ width: "100%", height: "100%", objectFit: "cover" }} />
                        </Box>
                        <Box sx={{ textAlign: "center", py: 1.5 }}>
                          <Typography sx={{ fontFamily: "var(--heading-font)", fontSize: "1.3rem", fontWeight: 700, color: charcoalText }}>
                            {t.panel2Label}
                          </Typography>
                        </Box>
                      </Box>
                    </Box>
                  </Grid>

                  <Grid size={{ xs: 12, md: 6 }} dir={isAr ? "rtl" : "ltr"}>
                    <Typography variant="overline" sx={{ color: accentColor, fontWeight: 900 }}>
                      {isAr ? "02 / الطبيعة والمكان" : "02 / NATURE & SPATIALITY"}
                    </Typography>
                    <Typography variant="h3" sx={{ fontFamily: "var(--heading-font)", fontSize: { xs: "1.8rem", sm: "2.5rem" }, fontWeight: 700, mt: 1, mb: 3 }}>
                      {t.panel2Title}
                    </Typography>
                    <Typography sx={{ fontSize: 16.5, lineHeight: 1.9, color: "rgba(44,37,34,0.78)", mb: 4 }}>
                      {highlightText(t.panel2Desc, highlightsList)}
                    </Typography>

                    <Box
                      onClick={() => handleScrollToSection(terraceSectionRef)}
                      component={motion.button}
                      whileHover="hover"
                      sx={{
                        position: "relative",
                        bgcolor: "transparent",
                        border: `2px solid ${accentColor}`,
                        color: accentColor,
                        fontFamily: "var(--heading-font)",
                        fontWeight: 900,
                        fontSize: "1.1rem",
                        letterSpacing: "0.08em",
                        textTransform: "uppercase",
                        px: 6,
                        py: 2,
                        transform: "rotate(-3deg)",
                        cursor: "pointer",
                        overflow: "hidden",
                        borderRadius: "16px",
                        "&:hover": { color: "#ffffff" }
                      }}
                    >
                      <Box
                        component={motion.div}
                        variants={{ hover: { y: 0 } }}
                        initial={{ y: "102%" }}
                        transition={{ duration: 0.3 }}
                        sx={{ position: "absolute", inset: 0, bgcolor: accentColor, zIndex: 1 }}
                      />
                      <Box component="span" sx={{ position: "relative", zIndex: 2, display: "flex", alignItems: "center", gap: 1, transition: "color 0.3s" }}>
                        <Typography sx={{ fontWeight: 800, fontFamily: "var(--heading-font)", color: "inherit" }}>{t.panel2Btn}</Typography>
                        {isAr ? <ArrowBackIcon sx={{ fontSize: 18 }} /> : <ArrowForwardIcon sx={{ fontSize: 18 }} />}
                      </Box>
                    </Box>
                  </Grid>
                </Grid>

                {/* Panel 3: Elite Meetings */}
                <Grid container spacing={8} alignItems="center" dir={isAr ? "rtl" : "ltr"}>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <Box
                      component={motion.div}
                      initial={{ opacity: 0, scale: 0.96 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true, margin: "-100px" }}
                      transition={{ duration: 1 }}
                      sx={{
                        p: 1.2,
                        bgcolor: accentColor,
                        transform: "rotate(-3deg)",
                        boxShadow: "0 25px 50px rgba(0,0,0,0.12)",
                        borderRadius: "24px",
                        overflow: "hidden"
                      }}
                    >
                      <Box sx={{ bgcolor: beigeBg, p: 2, borderRadius: "16px" }}>
                        <Box sx={{ overflow: "hidden", height: { xs: 300, sm: 400 }, borderRadius: "12px" }}>
                          <Box component="img" src={resolvedPanel3Img} alt="Distinguished Guests" sx={{ width: "100%", height: "100%", objectFit: "cover" }} />
                        </Box>
                        <Box sx={{ textAlign: "center", py: 1.5 }}>
                          <Typography sx={{ fontFamily: "var(--heading-font)", fontSize: "1.3rem", fontWeight: 700, color: charcoalText }}>
                            {t.panel3Label}
                          </Typography>
                        </Box>
                      </Box>
                    </Box>
                  </Grid>

                  <Grid size={{ xs: 12, md: 6 }}>
                    <Typography variant="overline" sx={{ color: accentColor, fontWeight: 900 }}>
                      {isAr ? "03 / النخبة والتميز" : "03 / PRESTIGE"}
                    </Typography>
                    <Typography variant="h3" sx={{ fontFamily: "var(--heading-font)", fontSize: { xs: "1.8rem", sm: "2.5rem" }, fontWeight: 700, mt: 1, mb: 3 }}>
                      {t.panel3Title}
                    </Typography>
                    <Typography sx={{ fontSize: 16.5, lineHeight: 1.9, color: "rgba(44,37,34,0.78)", mb: 4 }}>
                      {highlightText(t.panel3Desc, highlightsList)}
                    </Typography>

                    <Box
                      onClick={() => handleScrollToSection(philosophySectionRef)}
                      component={motion.button}
                      whileHover="hover"
                      sx={{
                        position: "relative",
                        bgcolor: "transparent",
                        border: `2px solid ${accentColor}`,
                        color: accentColor,
                        fontFamily: "var(--heading-font)",
                        fontWeight: 900,
                        fontSize: "1.1rem",
                        letterSpacing: "0.08em",
                        textTransform: "uppercase",
                        px: 6,
                        py: 2,
                        transform: "rotate(3deg)",
                        cursor: "pointer",
                        overflow: "hidden",
                        borderRadius: "16px",
                        "&:hover": { color: "#ffffff" }
                      }}
                    >
                      <Box
                        component={motion.div}
                        variants={{ hover: { y: 0 } }}
                        initial={{ y: "102%" }}
                        transition={{ duration: 0.3 }}
                        sx={{ position: "absolute", inset: 0, bgcolor: accentColor, zIndex: 1 }}
                      />
                      <Box component="span" sx={{ position: "relative", zIndex: 2, display: "flex", alignItems: "center", gap: 1, transition: "color 0.3s" }}>
                        <Typography sx={{ fontWeight: 800, fontFamily: "var(--heading-font)", color: "inherit" }}>{t.panel3Btn}</Typography>
                        {isAr ? <ArrowBackIcon sx={{ fontSize: 18 }} /> : <ArrowForwardIcon sx={{ fontSize: 18 }} />}
                      </Box>
                    </Box>
                  </Grid>
                </Grid>

              </Stack>
            </Container>
          </Box>


          {/* ==================== 5. EDITORIAL INTERACTIVE TASTING MENU ==================== */}
          <Box id="menu-section" ref={menuSectionRef} sx={{ py: 16, bgcolor: beigeBg }}>
            <Container maxWidth="lg">
              {/* Header */}
              <Box sx={{ textAlign: "center", mb: 8 }}>
                <Typography
                  variant="overline"
                  sx={{
                    color: accentColor,
                    fontWeight: 900,
                    letterSpacing: "0.2em",
                    display: "block",
                    mb: 1
                  }}
                >
                  {isAr ? "فن الطهي الشامي" : "LEVANT CULINARY ARTISTRY"}
                </Typography>
                <Typography
                  variant="h2"
                  sx={{
                    fontFamily: "var(--heading-font)",
                    fontWeight: 700,
                    fontSize: { xs: "2.4rem", md: "3.6rem" },
                    color: charcoalText,
                    textTransform: "uppercase",
                    mb: 3
                  }}
                >
                  {t.menuHeader}
                </Typography>
                <Typography
                  sx={{
                    maxWidth: "680px",
                    mx: "auto",
                    color: "rgba(44, 37, 34, 0.7)",
                    fontSize: { xs: 16, md: 17 },
                    lineHeight: 1.8
                  }}
                >
                  {isAr 
                    ? "رحلة منسقة بعناية عبر أشهى المأكولات السورية التقليدية. مرر الفأرة فوق أي طبق لاكتشاف أسرار المطبخ وحكايات بلاد الشام العريقة."
                    : "A curated journey across the traditional and beloved flavors of Syria. Hover over any dish card to reveal the Chef's Secret and Levant stories."}
                </Typography>
              </Box>

              {/* Centered responsive category selector bar */}
              <Box
                sx={{
                  display: "flex",
                  flexWrap: "wrap",
                  justifyContent: "center",
                  mb: 8,
                  gap: 1.5,
                  dir: isAr ? "rtl" : "ltr"
                }}
              >
                {t.menuTabs.map((tab: string, idx: number) => {
                  const isActive = vilamoreActiveTab === idx;
                  return (
                    <Box
                      key={idx}
                      onClick={() => setVilamoreActiveTab(idx)}
                      sx={{
                        px: { xs: 2.5, sm: 4 },
                        py: 1.6,
                        borderRadius: "50px",
                        bgcolor: isActive ? accentColor : "transparent",
                        color: isActive ? "#ffffff" : charcoalText,
                        border: isActive ? `1.5px solid ${accentColor}` : "1px solid rgba(44, 37, 34, 0.2)",
                        fontFamily: "var(--heading-font)",
                        fontWeight: 700,
                        fontSize: "0.95rem",
                        cursor: "pointer",
                        textTransform: "uppercase",
                        transition: "all 0.2s",
                        boxShadow: isActive ? "0 8px 24px rgba(203, 97, 22, 0.2)" : "none",
                        "&:hover": {
                          borderColor: accentColor,
                          color: isActive ? "#ffffff" : accentColor
                        }
                      }}
                    >
                      {tab}
                    </Box>
                  );
                })}
              </Box>

              {/* Grid of Dishes with smooth fade in */}
              <AnimatePresence mode="wait">
                <Box
                  key={vilamoreActiveTab}
                  component={motion.div}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.35 }}
                  sx={{
                    display: "grid",
                    gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr", md: "1fr 1fr 1fr" },
                    gap: 4
                  }}
                >
                  {getVilamoreActiveMenuList().map((item: any, index: number) => {
                    return (
                      <Box
                        key={index}
                        sx={{
                          position: "relative",
                          overflow: "hidden",
                          borderRadius: "20px",
                          border: "1.5px solid rgba(44,37,34,0.08)",
                          bgcolor: cardBg,
                          minHeight: "440px",
                          display: "flex",
                          flexDirection: "column",
                          transition: "all 0.3s",
                          "&:hover": {
                            boxShadow: "0 16px 40px rgba(44, 37, 34, 0.08)",
                            borderColor: accentColor
                          },
                          "&:hover .zoom-img": {
                            transform: "scale(1.06)"
                          },
                          "&:hover .hover-overlay": {
                            opacity: 1
                          }
                        }}
                      >
                        {/* Image Frame */}
                        <Box
                          sx={{
                            position: "relative",
                            height: "230px",
                            overflow: "hidden"
                          }}
                        >
                          <Box
                            component="img"
                            className="zoom-img"
                            src={item.image}
                            alt={item.name}
                            sx={{
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                              transition: "transform 0.6s ease"
                            }}
                          />
                          {/* Tag Badge */}
                          {item.tag && (
                            <Box
                              sx={{
                                position: "absolute",
                                top: 16,
                                left: isAr ? "auto" : 16,
                                right: isAr ? 16 : "auto",
                                bgcolor: accentColor,
                                color: "#ffffff",
                                fontSize: "0.75rem",
                                fontWeight: 800,
                                px: 2,
                                py: 0.6,
                                borderRadius: 0,
                                zIndex: 3,
                                textTransform: "uppercase"
                              }}
                            >
                              {item.tag}
                            </Box>
                          )}
                        </Box>

                        {/* Content Area */}
                        <Box
                          sx={{
                            p: 3,
                            flexGrow: 1,
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "space-between"
                          }}
                        >
                          <Box sx={{ textAlign: isAr ? "right" : "left" }}>
                            <Typography
                              sx={{
                                fontFamily: "var(--heading-font)",
                                fontWeight: 700,
                                fontSize: "1.25rem",
                                color: charcoalText,
                                mb: 1
                              }}
                            >
                              {item.name}
                            </Typography>
                            <Typography
                              sx={{
                                fontSize: "0.88rem",
                                lineHeight: 1.6,
                                color: "rgba(44, 37, 34, 0.7)"
                              }}
                            >
                              {item.desc}
                            </Typography>
                          </Box>

                          <Box sx={{ mt: 3 }}>
                            <Divider sx={{ borderColor: "rgba(44, 37, 34, 0.08)", mb: 2 }} />
                            <Stack
                              direction="row"
                              justifyContent="space-between"
                              alignItems="center"
                              dir={isAr ? "rtl" : "ltr"}
                            >
                              <Typography
                                sx={{
                                  color: "rgba(44, 37, 34, 0.5)",
                                  fontSize: "0.85rem",
                                  fontWeight: 500
                                }}
                              >
                                {isAr ? "السعر عند الطلب" : "Price on request"}
                              </Typography>
                              <Typography
                                sx={{
                                  color: accentColor,
                                  fontWeight: 700,
                                  fontSize: "1.05rem",
                                  fontFamily: "var(--heading-font)"
                                }}
                              >
                                {item.price}
                              </Typography>
                            </Stack>
                          </Box>
                        </Box>

                        {/* Chef's Secret Overlay on Hover */}
                        <Box
                          className="hover-overlay"
                          sx={{
                            position: "absolute",
                            inset: 0,
                            bgcolor: "rgba(253, 251, 248, 0.98)",
                            zIndex: 10,
                            opacity: 0,
                            transition: "opacity 0.4s ease",
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "center",
                            alignItems: "center",
                            p: 4,
                            textAlign: "center",
                            border: `1.5px solid ${accentColor}`,
                            borderRadius: 0
                          }}
                        >
                          <FormatQuoteIcon sx={{ color: accentColor, fontSize: 32, mb: 1 }} />
                          <Typography
                            sx={{
                              color: accentColor,
                              fontWeight: 900,
                              fontSize: "0.8rem",
                              letterSpacing: "0.15em",
                              textTransform: "uppercase",
                              mb: 1.5,
                              fontFamily: "Cairo, sans-serif"
                            }}
                          >
                            {isAr ? "سر الشيف" : "Chef's Secret"}
                          </Typography>
                          <Typography
                            sx={{
                              fontFamily: "var(--heading-font)",
                              fontStyle: "italic",
                              fontSize: "1.1rem",
                              lineHeight: 1.6,
                              color: charcoalText,
                              mb: 2.5,
                              px: 1
                            }}
                          >
                            {item.note}
                          </Typography>
                          <Box
                            sx={{
                              width: "30px",
                              height: "1px",
                              bgcolor: "rgba(44, 37, 34, 0.2)",
                              mb: 2
                            }}
                          />
                          <Typography
                            sx={{
                              fontSize: "0.75rem",
                              color: "rgba(44, 37, 34, 0.5)",
                              fontStyle: "italic"
                            }}
                          >
                            {isAr ? "تحضير فني طازج يومياً" : "Artisanal preparation daily"}
                          </Typography>
                        </Box>

                      </Box>
                    );
                  })}
                </Box>
              </AnimatePresence>
            </Container>
          </Box>
          
{/* ==================== 6. JASMINE AMBIANCE GALLERY ( exposed horizontal track ) ==================== */}
          <Box ref={terraceSectionRef} sx={{ bgcolor: cardBg, py: { xs: 12, md: 16 }, borderY: "1.5px solid rgba(44,37,34,0.06)" }}>
            <Container maxWidth="xl">
              <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 6, px: { md: 4 } }} dir={isAr ? "rtl" : "ltr"}>
                <Box>
                  <Typography variant="overline" sx={{ color: accentColor, fontWeight: 900, letterSpacing: "0.2em" }}>
                    VISUAL PORTFOLIO
                  </Typography>
                  <Typography variant="h2" sx={{ fontFamily: "var(--heading-font)", textTransform: "uppercase", fontSize: { xs: "2.2rem", md: "3.5rem" }, mt: 1 }}>
                    {t.ambianceHeader}
                  </Typography>
                </Box>

                <Stack direction="row" spacing={1.5}>
                  <Button
                    onClick={() => scrollTerrace("left", vilamoreScrollRef)}
                    sx={{
                      border: `2px solid ${accentColor}`,
                      color: accentColor,
                      minWidth: 50,
                      py: 1.5,
                      borderRadius: "12px",
                      transition: "all 0.3s",
                      "&:hover": { bgcolor: accentColor, color: "#ffffff" }
                    }}
                  >
                    {isAr ? <ChevronRightIcon /> : <ChevronLeftIcon />}
                  </Button>
                  <Button
                    onClick={() => scrollTerrace("right", vilamoreScrollRef)}
                    sx={{
                      border: `2px solid ${accentColor}`,
                      color: accentColor,
                      minWidth: 50,
                      py: 1.5,
                      borderRadius: "12px",
                      transition: "all 0.3s",
                      "&:hover": { bgcolor: accentColor, color: "#ffffff" }
                    }}
                  >
                    {isAr ? <ChevronLeftIcon /> : <ChevronRightIcon />}
                  </Button>
                </Stack>
              </Stack>

              <Box
                ref={vilamoreScrollRef}
                sx={{
                  display: "flex",
                  overflowX: "auto",
                  gap: 4,
                  pb: 3,
                  px: { md: 4 },
                  scrollBehavior: "smooth",
                  "&::-webkit-scrollbar": { height: "6px" },
                  "&::-webkit-scrollbar-thumb": { backgroundColor: accentColor, borderRadius: "3px" }
                }}
                dir={isAr ? "rtl" : "ltr"}
              >
                {[
                  {
                    img: "/brand/vilamore-bg.jpg",
                    title: isAr ? "تراس الياسمين المركزي" : "Central Jasmin Courtyard",
                    subtitle: isAr ? "النوافير التقليدية وأقواس الياسمين الفواح" : "Traditional fountains & jasmine arches"
                  },
                  {
                    img: "/brand/vilamore-kebab.jpg",
                    title: isAr ? "فرن الطين التقليدي" : "Clay Oven baking pit",
                    subtitle: isAr ? "الخبز الطازج والشواء على نار حطب الزيتون" : "Slow pit wood roasting fire"
                  },
                  {
                    img: "/brand/hero-woman.jpg",
                    title: isAr ? "الأركان الحجرية الدافئة" : "Intimate Stone Alcoves",
                    subtitle: isAr ? "تصميم معماري يحاكي البيوت الدمشقية العريقة" : "Heritage architecture layout"
                  },
                  {
                    img: "/brand/hero-unisex-perfume.jpg",
                    title: isAr ? "الممرات والقباب الذهبية" : "Grand Mall Archways",
                    subtitle: isAr ? "تحت القباب الذهبية الفاخرة للمول" : "Under the golden vaults"
                  }
                ].map((slide, idx) => (
                  <Box key={idx} sx={{ flexShrink: 0, width: { xs: "310px", sm: "440px" }, bgcolor: beigeBg, p: 2, border: "1px solid rgba(0,0,0,0.03)", borderRadius: "20px" }}>
                    <Box sx={{ overflow: "hidden", height: 320, mb: 2, borderRadius: "12px" }}>
                      <Box
                        component="img"
                        src={slide.img}
                        alt={slide.title}
                        sx={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                          transition: "transform 0.8s ease",
                          "&:hover": { transform: "scale(1.05)" }
                        }}
                      />
                    </Box>
                    <Typography sx={{ fontFamily: "var(--heading-font)", fontSize: "1.4rem", fontWeight: 700, mb: 0.5 }}>
                      {slide.title}
                    </Typography>
                    <Typography sx={{ fontSize: 13.5, opacity: 0.6 }}>
                      {slide.subtitle}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Container>
          </Box>


          {/* ==================== 7. LOCATION & MAP INFO ==================== */}
          <Box ref={locationSectionRef} sx={{ py: { xs: 12, md: 16 } }}>
            <Container maxWidth="lg">
              <Box sx={{ textAlign: "center", mb: 10 }}>
                <Typography variant="overline" sx={{ color: accentColor, fontWeight: 900, letterSpacing: "0.2em", mb: 2, display: "block" }}>
                  BOULEVARD LOCATION
                </Typography>
                <Typography variant="h2" sx={{ fontFamily: "var(--heading-font)", fontWeight: 700, fontSize: { xs: "2.5rem", md: "4rem" }, color: charcoalText }}>
                  {t.location}
                </Typography>
              </Box>

              <Grid container spacing={6} dir={isAr ? "rtl" : "ltr"}>
                <Grid size={{ xs: 12, md: 5 }}>
                  <Stack spacing={5} sx={{ textAlign: isAr ? "right" : "left", pt: 2 }}>
                    
                    <Stack direction="row" spacing={3} alignItems="flex-start" dir={isAr ? "rtl" : "ltr"}>
                      <Box sx={{ bgcolor: "rgba(203, 97, 22, 0.08)", p: 1.5, borderRadius: "10px" }}>
                        <LocationOnIcon sx={{ color: accentColor, fontSize: 28 }} />
                      </Box>
                      <Box>
                        <Typography sx={{ fontFamily: "var(--heading-font)", fontWeight: 700, fontSize: "1.25rem", mb: 1 }}>
                          {isAr ? "العنوان" : "Address"}
                        </Typography>
                        <Typography sx={{ fontSize: 15, color: "rgba(44,37,34,0.8)", lineHeight: 1.6 }}>
                          {t.vilamoreLocVal}
                        </Typography>
                      </Box>
                    </Stack>

                    <Stack direction="row" spacing={3} alignItems="flex-start" dir={isAr ? "rtl" : "ltr"}>
                      <Box sx={{ bgcolor: "rgba(203, 97, 22, 0.08)", p: 1.5, borderRadius: "10px" }}>
                        <AccessTimeIcon sx={{ color: accentColor, fontSize: 28 }} />
                      </Box>
                      <Box>
                        <Typography sx={{ fontFamily: "var(--heading-font)", fontWeight: 700, fontSize: "1.25rem", mb: 1 }}>
                          {t.hours}
                        </Typography>
                        <Typography sx={{ fontSize: 15, color: "rgba(44,37,34,0.8)" }}>
                          {t.hoursVal}
                        </Typography>
                      </Box>
                    </Stack>

                    <Stack direction="row" spacing={3} alignItems="flex-start" dir={isAr ? "rtl" : "ltr"}>
                      <Box sx={{ bgcolor: "rgba(203, 97, 22, 0.08)", p: 1.5, borderRadius: "10px" }}>
                        <PhoneIcon sx={{ color: accentColor, fontSize: 28 }} />
                      </Box>
                      <Box>
                        <Typography sx={{ fontFamily: "var(--heading-font)", fontWeight: 700, fontSize: "1.25rem", mb: 1 }}>
                          {t.contact}
                        </Typography>
                        <Typography sx={{ fontSize: 15, color: "rgba(44,37,34,0.8)", fontWeight: 700 }}>
                          {t.contactVal}
                        </Typography>
                      </Box>
                    </Stack>

                  </Stack>
                </Grid>

                {/* Google Map Grayscale iframe container */}
                <Grid size={{ xs: 12, md: 7 }}>
                  <Box sx={{ width: "100%", height: "420px", border: "1.5px solid rgba(44,37,34,0.08)", p: 1, bgcolor: cardBg, boxShadow: "0 15px 35px rgba(0,0,0,0.04)", borderRadius: "20px", overflow: "hidden" }}>
                    <iframe
                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3321.308945624108!2d36.2765373!3d33.5138245!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1518e6dc413cc6a7%3A0x6b6d51c784742e9!2sDamascus%2C%20Syria!5e0!3m2!1sen!2sae!4v1700000000000!5m2!1sen!2sae"
                      width="100%"
                      height="100%"
                      style={{ border: 0, borderRadius: "12px" }}
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                    />
                  </Box>
                </Grid>
              </Grid>
            </Container>
          </Box>

        </Box>
      </ThemeProvider>
    );
  }

  // 2. THE ESPRESSO LAB DESIGN: MINIMALIST PORTFOLIO WITH SCANDINAVIAN WHITE & BOLD TYPOGRAPHY
  const espressoTheme = createTheme({
    palette: {
      primary: { main: "#000000" },
      background: { default: "#FFFFFF", paper: "#FFFFFF" },
      text: { primary: "#000000", secondary: "rgba(0,0,0,0.6)" }
    },
    typography: {
      fontFamily: 'Cairo, sans-serif'
    }
  });

  const oppositeLang = isAr ? "en" : "ar";
  const oppositeLangPath = `/dining/the-espresso-lab/${oppositeLang}`;

  const backHref = useMemo(() => {
    const rawLink = initialSanityData?.backButtonLink || "/dining";
    if (rawLink === "/dining") {
      return `/category/dining/${lang}`;
    }
    if (rawLink === "/" || rawLink === "/home") {
      return `/${lang}`;
    }
    if (rawLink.startsWith("/dining") && !rawLink.endsWith("/ar") && !rawLink.endsWith("/en")) {
      return `${rawLink}/${lang}`;
    }
    return rawLink;
  }, [initialSanityData?.backButtonLink, lang]);

  return (
    <ThemeProvider theme={espressoTheme}>
      <Box sx={{ bgcolor: "#FFFFFF", color: "#000000", minHeight: "100vh", pb: 15, overflowX: "hidden", pt: "100px", position: "relative" }}>
        
        {/* ==================== THE ESPRESSO LAB HEADER ==================== */}
        
        {/* Desktop Fixed Navigation Buttons (Locks to sides, centered wordmark) */}
        <Box
          component={motion.div}
          animate={{ y: headerVisible ? 0 : -120 }}
          transition={{ type: "spring", stiffness: 100, damping: 18 }}
          sx={{
            display: { xs: "none", md: "block" },
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            height: "100px",
            zIndex: 999,
            bgcolor: headerScrolled ? "rgba(255, 255, 255, 0.95)" : "transparent",
            backdropFilter: headerScrolled ? "blur(12px)" : "none",
            borderBottom: headerScrolled ? "1px solid rgba(0, 0, 0, 0.08)" : "none",
            transition: "background-color 0.3s, border-bottom 0.3s, opacity 0.2s",
            opacity: drawerOpen ? 0 : 1,
            pointerEvents: drawerOpen ? "none" : "auto"
          }}
        >
          {/* Left side: MENU Drawer Button */}
          <Box
            component={motion.div}
            onClick={() => setDrawerOpen(true)}
            sx={{
              position: "absolute",
              top: "50%",
              left: { md: 16, lg: 60 },
              transform: "translateY(-50%)",
              zIndex: 999,
              bgcolor: "#000000",
              color: "#ffffff",
              border: "2px solid #ffffff",
              borderRadius: "16px",
              px: { md: 3, lg: 5 },
              py: { md: 1.5, lg: 2 },
              cursor: "pointer",
              boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
              display: "flex",
              alignItems: "center",
              gap: 1.5,
              transition: "background-color 0.2s, color 0.2s, border-color 0.2s",
              "&:hover": {
                bgcolor: "#333333"
              }
            }}
          >
            <MenuIcon sx={{ fontSize: 20 }} />
            <Typography sx={{ fontFamily: "Cairo, sans-serif", fontWeight: 700, fontSize: { md: "0.95rem", lg: "1.1rem" }, letterSpacing: lang === "ar" ? 0 : "0.1em" }}>
              {t.menuText}
            </Typography>
          </Box>

          {/* Center Logo/Branding PNG */}
          <Box
            component={Link}
            href={lang === "ar" ? "/ar" : "/en"}
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              zIndex: 999
            }}
          >
            <Box 
              component="img" 
              src={resolvedLogoUrl} 
              alt="Logo" 
              sx={{ 
                height: { 
                  md: `${initialSanityData?.logoHeight || 50}px` 
                },
                // maxHeight: { md: "50px", lg: "70px" },
                maxWidth: { md: "140px", lg: "220px" },
                width: initialSanityData?.logoWidth ? `${initialSanityData.logoWidth}px` : "auto",
                objectFit: "contain",
                display: "block" 
              }} 
            />
          </Box>

          {/* Right side: Language Switch, HOME Button, & VISIT US Anchor with flex gap spacing */}
          <Stack
            direction="row"
            sx={{
              position: "absolute",
              top: "50%",
              right: { md: 16, lg: 60 },
              transform: "translateY(-50%)",
              zIndex: 999,
              display: "flex",
              flexDirection: "row",
              gap: { md: 1, lg: 2 },
              alignItems: "center"
            }}
          >
            {/* Back to Dining page */}
            <Box
              component={Link}
              href={backHref}
              sx={{
                bgcolor: "#ffffff",
                color: "#000000",
                border: `1.5px solid #000000`,
                borderRadius: "16px",
                px: { md: 2, lg: 4 },
                py: { md: 1.2, lg: 1.8 },
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 1,
                boxShadow: "0 6px 18px rgba(0,0,0,0.06)",
                fontFamily: "Cairo, sans-serif",
                fontWeight: 700,
                textTransform: "uppercase",
                fontSize: { md: "0.8rem", lg: "0.9rem" },
                transition: "background-color 0.2s, color 0.2s, border-color 0.2s",
                "&:hover": {
                  bgcolor: "#000000",
                  color: "#ffffff"
                }
              }}
            >
              {getVal(initialSanityData?.backButtonLabel, isAr ? "العودة للمطاعم" : "BACK TO DINING")}
            </Box>

            {/* Language Switch */}
            <Box
              component={Link}
              href={oppositeLangPath}
              sx={{
                bgcolor: "#ffffff",
                color: "#000000",
                border: `1.5px solid #000000`,
                borderRadius: "16px",
                px: { md: 2, lg: 4 },
                py: { md: 1.2, lg: 1.8 },
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 1.5,
                boxShadow: "0 6px 18px rgba(0,0,0,0.06)",
                fontFamily: "Cairo, sans-serif",
                fontWeight: 700,
                textTransform: "uppercase",
                fontSize: { md: "0.8rem", lg: "0.9rem" },
                transition: "background-color 0.2s, color 0.2s, border-color 0.2s",
                "&:hover": {
                  bgcolor: "#000000",
                  color: "#ffffff"
                }
              }}
            >
              <Box 
                component="img" 
                src={lang === "en" ? "https://flagcdn.com/w40/sy.png" : "https://flagcdn.com/w40/gb.png"} 
                alt={lang === "en" ? "Syria Flag" : "UK Flag"}
                sx={{ width: 22, height: 15, objectFit: "cover", borderRadius: "2px" }}
              />
              <Box component="span" sx={{ display: { md: "none", lg: "inline" } }}>
                {t.langToggleText}
              </Box>
            </Box>

            {/* VISIT US Link */}
            <Box
              onClick={() => {
                const link = initialSanityData?.visitUsButtonLink;
                if (link && !link.startsWith("#")) {
                  window.location.href = link;
                } else {
                  handleScrollToSection(locationSectionRef);
                }
              }}
              sx={{
                bgcolor: "#ffffff",
                color: "#000000",
                border: `2px solid #000000`,
                borderRadius: "16px",
                px: { md: 3, lg: 5 },
                py: { md: 1.2, lg: 1.8 },
                cursor: "pointer",
                boxShadow: "0 6px 18px rgba(0,0,0,0.08)",
                fontFamily: "Cairo, sans-serif",
                fontWeight: 700,
                fontSize: { md: "0.80rem", lg: "0.95rem" },
                letterSpacing: "0.05em",
                transition: "background-color 0.2s, color 0.2s, border-color 0.2s",
                "&:hover": {
                  bgcolor: "#000000",
                  color: "#ffffff"
                }
              }}
            >
              {getVal(initialSanityData?.visitUsButtonLabel, isAr ? "اتصل بنا" : "VISIT US")}
            </Box>
          </Stack>
        </Box>

        {/* Mobile Top Sticky Navigation Bar */}
        <Box
          component={motion.div}
          animate={{ y: headerVisible ? 0 : -80 }}
          transition={{ type: "spring", stiffness: 100, damping: 18 }}
          sx={{
            display: { xs: "flex", md: "none" },
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            zIndex: 1100,
            bgcolor: headerScrolled ? "rgba(255, 255, 255, 0.95)" : "transparent",
            backdropFilter: headerScrolled ? "blur(8px)" : "none",
            borderBottom: headerScrolled ? "1px solid rgba(0, 0, 0, 0.08)" : "none",
            justifyContent: "space-between",
            alignItems: "center",
            px: 2,
            py: 2,
            transition: "background-color 0.3s, border-bottom 0.3s, opacity 0.2s",
            opacity: drawerOpen ? 0 : 1,
            pointerEvents: drawerOpen ? "none" : "auto"
          }}
        >
          <IconButton 
            onClick={() => setDrawerOpen(true)} 
            sx={{ 
              color: "#ffffff", 
              bgcolor: headerScrolled ? "rgba(0, 0, 0, 0.75)" : "rgba(0, 0, 0, 0.4)",
              borderRadius: "50%",
              width: 44,
              height: 44,
              zIndex: 10,
              transition: "background-color 0.3s, color 0.3s",
              "&:hover": {
                bgcolor: "#333333"
              }
            }}
          >
            <MenuIcon sx={{ fontSize: 24 }} />
          </IconButton>

          {/* Mobile Center Logo PNG */}
          <Box
            component={Link}
            href={lang === "ar" ? "/ar" : "/en"}
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            <Box 
              component="img" 
              src={resolvedLogoUrl} 
              alt="Logo" 
              sx={{ 
                height: `${initialSanityData?.logoHeightMobile || 30}px`,
                // maxHeight: "32px",
                maxWidth: { xs: "90px", sm: "140px" },
                width: "auto",
                objectFit: "contain",
                display: "block" 
              }} 
            />
          </Box>

          <Stack direction="row" spacing={1}>
            <Box
              component={Link}
              href={backHref}
              sx={{
                bgcolor: "#ffffff",
                color: "#000000",
                border: "1px solid rgba(0,0,0,0.2)",
                borderRadius: "8px",
                px: { xs: 1, sm: 1.5 },
                py: 0.6,
                fontSize: "0.75rem",
                fontWeight: 700,
                fontFamily: "Cairo, sans-serif",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                minWidth: { xs: 32, sm: "auto" },
                height: 32
              }}
            >
              <Box component="span" sx={{ display: { xs: "none", sm: "inline" } }}>
                {getVal(initialSanityData?.backButtonLabel, isAr ? "العودة" : "BACK")}
              </Box>
              <Box component="span" sx={{ display: { xs: "inline-flex", sm: "none" }, alignItems: "center" }}>
                {lang === "ar" ? <ArrowForwardIcon sx={{ fontSize: 16 }} /> : <ArrowBackIcon sx={{ fontSize: 16 }} />}
              </Box>
            </Box>
            <Box
              component={Link}
              href={oppositeLangPath}
              sx={{
                bgcolor: "#ffffff",
                color: "#000000",
                border: "1px solid rgba(0,0,0,0.2)",
                borderRadius: "8px",
                px: { xs: 1, sm: 1.5 },
                py: 0.6,
                fontSize: "0.75rem",
                fontWeight: 700,
                fontFamily: "Cairo, sans-serif",
                display: "flex",
                alignItems: "center",
                gap: 0.5,
                minWidth: { xs: 32, sm: "auto" },
                height: 32
              }}
            >
              <Box 
                component="img" 
                src={lang === "en" ? "https://flagcdn.com/w40/sy.png" : "https://flagcdn.com/w40/gb.png"} 
                alt={lang === "en" ? "Syria Flag" : "UK Flag"}
                sx={{ width: 18, height: 12, objectFit: "cover", borderRadius: "1px" }}
              />
              <Box component="span" sx={{ display: { xs: "none", sm: "inline" } }}>
                {t.langToggleText}
              </Box>
            </Box>
          </Stack>
        </Box>

        {/* Navigation drawer (Left slide-out Askim style menu) */}
        <Drawer
          anchor={isAr ? "right" : "left"}
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          PaperProps={{
            "data-lenis-prevent": "true",
            sx: {
              width: { xs: "100%", sm: "450px" },
              bgcolor: "#FFFFFF",
              backgroundImage: "none",
              p: 5,
              display: "flex",
              flexDirection: "column",
              borderRight: isAr ? "none" : "1.5px solid rgba(0,0,0,0.1)",
              borderLeft: isAr ? "1.5px solid rgba(0,0,0,0.1)" : "none",
              zIndex: 10000,
              overflowY: "auto",
              maxHeight: "100vh"
            }
          }}
          sx={{ zIndex: 10000 }}
        >
          {/* Drawer Header */}
          <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 8 }}>
            <Box component="img" src={resolvedLogoUrl} alt="Logo" sx={{ height: `${initialSanityData?.logoHeightMobile || 45}px`, objectFit: "contain" }} />
            <IconButton onClick={() => setDrawerOpen(false)} sx={{ color: "#000000", zIndex: 10 }}>
              <CloseIcon sx={{ fontSize: 30 }} />
            </IconButton>
          </Stack>

          {/* Menu Links */}
          <Stack spacing={4} sx={{ my: "auto", py: 4 }}>
            {resolvedHeaderLinks.map((item: any, idx: number) => (
              <Box
                key={idx}
                component={motion.div}
                onClick={item.action}
                sx={{ cursor: "pointer", py: 1, borderBottom: "1px solid rgba(0,0,0,0.06)" }}
              >
                <Typography
                  sx={{
                    fontFamily: "Cairo, sans-serif",
                    fontSize: "2.2rem",
                    fontWeight: 500,
                    color: "#000000",
                    transition: "color 0.2s",
                    "&:hover": { color: "#555555" }
                  }}
                >
                  {item.title}
                </Typography>
              </Box>
            ))}
          </Stack>
        </Drawer>

        {/* Cinematic Asymmetric Hero Section */}
        <Container ref={heroSectionRef} maxWidth="xl" sx={{ py: { xs: 8, md: 16 }, pt: { xs: 12, md: 20 } }}>
          <Grid container spacing={8} alignItems="center" dir={lang === "ar" ? "rtl" : "ltr"}>
            <Grid size={{ xs: 12, md: 7 }}>
              <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }}>
                <Typography sx={{ color: accentColor, fontWeight: 900, fontSize: 14, letterSpacing: "0.3em", textTransform: "uppercase", mb: 3 }}>
                  {isAr ? "ذا اسبريسو لاب" : "THE ESPRESSO LAB"}
                </Typography>
                <Typography variant="h1" sx={{ fontFamily: "var(--heading-font)", fontWeight: 900, fontSize: { xs: "3.5rem", sm: "5rem", md: "7rem" }, lineHeight: 0.95, letterSpacing: "-0.03em", mb: 4 }}>
                  {t.espressoHeroTitle}
                </Typography>
                <Typography sx={{ fontSize: 18, lineHeight: 1.9, color: "rgba(0,0,0,0.65)", maxWidth: "580px" }}>
                  {t.espressoHeroSub}
                </Typography>
              </motion.div>
            </Grid>

            {/* Coffee Showcase Image Grid */}
            <Grid size={{ xs: 12, md: 5 }}>
              <Box
                component={motion.div}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1, delay: 0.3 }}
                sx={{
                  position: "relative",
                  width: "100%",
                  pt: "100%",
                  bgcolor: "#FAFAFA",
                  border: "1px solid rgba(0,0,0,0.08)",
                  borderRadius: "24px",
                  overflow: "hidden",
                  boxShadow: "0 15px 35px rgba(0,0,0,0.03)"
                }}
              >
                <Box
                  component="img"
                  src="/brand/the-espresso-lab-flatwhite.jpg"
                  alt="Precision Coffee Extraction"
                  sx={{ position: "absolute", inset: 12, width: "calc(100% - 24px)", height: "calc(100% - 24px)", objectFit: "cover", borderRadius: "16px" }}
                />
              </Box>
            </Grid>
          </Grid>
        </Container>

        {/* Elegant Quotes Section */}
        <Box sx={{ borderY: "1.5px solid #000000", py: 14, bgcolor: "#FAFAFA" }}>
          <Container maxWidth="md" sx={{ textAlign: "center" }}>
            <Typography sx={{ fontFamily: "Griphorium", fontStyle: "italic", fontSize: { xs: "2rem", md: "3rem" }, lineHeight: 1.4, mb: 4 }}>
              {lang === "ar" ? "«القهوة ليست مجرد شراب، بل هي لغة قائمة بذاتها تُقرب المسافات»" : "“Coffee is a language in itself, extracted carefully to bridge cultures and gather souls.”"}
            </Typography>
            <Typography variant="overline" sx={{ color: accentColor, fontWeight: 900, letterSpacing: "0.2em" }}>
              {isAr ? "شعار ذا اسبريسو لاب" : "THE ESPRESSO LAB SLOGAN"}
            </Typography>
          </Container>
        </Box>

        {/* What makes us special Section */}
        <Container ref={philosophySectionRef} maxWidth="lg" sx={{ py: 16 }}>
          <Grid container spacing={8} alignItems="center" dir={lang === "ar" ? "rtl" : "ltr"}>
            <Grid size={{ xs: 12, md: 5 }}>
              <Box sx={{ border: "1px solid rgba(0,0,0,0.08)", p: 1.5, borderRadius: "24px", overflow: "hidden", boxShadow: "0 15px 35px rgba(0,0,0,0.03)" }}>
                <Box component="img" src="/brand/the-espresso-lab-bg.jpg" alt="Specialty Roaster" sx={{ width: "100%", height: "460px", objectFit: "cover", borderRadius: "16px" }} />
              </Box>
            </Grid>
            
            <Grid size={{ xs: 12, md: 7 }}>
              <Typography variant="overline" sx={{ color: accentColor, fontWeight: 900, letterSpacing: "0.2em", fontSize: 13 }}>
                {isAr ? "معايير التحميص المختص" : "SPECIALTY ROASTING STANDARDS"}
              </Typography>
              <Typography variant="h2" sx={{ fontFamily: "var(--heading-font)", fontWeight: 900, mb: 4, mt: 2, fontSize: { xs: "2.5rem", md: "4rem" }, textTransform: "uppercase", lineHeight: 1.1 }}>
                {lang === "ar" ? "شغف الاستخلاص المتوازن" : "THE PURSUIT OF COFFEE SYMMETRY"}
              </Typography>
              <Typography sx={{ fontSize: 17, lineHeight: 2.1, color: "rgba(0,0,0,0.65)" }}>
                {t.espressoStory}
              </Typography>
            </Grid>
          </Grid>
        </Container>

        {/* Visible Minimal Process Horizontal scroll track */}
        <Container ref={terraceSectionRef} maxWidth="xl" sx={{ py: 16 }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 6, px: { md: 4 } }} dir={lang === "ar" ? "rtl" : "ltr"}>
            <Box>
              <Typography variant="overline" sx={{ color: accentColor, fontWeight: 900, letterSpacing: "0.2em" }}>
                {isAr ? "خطوات التحضير الفنية" : "ARTISANAL TIMELINE"}
              </Typography>
              <Typography variant="h2" sx={{ fontFamily: "var(--heading-font)", fontWeight: 900, textTransform: "uppercase", fontSize: { xs: "2.5rem", md: "3.8rem" }, mt: 1 }}>
                {t.processHeader}
              </Typography>
            </Box>

            <Stack direction="row" spacing={1.5}>
              <Button onClick={() => scrollTerrace("left", espressoScrollRef)} sx={{ border: "1px solid rgba(0,0,0,0.1)", color: "#000000", minWidth: 50, py: 1.5, borderRadius: "12px", "&:hover": { bgcolor: "#000000", color: "#ffffff" } }}>
                <ChevronLeftIcon />
              </Button>
              <Button onClick={() => scrollTerrace("right", espressoScrollRef)} sx={{ border: "1px solid rgba(0,0,0,0.1)", color: "#000000", minWidth: 50, py: 1.5, borderRadius: "12px", "&:hover": { bgcolor: "#000000", color: "#ffffff" } }}>
                <ChevronRightIcon />
              </Button>
            </Stack>
          </Stack>

          <Box
            ref={espressoScrollRef}
            sx={{
              display: "flex",
              overflowX: "auto",
              gap: 4,
              pb: 3,
              px: { md: 4 },
              scrollBehavior: "smooth",
              "&::-webkit-scrollbar": { height: "4px" },
              "&::-webkit-scrollbar-thumb": { backgroundColor: "#000000" }
            }}
            dir={lang === "ar" ? "rtl" : "ltr"}
          >
            {[
              {
                img: "/brand/the-espresso-lab-flatwhite.jpg",
                title: isAr ? "01 / التقطير الدقيق" : "01 / Precision Pour-Over",
                desc: isAr ? "ترشيح المياه بالحرارة المعايرة" : "Temperature calibrated water filtration"
              },
              {
                img: "/brand/the-espresso-lab-bg.jpg",
                title: isAr ? "02 / التحميص المختص" : "02 / Specialty Roasting",
                desc: isAr ? "مراقبة منحنيات التحميص للدفعات الصغيرة" : "Micro-batch profile monitoring"
              },
              {
                img: "/brand/hero-unisex-perfume.jpg",
                title: isAr ? "03 / متناغمات الحلويات" : "03 / Dessert Pairings",
                desc: isAr ? "مواءمة كعكة سان سيباستيان الفاخرة" : "Decadent San Sebastian matching"
              },
              {
                img: "/brand/hero-woman.jpg",
                title: isAr ? "04 / ملاذ التبسيط" : "04 / Minimalist Sanctuary",
                desc: isAr ? "مصمم للعمل الهادئ واجتماعات التصميم" : "Crafted for peaceful work and design meetings"
              }
            ].map((slide, idx) => (
              <Box key={idx} sx={{ flexShrink: 0, width: { xs: "320px", sm: "420px" } }}>
                <Box sx={{ overflow: "hidden", height: 280, mb: 2, border: "1px solid rgba(0,0,0,0.1)", borderRadius: "20px" }}>
                  <Box
                    component="img"
                    src={slide.img}
                    alt={slide.title}
                    sx={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      transition: "transform 0.8s",
                      "&:hover": { transform: "scale(1.06)" }
                    }}
                  />
                </Box>
                <Typography sx={{ fontFamily: "var(--heading-font)", fontWeight: 900, textTransform: "uppercase", fontSize: 14, letterSpacing: "0.08em", mb: 0.5 }}>
                  {slide.title}
                </Typography>
                <Typography sx={{ fontSize: 13, opacity: 0.6 }}>
                  {slide.desc}
                </Typography>
              </Box>
            ))}
          </Box>
        </Container>

        {/* Minimal Board Menu with Category Tabs */}
        <Box ref={menuSectionRef} sx={{ borderY: "1.5px solid #000000", py: 16, bgcolor: "#FAFAFA" }}>
          <Container maxWidth="lg">
            <Box sx={{ textAlign: "center", mb: 8 }}>
              <Typography variant="overline" sx={{ color: accentColor, fontWeight: 900, letterSpacing: "0.25em" }}>
                {isAr ? "قائمة القهوة والتقطير" : "THE BREW LIST"}
              </Typography>
              <Typography variant="h2" sx={{ fontFamily: "var(--heading-font)", fontWeight: 900, textTransform: "uppercase", mt: 1, fontSize: { xs: "2.8rem", md: "4rem" } }}>
                {t.menuHeader}
              </Typography>
            </Box>

            {/* Tabs selector */}
            <Box sx={{ borderBottom: 1, borderColor: "rgba(0,0,0,0.08)", mb: 8, display: "flex", justifyContent: "center" }}>
              <Tabs
                value={espressoActiveTab}
                onChange={(e, val) => setEspressoActiveTab(val)}
                variant="scrollable"
                scrollButtons="auto"
                sx={{
                  "& .MuiTab-root": {
                    fontFamily: "var(--heading-font)",
                    fontSize: "1.25rem",
                    fontWeight: 900,
                    color: "rgba(0,0,0,0.45)",
                    px: 4,
                    pb: 2.5,
                    textTransform: "uppercase",
                    "&.Mui-selected": { color: accentColor }
                  },
                  "& .MuiTabs-indicator": { backgroundColor: accentColor, height: "3px" }
                }}
              >
                {t.espressoMenuTabs.map((tabName: string, idx: number) => (
                  <Tab label={tabName} key={idx} />
                ))}
              </Tabs>
            </Box>

            {/* Grid of Card Items with clean transitions & animations */}
            <AnimatePresence mode="wait">
              <Grid
                container
                spacing={5}
                dir={lang === "ar" ? "rtl" : "ltr"}
                component={motion.div}
                key={espressoActiveTab}
                variants={{
                  hidden: { opacity: 0 },
                  show: {
                    opacity: 1,
                    transition: {
                      staggerChildren: 0.1
                    }
                  }
                }}
                initial="hidden"
                animate="show"
                exit={{ opacity: 0 }}
              >
                {activeEspressoMenuList.map((item: any, idx: number) => (
                  <Grid 
                    size={{ xs: 12, md: 6 }} 
                    key={idx}
                    component={motion.div}
                    variants={{
                      hidden: { opacity: 0, y: 30 },
                      show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.25, 1, 0.5, 1] } }
                    }}
                  >
                    <Card
                      component={motion.div}
                      whileHover={{ y: -8, scale: 1.01 }}
                      transition={{ duration: 0.35, ease: "easeOut" }}
                      sx={{
                        display: "flex",
                        flexDirection: { xs: "column", sm: "row" },
                        bgcolor: cardBg,
                        border: "1px solid rgba(44, 37, 34, 0.08)",
                        borderRadius: "20px",
                        height: "100%",
                        overflow: "hidden",
                        boxShadow: "0 10px 30px rgba(44, 37, 34, 0.03)",
                        transition: "border-color 0.3s, box-shadow 0.3s",
                        "&:hover": {
                          borderColor: accentColor,
                          boxShadow: "0 20px 45px rgba(203, 97, 22, 0.08)"
                        },
                        "&:hover img": {
                          transform: "scale(1.06)"
                        }
                      }}
                    >
                      <Box sx={{ width: { xs: "100%", sm: "200px" }, height: { xs: "220px", sm: "100%" }, minHeight: { sm: "240px" }, position: "relative", overflow: "hidden" }}>
                        <CardMedia
                          component="img"
                          image={item.image}
                          alt={item.name}
                          sx={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                            transition: "transform 0.6s cubic-bezier(0.25, 1, 0.5, 1)"
                          }}
                        />
                        {item.tag && (
                          <Box
                            sx={{
                              position: "absolute",
                              top: 16,
                              left: isAr ? "auto" : 16,
                              right: isAr ? 16 : "auto",
                              bgcolor: "rgba(203, 97, 22, 0.12)",
                              color: accentColor,
                              fontSize: 10,
                              fontWeight: 900,
                              px: 2,
                              py: 0.6,
                              borderRadius: "12px",
                              border: "1px solid rgba(203, 97, 22, 0.2)",
                              fontFamily: "var(--heading-font)",
                              textTransform: "uppercase",
                              letterSpacing: "0.08em",
                              backdropFilter: "blur(4px)"
                            }}
                          >
                            {item.tag}
                          </Box>
                        )}
                      </Box>

                      <CardContent sx={{ flexGrow: 1, p: 4, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                        <Box>
                          <Stack
                            direction="row"
                            justifyContent="space-between"
                            alignItems="baseline"
                            sx={{ mb: 2 }}
                            dir={lang === "ar" ? "rtl" : "ltr"}
                          >
                            <Typography sx={{ fontFamily: "var(--heading-font)", fontWeight: 800, textTransform: "uppercase", fontSize: "1.35rem", letterSpacing: "0.02em", color: charcoalText }}>
                              {item.name}
                            </Typography>
                            <Typography sx={{ color: accentColor, fontWeight: 900, fontSize: "1.25rem", fontFamily: "var(--heading-font)" }}>
                              {item.price}
                            </Typography>
                          </Stack>
                          <Typography sx={{ fontSize: 14.5, lineHeight: 1.8, color: "rgba(44, 37, 34, 0.7)", fontFamily: "Cairo, sans-serif" }}>
                            {item.desc}
                          </Typography>
                        </Box>
                        {item.note && (
                          <Typography 
                            sx={{ 
                              fontSize: 12, 
                              fontStyle: "italic", 
                              color: "rgba(44, 37, 34, 0.55)", 
                              mt: 3, 
                              pt: 2,
                              display: "flex",
                              alignItems: "center",
                              gap: 0.5,
                              borderTop: "1px dashed rgba(44, 37, 34, 0.08)",
                              fontFamily: "Cairo, sans-serif"
                            }}
                          >
                            • {isAr ? item.note.ar || item.note.en : item.note.en || item.note.ar}
                          </Typography>
                        )}
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </AnimatePresence>

          </Container>
        </Box>

        {/* Minimalist Location & Map Card */}
        <Container ref={locationSectionRef} maxWidth="lg" sx={{ pt: 12, textAlign: "center" }}>
          <Box sx={{ mb: 8 }}>
            <Typography variant="overline" sx={{ color: accentColor, fontWeight: 900, letterSpacing: "0.2em", mb: 2, display: "block" }}>
              {isAr ? "تفضل بزيارتنا" : "FIND US"}
            </Typography>
            <Typography variant="h2" sx={{ fontFamily: "var(--heading-font)", fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.05em" }}>
              {t.location}
            </Typography>
          </Box>

          <Grid container spacing={6} dir={lang === "ar" ? "rtl" : "ltr"}>
            <Grid size={{ xs: 12, md: 5 }}>
              <Stack spacing={4} sx={{ textAlign: lang === "ar" ? "right" : "left", pt: 2 }}>
                <Stack direction="row" spacing={2.5} alignItems="flex-start" dir={lang === "ar" ? "rtl" : "ltr"}>
                  <LocationOnIcon sx={{ color: "#000000", fontSize: 28, mt: 0.5 }} />
                  <Box>
                    <Typography sx={{ fontFamily: "var(--heading-font)", fontWeight: 900, fontSize: "1.25rem", mb: 1, textTransform: "uppercase" }}>
                      {lang === "ar" ? "العنوان" : "Address"}
                    </Typography>
                    <Typography sx={{ fontSize: 15, color: "rgba(0,0,0,0.65)", lineHeight: 1.6 }}>
                      {t.espressoLocVal}
                    </Typography>
                  </Box>
                </Stack>

                <Stack direction="row" spacing={2.5} alignItems="flex-start" dir={lang === "ar" ? "rtl" : "ltr"}>
                  <AccessTimeIcon sx={{ color: "#000000", fontSize: 28, mt: 0.5 }} />
                  <Box>
                    <Typography sx={{ fontFamily: "var(--heading-font)", fontWeight: 900, fontSize: "1.25rem", mb: 1, textTransform: "uppercase" }}>
                      {lang === "ar" ? "أوقات العمل" : "Hours"}
                    </Typography>
                    <Typography sx={{ fontSize: 15, color: "rgba(0,0,0,0.65)" }}>
                      {t.hoursVal}
                    </Typography>
                  </Box>
                </Stack>

                <Stack direction="row" spacing={2.5} alignItems="flex-start" dir={lang === "ar" ? "rtl" : "ltr"}>
                  <PhoneIcon sx={{ color: "#000000", fontSize: 28, mt: 0.5 }} />
                  <Box>
                    <Typography sx={{ fontFamily: "var(--heading-font)", fontWeight: 900, fontSize: "1.25rem", mb: 1, textTransform: "uppercase" }}>
                      {lang === "ar" ? "خط الاتصال" : "Contact"}
                    </Typography>
                    <Typography sx={{ fontSize: 15, color: "rgba(0,0,0,0.65)" }}>
                      {t.espressoContactVal}
                    </Typography>
                  </Box>
                </Stack>
              </Stack>
            </Grid>
            {/* Google Map Colorful Iframe */}
            <Grid size={{ xs: 12, md: 7 }}>
              <Box sx={{ width: "100%", height: "400px", border: "1px solid rgba(0,0,0,0.08)", p: 1, bgcolor: "#ffffff", borderRadius: "20px", overflow: "hidden", boxShadow: "0 10px 30px rgba(0,0,0,0.03)" }}>
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3321.308945624108!2d36.2765373!3d33.5138245!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1518e6dc413cc6a7%3A0x6b6d51c784742e9!2sDamascus%2C%20Syria!5e0!3m2!1sen!2sae!4v1700000000000!5m2!1sen!2sae"
                  width="100%"
                  height="100%"
                  style={{ border: 0, borderRadius: "12px" }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </Box>
            </Grid>
          </Grid>
          {/* <Typography sx={{ fontSize: 12, fontStyle: "italic", opacity: 0.5, mt: 10 }}>{t.dubaiRef}</Typography> */}
        </Container>
      </Box>
    </ThemeProvider>
  );
}
