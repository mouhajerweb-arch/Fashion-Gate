import { defineField, defineType } from "sanity";

export const siteSettings = defineType({
  name: "siteSettings",
  title: "Site Settings",
  type: "document",
  fields: [
    defineField({ name: "title", title: "Site Title", type: "string", initialValue: "Fashion Gate" }),
    defineField({ name: "tagline", title: "Tagline", type: "string" }),
    defineField({ name: "logo", title: "Logo", type: "image", options: { hotspot: true } }),
    defineField({ name: "primaryColor", title: "Primary Color", type: "string", initialValue: "#CB6116" }),
    defineField({ name: "accentColor", title: "Accent Color", type: "string", initialValue: "#D06010" }),
    defineField({ name: "headingFont", title: "Heading Font", type: "string", initialValue: "Apple Garamond" }),
    defineField({ name: "bodyFont", title: "Body Font", type: "string", initialValue: "Cairo" }),
    defineField({
      name: "navigation",
      title: "Floating Menu",
      type: "array",
      of: [{ type: "reference", to: [{ type: "menuItem" }] }]
    }),
    defineField({ name: "socialLabel", title: "Social Label", type: "string" }),
    defineField({ name: "socialUrl", title: "Social URL", type: "url" }),
    defineField({
      name: "showLanguageSwitcher",
      title: "Show Language Switcher",
      type: "boolean",
      initialValue: true,
      description: "Toggle whether to display the language switcher (flag & toggle) across header and site."
    }),
    defineField({ name: "seo", title: "Global SEO Fallback Settings", type: "seo" }),
    defineField({
      name: "cookieConsent",
      title: "Cookie Consent Banner Settings",
      type: "object",
      fields: [
        defineField({ name: "enabled", title: "Enable Cookie Consent Banner", type: "boolean", initialValue: true }),
        defineField({ name: "message", title: "Consent Message", type: "localizedString" }),
        defineField({ name: "acceptAllText", title: "Accept All Button Text", type: "localizedString" }),
        defineField({ name: "rejectAllText", title: "Reject All Button Text", type: "localizedString" }),
        defineField({ name: "customizeText", title: "Customize Button Text", type: "localizedString" }),
        defineField({ name: "hidePreferencesText", title: "Hide Preferences Button Text", type: "localizedString" }),
        defineField({ name: "savePreferencesText", title: "Save Preferences Button Text", type: "localizedString" }),
        
        defineField({ name: "necessaryLabel", title: "Necessary Cookies Label", type: "localizedString" }),
        defineField({ name: "necessaryDesc", title: "Necessary Cookies Description", type: "localizedText" }),
        
        defineField({ name: "analyticsLabel", title: "Analytics Cookies Label", type: "localizedString" }),
        defineField({ name: "analyticsDesc", title: "Analytics Cookies Description", type: "localizedText" }),
        
        defineField({ name: "marketingLabel", title: "Marketing Cookies Label", type: "localizedString" }),
        defineField({ name: "marketingDesc", title: "Marketing Cookies Description", type: "localizedText" }),
      ]
    })
  ],
  preview: {
    select: { title: "title", media: "logo" }
  }
});
