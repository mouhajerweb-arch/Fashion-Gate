"use client";

import { useMemo } from "react";
import { Box, Button, Stack, Typography, Divider } from "@mui/material";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

import { getLocalizedValue, imageUrl } from "@/lib/sanity";

interface DiningClientProps {
  initialLang: "en" | "ar";
  initialData?: any;
}

export default function DiningClient({ initialLang, initialData }: DiningClientProps) {
  const router = useRouter();
  const lang = initialLang;

  const fallbackData = {
    en: {
      description: "At Fashion Gate Mall Syria, exceptional food and drink is something we take incredibly seriously. That is why we are proud to offer a destination featuring VILAMORE RESTAURANT & CAFE and The Espresso Lab. We have carefully curated these establishments to provide an elevated culinary experience, ensuring that every visit offers both quality and variety. Whether you are looking for a refined meal or a perfect brew, our selection is designed to satisfy the most discerning tastes in a comfortable and sophisticated setting.",
      places: [
        {
          title: "VILAMORE RESTAURANT & CAFE",
          description: "VILAMORE RESTAURANT & CAFE brings a celebrated blend of Syrian and Turkish culinary traditions to our guests, offering an authentic taste of the Levantine region in every bite. We are delighted to announce the grand opening of our newest destination at Fashion Gate Mall Syria. When visiting our new home in Syria, you will find warm lighting, sophisticated comfort, and a menu featuring traditional breakfasts, signature grilled specialties, and rich Mediterranean flavors. We invite you to join us for a beautiful dining experience that celebrates great food and genuine hospitality.",
          image: "/brand/vilamore-bg.jpg",
          logo: "/brand/vilamore-logo.png",
          operatingHoursLabel: "Operating Hours",
          operatingHoursValue: "Daily TBC",
          contactUsLabel: "Contact Us",
          contactUsValue: "TBC",
          buttonText: "EXPLORE MENU",
          redirectionType: "custom",
          buttonPath: "/dining/vilamore",
          showSecondaryButton: true,
          secondaryButtonText: "BOOK A TABLE",
          secondaryButtonPath: "https://wa.me/963119988"
        },
        {
          title: "The Espresso Lab",
          description: "From the vibrant heart of Dubai to the welcoming atmosphere of Fashion Gate Mall Syria, The Espresso Lab brings a refined coffee culture to Syria. We take pride in our dedication to excellence, sourcing premium specialty beans directly from world-renowned origins to ensure a superior cup in every pour. Whether you are pausing for a quiet moment during your shopping day or meeting friends to share our selection of artisanal treats, our cafe provides an inviting space where quality meets passion.",
          image: "/brand/the-espresso-lab-bg.jpg",
          logo: "/brand/the-espresso-lab-logo.png",
          operatingHoursLabel: "Operating Hours",
          operatingHoursValue: "Daily TBC",
          contactUsLabel: "Contact Us",
          contactUsValue: "TBC",
          buttonText: "EXPLORE OUR MENU",
          redirectionType: "custom",
          buttonPath: "/dining/the-espresso-lab",
          showSecondaryButton: false,
          secondaryButtonText: "BOOK A TABLE",
          secondaryButtonPath: "https://wa.me/963119988"
        }
      ]
    },
    ar: {
      description: "في فاشن غيت مول سوريا، نولي اهتماماً بالغاً لتقديم المأكولات والمشروبات الاستثنائية. ولهذا نفخر بتقديم وجهة فريدة تضم مطعم ومقهى فيلامور (VILAMORE RESTAURANT & CAFE) وذا اسبريسو لاب (The Espresso Lab). لقد اخترنا هذه المنشآت بعناية فائقة لنضمن تقديم تجربة طهي راقية ومتنوعة تلبي أرقى الأذواق في أجواء مريحة وفاخرة.",
      places: [
        {
          title: "مطعم ومقهى فيلامور",
          description: "يقدم مطعم ومقهى فيلامور مزيجاً شهيراً من تقاليد الطهي السورية والتركية لضيوفنا، ويقدم طعماً أصيلاً لمنطقة بلاد الشام في كل قضمة. يسعدنا أن نعلن عن الافتتاح الكبير لوجهتنا الأحدث في فاشن غيت مول سوريا. عند زيارة مقرنا الجديد في سوريا، ستجد إضاءة دافئة، وراحة راقية، وقائمة طعام تتميز بالفطور التقليدي، والمشاوي المميزة، والنكهات المتوسطية الغنية. ندعوكم للانضمام إلينا لتجربة طعام جميلة تحتفي بالطعام الرائع والضيافة الأصيلة.",
          image: "/brand/vilamore-bg.jpg",
          logo: "/brand/vilamore-logo.png",
          operatingHoursLabel: "ساعات العمل",
          operatingHoursValue: "يومياً - يحدد لاحقاً",
          contactUsLabel: "اتصل بنا",
          contactUsValue: "يحدد لاحقاً",
          buttonText: "استكشف القائمة",
          redirectionType: "custom",
          buttonPath: "/dining/vilamore",
          showSecondaryButton: true,
          secondaryButtonText: "حجز طاولة",
          secondaryButtonPath: "https://wa.me/963119988"
        },
        {
          title: "ذا اسبريسو لاب",
          description: "من عالم القهوة المختصة إلى قلب فاشن غيت مول سوريا، يقدم مقهى The Espresso Lab تجربة قهوة استثنائية ترتكز على الدقة، والحِرفية، والابتكار. يُحضَّر كل فنجان قهوة بعناية باستخدام أجود أنواع البن المختص المنتقى من أشهر مناطق زراعة القهوة حول العالم، ليُبرز النكهات الأصيلة لكل محصول من خلال أساليب تحميص واستخلاص متقنة. سواء كنتم تبحثون عن لحظة هادئة خلال جولتكم في التسوق أو لقاءٍ يجمعكم مع الأصدقاء حول قهوة مُحضّرة بإتقان ومخبوزات حرفية، يوفر مقهى ذا اسبريسو لاب وجهة تجمع بين الجودة، والإبداع، والشغف.",
          image: "/brand/the-espresso-lab-bg.jpg",
          logo: "/brand/the-espresso-lab-logo.png",
          operatingHoursLabel: "ساعات العمل",
          operatingHoursValue: "يومياً - يحدد لاحقاً",
          contactUsLabel: "اتصل بنا",
          contactUsValue: "يحدد لاحقاً",
          buttonText: "استكشف قائمتنا",
          redirectionType: "custom",
          buttonPath: "/dining/the-espresso-lab",
          showSecondaryButton: false,
          secondaryButtonText: "حجز طاولة",
          secondaryButtonPath: "https://wa.me/963119988"
        }
      ]
    }
  }[lang];

  // Dynamically resolve properties from CMS or fallback
  const description = getLocalizedValue(initialData?.description, lang, fallbackData.description);
  
  const fallbackRestaurant = fallbackData.places[0];
  const fallbackCafe = fallbackData.places[1];

  const getPlacePath = (p: any, fallbackPath: string) => {
    let rawPath = fallbackPath;
    if (p.redirectionType === "reference" && p.pageReference?.restaurantId) {
      rawPath = `/dining/${p.pageReference.restaurantId}/${lang}`;
    } else {
      rawPath = p.buttonPath || fallbackPath;
    }
    if (rawPath.startsWith("/")) {
      let clean = rawPath.replace(/\/(ar|en)$/, "").replace(/\/(ar|en)\//, "/");
      return `${clean}/${lang}`;
    }
    return rawPath;
  };

  const restaurant = useMemo(() => {
    const p = initialData?.restaurantPlace || {};
    return {
      title: getLocalizedValue(p.title, lang, fallbackRestaurant.title),
      description: getLocalizedValue(p.description, lang, fallbackRestaurant.description),
      operatingHoursLabel: getLocalizedValue(p.operatingHoursLabel, lang, fallbackRestaurant.operatingHoursLabel),
      operatingHoursValue: getLocalizedValue(p.operatingHoursValue, lang, fallbackRestaurant.operatingHoursValue),
      contactUsLabel: getLocalizedValue(p.contactUsLabel, lang, fallbackRestaurant.contactUsLabel),
      contactUsValue: getLocalizedValue(p.contactUsValue, lang, fallbackRestaurant.contactUsValue),
      buttonText: getLocalizedValue(p.buttonText, lang, fallbackRestaurant.buttonText),
      buttonPath: getPlacePath(p, fallbackRestaurant.buttonPath),
      image: p.image ? (p.image.asset?.url || imageUrl(p.image).url()) : fallbackRestaurant.image,
      logo: p.logo ? (p.logo.asset?.url || imageUrl(p.logo).url()) : fallbackRestaurant.logo,
      showSecondaryButton: p.showSecondaryButton !== undefined ? p.showSecondaryButton : fallbackRestaurant.showSecondaryButton,
      secondaryButtonText: getLocalizedValue(p.secondaryButtonText, lang, fallbackRestaurant.secondaryButtonText),
      secondaryButtonPath: p.secondaryButtonPath || fallbackRestaurant.secondaryButtonPath
    };
  }, [initialData?.restaurantPlace, lang, fallbackRestaurant]);

  const cafe = useMemo(() => {
    const p = initialData?.cafePlace || {};
    return {
      title: getLocalizedValue(p.title, lang, fallbackCafe.title),
      description: getLocalizedValue(p.description, lang, fallbackCafe.description),
      operatingHoursLabel: getLocalizedValue(p.operatingHoursLabel, lang, fallbackCafe.operatingHoursLabel),
      operatingHoursValue: getLocalizedValue(p.operatingHoursValue, lang, fallbackCafe.operatingHoursValue),
      contactUsLabel: getLocalizedValue(p.contactUsLabel, lang, fallbackCafe.contactUsLabel),
      contactUsValue: getLocalizedValue(p.contactUsValue, lang, fallbackCafe.contactUsValue),
      buttonText: getLocalizedValue(p.buttonText, lang, fallbackCafe.buttonText),
      buttonPath: getPlacePath(p, fallbackCafe.buttonPath),
      image: p.image ? (p.image.asset?.url || imageUrl(p.image).url()) : fallbackCafe.image,
      logo: p.logo ? (p.logo.asset?.url || imageUrl(p.logo).url()) : fallbackCafe.logo,
      showSecondaryButton: p.showSecondaryButton !== undefined ? p.showSecondaryButton : fallbackCafe.showSecondaryButton,
      secondaryButtonText: getLocalizedValue(p.secondaryButtonText, lang, fallbackCafe.secondaryButtonText),
      secondaryButtonPath: p.secondaryButtonPath || fallbackCafe.secondaryButtonPath
    };
  }, [initialData?.cafePlace, lang, fallbackCafe]);

  const places = useMemo(() => [restaurant, cafe], [restaurant, cafe]);

  const handleContainerClick = (path: string) => {
    if (path.startsWith("/")) {
      router.push(path);
    } else {
      const cleanPath = path.replace(/^\/+|\/+$/g, "");
      router.push(`/${cleanPath}/${lang}`);
    }
  };

  return (
    <Box
      dir={lang === "ar" ? "rtl" : "ltr"}
      sx={{
        width: "100%",
        color: "#2C2522",
        fontFamily: '"Cairo", sans-serif'
      }}
    >
      {/* Description Section - Aligned to the Asymmetrical Right Half */}
      <Box
        sx={{
          width: { xs: "100%", md: "50%" },
          marginLeft: lang === "ar" ? 0 : { xs: 0, md: "50%" },
          marginRight: lang === "ar" ? { xs: 0, md: "50%" } : 0,
          mb: { xs: 8, md: 10 },
          mt: 4,
          textAlign: lang === "ar" ? "right" : "left"
        }}
      >
        <Typography
          sx={{
            color: "rgba(0, 0, 0, 0.65)",
            fontSize: { xs: 15, md: 17 },
            fontFamily: '"Cairo", sans-serif',
            lineHeight: 1.9,
            fontWeight: 400
          }}
        >
          {description}
        </Typography>
      </Box>

      {/* Dining Places Cards List */}
      <Stack spacing={{ xs: 6, md: 8 }} sx={{ pb: 6 }}>
        {places.map((place: any, idx: number) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: [0.25, 1, 0.5, 1] }}
          >
            <Box
              onClick={() => handleContainerClick(place.buttonPath)}
              sx={{
                display: "flex",
                flexDirection: { xs: "column", md: idx % 2 === 0 ? "row" : "row-reverse" }, // Restored alternating design exactly!
                bgcolor: "#ffffff",
                border: "1px solid rgba(0, 0, 0, 0.06)",
                overflow: "hidden",
                cursor: "pointer",
                position: "relative",
                transition: "all 0.4s cubic-bezier(0.25, 1, 0.5, 1)",
                "&:hover": {
                  boxShadow: "0 15px 35px rgba(0, 0, 0, 0.04)",
                  borderColor: "rgba(0, 0, 0, 0.12)",
                  "& .place-image": {
                    transform: "scale(1.03)"
                  }
                }
              }}
            >
              {/* Left Side Image Container */}
              <Box
                sx={{
                  width: { xs: "100%", md: "50%" },
                  height: { xs: "300px", sm: "400px", md: "520px" },
                  overflow: "hidden",
                  position: "relative"
                }}
              >
                <Box
                  component="img"
                  src={place.image}
                  alt={place.title}
                  className="place-image"
                  sx={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    transition: "transform 0.6s cubic-bezier(0.25, 1, 0.5, 1)"
                  }}
                />
              </Box>

              {/* Right Side Content Container */}
              <Stack
                spacing={3}
                sx={{
                  width: { xs: "100%", md: "50%" },
                  p: { xs: 4, sm: 6, md: 8 },
                  justifyContent: "center",
                  alignItems: "flex-start",
                  textAlign: lang === "ar" ? "right" : "left"
                }}
              >
                {/* Brand Logo */}
                {place.logo && (
                  <Box
                    component="img"
                    src={place.logo}
                    alt={`${place.title} Logo`}
                    sx={{
                      height: { xs: "50px", md: "65px" },
                      maxWidth: "240px",
                      objectFit: "contain",
                      alignSelf: "flex-start",
                      mb: 1
                    }}
                  />
                )}

                {/* Place Title */}
                <Typography
                  variant="h4"
                  sx={{
                    fontFamily: "Apple Garamond, serif",
                    fontSize: { xs: "24px", sm: "28px", md: "32px" },
                    fontWeight: 500,
                    color: "#111111" // Restored Place Title Visibility to match previous screenshots
                  }}
                >
                  {place.title}
                </Typography>

                {/* Place Description */}
                <Typography
                  sx={{
                    color: "rgba(0, 0, 0, 0.6)",
                    fontSize: "14.5px",
                    lineHeight: 1.8,
                    fontFamily: '"Cairo", sans-serif'
                  }}
                >
                  {place.description}
                </Typography>

                <Divider sx={{ borderColor: "rgba(0, 0, 0, 0.06)", width: "100%", my: 0.5 }} />

                {/* Inline Operating Hours & Contact Info (Restored natural spacing without grid align offsets) */}
                <Stack spacing={1.5} sx={{ width: "100%" }}>
                  {place.operatingHoursValue && (
                    <Typography sx={{ fontSize: "13px", fontFamily: '"Cairo", sans-serif', color: "rgba(0, 0, 0, 0.7)" }}>
                      <Box component="span" sx={{ fontWeight: 700 }}>
                        {place.operatingHoursLabel || (lang === "ar" ? "ساعات العمل:" : "Operating Hours:")}
                      </Box>
                      {" "}{place.operatingHoursValue}
                    </Typography>
                  )}
                  {place.contactUsValue && (
                    <Typography sx={{ fontSize: "13px", fontFamily: '"Cairo", sans-serif', color: "rgba(0, 0, 0, 0.7)" }}>
                      <Box component="span" sx={{ fontWeight: 700 }}>
                        {place.contactUsLabel || (lang === "ar" ? "اتصل بنا:" : "Contact Us:")}
                      </Box>
                      {" "}{place.contactUsValue}
                    </Typography>
                  )}
                </Stack>

                {/* Buttons Stack */}
                <Stack direction="row" spacing={2} sx={{ mt: 3, flexWrap: "wrap", gap: { xs: 1.5, sm: 0 } }}>
                  {place.showSecondaryButton && (
                    <Button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (place.secondaryButtonPath) {
                          window.open(place.secondaryButtonPath, "_blank");
                        }
                      }}
                      sx={{
                        bgcolor: "#111111",
                        color: "#ffffff",
                        px: 4,
                        py: 1.5,
                        fontSize: "12px",
                        fontWeight: 700,
                        border: "1px solid #111111",
                        borderRadius: 0,
                        fontFamily: '"Cairo", sans-serif',
                        textTransform: "uppercase",
                        letterSpacing: "0.1em",
                        transition: "all 0.3s ease",
                        "&:hover": {
                          bgcolor: "transparent",
                          color: "#111111"
                        }
                      }}
                    >
                      {place.secondaryButtonText || (lang === "ar" ? "حجز طاولة" : "BOOK A TABLE")}
                    </Button>
                  )}
                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleContainerClick(place.buttonPath);
                    }}
                    variant="outlined"
                    sx={{
                      borderColor: "#111111",
                      color: "#111111",
                      px: 4,
                      py: 1.5,
                      fontSize: "12px",
                      fontWeight: 700,
                      borderRadius: 0,
                      fontFamily: '"Cairo", sans-serif',
                      textTransform: "uppercase",
                      letterSpacing: "0.1em",
                      transition: "all 0.3s ease",
                      "&:hover": {
                        bgcolor: "#111111",
                        color: "#ffffff",
                        borderColor: "#111111"
                      }
                    }}
                  >
                    {place.buttonText || (lang === "ar" ? "استكشف القائمة" : "EXPLORE MENU")}
                  </Button>
                </Stack>
              </Stack>
            </Box>
          </motion.div>
        ))}
      </Stack>
    </Box>
  );
}
