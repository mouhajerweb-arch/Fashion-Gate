import { defineField, defineType } from "sanity";

export const footerSettings = defineType({
  name: "footerSettings",
  title: "Footer Settings",
  type: "document",
  fields: [
    defineField({
      name: "logoImage",
      title: "Footer Logo / Monogram Image",
      type: "image",
      description: "Upload the monogram/logo icon for the footer brand lockup. Falls back to default logo if empty."
    }),
    defineField({
      name: "brandTitle",
      title: "Brand Title (Bilingual)",
      type: "localizedString",
      initialValue: { en: "Fashion Gate", ar: "فاشن غيت" },
      description: "Primary brand name displayed in the footer (e.g. 'Fashion Gate' / 'فاشن غيت')."
    }),
    defineField({
      name: "brandSubtitle",
      title: "Brand Subtitle (Bilingual)",
      type: "localizedString",
      initialValue: { en: "Boulevard Damascus", ar: "بوليفارد دمشق" },
      description: "Subtitle or venue location displayed beneath the brand name (e.g. 'Boulevard Damascus' / 'بوليفارد دمشق')."
    }),
    defineField({ name: "description", title: "Brand Description", type: "localizedText" }),
    defineField({ name: "exploreTitle", title: "Explore Column Title", type: "localizedString", initialValue: { en: "Explore", ar: "استكشف" } }),
    defineField({
      name: "links",
      title: "Quick Links",
      type: "array",
      of: [
        {
          type: "object",
          name: "footerLink",
          fields: [
            defineField({
              name: "isEnabled",
              title: "Enabled",
              type: "boolean",
              initialValue: true
            }),
            defineField({ name: "label", title: "Label", type: "localizedString" }),
            defineField({
              name: "href",
              title: "URL / Anchor Path",
              type: "string",
              options: {
                list: [
                  { title: "Homepage", value: "/" },
                  { title: "About Us", value: "/about" },
                  { title: "Contact Us", value: "/contact" },
                  { title: "Blogs", value: "/blogs" },
                  { title: "Terms & Conditions", value: "/terms" },
                  { title: "Privacy Policy", value: "/privacy" },
                  { title: "Men Section", value: "/men" },
                  { title: "Women Section", value: "/women" },
                  { title: "Designers Section", value: "/designers" },
                  { title: "Perfumes Section", value: "/perfumes" },
                  { title: "Skincare Section", value: "/skincare" },
                  { title: "Dining Section", value: "/dining" },
                  { title: "Women Anchor (#women)", value: "#women" },
                  { title: "Men Anchor (#men)", value: "#men" },
                  { title: "Designers Anchor (#designers)", value: "#designers" }
                ]
              }
            }),
            
            defineField({
              name: "order",
              title: "Display Order",
              type: "number",
              initialValue: 0
            })
          ],
          preview: {
            select: {
              title: "label.en",
              href: "href",
              isEnabled: "isEnabled",
              order: "order"
            },
            prepare(selection) {
              const { title, href, isEnabled, order } = selection;
              const status = isEnabled === false ? "Disabled" : "Active";
              const orderVal = order !== undefined ? order : 0;
              return {
                title: `${title || ""} (${status})`,
                subtitle: `Link: ${href || ""} | Order: ${orderVal}`
              };
            }
          }
        }
      ]
    }),
    defineField({ name: "updatesTitle", title: "Updates Column Title", type: "localizedString", initialValue: { en: "Bespoke Updates", ar: "تحديثات مخصصة" } }),
    defineField({ name: "subscribeText", title: "Subscribe Description Text", type: "localizedText" }),
    defineField({ name: "emailPlaceholder", title: "Email Placeholder Text", type: "localizedString", initialValue: { en: "Email address", ar: "البريد الإلكتروني" } }),
    defineField({ name: "copyright", title: "Copyright Text", type: "localizedString", initialValue: { en: "All rights reserved.", ar: "جميع الحقوق محفوظة." } }),
    defineField({ name: "facebookUrl", title: "Facebook URL", type: "string", initialValue: "#" }),
    defineField({ name: "instagramUrl", title: "Instagram URL", type: "string", initialValue: "#" }),
    defineField({ name: "whatsAppUrl", title: "WhatsApp URL", type: "string", initialValue: "#" }),
    defineField({ name: "floatingWhatsAppUrl", title: "Floating WhatsApp Button URL", type: "string", initialValue: "#" }),
    defineField({ name: "tiktokUrl", title: "TikTok URL", type: "string", initialValue: "#" }),
    defineField({ name: "youtubeUrl", title: "YouTube URL", type: "string", initialValue: "#" }),
    defineField({ name: "pinterestUrl", title: "Pinterest URL", type: "string", initialValue: "#" }),
    defineField({ name: "snapchatUrl", title: "Snapchat URL", type: "string", initialValue: "#" }),
    defineField({ name: "xUrl", title: "X (Twitter) URL", type: "string", initialValue: "#" })
  ],
  preview: {
    prepare() {
      return { title: "Footer Settings" };
    }
  }
});
