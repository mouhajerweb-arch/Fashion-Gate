import { defineField, defineType } from "sanity";
import { BookOpen } from "lucide-react";

export const blogsPage = defineType({
  name: "blogsPage",
  title: "Blogs Page Settings",
  type: "document",
  icon: BookOpen,
  fields: [
    defineField({ name: "title", title: "Title", type: "string", initialValue: "Blogs Page Settings" }),
    defineField({ name: "eyebrow", title: "Eyebrow", type: "localizedString" }),
    defineField({ name: "headline", title: "Headline", type: "localizedString" }),
    defineField({ name: "description", title: "Description", type: "localizedText" }),
    defineField({ name: "stat1", title: "Stat 1", type: "localizedString" }),
    defineField({ name: "stat2", title: "Stat 2", type: "localizedString" }),
    defineField({ name: "stat3", title: "Stat 3", type: "localizedString" }),
    defineField({
      name: "blogs",
      title: "Blogs List",
      type: "array",
      of: [
        {
          type: "object",
          name: "blogNavItem",
          title: "Blog Link Item",
          fields: [
            defineField({
              name: "label",
              title: "Label (Bilingual)",
              type: "localizedString"
            }),
            defineField({
              name: "href",
              title: "Redirect Link",
              type: "string",
              description: "Example: / or /blogs/luxury-hotel-refurbishment-dubai"
            })
          ],
          preview: {
            select: {
              titleEn: "label.en",
              titleAr: "label.ar",
              href: "href"
            },
            prepare(selection) {
              const { titleEn, titleAr, href } = selection;
              return {
                title: `${titleEn || ""} / ${titleAr || ""}`,
                subtitle: `Link: ${href || ""}`
              };
            }
          }
        }
      ],
      description: "Select and order the blog posts to display on this page."
    }),
    defineField({
      name: "editorialVision",
      title: "Editorial Vision Section",
      type: "object",
      fields: [
        defineField({
          name: "eyebrow",
          title: "Eyebrow",
          type: "localizedString",
        }),
        defineField({
          name: "quote",
          title: "Quote",
          type: "localizedText",
        }),
        defineField({
          name: "attribution",
          title: "Attribution",
          type: "localizedString",
        }),
      ],
    }),
    defineField({
      name: "seo",
      title: "SEO Settings",
      type: "seo"
    })
  ]
});
