"use client";

import { useState, useEffect } from "react";
import { Box, Container, Stack, Typography, IconButton } from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { sanityClient } from "@/lib/sanity";

interface FAQItem {
  q: { en: string; ar: string };
  a: { en: string; ar: string };
}

const faqData: FAQItem[] = [
  {
    q: {
      en: "What is Fashion Gate Mall?",
      ar: "ما هو مول بوابة الأزياء (Fashion Gate Mall)؟"
    },
    a: {
      en: "Fashion Gate Mall is Syria's first international luxury department store. It brings recognized global fashion and lifestyle brands under one roof for the first time in the country, offering a curated retail experience that spans apparel, accessories, and beauty.",
      ar: "بوابة الأزياء هو أول متجر متعدد الأقسام فاخر عالمي في سوريا. يجمع بين أشهر العلامات التجارية العالمية في مجالات الأزياء ولايف ستايل تحت سقف واحد لأول مرة في البلاد، مقدماً تجربة تسوق راقية تشمل الملابس والإكسسوارات ومستحضرات التجميل."
    }
  },
  {
    q: {
      en: "Where is Fashion Gate Mall located?",
      ar: "أين يقع مول بوابة الأزياء؟"
    },
    a: {
      en: "The mall is located on Damascus Boulevard, Syria.",
      ar: "يقع المول على أوتوستراد بوليفارد دمشق، سوريا."
    }
  },
  {
    q: {
      en: "When is the grand opening?",
      ar: "متى سيتم الافتتاح الكبير؟"
    },
    a: {
      en: "Fashion Gate Mall is scheduled to open in early August 2026.",
      ar: "من المقرر افتتاح بوابة الأزياء في أوائل شهر آب (أغسطس) 2026."
    }
  },
  {
    q: {
      en: "Who developed Fashion Gate Mall?",
      ar: "من قام بتطوير مول بوابة الأزياء؟"
    },
    a: {
      en: "The project is developed by Unlimited, a division of Mouhajer International Group. The group is known for its luxury hospitality interior design and fit-out work through Mouhajer International Design and Contracting.",
      ar: "تم تطوير المشروع من قبل شركة Unlimited، وهي ذراع لمجموعة مهاجر الدولية (Mouhajer International Group). وتشتهر المجموعة بأعمال التصميم الداخلي والتجهيز الفاخر لقطاع الضيافة من خلال شركة مهاجر الدولية للتصميم والمقاولات."
    }
  },
  {
    q: {
      en: "Is Fashion Gate Mall really the first of its kind in Syria?",
      ar: "هل مول بوابة الأزياء هو الأول من نوعه فعلاً في سوريا؟"
    },
    a: {
      en: "Yes. It introduces a dedicated international luxury department store format to Syria, moving away from the traditional standalone boutique or marketplace models previously available in the region.",
      ar: "نعم، يقدم المول نموذجاً فريداً ومخصصاً للمتاجر العالمية الكبرى والفاخرة في سوريا، مبتعداً عن نمط البوتيكات الفردية المنفصلة أو الأسواق التقليدية القديمة."
    }
  },
  {
    q: {
      en: "What brands will be available at the mall?",
      ar: "ما هي العلامات التجارية التي ستتوفر في المول؟"
    },
    a: {
      en: "The directory will feature a premium mix of international fashion, lifestyle, and dining options. The confirmed brand lineup includes:\n\n• Luxury Fashion & Haute Couture: Elie Saab, Gucci, Max Mara, Prada, Valentino, and YSL.\n• Contemporary & Premium Apparel: Calvin Klein, Hugo Boss, Giorgio Armani, Paul & Shark, Sandro, and Editorial.\n• Independent & Creative Design: Moje.\n• Footwear & Athletic Lifestyle: Adidas and Skechers.\n• Fine Jewelry & Luxury Timepieces: Cartier.\n• Premium Beauty & Skincare: Lancôme.\n• Luxury Accessories & Leather Goods: Jimmy Choo and Coach.",
      ar: "ستضم قائمة المحلات مزيجاً فاخراً من خيارات الموضة واللايف ستايل والمطاعم العالمية. تشمل التشكيلة المؤكدة:\n\n• الأزياء الفاخرة والراقية: Elie Saab، Gucci، Max Mara، Prada، Valentino، YSL.\n• الملابس المعاصرة والمميزة: Calvin Klein، Hugo Boss، Giorgio Armani، Paul & Shark، Sandro، Editorial.\n• التصميم المستقل: Moje.\n• الأحذية والأنشطة الرياضية: Adidas، Skechers.\n• المجوهرات والساعات الفاخرة: Cartier.\n• الجمال والعناية بالبشرة الفاخرة: Lancôme.\n• الإكسسوارات والمنتجات الجلدية: Jimmy Choo، Coach."
    }
  },
  {
    q: {
      en: "Will there be places to eat and drink at the mall?",
      ar: "هل ستتوفر مطاعم ومقاهٍ في المول؟"
    },
    a: {
      en: "Yes. The mall will feature a dedicated dining and coffee shop integrated into the shopping experience, offering premium cafe options and restaurants for visitors.",
      ar: "نعم، سيضم المول مقاهٍ ومطاعم فاخرة متكاملة مع تجربة التسوق الراقية، لتقديم أفضل خيارات المأكولات والمشروبات للزوار."
    }
  },
  {
    q: {
      en: "What are the operating hours for Fashion Gate Mall?",
      ar: "ما هي أوقات العمل في مول بوابة الأزياء؟"
    },
    a: {
      en: "The mall will operate from 10:00 AM to 10:00 PM on weekdays, with extended hours until midnight on weekends and public holidays. The signature coffee shop and select dining venues may open earlier for breakfast service.",
      ar: "يستقبل المول زواره من الساعة 10:00 صباحاً حتى 10:00 مساءً خلال أيام الأسبوع، مع تمديد ساعات العمل حتى منتصف الليل في عطلات نهاية الأسبوع والأعياد الرسمية. كما قد تفتح المقاهي وصالات الطعام المختارة مبكراً لتقديم خدمة الفطور."
    }
  },
  {
    q: {
      en: "Will there be parking facilities available at Damascus Boulevard?",
      ar: "هل تتوفر مواقف للسيارات في بوليفارد دمشق؟"
    },
    a: {
      en: "Yes. Fashion Gate Mall features a dedicated, secure parking structure with ample spaces for visitors, including premium valet parking services and designated spots for electric vehicle charging.",
      ar: "نعم، يوفر المول مواقف سيارات آمنة ومخصصة مع مساحات واسعة تتسع لجميع الزوار، بما في ذلك خدمة صف السيارات الفاخرة (Valet) ومواقف مخصصة لشحن السيارات الكهربائية."
    }
  },
  {
    q: {
      en: "Does the mall offer personal shopping or concierge services?",
      ar: "هل يقدم المول خدمات التسوق الشخصي أو الكونسيرج؟"
    },
    a: {
      en: "To ensure an elevated luxury experience, Fashion Gate provides personalized concierge services, including personal styling assistants, hands-free shopping delivery, and VIP lounge access for registered guests.",
      ar: "لضمان تجربة تسوق بالغة الفخامة والرفاهية، يوفر المول خدمات كونسيرج مخصصة بالكامل تشمل مساعدي تسوق وتنسيق مظهر شخصيين، توصيل المشتريات بدون حمل اليدين، ودخول صالات كبار الشخصيات (VIP Lounge) الحصرية للضيوف المسجلين."
    }
  }
];

export default function FaqSection({ lang }: { lang: "ar" | "en" }) {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const [faqs, setFaqs] = useState<any[]>([]);

  useEffect(() => {
    sanityClient.fetch('*[_type == "faq"] | order(order asc)')
      .then((data) => {
        if (data && data.length > 0) {
          setFaqs(data);
        }
      })
      .catch((err) => console.error("Error loading FAQs:", err));
  }, []);

  const handleToggle = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  const resolvedFaqs = faqs.length > 0 ? faqs.map(item => ({
    questionText: lang === "ar" ? item.question?.ar || item.question?.en : item.question?.en || item.question?.ar,
    answerText: lang === "ar" ? item.answer?.ar || item.answer?.en : item.answer?.en || item.answer?.ar
  })) : faqData.map(item => ({
    questionText: lang === "ar" ? item.q.ar : item.q.en,
    answerText: lang === "ar" ? item.a.ar : item.a.en
  }));

  return (
    <Box
      component="section"
      id="faq-section"
      sx={{
        py: { xs: 8, md: 12 },
        bgcolor: "#ffffff",
        borderTop: "1px solid rgba(0,0,0,0.06)",
        position: "relative"
      }}
    >
      <Container maxWidth="lg">
        {/* Title */}
        <Stack spacing={1.5} alignItems="center" sx={{ mb: { xs: 6, md: 9 }, textAlign: "center" }}>
          <Typography
            sx={{
              color: "#CB6116",
              fontSize: 11,
              fontWeight: 800,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              fontFamily: '"Cairo", sans-serif'
            }}
          >
            {lang === "ar" ? "الأسئلة الشائعة" : "Frequently Asked Questions"}
          </Typography>
          <Typography
            sx={{
              fontFamily: "var(--heading-font)",
              fontSize: { xs: 28, md: 38 },
              fontWeight: 500,
              lineHeight:lang === "ar" ?  1.3 : 1.15,
              color: "#111111"
            }}
          >
            {lang === "ar" ? "لديك أسئلة؟ نحن هنا للإجابة" : "Have Questions? We Have Answers"}
          </Typography>
        </Stack>

        {/* FAQ List */}
        <Stack spacing={0}>
          {resolvedFaqs.map((item, idx) => {
            const isExpanded = expandedIndex === idx;
            const questionText = item.questionText || "";
            const answerText = item.answerText || "";

            return (
              <Box
                key={idx}
                sx={{
                  borderBottom: "1px solid rgba(0, 0, 0, 0.08)",
                  transition: "background 0.3s ease",
                  "&:hover": {
                    bgcolor: "rgba(203, 97, 22, 0.015)"
                  }
                }}
              >
                {/* Header/Question Row */}
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                  onClick={() => handleToggle(idx)}
                  sx={{
                    py: { xs: 2.5, md: 3 },
                    px: { xs: 1, md: 2 },
                    cursor: "pointer",
                    userSelect: "none"
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: { xs: 15, md: 17.5 },
                      fontWeight: 600,
                      color: isExpanded ? "#CB6116" : "#111111",
                      transition: "color 0.25s ease",
                      fontFamily: '"Cairo", sans-serif',
                      flex: 1,
                      pr: lang === "en" ? 2 : 0,
                      pl: lang === "ar" ? 2 : 0,
                      textAlign: lang === "ar" ? "right" : "left"
                    }}
                  >
                    {questionText}
                  </Typography>
                  <IconButton
                    size="small"
                    sx={{
                      color: isExpanded ? "#CB6116" : "rgba(0,0,0,0.54)",
                      transform: isExpanded ? "rotate(180deg)" : "none",
                      transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
                    }}
                  >
                    {isExpanded ? <RemoveIcon sx={{ fontSize: 20 }} /> : <AddIcon sx={{ fontSize: 20 }} />}
                  </IconButton>
                </Stack>

                {/* Animated Answer Body */}
                <AnimatePresence initial={false}>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      style={{ overflow: "hidden" }}
                    >
                      <Box
                        sx={{
                          pb: { xs: 3, md: 4 },
                          px: { xs: 1, md: 2 },
                          color: "rgba(0, 0, 0, 0.65)",
                          fontSize: 14.5,
                          lineHeight: 1.8,
                          whiteSpace: "pre-line",
                          fontFamily: '"Cairo", sans-serif',
                          textAlign: lang === "ar" ? "right" : "left"
                        }}
                      >
                        {answerText}
                      </Box>
                    </motion.div>
                  )}
                </AnimatePresence>
              </Box>
            );
          })}
        </Stack>
      </Container>
    </Box>
  );
}
