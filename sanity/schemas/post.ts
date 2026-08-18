import { defineField, defineType } from "sanity";

export default defineType({
  name: "post",
  title: "Blog Post",
  type: "document",
  fields: [
    defineField({
      name: "publishedAt",
      title: "Published At",
      type: "datetime",
      initialValue: () => new Date().toISOString(),
    }),
    defineField({
      name: "readTime",
      title: "Read Time (minutes)",
      type: "number",
      validation: (Rule) => Rule.min(1),
    }),
    defineField({
      name: "title",
      title: "Title",
      type: "object",
      fields: [
        { name: "en", type: "string", title: "English" },
        { name: "ar", type: "string", title: "Arabic" },
      ],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: {
        source: "title",
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "excerpt",
      title: "Excerpt",
      type: "object",
      fields: [
        { name: "en", type: "text", title: "English", rows: 3 },
        { name: "ar", type: "text", title: "Arabic", rows: 3 },
      ],
    }),
    defineField({
      name: "mainImage",
      title: "Main Image",
      type: "image",
      options: {
        hotspot: true,
      },
      fields: [
        {
          name: "alt",
          type: "string",
          title: "Alternative Text",
        },
      ],
    }),
    defineField({
      name: "gallery",
      title: "Image Gallery",
      description:
        "Add multiple images for the gallery section, masonry grid, and full-width breaks",
      type: "array",
      of: [
        {
          type: "image",
          options: {
            hotspot: true,
          },
          fields: [
            {
              name: "alt",
              type: "string",
              title: "Alternative Text",
            },
            {
              name: "caption",
              type: "string",
              title: "Caption",
            },
          ],
        },
      ],
    }),
    defineField({
      name: "format",
      title: "Format",
      type: "string",
      options: {
        list: [
          { title: "Blog post", value: "Blog post" },
          { title: "Case study", value: "Case study" },
          { title: "Thought leadership", value: "Thought leadership" },
        ],
      },
      initialValue: "Blog post",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "category",
      title: "Category",
      type: "string",
      options: {
        list: [
          { title: "Design Trends", value: "design-trends" },
          { title: "Project Stories", value: "project-stories" },
          { title: "Behind the Scenes", value: "behind-the-scenes" },
          { title: "Materials & Craft", value: "materials-craft" },
          { title: "Engineering", value: "engineering" },
          { title: "Founder's Insights", value: "founders-insights" },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "author",
      title: "Author",
      type: "object",
      fields: [
        {
          name: "name",
          type: "string",
          title: "Name",
        },
        {
          name: "role",
          type: "object",
          title: "Role",
          fields: [
            { name: "en", type: "string", title: "English" },
            { name: "ar", type: "string", title: "Arabic" },
          ],
        },
        {
          name: "image",
          type: "image",
          title: "Image",
        },
      ],
    }),
    defineField({
      name: "content",
      title: "Content",
      type: "array",
      of: [
        {
          type: "block",
        },
        {
          type: "image",
          options: {
            hotspot: true,
          },
          fields: [
            {
              name: "alt",
              type: "string",
              title: "Alternative Text",
            },
            {
              name: "caption",
              type: "string",
              title: "Caption",
            },
          ],
        },
        {
          type: "imageSeparator",
        },
      ],
    }),

    defineField({
      name: "tags",
      title: "Tags",
      type: "array",
      of: [{ type: "string" }],
      validation: (Rule) => Rule.max(10),
    }),
    defineField({
      name: "relatedProducts",
      title: "Related Products",
      type: "array",
      of: [{ type: "reference", to: [{ type: "product" }] }],
    }),
    defineField({
      name: "featured",
      title: "Featured Post",
      type: "boolean",
      initialValue: false,
    }),

    defineField({
      name: "seo",
      title: "SEO Settings",
      type: "seo",
    }),
    // Engagement tracking fields (hidden from editors, managed via API)
    defineField({
      name: "viewCount",
      title: "View Count",
      type: "number",
      initialValue: 0,
      hidden: true,
    }),
    defineField({
      name: "reactions",
      title: "Reactions",
      type: "object",
      hidden: true,
      fields: [
        { name: "helpful", type: "number", title: "Helpful", initialValue: 0 },
        {
          name: "insightful",
          type: "number",
          title: "Insightful",
          initialValue: 0,
        },
        { name: "loved", type: "number", title: "Loved", initialValue: 0 },
      ],
    }),
  ],
  preview: {
    select: {
      title: "title.en",
      media: "mainImage",
      category: "category",
      author: "author.name",
    },
    prepare(selection) {
      const { title, media, category, author } = selection;
      return {
        title: title || "Untitled",
        subtitle: `${category} - By ${author || "Unknown"}`,
        media,
      };
    },
  },
});
