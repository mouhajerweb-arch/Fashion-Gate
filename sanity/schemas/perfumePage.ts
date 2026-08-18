import { defineType, defineField } from "sanity";
import { Sparkles } from "lucide-react";

export const perfumePage = defineType({
  name: "perfumePage",
  title: "Perfume Page",
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
      description: "Select which brands appear in this category page list.",
      type: "array",
      of: [
        {
          type: "object",
          name: "featuredCategoryBrand",
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
              name: "categoryLogoScale",
              title: "Perfume Card Logo Scale",
              type: "number",
              description: "Page-specific scale used only for this brand on the Perfume page cards. It does not change the Brand document or any other page.",
              initialValue: 1,
              validation: (Rule) => Rule.min(0.01),
            }),
          ],
          preview: {
            select: {
              title: "brand.title",
              media: "brand.image",
              scale: "categoryLogoScale",
            },
            prepare({ title, media, scale }) {
              return {
                title: title || "Featured Brand",
                subtitle: scale ? `Perfume card scale: ${scale}` : "Default Perfume card scale",
                media,
              };
            },
          },
        },
        {
          type: "reference",
          title: "Brand Reference (legacy, no page scale)",
          to: [{ type: "brand" }],
        },
      ]
    }),
    defineField({
      name: "brandLogoScaleOverrides",
      title: "Perfume Brand Card Logo Scale Overrides",
      description: "Optional per-brand logo scales used only on the Perfume page brand cards. These do not affect the main Brand document or any global brand placement.",
      type: "array",
      of: [
        {
          type: "object",
          name: "perfumeBrandLogoScaleOverride",
          title: "Perfume Brand Logo Scale",
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
              initialValue: 1,
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
                subtitle: `Perfume card scale: ${scale || 1}`,
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
        title: title || "Perfume Page Settings",
        subtitle: "Bilingual page content settings"
      };
    }
  }
});
