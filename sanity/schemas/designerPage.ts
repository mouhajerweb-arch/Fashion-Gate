import { defineField, defineType } from "sanity";
import { Sparkles } from "lucide-react";

export const designerPage = defineType({
  name: "designerPage",
  title: "Designers Page",
  type: "document",
  icon: Sparkles,
  fields: [
    defineField({
      name: "eyebrow",
      title: "Eyebrow (Bilingual)",
      type: "localizedString",
    }),
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
      name: "heroImage",
      title: "Hero Image",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "heroImagePosition",
      title: "Hero Image Position",
      type: "string",
      description: "CSS object-position used for the hero image on desktop and tablet, e.g. center center, 72% center.",
      initialValue: "72% center",
    }),
    defineField({
      name: "heroImagePositionMobile",
      title: "Hero Image Position Mobile",
      type: "string",
      description: "CSS object-position used for the hero image on mobile. This is shared by English and Arabic.",
      initialValue: "72% center",
    }),
    defineField({
      name: "categoriesHeading",
      title: "Categories Heading (Bilingual)",
      type: "localizedString",
    }),
    defineField({
      name: "featuredBrandsHeading",
      title: "Featured Brands Heading (Bilingual)",
      type: "localizedString",
    }),
    defineField({
      name: "searchPlaceholder",
      title: "Search Placeholder (Bilingual)",
      type: "localizedString",
    }),
    defineField({
      name: "allCategoriesLabel",
      title: "All Categories Label (Bilingual)",
      type: "localizedString",
    }),
    defineField({
      name: "exploreBrandLabel",
      title: "Explore Brand Label (Bilingual)",
      type: "localizedString",
    }),
    defineField({
      name: "categorySections",
      title: "Designer Category Sections",
      description: "Controls which Designers nav dropdown categories appear on this page, their large images, and which brand cards appear inside each category.",
      type: "array",
      of: [
        {
          type: "object",
          name: "designerPageCategorySection",
          title: "Designer Page Category",
          fields: [
            defineField({
              name: "category",
              title: "Designer Dropdown Category",
              type: "reference",
              to: [{ type: "designerCategory" }],
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "isVisible",
              title: "Show this category on Designers page",
              type: "boolean",
              initialValue: true,
            }),
            defineField({
              name: "sectionImage",
              title: "Large Category Image",
              type: "image",
              description: "Portrait image shown as the large visual for this category section.",
              options: { hotspot: true },
            }),
            defineField({
              name: "brands",
              title: "Brands to show in this category",
              description: "Select and order the brands shown when this category is selected. Upload a landscape image for each brand card.",
              type: "array",
              of: [
                {
                  type: "object",
                  name: "designerPageBrandCard",
                  title: "Brand Card",
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
                      title: "Show this brand",
                      type: "boolean",
                      initialValue: true,
                    }),
                    defineField({
                      name: "cardImage",
                      title: "Landscape Brand Image",
                      type: "image",
                      options: { hotspot: true },
                    }),
                  ],
                  preview: {
                    select: {
                      title: "brand.title",
                      media: "cardImage",
                    },
                  },
                },
              ],
            }),
          ],
          preview: {
            select: {
              title: "category.title.en",
              hidden: "isVisible",
              media: "sectionImage",
            },
            prepare({ title, hidden, media }) {
              return {
                title: title || "Designer Page Category",
                subtitle: hidden === false ? "Hidden on page" : "Visible on page",
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
    }),
  ],
  preview: {
    select: {
      title: "title.en",
      media: "heroImage",
    },
    prepare({ title, media }) {
      return {
        title: title || "Designers Page",
        subtitle: "Bilingual designers directory settings",
        media,
      };
    },
  },
});
