import { defineType, defineField } from "sanity";
import { Sparkles } from "lucide-react";

export const makeupPage = defineType({
  name: "makeupPage",
  title: "Makeup Page",
  type: "document",
  icon: Sparkles,
  fields: [
    defineField({
      name: "title",
      title: "Page Title (Bilingual)",
      type: "localizedString",
    }),
    defineField({
      name: "description",
      title: "Page Description (Bilingual)",
      type: "localizedText",
    }),
    defineField({
      name: "banners",
      title: "Hero Category Banners",
      type: "array",
      of: [
        {
          type: "object",
          name: "categoryBanner",
          title: "Category Banner",
          fields: [
            defineField({ name: "title", title: "Banner Title", type: "localizedString" }),
            defineField({ name: "subtitle", title: "Banner Subtitle", type: "localizedString" }),
            defineField({ name: "image", title: "Banner Image", type: "image", options: { hotspot: true } }),
            defineField({ name: "link", title: "Redirection Link Path", type: "string" })
          ],
          preview: {
            select: {
              title: "title.en",
              subtitle: "subtitle.en",
              media: "image"
            }
          }
        }
      ]
    }),
    defineField({
      name: "brandsHeading",
      title: "Brands Section Heading",
      type: "localizedString",
    }),
    defineField({
      name: "allowedBrands",
      title: "Featured Brands in this Page",
      description: "Select, order, and toggle brands for this page only. Turning a row off does not affect the Brand document or other pages.",
      type: "array",
      of: [
        {
          type: "object",
          name: "featuredMakeupBrand",
          title: "Featured Brand",
          fields: [
            defineField({
              name: "brand",
              title: "Brand",
              type: "reference",
              to: [{ type: "brand" }],
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "isVisible",
              title: "Show this brand on Makeup page",
              type: "boolean",
              description: "Turn this off to hide the brand only from the Makeup page. The brand can still appear elsewhere.",
              initialValue: true,
            }),
            defineField({
              name: "categoryLogoScale",
              title: "Makeup Card Logo Scale",
              type: "number",
              description: "Page-specific scale used only for this brand on the Makeup page cards. Leave at 1.5 unless this brand needs a custom card size.",
              initialValue: 1.5,
              validation: (Rule) => Rule.min(0.01),
            }),
          ],
          preview: {
            select: {
              title: "brand.title",
              media: "brand.image",
              scale: "categoryLogoScale",
              isVisible: "isVisible",
            },
            prepare({ title, media, scale, isVisible }) {
              return {
                title: title || "Featured Brand",
                subtitle: `${isVisible === false ? "Hidden on Makeup page" : "Visible on Makeup page"} - ${scale ? `Makeup card scale: ${scale}` : "Default Makeup card scale"}`,
                media,
              };
            },
          },
        },
      ]
    }),
    defineField({
      name: "brandLogoScaleOverrides",
      title: "Makeup Brand Card Logo Scale Overrides",
      description: "Optional per-brand logo scales used only on the Makeup page brand cards.",
      type: "array",
      of: [
        {
          type: "object",
          name: "makeupBrandLogoScaleOverride",
          title: "Makeup Brand Logo Scale",
          fields: [
            defineField({
              name: "brand",
              title: "Brand",
              type: "reference",
              to: [{ type: "brand" }],
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "scale",
              title: "Scale",
              type: "number",
              initialValue: 1.5,
              validation: (Rule) => Rule.required().min(0.01),
            }),
          ],
          preview: {
            select: {
              title: "brand.title",
              media: "brand.image",
              scale: "scale",
            },
            prepare({ title, media, scale }) {
              return {
                title: title || "Brand Logo Scale",
                subtitle: `Makeup card scale: ${scale || 1}`,
                media,
              };
            },
          },
        },
      ],
    }),
    defineField({
      name: "seo",
      title: "SEO Settings",
      type: "seo",
    })
  ],
  preview: {
    select: {
      title: "title.en",
    },
    prepare({ title }) {
      return {
        title: title || "Makeup Page Settings",
        subtitle: "Bilingual page content settings"
      };
    }
  }
});
