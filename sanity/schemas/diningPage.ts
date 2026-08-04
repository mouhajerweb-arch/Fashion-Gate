import { defineType, defineField } from "sanity";
import { Utensils } from "lucide-react";

const diningPlaceFields = [
  defineField({
    name: "title",
    title: "Place Name / Heading",
    type: "localizedString",
  }),
  defineField({
    name: "description",
    title: "Description",
    type: "localizedText",
  }),
  defineField({
    name: "image",
    title: "Image",
    type: "image",
    options: { hotspot: true },
  }),
  defineField({
    name: "logo",
    title: "Logo Image",
    type: "image",
    options: { hotspot: true },
  }),
  defineField({
    name: "operatingHoursLabel",
    title: "Operating Hours Label",
    type: "localizedString",
  }),
  defineField({
    name: "operatingHoursValue",
    title: "Operating Hours Value",
    type: "localizedString",
  }),
  defineField({
    name: "contactUsLabel",
    title: "Contact Us Label",
    type: "localizedString",
  }),
  defineField({
    name: "contactUsValue",
    title: "Contact Us Value",
    type: "localizedString",
  }),
  
  // Primary Redirect Button (e.g. Explore Menu)
  defineField({
    name: "buttonText",
    title: "Primary Button Text",
    type: "localizedString",
  }),
  defineField({
    name: "redirectionType",
    title: "Redirection Option Type",
    type: "string",
    description: "Choose whether to select a page from a list or type a custom path.",
    options: {
      list: [
        { title: "Select Page from List (Page Selection Option)", value: "reference" },
        { title: "Enter Custom Path (Path Option)", value: "custom" }
      ],
      layout: "radio"
    },
    initialValue: "custom"
  }),
  defineField({
    name: "pageReference",
    title: "Select Redirection Page Reference",
    type: "reference",
    to: [{ type: "restaurantPage" }],
    description: "Select the restaurant or cafe document to redirect to.",
    hidden: ({ parent }) => parent?.redirectionType === "custom"
  }),
  defineField({
    name: "buttonPath",
    title: "Button Custom Redirection Path",
    type: "string",
    description: "e.g. '/dining/vilamore' or '/dining/the-espresso-lab'",
    hidden: ({ parent }) => parent?.redirectionType === "reference"
  }),

  // Secondary Redirect Button (e.g. Book a Table)
  defineField({
    name: "showSecondaryButton",
    title: "Show Secondary Button (e.g. Book a Table)",
    type: "boolean",
    initialValue: false
  }),
  defineField({
    name: "secondaryButtonText",
    title: "Secondary Button Text",
    type: "localizedString",
    hidden: ({ parent }) => !parent?.showSecondaryButton
  }),
  defineField({
    name: "secondaryButtonPath",
    title: "Secondary Button Redirection URL / Path",
    type: "string",
    hidden: ({ parent }) => !parent?.showSecondaryButton
  })
];

export const diningPage = defineType({
  name: "diningPage",
  title: "Dining Page",
  type: "document",
  icon: Utensils,
  fields: [
    defineField({
      name: "title",
      title: "Page Title (Internal)",
      type: "string",
      description: "For internal admin organization (e.g. 'Dining Page')",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "eyebrow",
      title: "Eyebrow / Small Heading",
      type: "localizedString",
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
      name: "restaurantPlace",
      title: "Restaurant Section (e.g. Vilamore)",
      type: "object",
      fields: diningPlaceFields,
    }),
    defineField({
      name: "cafePlace",
      title: "Cafe Section (e.g. The Espresso Lab)",
      type: "object",
      fields: diningPlaceFields,
    }),
    defineField({
      name: "seo",
      title: "SEO Settings",
      type: "seo",
    }),
  ],
  initialValue: {
    title: "Dining Page",
    eyebrow: {
      en: "FASHION GATE MALL",
      ar: "فاشن غيت مول",
    },
    headline: {
      en: "Dining",
      ar: "المطاعم",
    },
    description: {
      en: "At Fashion Gate Mall Syria, exceptional food and drink is something we take incredibly seriously. That is why we are proud to offer a destination featuring VILAMORE RESTAURANT & CAFE and The Espresso Lab. We have carefully curated these establishments to provide an elevated culinary experience, ensuring that every visit offers both quality and variety. Whether you are looking for a refined meal or a perfect brew, our selection is designed to satisfy the most discerning tastes in a comfortable and sophisticated setting.",
      ar: "في فاشن غيت مول سوريا، نأخذ المأكولات والمشروبات الاستثنائية على محمل الجد. لهذا السبب نحن فخورون بتقديم وجهة تضم مطعم ومقهى فيلامور وذا اسبريسو لاب. لقد قمنا برعاية هذه المنشآت بعناية لتقديم تجربة طهي راقية، مما يضمن أن كل زيارة توفر الجودة والتنوع. سواء كنت تبحث عن وجبة راقية أو قهوة مثالية، فإن مجموعتنا مصممة لإرضاء الأذواق الأكثر تطلباً في أجواء مريحة وراقية.",
    },
  },
  preview: {
    select: {
      title: "title",
      subtitle: "headline.en",
    },
  },
});
