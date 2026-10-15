import { defineType, defineField } from "sanity";
import { Mail } from "lucide-react";

export const contactPage = defineType({
  name: "contactPage",
  title: "Contact Page",
  type: "document",
  icon: Mail,
  groups: [
    { name: "hero", title: "Hero Section", default: true },
    { name: "intro", title: "Introduction" },
    { name: "details", title: "Contact Details" },
    { name: "form", title: "Inquiry Form" },
    { name: "success", title: "Success Message" },
    { name: "map", title: "Map Section" },
    { name: "seo", title: "SEO Settings" },
  ],
  fields: [
    // ── HERO SECTION ──
    defineField({
      name: "heroImage",
      title: "Hero Background Image",
      description: "Full-width background image for hero banner",
      type: "image",
      options: { hotspot: true },
      group: "hero",
    }),
    defineField({
      name: "heroCursive",
      title: "Subheadline (Cursive)",
      description: "Handwritten cursive text above headline (e.g. 'We would love to hear from you')",
      type: "localizedString",
      group: "hero",
    }),
    defineField({
      name: "title",
      title: "Headline",
      description: "Main uppercase headline (e.g. 'GET IN TOUCH' / 'Contact the Atelier')",
      type: "localizedString",
      group: "hero",
    }),
    defineField({
      name: "headline",
      title: "Headline (Alias)",
      description: "Alternative headline field if used",
      type: "localizedString",
      group: "hero",
    }),
    defineField({
      name: "subheadline",
      title: "Subheadline (Alias)",
      description: "Alternative subheadline field if used",
      type: "localizedString",
      group: "hero",
    }),
    defineField({
      name: "eyebrow",
      title: "Eyebrow Badge",
      description: "Small badge text above title",
      type: "localizedString",
      group: "hero",
    }),

    // ── INTRODUCTION ──
    defineField({
      name: "subtitle",
      title: "Introduction Paragraph",
      description: "Introductory paragraph explaining concierge & atelier services",
      type: "localizedText",
      group: "intro",
    }),

    // ── CONTACT DETAILS ──
    defineField({
      name: "locationTitle",
      title: "Location Card Title",
      type: "localizedString",
      group: "details",
    }),
    defineField({
      name: "addressLabel",
      title: "Address Label",
      type: "localizedString",
      group: "details",
    }),
    defineField({
      name: "addressValue",
      title: "Address Text",
      type: "localizedText",
      group: "details",
    }),

    defineField({
      name: "hoursTitle",
      title: "Hours Card Title",
      type: "localizedString",
      group: "details",
    }),
    defineField({
      name: "hoursLabel",
      title: "Hours Label",
      type: "localizedString",
      group: "details",
    }),
    defineField({
      name: "hoursValue",
      title: "Hours Text",
      type: "localizedText",
      group: "details",
    }),

    defineField({
      name: "emailTitle",
      title: "Email Card Title",
      type: "localizedString",
      group: "details",
    }),
    defineField({
      name: "digitalLabel",
      title: "Digital Concierge Label",
      type: "localizedString",
      group: "details",
    }),
    defineField({
      name: "digitalValue",
      title: "Email Address",
      type: "string",
      group: "details",
    }),

    defineField({
      name: "whatsappTitle",
      title: "WhatsApp Card Title",
      type: "localizedString",
      group: "details",
    }),
    defineField({
      name: "whatsappLabel",
      title: "WhatsApp Label",
      type: "localizedString",
      group: "details",
    }),
    defineField({
      name: "whatsappValue",
      title: "WhatsApp Phone Number (Display)",
      type: "string",
      group: "details",
    }),
    defineField({
      name: "whatsappLink",
      title: "WhatsApp Link URL",
      description: "Full click-to-chat URL (e.g. https://wa.me/963930000000)",
      type: "url",
      group: "details",
    }),
    defineField({
      name: "chatConcierge",
      title: "WhatsApp Button Text",
      type: "localizedString",
      group: "details",
    }),

    // ── INQUIRY FORM ──
    defineField({
      name: "formImage",
      title: "Form Section Image",
      type: "image",
      options: { hotspot: true },
      group: "form",
    }),
    defineField({
      name: "formImagePosition",
      title: "Form Image Position (Desktop)",
      description: "CSS object-position percentage used for the modal and contact form image on desktop, e.g. 'center top', '50% 20%', or '20%'.",
      type: "string",
      initialValue: "center top",
      group: "form",
    }),
    defineField({
      name: "formImagePositionMobile",
      title: "Form Image Position (Mobile)",
      description: "CSS object-position percentage used for the modal and contact form image on mobile, e.g. '20%', 'center 20%', or '50% 25%'.",
      type: "string",
      initialValue: "center 20%",
      group: "form",
    }),
    defineField({
      name: "formCursive",
      title: "Form Cursive Accent",
      description: "Cursive text above form title (e.g. 'write to us')",
      type: "localizedString",
      group: "form",
    }),
    defineField({
      name: "formTitle",
      title: "Form Headline",
      type: "localizedString",
      group: "form",
    }),
    defineField({
      name: "formSubtitle",
      title: "Form Subtext",
      type: "localizedString",
      group: "form",
    }),
    defineField({
      name: "fullNameLabel",
      title: "Name Input Label",
      type: "localizedString",
      group: "form",
    }),
    defineField({
      name: "emailLabel",
      title: "Email Input Label",
      type: "localizedString",
      group: "form",
    }),
    defineField({
      name: "phoneLabel",
      title: "Phone Input Label",
      type: "localizedString",
      group: "form",
    }),
    defineField({
      name: "msgLabel",
      title: "Message Input Label",
      type: "localizedString",
      group: "form",
    }),
    defineField({
      name: "sendBtn",
      title: "Submit Button Text",
      type: "localizedString",
      group: "form",
    }),

    // ── SUCCESS MESSAGE ──
    defineField({
      name: "successHeader",
      title: "Success Headline",
      type: "localizedString",
      group: "success",
    }),
    defineField({
      name: "successDesc",
      title: "Success Message Body",
      type: "localizedText",
      group: "success",
    }),
    defineField({
      name: "sendAnother",
      title: "Reset Button Text",
      type: "localizedString",
      group: "success",
    }),

    // ── MAP ──
    defineField({
      name: "mapTitle",
      title: "Map Headline",
      type: "localizedString",
      group: "map",
    }),
    defineField({
      name: "mapEmbedUrl",
      title: "Google Maps Embed URL",
      type: "url",
      group: "map",
    }),

    // ── SEO ──
    defineField({
      name: "seo",
      title: "SEO & Social Sharing Settings",
      type: "seo",
      group: "seo",
    }),
  ],

  initialValue: {
    heroCursive: { en: "We would love to hear from you", ar: "يسعدنا أن نسمع منك" },
    title: { en: "GET IN TOUCH", ar: "تواصل معنا" },
    headline: { en: "GET IN TOUCH", ar: "تواصل معنا" },
    subheadline: { en: "We would love to hear from you", ar: "يسعدنا أن نسمع منك" },
    eyebrow: { en: "CLIENT SERVICES & CONCIERGE", ar: "خدمات العملاء والكونسيرج" },
    subtitle: {
      en: "Whether you're seeking a private viewing, a bespoke consultation, or simply wish to learn more about our collections — our client advisory team at Fashion Gate Boulevard, Damascus, is here to assist you personally.",
      ar: "سواء كنت تبحث عن معاينة خاصة، أو استشارة مخصصة، أو ترغب ببساطة في معرفة المزيد عن مجموعاتنا — فريقنا الاستشاري في فاشن غيت بوليفارد بدمشق جاهز لمساعدتك شخصياً."
    },
    locationTitle: { en: "Visit the Atelier", ar: "زُر الأتيليه" },
    addressLabel: { en: "Atelier location", ar: "موقع الأتيليه" },
    addressValue: { en: "Fashion Gate Boulevard\nDamascus, Syria", ar: "فاشن غيت بوليفارد\nدمشق، سوريا" },
    hoursTitle: { en: "Opening Hours", ar: "ساعات العمل" },
    hoursLabel: { en: "Salon hours", ar: "أوقات الصالون" },
    hoursValue: { en: "Mon – Sat\n11:00 AM – 9:00 PM", ar: "الاثنين – السبت\n١١:٠٠ ص – ٩:٠٠ م" },
    emailTitle: { en: "Email Us", ar: "راسلنا" },
    digitalLabel: { en: "Digital concierge", ar: "الكونسيرج الرقمي" },
    digitalValue: "concierge@fashiongate.sy",
    whatsappTitle: { en: "WhatsApp", ar: "واتساب" },
    whatsappLabel: { en: "Instant chat", ar: "المحادثة الفورية" },
    whatsappValue: "+963 930 000 000",
    whatsappLink: "https://wa.me/963930000000",
    chatConcierge: { en: "Chat with Concierge", ar: "تحدث مع الكونسيرج" },
    formCursive: { en: "write to us", ar: "راسلنا" },
    formTitle: { en: "Send a Message", ar: "أرسل رسالتك" },
    formSubtitle: {
      en: "A personal advisor will be in touch within 24 hours.",
      ar: "سيتواصل معك مستشار شخصي خلال ٢٤ ساعة."
    },
    fullNameLabel: { en: "Your Name", ar: "الاسم الكامل" },
    emailLabel: { en: "Email Address", ar: "البريد الإلكتروني" },
    phoneLabel: { en: "Phone (optional)", ar: "الهاتف (اختياري)" },
    msgLabel: { en: "Your Message", ar: "رسالتك" },
    sendBtn: { en: "Send Message", ar: "إرسال الرسالة" },
    successHeader: { en: "Thank You", ar: "شكراً لك" },
    successDesc: {
      en: "We've received your message and will respond shortly.",
      ar: "تم استلام رسالتك وسنتواصل معك قريباً."
    },
    sendAnother: { en: "Send Another", ar: "إرسال رسالة أخرى" },
    mapTitle: { en: "Find the Atelier", ar: "موقع الأتيليه" },
    mapEmbedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d26615.11111111111!2d36.2750!3d33.5130!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1518e6dc413cc6a7%3A0x6b9745e5d31518f!2sDamascus%2C%20Syria!5e0!3m2!1sen!2s!4v1710000000000!5m2!1sen!2s",
  },

  preview: {
    select: {
      title: "title.en",
      subtitle: "subtitle.en",
      media: "heroImage",
    },
    prepare({ title, subtitle, media }) {
      return {
        title: title || "Contact Page",
        subtitle: subtitle ? subtitle.substring(0, 80) + "..." : "Contact page content",
        media,
      };
    },
  },
});
