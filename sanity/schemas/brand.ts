import { defineType, defineField } from "sanity";
import { Award } from "lucide-react";

export default defineType({
  name: "brand",
  title: "Brand",
  type: "document",
  icon: Award,
  fields: [
    defineField({
      name: "title",
      title: "Brand Title",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "titleAr",
      title: "Brand Title (Arabic)",
      type: "string",
    }),
    defineField({
      name: "isActive",
      title: "Is Active / Show in UI",
      type: "boolean",
      description: "If enabled, this brand will be shown in the UI. If disabled, it will be hidden.",
      initialValue: true,
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title" },
    }),
    defineField({
      name: "image",
      title: "Brand Logo Image",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "imageAr",
      title: "Brand Logo Image (Arabic)",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "size",
      title: "Logo Display Size",
      type: "string",
      options: {
        list: [
          { title: "Small", value: "small" },
          { title: "Medium", value: "medium" },
          { title: "Large", value: "large" },
        ],
      },
      initialValue: "medium",
    }),
    defineField({
      name: "categoryLogoScale",
      title: "Fashion / Perfume Cards ONLY Scale",
      type: "number",
      description: "Use this for Fashion and Perfume page brand cards. This does not affect global brand logo placements.",
      initialValue: 1,
      validation: (Rule) => Rule.min(0.01),
    }),
    defineField({
      name: "scale",
      title: "Global Logo Custom Scale",
      type: "number",
      description: "Global logo scale used outside the Fashion and Perfume page brand cards.",
      initialValue: 3.0,
      validation: (Rule) => Rule.min(0.01),
    }),
    defineField({
      name: "headline",
      title: "Headline",
      type: "localizedString",
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "localizedText",
    }),
    defineField({
      name: "bgImage",
      title: "Background Image",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "seo",
      title: "SEO Settings",
      type: "seo",
    }),
  ],
  preview: {
    select: {
      title: "title",
      media: "image",
    },
  },
});
